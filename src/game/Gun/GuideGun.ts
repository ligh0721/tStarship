class GuideGun extends Gun {
	public fire() {
		this.playFireSound();
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		this.fireBulletGuild(bullet, null);
	}

	protected fireBulletGuild(bullet: Bullet, target: Ship): void {
		let bulletId = bullet.id;
		let targetId = "";
		let timer = new tutils.Timer();
		let bulletAngleRaw = -Math.PI/2;
		timer.setOnTimerListener((dt: number)=> {
			if (!bullet.isAlive() || bullet.id != bulletId) {
				timer.stop();
				return;
			}
			if ((target==null || !target.isAlive() || target.id != targetId) && this.ship.isAlive()) {
				targetId = "";
				target = this.ship.world.findNearestFrontAliveEnemyShip(bullet.gameObject.x, bullet.gameObject.y, this.ship.force);
				if (target != null) {
					targetId = target.id;
				}
			}
			if (target != null) {
				bulletAngleRaw = Math.atan2(target.gameObject.y-bullet.gameObject.y, target.gameObject.x-bullet.gameObject.x);
			}
			bullet.angle = bulletAngleRaw * tutils.DegPerRad + 90;
			let to = tutils.getDirectionPoint(bullet.gameObject.x, bullet.gameObject.y, bulletAngleRaw, dt*this.bulletSpeed.value/tutils.SpeedFactor)
			bullet.gameObject.x = to.x;
			bullet.gameObject.y = to.y;
		}, this);
		timer.start(0, true, 0);
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("GuideGunShoot_mp3");
		}
	}
}