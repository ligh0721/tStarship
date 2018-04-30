class Value {
	public baseValue: number;
	private $a: number = 1;
	private $b: number = 0;
	private minValue: number = 0;
	private maxValue: number = tutils.LargeNumber;
	private maxA: number = tutils.LargeNumber;

	public constructor(x: number, minValue?: number, maxValue?: number, maxA?: number) {
		this.baseValue = x;
		this.setRange({minValue: minValue, maxValue: maxValue, maxA: maxA});
	}

	public get value(): number {
		return Math.min(Math.max(this.baseValue*this.realA+this.$b, this.minValue), this.maxValue);
	}

	public get a(): number {
		return this.$a;
	}

	public get b(): number {
		return this.$b;
	}

	public get realA(): number {
		return Math.min(Math.max(this.$a, 0));
	}

	public setRange(prop: {minValue?: number, maxValue?: number, maxA?: number}) {
		if (prop.minValue != undefined) {
			this.minValue = prop.minValue;
		}
		if (prop.maxValue != undefined) {
			this.maxValue = prop.maxValue;
		}
		if (prop.maxA != undefined) {
			this.maxA = prop.maxA;
		}
	}

	public add(prop: {a?: number, b?: number}) {
		if (prop.a != undefined) {
			this.$a += prop.a;
		}
		if (prop.b != undefined) {
			this.$b += prop.b;
		}
	}

	public sub(prop: {a?: number, b?: number}) {
		if (prop.a != undefined) {
			this.$a -= prop.a;
		}
		if (prop.b != undefined) {
			this.$b -= prop.b;
		}
	}
}