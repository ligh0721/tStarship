class GuideGun extends Gun {
	bulletAngleSpeed: number = 50/1000;
	private bulletAngleNum = 3;
	private bulletAngleDelta = 30;
	private $bulletAngleIndex = 0;

	public fire() {
		this.playFireSound();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)

		let r = Math.sqrt(this.ship.width*this.ship.width+this.ship.height*this.ship.height) / 2;
		let angle = (this.$bulletAngleIndex - (this.bulletAngleNum - 1) / 2) * this.bulletAngleDelta + this.ship.angle;
		let firePos = this.ship.getDirectionPoint(r, angle);
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		bullet.angle = angle;
		this.fireBulletGuild(bullet, null);

		this.$bulletAngleIndex++;
		if (this.$bulletAngleIndex === this.bulletAngleNum) {
			this.$bulletAngleIndex = 0;
		}
	}

	protected fireBulletGuild(bullet: Bullet, target: Ship): void {
		let bulletId = bullet.id;
		let targetId = "";
		let timer = new tutils.Timer();
		timer.setOnTimerListener((dt: number)=> {
			if (!bullet.alive || bullet.id!=bulletId) {
				timer.stop();
				return;
			}
			if ((target==null || !target.alive || target.id!=targetId) && this.ship.alive) {
				targetId = "";
				target = this.ship.world.findNearestFrontAliveEnemyShip(bullet.gameObject.x, bullet.gameObject.y, this.ship.force);
				if (target != null) {
					targetId = target.id;
				}
			}
			if (target != null) {
				let dis = bullet.getDistance(target.gameObject.x, target.gameObject.y);
				let angleSpeed = 1000000 / Math.max(10, dis*dis) * this.bulletAngleSpeed;
				bullet.adjustAngle(dt, angleSpeed, target.gameObject.x, target.gameObject.y);
			}
			let to = bullet.getDirectionPoint(dt*this.bulletSpeed.value/tutils.SpeedFactor)
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

	// override
	protected onLevelUp(): void {
		this.bulletPower.baseValue += 2;
	}
}