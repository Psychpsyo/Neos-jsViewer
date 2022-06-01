neos.components["FrooxEngine.LogiX.LogixInterfaceProxy"] = class LogixInterfaceProxy extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.LogiX.LogixInterfaceProxy";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"_worker": "FrooxEngine.Worker",
		"_interfaceSlot": "FrooxEngine.Slot",
		"_position": "BaseX.float3",
		"_rotation": "BaseX.floatQ",
		"_scale": "BaseX.float3"
	}
}