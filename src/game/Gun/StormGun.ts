class StormGun extends Gun {
	period: number = 500;
	antiClockWise: boolean = false;

	public constructor() {
		super();
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