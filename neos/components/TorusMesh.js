neos.components["FrooxEngine.TorusMesh"] = class TorusMesh extends MeshComponent {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.TorusMesh";
		this.Mesh = new THREE.TorusGeometry();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"OverrideBoundingBox": "System.Boolean",
		"OverridenBoundingBox": "FrooxEngine.BoundingBox",
		"MinorSegments": "System.Int32",
		"MajorSegments": "System.Int32",
		"MajorRadius": "System.Single",
		"MinorRadius": "System.Single",
		"UVScale": "BaseX.float2"
	}
	
	destroy() {
		this.Mesh.dispose();
	}
	
	regenerateMesh(newFieldValue) {
		this.Mesh.dispose();
		this.Mesh = new THREE.TorusGeometry(this.Fields.MajorRadius.Data, this.Fields.MinorRadius.Data, Math.max(this.Fields.MinorSegments.Data, 3), Math.max(this.Fields.MajorSegments.Data, 3));
		this.Mesh.rotateX(Math.PI / -2);
		this.Mesh.rotateY(Math.PI);
		this.updateMeshUsers();
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.MinorSegments.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.MajorSegments.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.MajorRadius.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.MinorRadius.OnSet = [this.regenerateMesh.bind(this)];
	}
}