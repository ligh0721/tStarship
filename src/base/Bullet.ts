class Bullet extends GameObject {
	gun: Gun;
	power: Health;
	powerLossPer: number = 1.0;  // 子弹能量下降系数
	powerLossInterval: number = 500;  // 子弹能量下降时间间隔
	removeOutOfWorld: boolean = true;
	private effectedShips: Object = {};
	
	public constructor(gun: Gun) {
		super();
		this.gun = gun;
		this.power = new Health();
		this.power.reset(gun.bulletPower);
		this.powerLossPer = gun.bulletPowerLossPer;
		this.powerLossInterval = gun.bulletPowerLossInterval;
	}

	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        bullet.graphics.beginFill(0xffffff, 1.0);
        bullet.graphics.drawCircle(0, 0, 6);
        bullet.graphics.endFill();
		return bullet;
	}

	public onHitEnemyShipTest(ship: Ship): boolean {
		if (this.powerLossPer == 1) {
			
			return this.hitTest(ship);
		}
		
		let now = egret.getTimer();
		let idStr = ship.id.toString();
		if (this.effectedShips.hasOwnProperty(idStr)) {
			// 有击中记录
			if (now - this.effectedShips[idStr] > this.powerLossInterval) {
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

	public onDying() {
	}

	public fireStraight(angle: number, speed: number, ease?: Function) {
		this.angle = angle;
		let tw = egret.Tween.get(this.gameObject);
		let toPos = GameObject.getDirectionPoint(this.gameObject.x, this.gameObject.y, angle, tutils.LongDistance);
		tw.to({x: toPos.x, y: toPos.y}, tutils.LongDistance*tutils.SpeedFactor/speed, ease);
	}
}
