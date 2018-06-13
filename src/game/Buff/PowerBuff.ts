class PowerSpeedUpBuff extends Buff {
	per: number;

	public constructor(per: number) {
		super(-1, HeroShipTrigger.OnPowerChange);
		this.per = per;
	}

	// override
	public onPowerChange(change: number): number {
		if (change > 0) {
			change = Math.floor(change*this.per);
		}
		return change;
	}
}

class PowerNeverEmptyBuff extends Buff {
	per: number;

	public constructor(per: number) {
		super(-1, HeroShipTrigger.OnPowerEmpty);
		this.per = per;
	}

	// override
	public onPowerEmpty(): void {
		let hero = this.ship as HeroShip;
		hero.addPower(Math.floor(hero.maxPower*this.per));
	}
}
