class Effect {
	$value: number = 0;
	gameObject: egret.DisplayObject;
	readonly minimum: number = 0;
	readonly maximum: number = 100;
	onChanged: (effect: Effect)=>void = null;
	onChangedThis: any = null;

	public constructor(minimum: number, maximum: number) {
		this.minimum = Math.floor(minimum);
		this.maximum = Math.floor(maximum);
		this.value = this.minimum;
	}

	public get value(): number {
		return this.$value;
	}

	public set value(value: number) {
		value = Math.floor(value);
		if (value > this.maximum) {
			value = this.maximum;
		} else if (value < this.minimum) {
			value = this.minimum
		}
		if (this.$value == value) {
			return;
		}
		this.$value = value;
		if (this.onChanged != null) {
			this.onChanged.call(this.onChangedThis, this);
		}
	}

	public setOnChanged(onChanged: (effect: Effect)=>void, thisObject: any) {
		this.onChanged = onChanged;
		this.onChangedThis = thisObject;
	}
}