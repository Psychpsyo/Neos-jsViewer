neos.components["FrooxEngine.ValueField`1"] = class ValueField extends Component {
	constructor(slot, ofType) {
		super(slot, ofType);
		this.Type = "FrooxEngine.ValueField`1";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"Value": "{T0}"
	}
}