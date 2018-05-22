class StormGun extends Gun {
	radius: number = 150;
	timer: tutils.Timer;
	period: number = 500;
	antiClockWise: boolean = false;

	public constructor() {
		super();
		this.timer===undefined ? this.timer=new tutils.Timer() : this.timer.constructor();
	}

	public fire(): void {
		let periodPer = (egret.getTimer() % this.period) / this.period;
		let angle = periodPer * (this.antiClockWise ? -360 : 360);
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet);
		let pos = Unit.getDirectionPoint(this.ship.x, this.ship.y, angle, this.ship.gameObject.width / 2);
		bullet.x = pos.x;
		bullet.y = pos.y;
		this.fireBulletStraight(bullet, angle);
	}
}