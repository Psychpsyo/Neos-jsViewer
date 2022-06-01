neos.components["FrooxEngine.DestroyBlock"] = class DestroyBlock extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.DestroyBlock";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}