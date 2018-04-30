class EnemyController {
	readonly world: World;

	public constructor(world: World) {
		this.world = world;
	}

	public createEnemyShip(width: number, height: number, type: string): EnemyShip {
		let enemyShip = new EnemyShip(width, height, type);
		//this.world.addShip(enemyShip);

		enemyShip.speed.baseValue = 50;
		enemyShip.force.force = tutils.EnemyForce;

		return enemyShip;
	}

	public rushStraight(ship: EnemyShip, startX: number) {
		ship.x = startX;
		let dis = this.world.height + ship.height;
        let dur = dis * tutils.SpeedFactor / ship.speed.value;
        let tw = egret.Tween.get(ship.gameObject);
        tw.to({y: this.world.height  + ship.height}, dur);
		tw.call(()=>{
			ship.status = UnitStatus.Dead;
		}, this);
	}

	public rushBezier(ships: EnemyShip[], point0: {x: number, y: number},  point1: {x: number, y: number},  point2: {x: number, y: number}, fixedRotation: boolean=false) {
		if (ships.length == 0) {
			return;
		}

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);
			let bezier = new BezierCurve(ship, point0, point1, point2, fixedRotation);
			bezier.startMove(2000, ()=>{
				ship.status = UnitStatus.Dead;
			});
		}, this);
		t.start(200, true, ships.length);
	}
}