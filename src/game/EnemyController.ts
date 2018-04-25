class EnemyController {
	world: World;
	arrEnemyShips: Array<EnemyShip>;

	private static _inst: EnemyController = null;
	private constructor() {
	}

	public static get instance(): EnemyController {
		return EnemyController._inst != null ? EnemyController._inst : (EnemyController._inst = new EnemyController());
	}

	public createEnemyShip(): EnemyShip {
		let enemyShip = new EnemyShip(10, 10, "rect");
		enemyShip.force.force = 8;
		this.arrEnemyShips.push(enemyShip);

		this.world.addShip(enemyShip)
		return enemyShip;
	}
}