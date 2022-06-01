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
		"Source": "FrooxEngine.IField`1[[{T0}]]",
		"Target": "FrooxEngine.IField`1[[{T0}]]"
	}
	
	update() {
		if (!this.Fields.Enabled.Data) {
			return;
		}
		let targetField = getFromRefID(this.Fields["Target"].Data);
		let sourceField = getFromRefID(this.Fields["Source"].Data);
		// only do anything if we have a target
		if (targetField && sourceField) {
			setField(targetField, sourceField.Data);
		}
	}
	
	destroy() {
		// un-drive the target
		getFromRefID(this.Fields["Target"].Data).driven = false;
	}
	
	targetChanged(newValue, oldValue) {
		// un-drive old value
		if (getFromRefID(oldValue)) {
			getFromRefID(oldValue).driven = false;
		}
		if (getFromRefID(newValue)) {
			// only accept the new target if it's not driven yet
			if (getFromRefID(newValue).driven) {
				this.Fields["Target"].Data = "ID0";
				return;
			}
			getFromRefID(newValue).driven = true;
		}
	}
	
	writeBackChanged(newValue) {
		// start tracking the last value that the target was.
		if (newValue) {
			this.lastTargetValue = targetField.Data;
		}
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Target.OnSet = [this.targetChanged.bind(this)];
		this.Fields.WriteBack.OnSet = [this.writeBackChanged.bind(this)];
	}
}