neos.components["FrooxEngine.PBS_Specular"] = class PBS_Specular extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.PBS_Specular";
		this.Material = new THREE.MeshPhongMaterial();
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"_shader": "FrooxEngine.Shader",
		"TextureScale": "BaseX.float2",
		"TextureOffset": "BaseX.float2",
		"DetailTextureScale": "BaseX.float2",
		"DetailTextureOffset": "BaseX.float2",
		"AlbedoColor": "BaseX.color",
		"AlbedoTexture": "FrooxEngine.ITexture2D",
		"EmissiveColor": "BaseX.color",
		"EmissiveMap": "FrooxEngine.ITexture2D",
		"NormalScale": "System.Single",
		"NormalMap": "FrooxEngine.ITexture2D",
		"HeightMap": "FrooxEngine.ITexture2D",
		"HeightScale": "System.Single",
		"OcclusionMap": "FrooxEngine.ITexture2D",
		"DetailAlbedoTexture": "FrooxEngine.ITexture2D",
		"DetailNormalMap": "FrooxEngine.ITexture2D",
		"DetailNormalScale": "System.Single",
		"BlendMode": "FrooxEngine.BlendMode",
		"AlphaCutoff": "System.Single",
		"OffsetFactor": "System.Single",
		"OffsetUnits": "System.Single",
		"RenderQueue": "System.Int32",
		"SpecularColor": "BaseX.color",
		"SpecularMap": "FrooxEngine.ITexture2D"
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
		this.Fields.BlendMode.OnSet = [this.blendModeChanged.bind(this)];
		this.Fields.AlphaCutoff.OnSet = [this.alphaCutoffChanged.bind(this)];
		this.Fields.SpecularColor.OnSet = [this.specularColorChanged.bind(this)];
		this.Fields.SpecularMap.OnSet = [this.specularMapChanged.bind(this)];
	}
}