neos.components["FrooxEngine.DuplicateBlock"] = class DuplicateBlock extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.DuplicateBlock";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}