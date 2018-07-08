class ExplosionGun extends EaseGun {
	ease: Function = egret.Ease.getPowOut(60);
	explosionRadius: number = 100;
	explosionPowerEveryPer: number = 0.3;

	public fire(): void {
		if (this.ship == null || !this.ship.alive) {
			return;
		}
		this.playFireSound();
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		if (bullet instanceof ExplosionBallBullet) {
			bullet.explosionRadius = this.explosionRadius;
			bullet.explosionPowerEveryPer = this.explosionPowerEveryPer;
		}
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		this.fireBulletStraight(bullet, this.ship.rotation, false, this.ease);
	}
	
	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("ExplosionGunShoot_mp3");
		}
	}

	// override
	protected onLevelUp(): void {
		this.explosionRadius *= 1.2;
		this.bulletPower.baseValue += 3;
	}
}
