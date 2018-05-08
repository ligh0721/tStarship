class EaseGun extends Gun {
	ease: Function = null;

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
		tutils.playSound("EaseGunShoot_mp3");
	}
}
