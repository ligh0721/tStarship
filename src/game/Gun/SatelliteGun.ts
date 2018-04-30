class SatelliteGun extends Gun {
	radiusDelta: number = 80;
	maxBullets: number = 5;
	period: number = 1000;
	antiClockWise: boolean = false;
	private bullets: string[] = null;
	private readonly timer: tutils.Timer = new tutils.Timer();
	private radius: number;

	public fire() {
		if (this.bullets == null) {
			this.bullets = [];
			this.bullets.length = this.maxBullets;
			for (let i=0; i<this.bullets.length; i++) {
				this.bullets[i] = "";
			}
			this.radius = Math.sqrt(this.ship.width*this.ship.width+this.ship.height*this.ship.height) / 2 + this.radiusDelta;
			this.timer.setOnTimerListener(this.onTimer, this);
			this.timer.start(0, true, 0, true);
		}

		let periodPer = (egret.getTimer() % this.period) / this.period;
		for (let i=0; i<this.bullets.length; i++) {
			let bulletId = this.bullets[i];
			let bullet = this.ship.world.getBullet(bulletId);
			if (bullet != null && bullet.isAlive()) {
				continue;
			}

			bullet = this.createBullet();
			bullet.removeOutOfWorld = false;
			this.addBulletToWorld(bullet);
			this.bullets[i] = bullet.id;
			this.updatePosition(bullet, i, periodPer);
			break;
		}
	}

	public onTimer(dt: number): void {
		let periodPer = (egret.getTimer() % this.period) / this.period;
		for (let i=0; i<this.bullets.length; i++) {
			let bulletId = this.bullets[i];
			let bullet = this.ship.world.getBullet(bulletId);
			if (bullet == null || !bullet.isAlive()) {
				continue;
			}
			this.updatePosition(bullet, i, periodPer);
		}
	}

	private updatePosition(bullet: Bullet, index: number, periodPer: number) {
		let angle = (index / this.bullets.length + periodPer) * (this.antiClockWise ? -360 : 360);
		let pos = Unit.getDirectionPoint(this.ship.x, this.ship.y, angle, this.radius);
		bullet.x = pos.x;
		bullet.y = pos.y;
		bullet.angle = angle;
	}

	protected onCleanup() {
		super.onCleanup();
		if (this.timer != null) {
			this.timer.stop();
		}

		if (this.bullets != null) {
			// 所有剩余子弹死亡
			for (let i=0; i<this.bullets.length; i++) {
				let bulletId = this.bullets[i];
				let bullet = this.ship.world.getBullet(bulletId);
				if (bullet == null || !bullet.isAlive()) {
					continue;
				}
				bullet.damaged(bullet.hp, null);
			}
		}
	}
}