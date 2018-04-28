class SatelliteGun extends Gun {
	radiusDelta: number = 80;
	maxBullets: number = 5;
	period: number = 1000;
	antiClockWise: boolean = false;
	private bullets: number[] = [];
	private tick: number = 0;
	private timer: egret.Timer = null;
	private radius: number;

	public fire() {
		if (this.bullets.length == 0) {
			this.bullets.length = this.maxBullets;
			for (let i=0; i<this.bullets.length; i++) {
				this.bullets[i] = 0;
			}
			this.radius = Math.sqrt(this.ship.width*this.ship.width+this.ship.height*this.ship.height) / 2 + this.radiusDelta;
			this.tick = egret.getTimer();
			this.timer = new egret.Timer(1000/60, 0);
			this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
			this.timer.start();
		}

		for (let i in this.bullets) {
			let bulletId = this.bullets[i];
			let bullet = this.ship.world.getBullet(bulletId);
			if (bullet != null && !bullet.power.isDead()) {
				continue;
			}

			bullet = this.createBullet();
			bullet.removeOutOfWorld = false;
			this.addBulletToWorld(bullet);
			this.bullets[i] = bullet.id;
		}
	}

	public onTimer(evt: egret.TimerEvent) {
		let now = egret.getTimer();
		let periodPer = (now % this.period) / this.period;

		for (let i=0; i<this.bullets.length; i++) {
			let bulletId = this.bullets[i];
			let bullet = this.ship.world.getBullet(bulletId);
			if (bullet == null || bullet.power.isDead()) {
				continue;
			}

			let angle = (i / this.bullets.length + periodPer) * (this.antiClockWise ? -360 : 360);
			let pos = GameObject.getDirectionPoint(this.ship.x, this.ship.y, angle, this.radius);
			bullet.x = pos.x;
			bullet.y = pos.y;
			bullet.angle = angle;
		}
	}

	public cleanup() {
		super.cleanup();
		if (this.timer != null) {
			this.timer.stop();
		}

		for (let i=0; i<this.bullets.length; i++) {
			let bulletId = this.bullets[i];
			let bullet = this.ship.world.getBullet(bulletId);
			if (bullet == null || bullet.power.isDead()) {
				continue;
			}
			bullet.power.hp = 0;
			bullet.onDying();
			this.ship.world.removeBullet(bulletId);
		}
	}
}