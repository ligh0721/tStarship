class CriticalBuff extends Buff {
	rate: number;
	a: number;
	b: number;
	
	public constructor(duration: number, rate: number, a: number=2.0, b: number=0) {
		super(duration, HeroShipTrigger.OnDamageTarget);
		this.rate = rate;
		this.a = a;
		this.b = b;
	}

	// override
	public onDamageTarget(value: number, target: Ship, unit: HpUnit): number {
		let rate = this.rate;
		if (unit instanceof Bullet) {
			rate /= unit.gun.bulletNum;
		}
		if (Math.random() < rate) {
			value = (this.a * value + this.b) * (Math.random() * 0.3 + 0.85);
			GameController.instance.hud.addBattleTip(unit.x, unit.y, "CRI "+value.toFixed(0)+"!", 45, "FranklinGothicHeavyItalicRed_fnt", 1.0);
			return value;
		}
		return value;
	}
}

class AddTargetBuffBuff extends Buff implements IFromGunBuff {
	rate: number;
	buffs: string[];
	from: Gun;

	public constructor(duration: number, rate: number, buffs: string[], from?: Gun) {
		super(duration, HeroShipTrigger.OnDamageTarget);
		this.rate = rate;
		this.buffs = buffs;
		this.from = from;
	}

	// override
	public onDamageTarget(value: number, target: Ship, unit: HpUnit): number {
		if ((!this.from || (unit instanceof Bullet && unit.gun===this.from)) && Math.random()<this.rate) {
			for (let i in this.buffs) {
				let buff = GameController.instance.createBuff(this.buffs[i]);
				target.addBuff(buff);
			}
		}
		return value;
	}
}