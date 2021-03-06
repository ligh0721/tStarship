class IntervalHitShip extends Ship {
	ship: Ship;
	hitShipInterval: number = 1000;
	private readonly effectedShips: { [id: string]: number } = {};

	public constructor(model: string, modelScale?: number, owner?: Ship) {
		super(model, modelScale);
		this.ship = owner;
		this.hitTestFlags = ShipHitTestType.Ship;
	}

	// override
	public $triggerOnDestroyTarget(target: Ship): void {
		super.$triggerOnDestroyTarget(target);
		if (this.ship && this.ship.alive) {
			this.ship.$triggerOnDestroyTarget(target);
		}
	}

	// override
	public onHitEnemyShipTest(ship: Ship): boolean {
		let now = egret.getTimer();
		if (this.effectedShips.hasOwnProperty(ship.id)) {
			// 有击中记录
			if (now-this.effectedShips[ship.id] > this.hitShipInterval) {
				// 已过击中保护时间
				//if (ship.hitTest(this)) {
				if (super.onHitEnemyShipTest(ship)) {
					// 击中
					this.effectedShips[ship.id] = now;
					return true;
				}
			}
		} else {
			// 无击中记录
			//if (ship.hitTest(this)) {
			if (super.onHitEnemyShipTest(ship)) {
				// 击中
				this.effectedShips[ship.id] = now;
				return true;
			}
		}
		return false;
	}
}