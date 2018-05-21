class Bullet extends HpUnit {
	gun: Gun;
	powerLossPer: number = 1.0;  // 子弹能量下降系数
	powerLossInterval: number = 500;  // 子弹能量下降时间间隔
	removeOutOfWorld: boolean = true;
	private readonly effectedShips: { [id: string]: number };
	model: string;

	public constructor(gun: Gun, model?: string) {
		super();
		this.gun = gun;
		this.model = model===undefined ? "Bullet_png" : model;
		this.resetHp(gun.bulletPower.value);
		this.powerLossPer = gun.bulletPowerLossPer;
		this.powerLossInterval = gun.bulletPowerLossInterval.value;
		this.effectedShips===undefined ? this.effectedShips={} : this.effectedShips.constructor();
	}

	// protected onCreate(): egret.DisplayObject {
	// 	if (this.gameObject !== undefined) {
	// 		return this.gameObject;
	// 	}
	// 	let bullet = new egret.Shape();
    //     bullet.graphics.beginFill(this.gun.bulletColor, 1.0);
    //     bullet.graphics.drawCircle(0, 0, 6);
    //     bullet.graphics.endFill();
	// 	return bullet;
	// }

	protected onCreate(): egret.DisplayObject {
		if (this.gameObject !== undefined) {
			return this.gameObject;
		}
		let gameObject = tutils.createBitmapByName(this.model);
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
		return gameObject;
	}

	public onHitEnemyShipTest(ship: Ship): boolean {
		if (this.powerLossPer == 1) {
			return ship.hitTest(this);
		}
		
		let now = egret.getTimer();
		if (this.effectedShips.hasOwnProperty(ship.id)) {
			// 有击中记录
			if (now - this.effectedShips[ship.id] > this.powerLossInterval) {
				// 已过击中保护时间
				if (ship.hitTest(this)) {
					// 击中
					this.effectedShips[ship.id] = now;
					return true;
				}
			}
		} else {
			// 无击中记录
			if (ship.hitTest(this)) {
				// 击中
				this.effectedShips[ship.id] = now;
				return true;
			}
		}
		return false;
	}

	public onHitEnemyBulletTest(ship: Ship): boolean {
		return false;
	}

	protected onDying(src: HpUnit) {
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.gameObject);
		this.status = UnitStatus.Dead;
	}
}
