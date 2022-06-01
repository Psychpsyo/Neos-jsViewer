neos.components["FrooxEngine.CapsuleMesh"] = class CapsuleMesh extends MeshComponent {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.CapsuleMesh";
		this.Mesh = new THREE.CapsuleGeometry();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"OverrideBoundingBox": "System.Boolean",
		"OverridenBoundingBox": "FrooxEngine.BoundingBox",
		"Radius": "System.Single",
		"Height": "System.Single",
		"Segments": "System.Int32",
		"Rings": "System.Int32",
		"Shading": "BaseX.UVSphereCapsule+Shading",
		"UVScale": "BaseX.float2",
		"DualSided": "System.Boolean"
	}
	
	destroy() {
		this.Mesh.dispose();
	}
	
	regenerateMesh(newFieldValue) {
		this.Mesh.dispose();
		this.Mesh = new THREE.CapsuleGeometry(this.Fields.Radius.Data, this.Fields.Height.Data - 1, Math.max(this.Fields.Segments.Data, 3), Math.max(this.Fields.Rings.Data, 3));
		this.updateMeshUsers();
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Radius.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.Height.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.Segments.OnSet = [this.regenerateMesh.bind(this)];
		this.Fields.Rings.OnSet = [this.regenerateMesh.bind(this)];
	}
}