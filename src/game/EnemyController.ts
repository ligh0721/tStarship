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

		enemyShip.speed.baseValue = 50;
		enemyShip.force.force = tutils.EnemyForce;

		return enemyShip;
	}

	public rushStraight(ships: EnemyShip[], startX: number, interval: number, duration: number) {
		if (ships.length == 0) {
			return;
		}

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);
			ship.x = startX;
			let tw = egret.Tween.get(ship.gameObject);
			tw.to({y: this.world.height  + ship.height}, duration);
			tw.call(()=>{
				ship.status = UnitStatus.Dead;
			}, this);
		}, this);

		t.start(interval, true, ships.length);
	}

	rushPath(ships: EnemyShip[], path: {x: number, y: number}[], interval: number, duration: number) {
		if (ships.length == 0 || path.length < 2) {
			return;
		}

		let paths = [];
		let totalDis = 0;
		for(let i = 0; i < path.length - 1; i ++) {
			let dis = Math.sqrt((path[i + 1].y - path[i].y) * (path[i + 1].y - path[i].y) + (path[i + 1].x - path[i].x) * (path[i + 1].x - path[i].x));
			paths.push(dis);
			totalDis += dis;
		}

		

		let durations = [];
		for(let i = 0; i < paths.length; i ++) {
			let dur = paths[i] / totalDis * duration;
			durations.push(dur);
			
		}

		

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);

			ship.x = path[0].x;
			ship.y = path[0].y;
			let tw = egret.Tween.get(ship.gameObject);

			for(let i = 1; i < path.length; i ++) {
				console.log("ddddddd" + i);
				tw.to({x: path[i].x, y: path[i].y}, durations[i - 1]);
			}
			// tw.to({x: path[1].x, y: path[1].y}, durations[0]);
			// tw.to({x: path[2].x, y: path[2].y}, durations[1]);
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

	public startRush(frameRate: number) {
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
		case "bezier":
			if(rushItem.path.length < 3) {
				break;
			}
			this.rushBezier(rushItem.ships, rushItem.path[0], rushItem.path[1], rushItem.path[2], rushItem.interval, rushItem.duration, false);
			break;

		case "straight":
			if(rushItem.path.length < 1) {
				break;
			}
			this.rushStraight(rushItem.ships, (rushItem.path[0]).x, rushItem.interval, rushItem.duration);
			break;
	    
		case "path":
			if(rushItem.path.length < 2) {
				break;
			}
			this.rushPath(rushItem.ships, rushItem.path, rushItem.interval, rushItem.duration);
			break;

		case "sin":
			if(rushItem.path.length < 2) {
				break;
			}
			this.rushSin(rushItem.ships, rushItem.path[0], rushItem.path[1], rushItem.interval, rushItem.duration, rushItem.period, rushItem.amplitude);
			break;
		}

		if (rushItem.callback != null) {
			rushItem.callback.call(rushItem.callbackThisObject);
		}
	}
}