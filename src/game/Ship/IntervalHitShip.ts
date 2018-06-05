class IntervalHitShip extends Ship {
	ship: Ship;
	hitShipInterval: number = 1000;
	private readonly effectedShips: { [id: string]: number } = {};

	public constructor(model: string, scale?: number, owner?: Ship) {
		super(model, scale);
		this.ship = owner;
		this.hitTestFlags = ShipHitTestType.Ship;
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