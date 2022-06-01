neos.components["FrooxEngine.AtlasInfo"] = class AtlasInfo extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.AtlasInfo";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"GridSize": "BaseX.int2",
		"GridFrames": "System.Int32"
	}
}