class Skill {
	ship: HeroShip;
	power: number;

	level :number = 1;

	public constructor(power: number) {
		this.power = power;
	}

	public cast(): boolean {
		if (!this.ship.isEnergyFull()) {
            return false;
        }
		if (this.ship.energy < this.power) {
			return false;
		}
		this.ship.addEnergy(-this.power);
		this.onCast();
		return true;
	}

	// override
	protected onCast(): void {
	}

	public levelUp(num: number=1, sound: boolean=true): void {
		if (num === 0) {
			return;
		}
		for (let i=0; i<num; i++) {
			this.level++;
			this.onLevelUp();
		}
		if (sound) {
			tutils.playSound("GunPowerup_mp3");
		}
	}

	// override
	protected onLevelUp(): void {
	}
}