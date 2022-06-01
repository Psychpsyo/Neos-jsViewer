neos.components["FrooxEngine.QuadMesh"] = class QuadMesh extends MeshComponent {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.QuadMesh";
		this.Mesh = new THREE.PlaneGeometry(1, 1);
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"OverrideBoundingBox": "System.Boolean",
		"OverridenBoundingBox": "FrooxEngine.BoundingBox",
		"Rotation": "BaseX.floatQ",
		"Size": "BaseX.float2",
		"UVScale": "BaseX.float2",
		"ScaleUVWithSize": "System.Boolean",
		"UVOffset": "BaseX.float2",
		"DualSided": "System.Boolean",
		"UseVertexColors": "System.Boolean",
		"UpperLeftColor": "BaseX.color",
		"LowerLeftColor": "BaseX.color",
		"LowerRightColor": "BaseX.color",
		"UpperRightColor": "BaseX.color"
	}
	
	destroy() {
		this.Mesh.dispose();
	}
	
	sizeChanged(newValue) {
		this.Mesh.dispose();
		this.Mesh = new THREE.PlaneGeometry(...newValue);
		this.updateMeshUsers();
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Size.OnSet = [this.sizeChanged.bind(this)];
	}
}