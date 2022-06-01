neos.components["FrooxEngine.CircleMesh"] = class CircleMesh extends MeshComponent {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.CircleMesh";
		this.Mesh = new THREE.CircleGeometry();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"OverrideBoundingBox": "System.Boolean",
		"OverridenBoundingBox": "FrooxEngine.BoundingBox",
		"Rotation": "BaseX.floatQ",
		"Segments": "System.Int32",
		"Radius": "System.Single",
		"Arc": "System.Single",
		"UVScale": "BaseX.float2",
		"ScaleUVWithSize": "System.Boolean",
		"TriangleFan": "System.Boolean"
	}
	
	destroy() {
		this.Mesh.dispose();
	}
	
	regenerateMesh(newFieldValue) {
		this.Mesh.dispose();
		this.Mesh = new THREE.CircleGeometry(this.Fields.Radius.Data, this.Fields.Segments.Data - 1);
		this.Mesh.applyQuaternion(this.Fields.Rotation.Data);
		this.Mesh.rotateX(Math.PI);
		this.updateMeshUsers();
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Rotation.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.Segments.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.Radius.OnSet = [this.regenerateMesh.bind(this)];
	}
}