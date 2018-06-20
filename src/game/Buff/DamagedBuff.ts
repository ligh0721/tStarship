class ShieldBuff extends Buff {
	shield: number;
	
	public constructor(duration: number, shield: number) {
		super(duration, ShipTrigger.OnDamaged);
		this.shield = shield;
	}

	// override
	public onDamaged(value: number, src: HpUnit, unit: HpUnit): number {
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
	public onDamaged(value: number, src: Ship, unit: HpUnit): number {
		let power = this.power * (Math.random() * 0.3 + 0.85);
		value += power;
		let x = (Math.random() * 0.6 - 0.3) * this.ship.width;
		let y = (Math.random() * 0.6 - 0.3) * this.ship.height;
		GameController.instance.hud.addBattleTip(this.ship.x+x, this.ship.y+y, "-"+power.toFixed(0), 360, "FranklinGothicHeavyBlue_fnt", 0.6);
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
	public onDamaged(value: number, src: Ship, unit: HpUnit): number {
		value *= this.factor;
		return value;
	}
}