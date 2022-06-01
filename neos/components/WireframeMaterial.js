neos.components["FrooxEngine.WireframeMaterial"] = class WireframeMaterial extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.WireframeMaterial";
		this.Material = new THREE.MeshBasicMaterial();
		this.Material.wireframe = true;
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"HighPriorityIntegration": "System.Boolean",
		"Thickness": "System.Single",
		"ScreenSpace": "System.Boolean",
		"LineColor": "BaseX.color",
		"FillColor": "BaseX.color",
		"InnerLineColor": "BaseX.color",
		"InnerFillColor": "BaseX.color",
		"UseFresnel": "System.Boolean",
		"LineFarColor": "BaseX.color",
		"FillFarColor": "BaseX.color",
		"InnerLineFarColor": "BaseX.color",
		"InnerFillFarColor": "BaseX.color",
		"Exp": "System.Single",
		"Texture": "FrooxEngine.ITexture2D",
		"ZWrite": "FrooxEngine.ZWrite",
		"DoubleSided": "System.Boolean",
		"OffsetFactor": "System.Single",
		"OffsetUnits": "System.Single",
		"RenderQueue": "System.Int32",
		"_regular": "FrooxEngine.Shader",
		"_regularDoubleSided": "FrooxEngine.Shader"
	}
	
	thicknessChange(newValue) {
		this.Material.wireframeLinewidth = newValue;
	}
	
	lineColorChanged(newValue) {
		this.Material.color.set(colorToRGB(newValue));
	}
	
	doubleSidedChange(newValue) {
		this.Material.side = newValue? THREE.DoubleSide : THREE.FrontSide;
	}
	
	zWriteChange(newValue) {
		this.Material.depthWrite = neos.enums["FrooxEngine.ZWrite"][newValue];
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Thickness.OnSet = [this.thicknessChange.bind(this)];
		this.Fields.LineColor.OnSet = [this.lineColorChanged.bind(this)];
		this.Fields.DoubleSided.OnSet = [this.doubleSidedChange.bind(this)];
		this.Fields.ZWrite.OnSet = [this.zWriteChange.bind(this)];
	}
}