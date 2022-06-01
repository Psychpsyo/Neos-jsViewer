neos.components["FrooxEngine.ReferenceField`1"] = class ReferenceField extends Component {
	constructor(slot, ofType) {
		super(slot, ofType);
		this.Type = "FrooxEngine.ReferenceField`1";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"Reference": "{T0}"
	}
}