neos.components["FrooxEngine.TeleportSurface"] = class TeleportSurface extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.TeleportSurface";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}