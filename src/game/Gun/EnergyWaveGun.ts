class EnergyWaveGun extends Gun {
	ease: Function = egret.Ease.quadIn;

	// override
	protected onLevelUp(): void {
		this.bulletPower.baseValue += 4;
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("EaseGunShoot_mp3");
		}
	}
}
