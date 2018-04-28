class EnemyController {
	readonly world: World;

	public constructor(world: World) {
		this.world = world;
	}

	public createEnemyShip(width: number, height: number, type: string): EnemyShip {
		let enemyShip = new EnemyShip(width, height, type);
		//this.world.addShip(enemyShip);

		enemyShip.speed = 50;
		enemyShip.force.force = 8;

		return enemyShip;
	}

	public rushStraight(ship: EnemyShip, startX: number) {
		ship.x = startX;
		let dis = this.world.height + ship.height;
        let dur = dis * 100 / ship.speed;
        let tw = egret.Tween.get(ship.gameObject);
        tw.to({y: this.world.height  + ship.height}, dur);
		tw.call(() => {
			this.world.removeShip(ship.id);
		});
	}

	public rushBezier(ships: EnemyShip[], point0: {x: number, y: number},  point1: {x: number, y: number},  point2: {x: number, y: number}, fixedRotation: boolean=false) {
		if (ships.length == 0) {
			return;
		}

		let moveLikeBezier = (ship: EnemyShip)=>{
			this.world.addShip(ship);
			let bezier = new BezierCurve(ship, point0, point1, point2, fixedRotation);
			bezier.startMove(2000, ()=>{
				this.world.removeShip(ship.id);
			});
		}

		let ship = ships.pop();
		moveLikeBezier(ship);

		if (ships.length == 0) {
			return;
		}

		let t = new egret.Timer(150, ships.length);
		t.addEventListener(egret.TimerEvent.TIMER, ()=>{
			let ship = ships.pop();
			moveLikeBezier(ship);
		}, null);
		t.start();
	}
}