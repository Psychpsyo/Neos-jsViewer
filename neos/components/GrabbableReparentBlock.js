neos.components["FrooxEngine.GrabbableReparentBlock"] = class GrabbableReparentBlock extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.GrabbableReparentBlock";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"DontReparent": "System.Boolean",
		"MaxDepth": "System.Int32"
	}
}