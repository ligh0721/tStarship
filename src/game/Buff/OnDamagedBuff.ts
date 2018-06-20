class ShieldBuff extends Buff {
	shield: number;
	
	public constructor(duration: number, shield: number) {
		super(duration, ShipTrigger.OnDamaged);
		this.shield = shield;
	}

	public onDamaged(value: number, src: HpUnit): number {
		let dt = value - this.shield;
		if (dt > 0) {
			value = dt;
			this.shield = 0;
		} else {
			this.shield = -dt;
			value = 0;
		}
		return value;
	}
}

class ElecBuff extends Buff {
	power: number;

	public constructor(duration:number, power: number) {
		super(duration, ShipTrigger.OnDamaged);
		this.power = power;
	}

	// override
	public onDamaged(value: number, src: Ship): number {
		value += this.power;
		// TODO: effect
		return value;
	}
}

class FactorDamageBuff extends Buff {
	factor: number;

	public constructor(duration:number, factor: number) {
		super(duration, ShipTrigger.OnDamaged);
		this.factor = factor;
	}

	// override
	public onDamaged(value: number, src: Ship): number {
		value *= this.factor;
		return value;
	}
}