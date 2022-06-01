neos.components["FrooxEngine.DestroyRoot"] = class DestroyRoot extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.DestroyRoot";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}