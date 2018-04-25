class EnemyController {
	world: World;

	private static _inst: EnemyController = null;
	private constructor5() {
	}

	public static get instance(): EnemyController {
		return EnemyController._inst != null ? EnemyController._inst : (EnemyController._inst = new EnemyController());
	}

	public createEnemyShip(): EnemyShip {
		let enemyShip = new EnemyShip(20, 20, "rect");
		this.world.addShip(enemyShip);

		enemyShip.x =enemyShip.width * 0.5;
		enemyShip.speed = 50;
		enemyShip.force.force = 8;

		return enemyShip;
	}

	public enemyShipMoveInStraightLine(ship: EnemyShip) {
		let dis = this.world.height + ship.height;
        let dur = dis * 100 / ship.speed;
        let tw = egret.Tween.get(ship.gameObject);
        tw.to({y: this.world.height  + ship.height}, dur);
		tw.call(() => {
			this.world.removeShip(ship.id);
		});
	}
}