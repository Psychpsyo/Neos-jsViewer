neos.components["FrooxEngine.GridMesh"] = class GridMesh extends MeshComponent {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.GridMesh";
		this.Mesh = new THREE.PlaneGeometry(1, 1);
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"OverrideBoundingBox": "System.Boolean",
		"OverridenBoundingBox": "BaseX.BoundingBox",
		"Points": "BaseX.int2",
		"Size": "BaseX.float2",
		"FlatShading": "System.Boolean"
	}
	
	destroy() {
		this.Mesh.dispose();
	}
	
	regenerateMesh(newFieldValue) {
		this.Mesh.dispose();
		this.Mesh = new THREE.PlaneGeometry(...this.Fields.Size.Data, ...this.Fields.Points.Data);
		this.updateMeshUsers();
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Size.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.Points.OnSet = [this.regenerateMesh.bind(this)];
	}
}