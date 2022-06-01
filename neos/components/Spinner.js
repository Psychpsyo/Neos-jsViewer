neos.components["FrooxEngine.Spinner"] = class Spinner extends Component {
	constructor(slot) {
		super(slot);
		this.Type = "FrooxEngine.Spinner";
	}
	
	static fieldTypes = {
		"persistent": "System.Boolean",
		"UpdateOrder": "System.Int32",
		"Enabled": "System.Boolean",
		"Range": "BaseX.float3",
		"_target": "FrooxEngine.IField`1[[BaseX.floatQ]]",
		"_offset": "BaseX.floatQ",
		"_speed": "BaseX.float3"
	}
	
	update() {
		// spin!
		if (getFromRefID(this.Fields["_target"].Data)) {
			let tempVector = this.Fields["_speed"].Data.clone().multiplyScalar(neos.getTime());
			tempVector.x %= this.Fields["Range"].Data.x;
			tempVector.y %= this.Fields["Range"].Data.y;
			tempVector.z %= this.Fields["Range"].Data.z;
			let tempQuaternion = new THREE.Quaternion();
			tempQuaternion.setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(tempVector.x), THREE.MathUtils.degToRad(tempVector.y), THREE.MathUtils.degToRad(tempVector.z)));
			tempQuaternion.multiplyQuaternions(this.Fields["_offset"].Data, tempQuaternion);
			setField(getFromRefID(this.Fields["_target"].Data), tempQuaternion);
		}
	}
	
	disable() {
		setField(getFromRefID(this.Fields["_target"].Data), this.Fields["_offset"].Data);
	}
	
	destroy() {
		// un-drive the spinner's target on destroy
		getFromRefID(this.Fields["_target"].Data).driven = false;
	}
	
	targetChanged(newValue, oldValue) {
		// un-drive old value
		if (getFromRefID(oldValue)) {
			getFromRefID(oldValue).driven = false;
		}
		if (getFromRefID(newValue)) {
			// only accept the new target if it's not driven yet
			if (getFromRefID(newValue).driven) {
				this.Fields["_target"].Data = "ID0";
				return;
			}
			getFromRefID(newValue).driven = true;
		}
	}
	
	initOnSetEvents() {
		super.initOnSetEvents();
		this.Fields._target.OnSet = [this.targetChanged.bind(this)];
	}
}