neos.components["FrooxEngine.PBS_DualSidedSpecular"] = class PBS_DualSidedSpecular extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.PBS_DualSidedSpecular";
		this.Material = new THREE.MeshPhongMaterial();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"TextureScale": "BaseX.float2",
		"TextureOffset": "BaseX.float2",
		"AlbedoColor": "BaseX.color",
		"AlbedoTexture": "FrooxEngine.ITexture2D",
		"EmissiveColor": "BaseX.color",
		"EmissiveMap": "FrooxEngine.ITexture2D",
		"NormalMap": "FrooxEngine.ITexture2D",
		"NormalScale": "System.Single",
		"OcclusionMap": "FrooxEngine.ITexture2D",
		"Culling": "FrooxEngine.Culling",
		"AlphaHandling": "System.Boolean",
		"AlphaClip": "System.Single",
		"OffsetFactor": "System.Single",
		"OffsetUnits": "System.Single",
		"RenderQueue": "System.Int32",
		"SpecularColor": "BaseX.color",
		"SpecularMap": "FrooxEngine.ITexture2D",
		"_regular": "FrooxEngine.Shader",
		"_transparent": "FrooxEngine.Shader"
	}
	
	destroy() {
		this.Material.dispose();
	}
	
	albedoColorChanged(newValue) {
		this.Material.color.set(colorToRGB(newValue));
		this.Material.opacity = newValue.w;
	}
	
	albedoTextureChanged(newValue) {
		let textureProvider = getFromRefID(newValue);
		this.Material.map = textureProvider?.Texture? textureProvider.Texture : null;
	}
	
	emissiveColorChanged(newValue) {
		this.Material.emissive.set(colorToRGB(newValue));
	}
	
	emissiveMapChanged(newValue) {
		let textureProvider = getFromRefID(newValue);
		this.Material.emissiveMap = textureProvider?.Texture? textureProvider.Texture : null;
	}
	
	normalScaleChanged(newValue) {
		this.Material.normalScale = [newValue, newValue];
	}
	
	normalMapChanged(newValue) {
		let textureProvider = getFromRefID(newValue);
		this.Material.normalMap = textureProvider?.Texture? textureProvider.Texture : null;
	}
	
	cullingChanged(newValue) {
		this.Material.side = neos.enums["FrooxEngine.Culling"][newValue];
	}
	
	alphaHandlingChanged(newValue) {
		this.Material.transparent = newValue != "Opaque";
	}
	
	alphaClipChanged(newValue) {
		this.Material.alphaTest = newValue;
	}
	
	specularColorChanged(newValue) {
		this.Material.specular.set(colorToRGB(newValue));
	}
	
	specularMapChanged(newValue) {
		let textureProvider = getFromRefID(newValue);
		this.Material.specularMap = textureProvider?.Texture? textureProvider.Texture : null;
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.AlbedoColor.OnSet = [this.albedoColorChanged.bind(this)];
		this.Fields.AlbedoTexture.OnSet = [this.albedoTextureChanged.bind(this)];
		this.Fields.EmissiveColor.OnSet = [this.emissiveColorChanged.bind(this)];
		this.Fields.EmissiveMap.OnSet = [this.emissiveMapChanged.bind(this)];
		this.Fields.NormalScale.OnSet = [this.normalScaleChanged.bind(this)];
		this.Fields.NormalMap.OnSet = [this.normalMapChanged.bind(this)];
		this.Fields.Culling.OnSet = [this.cullingChanged.bind(this)];
		this.Fields.AlphaClip.OnSet = [this.alphaClipChanged.bind(this)];
		this.Fields.SpecularColor.OnSet = [this.specularColorChanged.bind(this)];
		this.Fields.SpecularMap.OnSet = [this.specularMapChanged.bind(this)];
	}
}