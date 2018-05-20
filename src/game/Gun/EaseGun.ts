class EaseGun extends Gun {
	ease: Function = egret.Ease.getPowIn(2);

	public fire(): void {
		this.playFireSound();
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		this.fireBulletStraight(bullet, this.ship.angle, false, this.ease);
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("EaseGunShoot_mp3");
		}
	}
}
