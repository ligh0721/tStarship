class EnemyController {
	world: World;

	private static _inst: EnemyController = null;
	private constructor5() {
	}

	public static get instance(): EnemyController {
		return EnemyController._inst != null ? EnemyController._inst : (EnemyController._inst = new EnemyController());
	}

	public createEnemyShip(): EnemyShip {
		let enemyShip = new EnemyShip(40, 80, "tri");
		this.world.addShip(enemyShip);

		enemyShip.speed = 50;
		enemyShip.force.force = 8;

		return enemyShip;
	}

	public enemyShipMoveInStraightLine(ship: EnemyShip, startX: number) {
		ship.x = startX;
		let dis = this.world.height + ship.height;
        let dur = dis * 100 / ship.speed;
        let tw = egret.Tween.get(ship.gameObject);
        tw.to({y: this.world.height  + ship.height}, dur);
		tw.call(() => {
			this.world.removeShip(ship.id);
		});
	}

	public enemyShipMoveInBezierCurve(ship: EnemyShip, point0: {x: number, y: number},  point1: {x: number, y: number},  point2: {x: number, y: number}) {
		let bezierCurve = new BezierCurve(ship, point0, point1, point2);
		bezierCurve.startMove(() => {
			this.world.removeShip(ship.id);
		});
	}

	public arrEnemyShipsMoveInBezierCurve(arrShips: EnemyShip[], point0: {x: number, y: number},  point1: {x: number, y: number},  point2: {x: number, y: number}) {
		let t = new egret.Timer(150, 0);
		let i = 0;
		t.addEventListener(egret.TimerEvent.TIMER, () => {
			if(i >= arrShips.length) {
				t.stop();
				return;
			}
			
			let ship = arrShips[i];
			let bezierCurve = new BezierCurve(ship, point0, point1, point2);
			bezierCurve.startMove(() => {
				this.world.removeShip(ship.id);
			});

			i++;
		}, null);
		t.start();
	}
}