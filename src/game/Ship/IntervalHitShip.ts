class IntervalHitShip extends Ship {
	hitShipInterval: number = 1000;
	private readonly effectedShips: { [id: string]: number };

	public constructor(model: string, scale?: number) {
		super(model, scale);
		this.effectedShips===undefined ? this.effectedShips={} : this.effectedShips.constructor();
	}

	// override
	public onHitEnemyShipTest(ship: Ship): boolean {
		let now = egret.getTimer();
		if (this.effectedShips.hasOwnProperty(ship.id)) {
			// 有击中记录
			if (now - this.effectedShips[ship.id] > this.hitShipInterval) {
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
}