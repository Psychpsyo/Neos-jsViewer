neos.components["FrooxEngine.DebugMaterial"] = class DebugMaterial extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.DebugMaterial";
		this.Material = new THREE.MeshNormalMaterial();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"_shader": "FrooxEngine.Shader",
		"Scale": "System.Single",
		"Offset": "BaseX.float3",
		"Visualize": "FrooxEngine.DebugMaterial+MeshData",
		"Normalize": "System.Boolean",
		"RenderQueue": "System.Int32"
	}
	
	destroy() {
		this.Material.dispose();
	}
}