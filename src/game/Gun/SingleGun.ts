class SingleGun extends Gun {

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("GunShoot_mp3");
		}
	}

	// override
	protected onLevelUp(): void {
		this.bulletPower.baseValue++;
	}
}

