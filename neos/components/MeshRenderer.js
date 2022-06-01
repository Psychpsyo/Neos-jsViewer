neos.components["FrooxEngine.MeshRenderer"] = class MeshRenderer extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.MeshRenderer";
		this.Mesh = new THREE.Mesh();
		this.Mesh.material = neos.missingMaterial;
		this.Slot.add(this.Mesh);
		this.oldMeshProvider = null;
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"Mesh": "FrooxEngine.Mesh",
		"Materials": "FrooxEngine.SyncAssetList`1[[FrooxEngine.Material]]",
		"MaterialPropertyBlocks": "FrooxEngine.SyncAssetList`1[[FrooxEngine.MaterialPropertyBlock]]",
		"ShadowCastMode": "FrooxEngine.ShadowCastMode",
		"MotionVectorMode": "FrooxEngine.MotionVectorMode",
		"SortingOrder": "System.Int32"
	}
	
	destroy() {
		this.Slot.remove(this.Mesh);
	}
	
	meshChanged(newValue) {
		// remove yourself from the old mesh provider's list of meshUsers
		if (this.oldMeshProvider) {
			this.oldMeshProvider.meshUsers.splice(this.oldMeshProvider.meshUsers.indexOf(this.Mesh), 1);
		}
		
		let newMeshProvider = getFromRefID(newValue);
		if (newMeshProvider?.Mesh) {
			this.Mesh.geometry = newMeshProvider.Mesh;
			this.Mesh.visible = true;
			// add your Mesh to the new meshProvider's meshUsers so that the MeshProvider can update the mesh on its own
			newMeshProvider.meshUsers.push(this.Mesh);
			this.oldMeshProvider = newMeshProvider;
		} else {
			this.Mesh.visible = false;
		}
	}
	
	materialsChanged(newValue) {
		if (newValue.length > 0) {
			let material = getFromRefID(newValue[0].Data);
			this.Mesh.material = material?.Material? material.Material : neos.missingMaterial;
		}
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Mesh.OnSet = [this.meshChanged.bind(this)];
		this.Fields.Materials.OnSet = [this.materialsChanged.bind(this)];
	}
}