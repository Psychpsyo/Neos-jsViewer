neos.components["FrooxEngine.NoDestroyUndo"] = class NoDestroyUndo extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.NoDestroyUndo";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}