class EnemyController {
	readonly world: World;
	private rushes: RushItem[] = [];
	private tick: number = 0;
	private timer: tutils.Timer = null;

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

	public rushStraight(ships: EnemyShip[], startX: number, interval: number) {
		if (ships.length == 0) {
			return;
		}

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);
			ship.x = startX;
			let dis = this.world.height + ship.height;
			let dur = dis * tutils.SpeedFactor / ship.speed.value;
			let tw = egret.Tween.get(ship.gameObject);
			tw.to({y: this.world.height  + ship.height}, dur);
			tw.call(()=>{
				ship.status = UnitStatus.Dead;
			}, this);
		}, this);

		t.start(interval, true, ships.length);
	}

	public rushBezier(ships: EnemyShip[], point0: {x: number, y: number},  point1: {x: number, y: number},  point2: {x: number, y: number}, interval: number, duration: number, fixedRotation: boolean=false) {
		if (ships.length == 0) {
			return;
		}

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);
			let bezier = new BezierCurve(ship, point0, point1, point2, fixedRotation);
			bezier.startMove(duration, ()=>{
				ship.status = UnitStatus.Dead;
			});
		}, this);

		t.start(interval, true, ships.length);
	}

	public rushSin(ships: EnemyShip[], point0: {x: number, y: number},  point1: {x: number, y: number}, interval: number, duration: number, period: number, amplitude: number) {
		if (ships.length == 0) {
			return;
		}

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);
			let sin = new SinCurve(ship, point0, point1, period, amplitude);
			sin.startMove(duration, ()=>{
			ship.status = UnitStatus.Dead;
		});
		
		}, this);

		t.start(interval, true, ships.length);
	}

	public clearRushes() {
		this.rushes = [];
	}

	public addRush(rushItem: RushItem) {
		this.rushes.push(rushItem);
	}

	public start(frameRate: number) {
		if (this.timer == null) {
			this.timer = new tutils.Timer();
			this.timer.setOnTimerListener(this.rushStep, this);
		}
		this.timer.start(1000/frameRate, true, 0);
		this.tick = 0;
	}

	public rushStep(dt: number) {
		if(this.rushes.length <= 0) {
			this.timer.stop();
			this.tick = 0;
			return;
		}

		let topItem = this.rushes[0];
		this.tick += dt;

		if(this.tick >= topItem.delay) {
			this.rush(topItem);
			this.tick = 0;
			this.rushes.splice(0, 1);
		}
	}

	private rush(rushItem: RushItem) {
		switch(rushItem.type) {
			case "Bezier":
				if(rushItem.path.length < 3) {
					return;
				}
				
				this.rushBezier(rushItem.ships, rushItem.path[0], rushItem.path[1], rushItem.path[2], rushItem.interval, rushItem.duration, false);
				return;
			case "streight":
				if(rushItem.path.length < 1) {
					return ;
				}

				this.rushStraight(rushItem.ships, (rushItem.path[0]).x, rushItem.interval);
				return ;
			case "sin":
				if(rushItem.path.length < 2) {
					return ;
				}

				this.rushSin(rushItem.ships, rushItem.path[0], rushItem.path[1], rushItem.interval, rushItem.duration, rushItem.period, rushItem.amplitude);
				return ;
			default: return;
		}

	}
}