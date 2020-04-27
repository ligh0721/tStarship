class EnergySpeedUpBuff extends Buff {
	per: number;

	public constructor(duration:number, per: number) {
		super(duration, HeroShipTrigger.OnEnergyChange);
		this.per = per;
	}

	// override
	public onEnergyChange(change: number): number {
		if (change > 0) {
			change = change*this.per;
		}
		return change;
	}
}

class EnergyNeverEmptyBuff extends Buff {
	per: number;

	public constructor(duration: number, per: number) {
		super(duration, HeroShipTrigger.OnEnergyEmpty);
		this.per = per;
	}

	// override
	public onEnergyEmpty(): void {
		let hero = this.ship as HeroShip;
		hero.addEnergy(hero.maxEnergy*this.per);
	}
}

class AddEnergyBuff extends Buff {
	energy: number;

	public constructor(power: number) {
		super(0);
		this.energy = power;
	}

	// override
	public onAddBuff(): void {
		if (this.ship instanceof HeroShip) {
			this.ship.addEnergy(this.energy);
		}
	}
}
