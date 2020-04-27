class Bullet extends HpUnit {
	gun: Gun;
	// powerLossPer: number = 1.0;  // 子弹能量下降系数
	maxHitTimes: number = 1;  // 子弹可碰撞次数
	hitInterval: number = 500;  // 子弹能量下降时间间隔
	removeOutOfWorld: boolean = true;
	private readonly effectedShips: { [id: string]: number } = {};
	readonly model: string;
	readonly modelScale: number;

	public constructor(gun: Gun, model?: string, modelScale?: number) {
		super();
		this.gun = gun;
		this.model = model===undefined ? "BlueBullet2_png" : model;
		this.modelScale = modelScale===undefined ? 1.0 : modelScale;
		this.resetHp(gun.bulletPower.value*gun.bulletMaxHitTimes);
		this.maxHitTimes = gun.bulletMaxHitTimes;
		this.hitInterval = gun.bulletHitInterval.value;
	}

	protected createModel(): egret.DisplayObject {
		let gameObject = tutils.createBitmapByName(this.model);
		gameObject.width *= this.modelScale;
		gameObject.height *= this.modelScale;
		return gameObject;
	}

	// override
	protected onCreate(): egret.DisplayObject {
		if (this.gameObject !== undefined) {
			return this.gameObject;
		}
		let gameObject = this.createModel();
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
		return gameObject;
	}

	// override
	public onHitEnemyShipTest(ship: Ship): boolean {
		if (this.maxHitTimes === 1) {
			return ship.hitTest(this);
		}
		
		let now = egret.getTimer();
		if (this.effectedShips.hasOwnProperty(ship.id)) {
			// 有击中记录
			if (now - this.effectedShips[ship.id] > this.hitInterval) {
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

	// override
	public onHitEnemyBulletTest(ship: Ship): boolean {
		return false;
	}

	// override
	protected onDying(src: HpUnit) {
		this.stopAllActions();
		GameController.instance.actMgr.removeAllActions(this.gameObject);
		this.status = UnitStatus.Dead;
	}
}
