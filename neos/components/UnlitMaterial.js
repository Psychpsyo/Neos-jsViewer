neos.components["FrooxEngine.UnlitMaterial"] = class UnlitMaterial extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.UnlitMaterial";
		this.Material = new THREE.MeshBasicMaterial();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"TintColor": "BaseX.color",
		"Texture": "FrooxEngine.ITexture2D",
		"TextureScale": "BaseX.float2",
		"TextureOffset": "BaseX.float2",
		"MaskTexture": "FrooxEngine.ITexture2D",
		"MaskScale": "BaseX.float2",
		"MaskOffset": "BaseX.float2",
		"MaskMode": "FrooxEngine.MaskTextureMode",
		"BlendMode": "FrooxEngine.BlendMode",
		"AlphaCutoff": "System.Single",
		"UseVertexColors": "System.Boolean",
		"Sidedness": "FrooxEngine.Sidedness",
		"ZWrite": "FrooxEngine.ZWrite",
		"OffsetTexture": "FrooxEngine.ITexture2D",
		"OffsetMagnitude": "BaseX.float2",
		"OffsetTextureScale": "BaseX.float2",
		"OffsetTextureOffset": "BaseX.float2",
		"PolarUVmapping": "System.Boolean",
		"PolarPower": "System.Single",
		"StereoTextureTransform": "System.Boolean",
		"RightEyeTextureScale": "BaseX.float2",
		"RightEyeTextureOffset": "BaseX.float2",
		"DecodeAsNormalMap": "System.Boolean",
		"UseBillboardGeometry": "System.Boolean",
		"UsePerBillboardScale": "System.Boolean",
		"UsePerBillboardRotation": "System.Boolean",
		"UsePerBillboardUV": "System.Boolean",
		"BillboardSize": "BaseX.float2",
		"OffsetFactor": "System.Single",
		"OffsetUnits": "System.Single",
		"RenderQueue": "System.Int32",
		"_unlit": "FrooxEngine.Shader",
		"_unlitBillboard": "FrooxEngine.Shader"
	}
	
	destroy() {
		this.Material.dispose();
	}
	
	tintColorChanged(newValue) {
		this.Material.color.set(colorToRGB(newValue));
		this.Material.opacity = newValue.w;
	}
	
	textureChanged(newValue) {
		let textureProvider = getFromRefID(newValue);
		this.Material.map = textureProvider?.Texture? textureProvider.Texture : null;
	}
	
	blendModeChanged(newValue) {
		switch (newValue) {
			case "Opaque":
			case "Cutout":
				this.Material.transparent = false;
				this.Material.blending = THREE.NormalBlending;
				break;
			case "Alpha":
			case "Transparent":
				this.Material.transparent = true;
				this.Material.blending = THREE.NormalBlending;
				break;
			case "Additive":
				this.Material.transparent = true;
				this.Material.blending = THREE.AdditiveBlending;
				break;
			case "Multiply":
				this.Material.transparent = true;
				this.Material.blending = THREE.MultiplyBlending;
				break;
		}
	}
	
	alphaCutoffChanged(newValue) {
		this.Material.alphaTest = newValue;
	}
	
	sidednessChange(newValue) {
		this.Material.side = neos.enums["FrooxEngine.Sidedness"][newValue];
	}
	
	zWriteChange(newValue) {
		this.Material.depthWrite = neos.enums["FrooxEngine.ZWrite"][newValue];
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.TintColor.OnSet = [this.tintColorChanged.bind(this)];
		this.Fields.Texture.OnSet = [this.textureChanged.bind(this)];
		this.Fields.BlendMode.OnSet = [this.blendModeChanged.bind(this)];
		this.Fields.AlphaCutoff.OnSet = [this.alphaCutoffChanged.bind(this)];
		this.Fields.Sidedness.OnSet = [this.sidednessChange.bind(this)];
		this.Fields.ZWrite.OnSet = [this.zWriteChange.bind(this)];
	}
}