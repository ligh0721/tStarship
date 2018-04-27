class Bullet extends GameObject {
	gun: Gun;
	hp: Health;
	private effectedShips: Object = {};
	
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
		if (this.gun.bulletPowerLossPer == 1) {
			return this.hitTest(ship);
		}
		
		let now = egret.getTimer();
		let idStr = ship.id.toString();
		if (this.effectedShips.hasOwnProperty(idStr)) {
			// 有击中记录
			if (now-this.effectedShips[idStr]>this.gun.bulletPowerLossInterval) {
				// 已过击中保护时间
				if (this.hitTest(ship)) {
					// 击中
					this.effectedShips[idStr] = now;
					return true;
				}
			}
		} else {
			// 无击中记录
			if (this.hitTest(ship)) {
				// 击中
				this.effectedShips[idStr] = now;
				return true;
			}
		}
		return false;
	}

	public onHitEnemyBulletTest(ship: Ship): boolean {
		return false;
	}

	public static getDirectionPoint(x: number, y: number, angle: number, dis: number) {
		return tutils.getDirectionPoint(x, y, (angle-90)/tutils.DegPerRad, dis);
	}

	public fireStraight(angle: number, speed: number) {
		this.angle = angle;
		let tw = egret.Tween.get(this.gameObject);
		let toPos = Bullet.getDirectionPoint(this.gameObject.x, this.gameObject.y, angle, tutils.LongDistance);
		tw.to({x: toPos.x, y: toPos.y}, tutils.LongDistance*tutils.SpeedFactor/speed);
	}
}
