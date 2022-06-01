neos.components["FrooxEngine.License"] = class License extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.License";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"Text": "System.String"
	}
}