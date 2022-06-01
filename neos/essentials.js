
var neos = {
	// The last refID that has been generated
	lastRefID: 0,
	// dict where the keys are refIDs and the values what they correspond to.
	refIDMappings: {},
	// the url that the neosDB can be reached at (should get replaced by a proxy by the user / application until Neos sets their CORS headers to something better)
	databaseURL: "https://assets.neos.com/assets/",
	// global materials
	missingMaterial: new THREE.MeshBasicMaterial({color: 0xff00ff}),
	uixMaterial: new THREE.MeshBasicMaterial({opacity: 0, color: 0x000000, blending: THREE.NoBlending, side: THREE.DoubleSide}),
	
	// list of all components, will be populated later on by the individual components
	components: {},
	// list of all types in Neos that need to be converted to refIDs upon import.
	refTypes: [
		"FrooxEngine.Slot",
		"FrooxEngine.IField`1",
		"FrooxEngine.MaterialPropertyBlock",
		"FrooxEngine.Material",
		"FrooxEngine.Mesh",
		"FrooxEngine.Worker",
		"FrooxEngine.ITexture2D"
	],
	// types that are to be interpreted at lists
	listTypes: [
		"FrooxEngine.SyncAssetList`1"
	],
	// *some* of the enums from neos with more or less accurate mappings to THREEjs values. Probably bound to get axed at some point since this seems like a bad way of doing this.
	enums: {
		"FrooxEngine.TextureWrapMode": {
			"Repeat": THREE.RepeatWrapping,
			"Clamp": THREE.ClampToEdgeWrapping,
			"Mirror": THREE.MirroredRepeatWrapping,
			"MirrorOnce": THREE.MirroredRepeatWrapping
		},
		"FrooxEngine.Sidedness": {
			"Double": THREE.DoubleSide,
			"Auto": THREE.DoubleSide,
			"Front": THREE.FrontSide,
			"Back": THREE.BackSide
		},
		"FrooxEngine.Culling": {
			"Off": THREE.DoubleSide,
			"Front": THREE.BackSide,
			"Back": THREE.FrontSide
		},
		"FrooxEngine.ZWrite": {
			"Auto": true,
			"Off": false,
			"On": true
		},
		"FrooxEngine.LightType": {
			"Point": THREE.PointLight,
			"Directional": THREE.DirectionalLight,
			"Spot": THREE.SpotLight
		}
	},
	
	//threeJS ImageLoader to be used everywhere.
	imageLoader: new THREE.ImageLoader(),
	
	// runs an update for the current frame on a slot and all its children and components
	updateSlot: function(slot) {
		slot.userData.Fields.Components.Data.forEach(component => {
			component.update();
		});
		
		slot.userData.Children.forEach(child => {
			neos.updateSlot(child);
		});
	},
	
	// destroys a slot, all slots below it and their components
	destroySlot: function(slot) {
		slot.userData.Fields.Components.Data.forEach(component => {
			component.destroy();
		});
		
		slot.userData.Children.forEach(child => {
			destroySlot(child);
		});
		
		slot.parent.remove(slot);
	},
	
	// gets what would be T in a Neos session
	getTime: function() {
		return performance.now() / 1000;
	}
}

neos.imageLoader.crossOrigin = "";

// helper function for the RGB/A conversion functions below
function clamp01(num) {
	return Math.max(Math.min(num, 1), 0);
}
// converts a color (Float4) to an RGB value ("#000000")
function colorToRGB(color) {
	return "#" +
	(isNaN(color.x)? 0 : Math.round(255 * clamp01(color.x)).toString(16).padStart(2, "0")) +
	(isNaN(color.y)? 0 : Math.round(255 * clamp01(color.y)).toString(16).padStart(2, "0")) +
	(isNaN(color.z)? 0 : Math.round(255 * clamp01(color.z)).toString(16).padStart(2, "0"));
}
// converts a color (Float4) to an RGBA value ("#00000000")
function colorToRGBA(color) {
	return "#" +
	(isNaN(color.x)? 0 : Math.round(255 * clamp01(color.x)).toString(16).padStart(2, "0")) +
	(isNaN(color.y)? 0 : Math.round(255 * clamp01(color.y)).toString(16).padStart(2, "0")) +
	(isNaN(color.z)? 0 : Math.round(255 * clamp01(color.z)).toString(16).padStart(2, "0")) +
	(isNaN(color.w)? 0 : Math.round(255 * clamp01(color.w)).toString(16).padStart(2, "0"));
}

// accounts for neosdb links in URLs
function getNeosURL(url) {
	if (url.startsWith("neosdb:///")) {
		url = url.substring(10);
		url = neos.databaseURL + url.substring(0, url.indexOf("."));
	}
	return url;
}

// sets a Neos field to its new value, accounting for special types such as float3 or floatQ
function setField(field, value) {
	let oldValue = field.Data;
	if (field.Type) {
		switch (field.Type) {
			case "BaseX.float2":
			case "BaseX.float3":
			case "BaseX.float4":
			case "BaseX.color":
			case "BaseX.floatQ":
				field.Data.copy(value);
				runOnSetEvents(field, oldValue);
				return;
		}
	}
	field.Data = value;
	runOnSetEvents(field, oldValue);
}

// runs all events that need to happen when a field's value is changed
function runOnSetEvents(field, oldValue) {
	if (field.OnSet) {
		field.OnSet.forEach(func => {
			func(field.Data, oldValue);
		});
	}
}

// superclass for all components
class Component {
	constructor(slot, ofTypes = []) {
		this.Fields = {};
		this.Slot = slot;
		slot.userData.Fields.Components.Data.push(this);
		// ofTypes is used in components that can be made of multiple types, such as ValueCopy<T>
		this.ofTypes = ofTypes;
	}
	
	getFieldType(field) {
		let fieldType = neos.components[this.Type].fieldTypes[field];
		this.ofTypes.forEach((type, i) => {
			fieldType.replace("{T" + i + "}", type);
		});
		return fieldType;
	}
	
	enabledChanged(newValue) {
		if (!newValue) {
			this.disable();
		}
	}
	
	update() {}
	disable() {}
	destroy() {}
	
	initOnSetEvents() {
		this.Fields.Enabled.OnSet = [this.enabledChanged.bind(this)];
	}
}

// superclass for all Mesh components.
// This is important because of the meshUsers attribute.
// The meshUsers list holds all THREE.Mesh object that are using this component's mesh, so that when the mesh gets regenerated, it can be swapped out in those THREE.Mesh instances.
class MeshComponent extends Component {
	constructor(slot, ofTypes) {
		super(slot, ofTypes);
		this.meshUsers = [];
	}
	
	updateMeshUsers() {
		this.meshUsers.forEach(meshUser => {
			meshUser.geometry = this.Mesh;
		});
	}
} // This meshUsers system may need to be expanded to span Materials and Textures as well.


// returns a new refID, as a string.
function newRefID() {
	neos.lastRefID += 256;
	return "ID" + neos.lastRefID.toString(16);
}

function getFromRefID(refID) {
	if (refID in neos.refIDMappings) {
		return neos.refIDMappings[refID];
	}
	return null;
}

// creates an empty Neos slot, parents it under parentSlot and returns it as a THREEjs object
function createEmptySlot(parentSlot, name) {
	let slot = new THREE.Object3D();
	
	slot.userData.ID = newRefID();
	slot.userData.Fields = {};
	
	neos.refIDMappings[slot.userData.ID] = slot;
	slot.userData.Fields.Name = {
		"ID": newRefID(),
		"Data": name,
		"Type": "System.String"
	};
	neos.refIDMappings[slot.userData.Fields.Name.ID] = slot.userData.Fields.Name;
	slot.userData.Fields.Parent = {
		"ID": newRefID(),
		"Data": null, // null for now, will get set later when actually parenting the slot
		"Type": "FrooxEngine.Slot"
	};
	neos.refIDMappings[slot.userData.Fields.Parent.ID] = slot.userData.Fields.Parent;
	slot.userData.Fields.Tag = {
		"ID": newRefID(),
		"Data": null,
		"Type": "System.String"
	};
	neos.refIDMappings[slot.userData.Fields.Tag.ID] = slot.userData.Fields.Tag;
	slot.userData.Fields.Active = {
		"ID": newRefID(),
		"Data": true,
		"Type": "System.Boolean",
		"OnSet": [function(newValue) {slot.visible = newValue;}]
	};
	neos.refIDMappings[slot.userData.Fields.Active.ID] = slot.userData.Fields.Active;
	slot.userData.Fields.Persistent = {
		"ID": newRefID(),
		"Data": true,
		"Type": "System.Boolean"
	};
	neos.refIDMappings[slot.userData.Fields.Persistent.ID] = slot.userData.Fields.Persistent;
	slot.userData.Fields.Position = {
		"ID": newRefID(),
		"Data": slot.position,
		"Type": "BaseX.float3"
	};
	neos.refIDMappings[slot.userData.Fields.Position.ID] = slot.userData.Fields.Position;
	slot.userData.Fields.Rotation = {
		"ID": newRefID(),
		"Data": slot.quaternion,
		"Type": "BaseX.floatQ"
	};
	neos.refIDMappings[slot.userData.Fields.Rotation.ID] = slot.userData.Fields.Rotation;
	slot.userData.Fields.Scale = {
		"ID": newRefID(),
		"Data": slot.scale,
		"Type": "BaseX.float3"
	};
	neos.refIDMappings[slot.userData.Fields.Scale.ID] = slot.userData.Fields.Scale;
	slot.userData.Fields.OrderOffset = {
		"ID": newRefID(),
		"Data": 0,
		"Type": "System.Int64"
	};
	neos.refIDMappings[slot.userData.Fields.OrderOffset.ID] = slot.userData.Fields.OrderOffset;
	
	// components and children
	slot.userData.Fields.Components = {
		"ID": newRefID(),
		"Data": []
	};
	neos.refIDMappings[slot.userData.Fields.Components.ID] = slot.userData.Fields.Components;
	slot.userData.Children = [];
	
	// actually parent the slot under its parent
	if (parentSlot) {
		setParent(slot, parentSlot);
	}
	return slot;
}

// reparents a slot
function setParent(slot, newParent) {
	// remove the slot from the old parent's userData
	if (slot.userData.Fields.Parent.Data) {
		slot.parent.userData.Children.splice(slot.parent.userData.Children.indexOf(slot), 1);
	}
	newParent.add(slot);
	newParent.userData.Children.push(slot);
	// update the userData parent
	slot.userData.Fields.Parent.Data = newParent.userData.ID;
}

// render loop
function render() {
	requestAnimationFrame(render);
	
	neos.updateSlot(neos.rootSlot);
	
	neos.scene.updateMatrixWorld();
	
	neos.renderer.render(neos.scene, neos.camera);
	neos.UIXRenderer.render(neos.scene, neos.camera);
}

// calling this makes Neos initialize itself in the DOM element with a "neosWindow" ID.
function initializeNeos() {
	let neosWindow = document.getElementById("neosWindow");
	if (!neosWindow) {
		throw "Couldn't find element with id \"neosWindow\" in the page!";
	}
	
	neos.rootSlot = createEmptySlot(null, "Root");
	neos.assetSlot = createEmptySlot(neos.rootSlot, "Assets");
	
	neos.scene = new THREE.Scene();
	// correct for left hand coordinate system
	neos.scene.scale.x = -1;
	neos.scene.add(neos.rootSlot);
	
	neos.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
	
	neos.renderer = new THREE.WebGLRenderer();
	neos.renderer.setSize(neosWindow.offsetWidth, neosWindow.offsetHeight);
	neos.renderer.setClearColor(new THREE.Color(0x888888));
	
	neos.UIXRenderer = new THREE.CSS3DRenderer();
	neos.UIXRenderer.setSize(neosWindow.offsetWidth, neosWindow.offsetHeight);
	
	// add the UIXRenderer first so that UIX panels are properly occluded
	neosWindow.appendChild(neos.UIXRenderer.domElement);
	neosWindow.appendChild(neos.renderer.domElement);
	
	render();
}