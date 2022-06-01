neos.components["FrooxEngine.AssetOptimizationBlock"] = class AssetOptimizationBlock extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.AssetOptimizationBlock";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean"
	}
}