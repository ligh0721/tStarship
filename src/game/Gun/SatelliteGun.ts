class SatelliteGun extends Gun {
	distance: number = 80;
	period: number = 1000;
	antiClockWise: boolean = false;
	private bullets: string[] = null;
	private readonly timer: tutils.Timer;
	private radius: number;

	public constructor() {
		super();
		this.timer===undefined ? this.timer=new tutils.Timer() : this.timer.constructor();
	}

	public fire(): void {
		if (this.bullets == null) {
			this.bullets = [];
			this.bullets.length = this.bulletNum;
			for (let i=0; i<this.bullets.length; i++) {
				this.bullets[i] = "";
			}
			this.radius = Math.sqrt(this.ship.width*this.ship.width+this.ship.height*this.ship.height) / 2 + this.distance;
			this.timer.setOnTimerListener(this.onTimer, this);
			this.timer.start(0, true, 0);
		}

		let periodPer = (egret.getTimer() % this.period) / this.period;
		for (let i=0; i<this.bullets.length; i++) {
			let bulletId = this.bullets[i];
			let bullet = this.ship.world.getBullet(bulletId);
			if (bullet != null && bullet.alive) {
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
			if (bullet == null || !bullet.alive) {
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
		bullet.rotation = angle;
	}

	protected onCleanup(): void {
		super.onCleanup();
		this.timer.stop();

		if (this.bullets != null) {
			// 所有剩余子弹死亡
			for (let i=0; i<this.bullets.length; i++) {
				let bulletId = this.bullets[i];
				let bullet = this.ship.world.getBullet(bulletId);
				if (bullet == null || !bullet.alive) {
					continue;
				}
				bullet.damaged(bullet.hp, null);
			}
		}
	}

	// override
	protected onLevelUp(): void {
		this.bullets.push("");
		this.bulletNum = this.bullets.length;
	}
}