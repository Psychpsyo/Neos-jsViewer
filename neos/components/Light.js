neos.components["FrooxEngine.Light"] = class Light extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.Light";
		this.Light = new THREE.Light();
		this.Slot.add(this.Light);
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"LightType": "FrooxEngine.LightType",
		"Intensity": "System.Single",
		"Color": "BaseX.color",
		"ShadowType": "FrooxEngine.ShadowType",
		"ShadowStrength": "System.Single",
		"ShadowNearPlane": "System.Single",
		"ShadowMapResolution": "System.Int32",
		"Range": "System.Single",
		"SpotAngle": "System.Single",
		"Cookie": "FrooxEngine.ITexture2D"
	}
	
	destroy() {
		this.Slot.remove(this.Light);
		this.Light.dispose();
	}
	
	lightTypeChanged(newValue) {
		// replace the light
		this.Slot.remove(this.Light);
		this.Light.dispose();
		
		this.Light = new neos.enums["FrooxEngine.LightType"][newValue]();
		this.Light.intensity = this.Fields["Intensity"];
		this.Light.color.set(colorToRGB(this.Fields.Color.Data));
		
		this.Slot.add(this.Light);
	}
	
	intensityChanged(newValue) {
		this.Light.intensity = newValue;
	}
	
	colorChanged(newValue) {
		this.Light.color.set(colorToRGB(newValue));
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.LightType.OnSet = [this.lightTypeChanged.bind(this)];
		this.Fields.Intensity.OnSet = [this.intensityChanged.bind(this)];
		this.Fields.Color.OnSet = [this.colorChanged.bind(this)];
	}
}