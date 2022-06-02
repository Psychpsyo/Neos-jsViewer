neos.components["FrooxEngine.ValueDriver`1"] = class ValueDriver extends Component {
	constructor(slot, ofTypes) {
		super(slot, ofTypes);
		this.Type = "FrooxEngine.ValueDriver`1";
		this.lastTargetValue = null;
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"ValueSource": "FrooxEngine.IField`1[[{T0}]]",
		"DriveTarget": "FrooxEngine.IField`1[[{T0}]]"
	}
	
	update() {
		if (!this.Fields.Enabled.Data) {
			return;
		}
		let targetField = getFromRefID(this.Fields["DriveTarget"].Data);
		let sourceField = getFromRefID(this.Fields["ValueSource"].Data);
		// only do anything if we have a target
		if (targetField && sourceField) {
			setField(targetField, sourceField.Data);
		}
	}
	
	destroy() {
		// un-drive the target
		getFromRefID(this.Fields["DriveTarget"].Data).driven = false;
	}
	
	driveTargetChanged(newValue, oldValue) {
		// un-drive old value
		if (getFromRefID(oldValue)) {
			getFromRefID(oldValue).driven = false;
		}
		if (getFromRefID(newValue)) {
			// only accept the new target if it's not driven yet
			if (getFromRefID(newValue).driven) {
				this.Fields["DriveTarget"].Data = "ID0";
				return;
			}
			getFromRefID(newValue).driven = true;
		}
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.DriveTarget.OnSet = [this.driveTargetChanged.bind(this)];
	}
}