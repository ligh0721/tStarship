class Skill {
	ship: HeroShip;
	power: number;

	public constructor(power: number) {
		this.power = power;
	}

	public cast(): boolean {
		if (!this.ship.isPowerFull()) {
            return false;
        }
		if (this.ship.power < this.power) {
			return false;
		}
		this.ship.addPower(-this.power);
		this.onCast();
		return true;
	}

	// override
	protected onCast(): void {
	}
}