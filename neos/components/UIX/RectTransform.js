neos.components["FrooxEngine.UIX.RectTransform"] = class RectTransform extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.UIX.RectTransform";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"AnchorMin": "BaseX.float2",
		"AnchorMax": "BaseX.float2",
		"OffsetMin": "BaseX.float2",
		"OffsetMax": "BaseX.float2",
		"Pivot": "BaseX.float2"
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
	}
}