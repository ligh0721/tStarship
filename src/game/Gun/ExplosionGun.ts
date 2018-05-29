class ExplosionGun extends Gun {
	explosionRadius: number = 100;

	public fire(): void {
		if (this.ship == null || !this.ship.alive) {
			return;
		}
		this.playFireSound();
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		if (bullet instanceof ExplosionBullet) {
			bullet.explosionRadius = this.explosionRadius;
		}
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		this.fireBulletStraight(bullet);
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
		this.bulletPower.baseValue += 5;
	}
}
