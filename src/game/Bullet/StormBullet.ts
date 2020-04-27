class StormBullet extends Bullet {
	radius: number = 150;
	timer: tutils.Timer;
	period: number = 500;
	antiClockWise: boolean = false;
	fireCD: number = 0;
	bulletSpeed: number = 50;
	bulletPower: number = 3;
	bulletMaxHitTimes: number = 1;
	bulletHitInterval: number = 1000;
	
	public constructor(gun: Gun) {
		super(gun, "BlueBallBullet_png");
		this.timer===undefined ? this.timer=new tutils.Timer() : this.timer.constructor();
		this.timer.setOnTimerListener(this.onTimer, this);
	}

	protected onCreate(): egret.DisplayObject {
		if (this.gameObject !== undefined) {
			return this.gameObject;
		}
		let gameObject = this.createModel();
		gameObject.width = this.radius * 2;
		gameObject.height = this.radius * 2;
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
		return gameObject;
	}

	// override
	public onAddToWorld(): void {
		super.onAddToWorld();
		this.timer.start(this.fireCD, false, 0);
	}

	protected onTimer(dt: number): void {
		let periodPer = (egret.getTimer() % this.period) / this.period;
		let angle = periodPer * (this.antiClockWise ? -360 : 360);
		let bullet = this.pools.newObject(Bullet, this.gun);
		this.world.addBullet(bullet);
		let pos = Unit.getDirectionPoint(this.x, this.y, angle, this.gameObject.width / 2);
		bullet.x = pos.x;
		bullet.y = pos.y;
		bullet.resetHp(this.bulletPower);
		bullet.maxHitTimes = this.bulletMaxHitTimes;
		bullet.hitInterval = this.bulletHitInterval;
		bullet.moveStraight(angle, this.bulletSpeed);
	}

	// override
	protected onCleanup(): void {
		this.timer.stop();
		super.onCleanup();
	}
}