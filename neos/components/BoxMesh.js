neos.components["FrooxEngine.BoxMesh"] = class BoxMesh extends MeshComponent {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.BoxMesh";
		this.Mesh = new THREE.BoxGeometry();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"OverrideBoundingBox": "System.Boolean",
		"OverridenBoundingBox": "FrooxEngine.BoundingBox",
		"Size": "BaseX.float3",
		"UVScale": "BaseX.float3",
		"ScaleUVWithSize": "System.Boolean"
	}
	
	destroy() {
		this.Mesh.dispose();
	}
	
	sizeChanged(newValue) {
		this.Mesh.dispose();
		this.Mesh = new THREE.BoxGeometry(...newValue);
		this.updateMeshUsers();
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Size.OnSet = [this.sizeChanged.bind(this)];
	}
}