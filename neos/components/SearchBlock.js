neos.components["FrooxEngine.SearchBlock"] = class SearchBlock extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.SearchBlock";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}