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
				tutils.playSound("GunPowerup_mp3");
			} else if ((ship.mainGun instanceof RowGun) && (this.gun instanceof RowGun)) {
				(<RowGun>ship.mainGun).bulletNum++;
				tutils.playSound("GunPowerup_mp3");
			} else if ((ship.mainGun instanceof EaseGun) && (this.gun instanceof EaseGun)) {
				(<EaseGun>ship.mainGun).bulletPower.baseValue += 5;
				tutils.playSound("GunPowerup_mp3");
			} else if ((ship.mainGun instanceof SoundWaveGun) && (this.gun instanceof SoundWaveGun)) {
				(<SoundWaveGun>ship.mainGun).bulletNum += 1;
				tutils.playSound("GunPowerup_mp3");
			} else if ((ship.mainGun instanceof GuideGun) && (this.gun instanceof GuideGun)) {
				ship.mainGun.bulletPower.baseValue += 2;
				tutils.playSound("GunPowerup_mp3");
			} else if ((ship.mainGun instanceof ExplosionGun) && (this.gun instanceof ExplosionGun)) {
				ship.mainGun.explosionRadius *= 1.2;
				ship.mainGun.bulletPower.baseValue += 5;
				tutils.playSound("GunPowerup_mp3");
			} else {
				ship.removeGun(ship.mainGun.id);
				ship.addGun(this.gun, true).autoFire = true;
			}
		} else {
			ship.addGun(this.gun, true).autoFire = true;
		}
	}
}