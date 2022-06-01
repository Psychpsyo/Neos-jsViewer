neos.components["FrooxEngine.TimeIntDriver"] = class TimeIntDriver extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.TimeIntDriver";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"Scale": "System.Single",
		"Repeat": "System.Int32",
		"PingPong": "System.Boolean",
	"Target": "FrooxEngine.IField`1[[System.Int32]]"
	}
	
	update() {
		if (this.Fields.Enabled.Data) {
			let targetField = getFromRefID(this.Fields.Target.Data);
			if (targetField) {
				if (this.Fields.Repeat.Data > 0) {
					let step = Math.floor(neos.getTime() * this.Fields.Scale.Data);
					if (this.Fields.PingPong.Data && (step % (this.Fields.Repeat.Data * 2)) >= this.Fields.Repeat.Data) {
						setField(targetField, this.Fields.Repeat.Data - 1 - (step % this.Fields.Repeat.Data));
					} else {
						setField(targetField, step % this.Fields.Repeat.Data);
					}
				} else {
					setField(targetField, Math.floor(neos.getTime() * this.Fields.Scale.Data));
				}
			}
		}
	}
	
	destroy() {
		// un-drive the spinner's target on destroy
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
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields.Target.OnSet = [this.targetChanged.bind(this)];
	}
}