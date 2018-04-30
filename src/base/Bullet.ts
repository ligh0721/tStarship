class Bullet extends HpUnit {
	gun: Gun;
	powerLossPer: number = 1.0;  // 子弹能量下降系数
	powerLossInterval: number = 500;  // 子弹能量下降时间间隔
	removeOutOfWorld: boolean = true;
	private effectedShips: { [id: string]: number } = {};
	
	public constructor(gun: Gun) {
		super();
		this.gun = gun;
		this.resetHp(gun.bulletPower);
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
		if (this.effectedShips.hasOwnProperty(ship.id)) {
			// 有击中记录
			if (now - this.effectedShips[ship.id] > this.powerLossInterval) {
				// 已过击中保护时间
				if (this.hitTest(ship)) {
					// 击中
					this.effectedShips[ship.id] = now;
					return true;
				}
			}
		} else {
			// 无击中记录
			if (this.hitTest(ship)) {
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
