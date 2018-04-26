class Bullet extends GameObject {
	gun: Gun;
	hp: Health;
	
	public constructor(gun: Gun) {
		super();
		this.gun = gun;
		this.hp = new Health();
		this.hp.reset(gun.bulletPower);
	}

	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        bullet.graphics.beginFill(0xffffff, 1.0);
        bullet.graphics.drawCircle(0, 0, 6);
        bullet.graphics.endFill();
		return bullet;
	}

	public onHitEnemyShipTest(ship: Ship): boolean {
		return this.hitTest(ship);
	}

	public onHitEnemyBulletTest(ship: Ship): boolean {
		return false;
	}

	public static getDirectionPoint(x: number, y: number, angle: number, dis: number) {
		return tutils.getDirectionPoint(x, y, (angle-90)/tutils.AnglePerRadian, dis);
	}

	public fireStraight(angle: number, speed: number) {
		let tw = egret.Tween.get(this.gameObject);
		let toPos = Bullet.getDirectionPoint(this.gameObject.x, this.gameObject.y, angle, tutils.LongDistance);
		tw.to({x: toPos.x, y: toPos.y}, tutils.LongDistance*tutils.SpeedFactor/speed);
	}
}
