neos.components["FrooxEngine.ObjectRoot"] = class ObjectRoot extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.ObjectRoot";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}