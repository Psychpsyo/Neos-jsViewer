// mapping table from the json IDs of the currently loading object and their refIDs
var jsonToRefID = {}
var unknownComponents = [];

// gets a RefID from the ID in a json object
function loadRefID(id) {
	if (!(id in jsonToRefID)) {
		jsonToRefID[id] = newRefID();
	}
	return jsonToRefID[id];
}

// loads a Neos object from its json description
neos.loadObject = function(jsonData, parentSlot) {
	//load assets
	if ("Assets" in jsonData) {
		assets = createEmptySlot(neos.assetSlot, jsonData.Object.Name.Data + " - Assets");
		jsonData.Assets.forEach(component => {
			loadComponent(component, assets);
		});
	}
	
	//load the actual object
	loadedObject = loadSlot(jsonData.Object, parentSlot);
	setParent(loadedObject, parentSlot);
	loadedObject.position.set(0, 0, 0);
	// clean RefID mapping table
	jsonToRefID = {};
	
	//run all onSet events for the loaded object
	if ("Assets" in jsonData) {
		runLoadedFieldSetEvents(assets);
	}
	runLoadedFieldSetEvents(loadedObject);
	
	return loadedObject;
}

// loads a Neos slot from its json description
function loadSlot(jsonData, parentSlot) {
	let slot = new THREE.Object3D();
	
	slot.userData.ID = loadRefID(jsonData.ID);
	slot.userData.Fields = {};
	
	neos.refIDMappings[slot.userData.ID] = slot;
	slot.userData.Fields.Name = {
		"ID": loadRefID(jsonData.Name.ID),
		"Data": jsonData.Name.Data,
		"Type": "System.String"
	};
	neos.refIDMappings[slot.userData.Fields.Name.ID] = slot.userData.Fields.Name;
	slot.userData.Fields.Parent = {
		"ID": loadRefID(jsonData.ParentReference),
		"Data": null, // null for now, will get set later when actually parenting the slot
		"Type": "FrooxEngine.Slot"
	};
	neos.refIDMappings[slot.userData.Fields.Parent.ID] = slot.userData.Fields.Parent;
	slot.userData.Fields.Tag = {
		"ID": loadRefID(jsonData.Tag.ID),
		"Data": jsonData.Tag.Data,
		"Type": "System.String"
	};
	neos.refIDMappings[slot.userData.Fields.Tag.ID] = slot.userData.Fields.Tag;
	slot.userData.Fields.Active = {
		"ID": loadRefID(jsonData.Active.ID),
		"Data": jsonData.Active.Data,
		"Type": "System.Boolean",
		"OnSet": [function(newValue) {slot.visible = newValue;}]
	};
	neos.refIDMappings[slot.userData.Fields.Active.ID] = slot.userData.Fields.Active;
	slot.userData.Fields.Persistent = {
		"ID": loadRefID(jsonData["Persistent-ID"]),
		"Data": true,
		"Type": "System.Boolean"
	};
	neos.refIDMappings[slot.userData.Fields.Persistent.ID] = slot.userData.Fields.Persistent;
	slot.userData.Fields.Position = {
		"ID": loadRefID(jsonData.Position.ID),
		"Data": slot.position,
		"Type": "BaseX.float3"
	};
	neos.refIDMappings[slot.userData.Fields.Position.ID] = slot.userData.Fields.Position;
	slot.userData.Fields.Rotation = {
		"ID": loadRefID(jsonData.Rotation.ID),
		"Data": slot.quaternion,
		"Type": "BaseX.floatQ"
	};
	neos.refIDMappings[slot.userData.Fields.Rotation.ID] = slot.userData.Fields.Rotation;
	slot.userData.Fields.Scale = {
		"ID": loadRefID(jsonData.Scale.ID),
		"Data": slot.scale,
		"Type": "BaseX.float3"
	};
	neos.refIDMappings[slot.userData.Fields.Scale.ID] = slot.userData.Fields.Scale;
	slot.userData.Fields.OrderOffset = {
		"ID": loadRefID(jsonData.OrderOffset.ID),
		"Data": jsonData.OrderOffset.Data,
		"Type": "System.Int64"
	};
	neos.refIDMappings[slot.userData.Fields.OrderOffset.ID] = slot.userData.Fields.OrderOffset;
	
	// set position, rotation, scale
	slot.position.set(...jsonData.Position.Data);
	slot.quaternion.set(...jsonData.Rotation.Data);
	slot.scale.set(...jsonData.Scale.Data);
	
	// load components
	slot.userData.Fields.Components = {
		"ID": loadRefID(jsonData.Components.ID),
		"Data": []
	};
	neos.refIDMappings[slot.userData.Fields.Components.ID] = slot.userData.Fields.Components;
	jsonData.Components.Data.forEach(component => {
		loadComponent(component, slot);
	});
	
	// recursively load children
	slot.userData.Children = [];
	jsonData["Children"].forEach(child => {
		childSlot = loadSlot(child);
		setParent(childSlot, slot);
	});
	
	return slot;
}

// loads a Neos component from its json description
function loadComponent(jsonData, slot) {
	// normalize -ID fields
	for (const [key, value] of Object.entries(jsonData.Data)) {
		if (key.endsWith("-ID")) {
			jsonData.Data[key.substring(0, key.length - 3)] = {
				"ID": jsonData.Data[key],
				"Data": null
			}
			delete jsonData.Data[key];
		}
	}
	jsonData.Data.persistent.Data = true;
	
	let componentBaseType = getNeosBaseType(jsonData.Type);
	let componentOfType = getNeosInnerType(jsonData.Type);
	componentOfTypeList = [];
	if (componentOfType) {
		// Currently only parses the very first type in a very janky and error-prone manner.
		// TODO: make this a proper parser.
		// The structure that needs to be parsed here is "[TYPE, foo, bar],[TYPE, foo, bar]" where TYPE is what we want but TYPE may also contain commas, enclosed in more nested brackets.
		componentOfTypeList.push(componentOfType.substring(1, componentOfType.indexOf(",")));
	}
	
	if (componentBaseType in neos.components) {
		component = new neos.components[componentBaseType](slot, ofType = componentOfTypeList);
	} else {
		component = new Component(slot);
		component.Type = jsonData.Type;
		if (!unknownComponents.includes(componentBaseType)) {
			unknownComponents.push(componentBaseType);
		}
	}
	component["ID"] = loadRefID(jsonData.Data.ID),
	neos.refIDMappings[component.ID] = component;
	
	// load all fields
	for (const [key, value] of Object.entries(jsonData.Data)) {
		if (key == "ID") {
			continue;
		}
		
		// load field when type is known
		if (componentBaseType in neos.components) {
			try {
				component.Fields[key] = loadField(value, component.getFieldType(key));
			} catch(e) {
				console.log("Found unknown field name when loading component:\nField " + key + " in " + component.Type);
			}
		} else {
			// else, load with unknown type
			component.Fields[key] = {
				"ID": loadRefID(value.ID),
				"Data": value.Data,
				"Type": "jsUnknown"
			};
			neos.refIDMappings[component.Fields[key].ID] = component.Fields[key];
		}
	}
	component.initOnSetEvents();
	return component;
}

// takes a field from Neos json file and turns it into a field object that's usable.
function loadField(field, valueType) {
	let isNullable = getNeosBaseType(valueType) == "System.Nullable`1";
	newField = {
		"ID": loadRefID(field.ID),
		"Data": isNullable? loadValue(field.Data, getNeosInnerType(valueType)) : loadValue(field.Data, valueType),
		"Type": valueType
	};
	
	if (isNullable) {
		newField.nullable = true;
	}
	
	neos.refIDMappings[newField.ID] = newField;
	return newField;
}

// takes a value and its supposed type from a neos json file and turns it into out equivalent representation
function loadValue(value, asType) {
	switch (asType) {
		case "System.Uri":
			// remove the @ from the beginning of links
			value = value.substring(1);
			return value;
		case "BaseX.float2":
			return new THREE.Vector2(...value);
		case "BaseX.float3":
			return new THREE.Vector3(...value);
		case "BaseX.float4":
		case "BaseX.color":
			return new THREE.Vector4(...value);
		case "BaseX.floatQ":
			let tempQ = new THREE.Quaternion();
			tempQ.fromArray(value);
			return tempQ;
	}
	
	let baseType = getNeosBaseType(asType);
	let innerType = getNeosInnerType(asType);
	
	// check if the type's value needs to be converted to a RefID
	if (neos.refTypes.includes(baseType)) {
		return value? loadRefID(value) : "ID0";
	}
	
	// check if the type is a list and, if so, recursively load its elements
	if (neos.listTypes.includes(baseType)) {
		outList = [];
		value.forEach(field => {
			outList.push(loadField(field, innerType));
		});
		return outList;
	}
	
	return value;
}

// Base and inner type are as follows:
// Example: IField`1[System.Boolean]
// Base Type  => IField`1
// Inner Type => System.Boolean
function getNeosBaseType(fullType) {
	return fullType.indexOf("[") >= 0? fullType.substring(0, fullType.indexOf("[")) : fullType;
}
function getNeosInnerType(fullType) {
	if (fullType.indexOf("[") < 0) {
		return null;
	}
	return fullType.substring(fullType.indexOf("[") + 2, fullType.length - 2);
}

// runs the OnSet events for all fields under the given slot.
function runLoadedFieldSetEvents(slot) {
	Object.values(slot.userData.Fields).forEach(field => {
		runOnSetEvents(field);
	});
	slot.userData.Fields.Components.Data.forEach(component => {
		Object.values(component.Fields).forEach(field => {
			runOnSetEvents(field);
		});
	});
	slot.userData.Children.forEach(child => {
		runLoadedFieldSetEvents(child);
	});
}