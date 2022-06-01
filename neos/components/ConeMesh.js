neos.components["FrooxEngine.ConeMesh"] = class ConeMesh extends MeshComponent {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.ConeMesh";
		this.Mesh = new THREE.CylinderGeometry();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"OverrideBoundingBox": "System.Boolean",
		"OverridenBoundingBox": "FrooxEngine.BoundingBox",
		"Height": "System.Single",
		"RadiusBase": "System.Single",
		"RadiusTop": "System.Single",
		"Sides": "System.Int32",
		"Caps": "System.Boolean",
		"FlatShading": "System.Boolean",
		"UVScale": "BaseX.float2"
	}
	
	destroy() {
		this.Mesh.dispose();
	}
	
	regenerateMesh(newFieldValue) {
		this.Mesh.dispose();
		this.Mesh = new THREE.CylinderGeometry(this.Fields.RadiusTop.Data, this.Fields.RadiusBase.Data, this.Fields.Height.Data, Math.max(this.Fields.Sides.Data, 3), 1, !this.Fields.Caps.Data);
		this.updateMeshUsers();
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Height.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.RadiusBase.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.RadiusTop.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.Sides.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.Caps.OnSet = [this.regenerateMesh.bind(this)];
	}
}