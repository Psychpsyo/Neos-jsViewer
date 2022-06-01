neos.components["FrooxEngine.TeleportPassthrough"] = class TeleportPassthrough extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.TeleportPassthrough";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}