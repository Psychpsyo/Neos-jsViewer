neos.components["FrooxEngine.UIX.Canvas"] = class UIX_Canvas extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.UIX.Canvas";
		
		this.canvasObject = new THREE.Object3D();
		
		this.div = document.createElement("div");
		this.div.classList.add("uixCanvas");
		this.div.textContent = "UIX isn't currently supported.";
		
		this.canvas = new THREE.CSS3DObject(this.div);
		this.canvasObject.css3dObject = this.canvas;
		this.canvasObject.add(this.canvas);
		
		this.canvasGeometry = new THREE.PlaneGeometry(0, 0);
		this.canvasMesh = new THREE.Mesh(this.canvasGeometry, neos.uixMaterial);
		
		this.canvasObject.lightShadowMesh = this.canvasMesh;
		this.canvasObject.add(this.canvasMesh);
		this.Slot.add(this.canvasObject);
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"Size": "BaseX.float2",
		"EditModeOnly": "System.Boolean",
		"AcceptRemoteTouch": "System.Boolean",
		"AcceptPhysicalTouch": "System.Boolean",
		"AcceptExistingTouch": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"IgnoreTouchesFromBehind": "System.Boolean",
		"BlockAllInteractions": "System.Boolean",
		"LaserPassThrough": "System.Boolean",
		"PixelScale": "System.Single",
		"UnitScale": "System.Single",
		"_rootRect": "FrooxEngine.UIX.RectTransform",
		"Collider": "FrooxEngine.BoxCollider",
		"_colliderSize": "FrooxEngine.IField`1[[BaseX.float3]]",
		"_colliderOffset": "FrooxEngine.IField`1[[BaseX.float3]]",
		"StartingOffset": "System.Int32",
		"StartingMaskDepth": "System.Int32"
	}
	
	destroy() {
		this.Slot.remove(this.canvasObject);
		this.canvasGeometry.dispose();
		getFromRefID(this.Fields["_colliderSize"].Data).driven = false;
		getFromRefID(this.Fields["_colliderOffset"].Data).driven = false;
	}
	
	sizeChanged(newValue) {
		this.div.style.width = newValue.x + "px";
		this.div.style.height = newValue.y + "px";
		this.canvasGeometry.dispose();
		this.canvasGeometry = new THREE.PlaneGeometry(newValue.x, newValue.y);
		this.canvasMesh.geometry = this.canvasGeometry;
		
		// update the collider
		let colliderSizeTarget = getFromRefID(this.Fields._colliderSize.Data);
		if (colliderSizeTarget) {
			//colliderSizeTarget.Data.set(newValue.x, newValue.y, 0);
		}
	}
	
	colliderSizeChanged(newValue, oldValue) {
		// un-drive old value
		if (getFromRefID(oldValue)) {
			getFromRefID(oldValue).driven = false;
		}
		let colliderSizeTarget = getFromRefID(newValue);
		if (colliderSizeTarget) {
			// only accept the new target if it's not driven yet
			if (colliderSizeTarget.driven) {
				this.Fields["_colliderSize"].Data = "ID0";
				return;
			}
			colliderSizeTarget.driven = true;
			//colliderSizeTarget.Data.set(this.Fields.Size.Data.x, this.Fields.Size.Data.y, 0);
		}
	}
	
	colliderOffsetChanged(newValue, oldValue) {
		// un-drive old value
		if (getFromRefID(oldValue)) {
			getFromRefID(oldValue).driven = false;
		}
		let colliderOffsetTarget = getFromRefID(newValue);
		if (colliderOffsetTarget) {
			// only accept the new target if it's not driven yet
			if (colliderOffsetTarget.driven) {
				this.Fields["_colliderOffset"].Data = "ID0";
				return;
			}
			colliderOffsetTarget.driven = true;
			//colliderOffsetTarget.Data.set(0,0,0);
		}
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Size.OnSet = [this.sizeChanged.bind(this)];
		this.Fields._colliderSize.OnSet = [this.colliderSizeChanged.bind(this)];
		this.Fields._colliderOffset.OnSet = [this.colliderOffsetChanged.bind(this)];
	}
}