class GunSupply extends Supply {
	private readonly gun: Gun;

	public constructor(gun: Gun) {
		super();
		this.gun = gun;
	}

	// override
	public onHitShip(ship: Ship): void {
		if (ship.mainGun != null) {
			if ((ship.mainGun instanceof ShotGun) && (this.gun instanceof ShotGun)) {
				(<ShotGun>ship.mainGun).bulletNum++;
			} else if ((ship.mainGun instanceof RowGun) && (this.gun instanceof RowGun)) {
				(<RowGun>ship.mainGun).bulletNum++;
			} else if ((ship.mainGun instanceof EaseGun) && (this.gun instanceof EaseGun)) {
				(<EaseGun>ship.mainGun).bulletPower.baseValue += 5;
			} else if ((ship.mainGun instanceof SoundWaveGun) && (this.gun instanceof SoundWaveGun)) {
				(<SoundWaveGun>ship.mainGun).bulletNum += 1;
			} else {
				ship.removeGun(ship.mainGun.id);
				ship.addGun(this.gun, true).autoFire = true;
			}
		} else {
			ship.addGun(this.gun, true).autoFire = true;
		}
	}
}