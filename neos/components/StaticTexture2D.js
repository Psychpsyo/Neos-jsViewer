neos.components["FrooxEngine.StaticTexture2D"] = class StaticTexture2D extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.StaticTexture2D";
		this.Texture = new THREE.Texture();
		this.Texture.center.set(0.5, 0.5);
		this.Texture.repeat.set(-1, 1);
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"URL": "System.Uri",
		"FilterMode": "FrooxEngine.TextureFilterMode",
		"AnisotropicLevel": "System.Int32",
		"Uncompressed": "System.Boolean",
		"DirectLoad": "System.Boolean",
		"ForceExactVariant": "System.Boolean",
		"PreferredFormat": "System.Nullable`1[[CodeX.TextureCompression]]",
		"MipMapBias": "System.Single",
		"IsNormalMap": "System.Boolean",
		"WrapModeU": "FrooxEngine.TextureWrapMode",
		"WrapModeV": "FrooxEngine.TextureWrapMode",
		"PowerOfTwoAlignThreshold": "System.Single",
		"CrunchCompressed": "System.Boolean",
		"MaxSize": "System.Nullable`1[[System.Int32]]",
		"MipMaps": "System.Boolean",
		"MipMapFilter": "CodeX.Filtering",
		"Readable": "System.Boolean"
	}
	
	destroy() {
		this.Texture.dispose();
	}
	
	urlChanged(newValue) {
		this.Texture.source = new THREE.Source(neos.imageLoader.load(getNeosURL(newValue)));
		this.Texture.needsUpdate = true;
	}
	
	wrapModeUChanged(newValue) {
		this.Texture.wrapS = neos.enums["FrooxEngine.TextureWrapMode"][newValue];
		this.Texture.needsUpdate = true;
	}
	
	wrapModeVChanged(newValue) {
		this.Texture.wrapT = neos.enums["FrooxEngine.TextureWrapMode"][newValue];
		this.Texture.needsUpdate = true;
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.URL.OnSet = [this.urlChanged.bind(this)];
		this.Fields.WrapModeU.OnSet = [this.wrapModeUChanged.bind(this)];
		this.Fields.WrapModeV.OnSet = [this.wrapModeVChanged.bind(this)];
	}
}