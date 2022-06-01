neos.components["FrooxEngine.GrabBlock"] = class GrabBlock extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.GrabBlock";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}