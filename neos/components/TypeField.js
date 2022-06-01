neos.components["FrooxEngine.TypeField"] = class TypeField extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.TypeField";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"Type": "FrooxEngine.SyncType"
	}
}