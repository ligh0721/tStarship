class MissileGun extends Gun {
	bulletAngleSpeed: number = 9/1000;  // 加速度
	bulletNum: number = 3;
	bulletAngleDelta = 20;

	explosionRadius: number = 100;
	explosionPowerEveryPer: number = 0.5;

	public constructor() {
		super();
		this.fireCooldown.setRange({minValue: 150});
	}

	public fire() {
		this.playFireSound();

		for (let i=0; i<this.bulletNum; i++) {
			let bullet = this.createBullet();
			this.addBulletToWorld(bullet)
			if (bullet instanceof MissileBullet) {
				bullet.explosionRadius = this.explosionRadius;
				bullet.explosionPowerEveryPer = this.explosionPowerEveryPer;
			}
			let angle = (i - (this.bulletNum - 1) / 2) * this.bulletAngleDelta + this.ship.rotation;
			let firePos = Unit.getDirectionPoint(this.ship.x, this.ship.y+60, angle, this.ship.height*0.5);
			bullet.x = firePos.x;
			bullet.y = firePos.y;
			bullet.rotation = angle;
			this.fireBulletGuild(bullet, null);
		}
	}

	protected fireBulletGuild(bullet: Bullet, target: Ship): void {
		let bulletId = bullet.id;
		let targetId = "";
		let timer = new tutils.TimerByAction(GameController.instance.actMgr);
		let yDropSpeed = 40;
		let bulletSpeed = 0;
		let angleSpeed = 0;
		timer.setOnTimerListener((dt: number)=> {
			if (!bullet.alive || bullet.id!=bulletId) {
				timer.stop();
				return;
			}
			if (target==null || !target.alive || target.id!=targetId) {
				targetId = "";
				target = null;
				if (this.ship.alive) {
					target = this.ship.world.findNearestFrontAliveEnemyShip(bullet.gameObject.x, bullet.gameObject.y, this.ship.force, 600);
					if (target != null) {
						targetId = target.id;
					}
				}
			}
			if (target!=null && bulletSpeed>100) {
				angleSpeed += this.bulletAngleSpeed;
				bullet.adjustAngle(dt, angleSpeed, target.gameObject.x, target.gameObject.y);
			}
			bulletSpeed += dt/1000*this.bulletSpeed.value;
			let to = bullet.getDirectionPoint(dt*bulletSpeed/tutils.SpeedFactor)
			if (yDropSpeed > 0) {
				to.y += dt*yDropSpeed/tutils.SpeedFactor
				yDropSpeed -= 40/1000;
			}
			bullet.gameObject.x = to.x;
			bullet.gameObject.y = to.y;
		}, this);
		timer.start(0, true, 0);
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("MissileGunShoot_mp3");
		}
	}

	// override
	protected onLevelUp(): void {
		this.explosionRadius *= 1.1;
		this.bulletPower.baseValue += 3;
	}
}