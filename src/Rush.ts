class Rush {
	delay: number;
	protected ships: Ship[];
	protected interval: number;
	protected fixedRotation: boolean = true;
	protected callback: Function;
	protected callbackThisObj: any;

	public constructor(delay: number, ships: Ship[], interval: number, fixedRotaion?: boolean, callback?: Function, callbackThisObj?: any) {
		this.delay = delay;
		this.ships = ships;
		this.interval = interval;
		this.fixedRotation = fixedRotaion===undefined ? false : fixedRotaion;
		this.callback = callback;
		this.callbackThisObj = callbackThisObj;
	}

	public start(world: World): void {
		this.onStart(world);
		if (this.callback) {
			this.callback.call(this.callbackThisObj);
		}
		if (this.ships && this.ships.length > 0) {
			if (this.interval === 0) {
				this.ships.forEach((ship, i, arr):void=>{
					world.addShip(ship);
					this.onRushOne(i, ship);
				}, this);
			} else {
				let t = new tutils.Timer();
				let i = 0;
				t.setOnTimerListener((dt: number):void=>{
					let ship = this.ships[i];
					world.addShip(ship);
					this.onRushOne(i, ship);
					i++;
				}, this);
				t.start(this.interval, true, this.ships.length);
			}
		}
	}

	public setCallback(callback: Function, thisObj: any): void {
		this.callback = callback;
		this.callbackThisObj = thisObj;
	}

	// override
	protected onStart(world: World): void {
	}

	// override
	protected onRushOne(index: number, ship: Ship): void {
		ship.status = UnitStatus.Dead;
	}

	protected convertPointToWorldPer(world: World, point: {x: number, y: number}): {x: number, y: number} {
		point.x *= world.width/100;
		point.y *= world.height/100;
		return point;
	}
}

class StraightRush extends Rush {
	protected duration: number;
	from: {x: number, y: number};
	to: {x: number, y: number};

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, from: {x: number, y: number}, to: {x: number, y: number}) {
		super(delay, ships, interval);
		this.duration = duration;
		this.from = from;
		this.to = to;
	}

	// override
	protected onStart(world: World): void {
		if (this.to.y == 100) {
			this.to.y = 120;
		}
		this.convertPointToWorldPer(world, this.from);
		this.convertPointToWorldPer(world, this.to);
	}

	// override
	protected onRushOne(index: number, ship: Ship): void {
		ship.x = this.from.x;
		ship.y = this.from.y;
		let dis = ship.getDistance(this.to.x, this.to.y);
		let speed = dis / this.duration * tutils.SpeedFactor;
		ship.moveTo(this.to.x, this.to.y, speed, this.fixedRotation, null, ():void=>{
			ship.status = UnitStatus.Dead;
		}, this);
	}
}

class BezierRush extends Rush {
	protected duration: number;
	protected from: {x: number, y: number};
	protected to: {x: number, y: number};
	protected k: {x: number, y: number};

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, from: {x: number, y: number}, to: {x: number, y: number}, k: {x: number, y: number}) {
		super(delay, ships, interval);
		this.duration = duration;
		this.from = from;
		this.to = to;
		this.k = k;
	}

	// override
	protected onStart(world: World): void {
		this.convertPointToWorldPer(world, this.from);
		this.convertPointToWorldPer(world, this.to);
		this.convertPointToWorldPer(world, this.k);
	}

	// override
	protected onRushOne(index: number, ship: Ship): void {
		let bezier = new BezierCurve(ship, this.from, this.k, this.to, this.fixedRotation);
		bezier.start(this.duration, ()=>{
			ship.status = UnitStatus.Dead;
		});
	}
}

class SineRush extends Rush {
	protected duration: number;
	protected from: {x: number, y: number};
	protected to: {x: number, y: number};
	protected wavelen: number;
	protected amplitude: number;

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, from: {x: number, y: number}, to: {x: number, y: number}, wavelen: number, amplitude: number) {
		super(delay, ships, interval, true);
		this.duration = duration;
		this.from = from;
		this.to = to;
		this.wavelen = wavelen;
		this.amplitude = amplitude;
	}

	// override
	protected onStart(world: World): void {
		this.convertPointToWorldPer(world, this.from);
		this.convertPointToWorldPer(world, this.to);
		this.amplitude *= world.width/100;
		this.wavelen *= world.height/100;
	}

	// override
	protected onRushOne(index: number, ship: Ship): void {
		// let sin = new SineCurve(ship, this.from, this.to, this.period, this.amplitude);
		// sin.start(this.duration, ()=>{
		// 	ship.status = UnitStatus.Dead;
		// });
		ship.gameObject.x = this.from.x;
		ship.gameObject.y = this.from.y;
		let act = new tutils.Sequence(new tutils.Sine(this.duration, this.from.x, this.from.y, this.to.x, this.to.y, this.wavelen, this.amplitude), new tutils.CallFunc(():void=>{
			ship.status = UnitStatus.Dead;
		}, this));
		ship.runAction(act);
	}
}

class PathRush extends Rush {
	protected duration: number;
	protected pts: {x: number, y: number}[];
	protected durs: number[] = [];

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, pts: {x: number, y: number}[]) {
		super(delay, ships, interval);
		this.duration = duration;
		this.pts = pts;
	}

	// override
	protected onStart(world: World): void {
		let totalDis = 0;
		this.pts.forEach((pt, i, arr):void=>{
			this.convertPointToWorldPer(world, pt);
			if (i > 0) {
				let dis = tutils.getDistance(pt.x, pt.y, arr[i-1].x, arr[i-1].y);
				totalDis += dis;
				this.durs.push(dis);
			}
		}, this);
		this.durs.forEach((dur, i, arr):void=>{
			arr[i] = arr[i] / totalDis * this.duration;
		}, this);
	}

	// override
	protected onRushOne(index: number, ship: Ship): void {
		if (this.pts.length === 0) {
			ship.status = UnitStatus.Dead;
			return;
		}
		let tw = egret.Tween.get(ship);
		this.pts.forEach((pt, i, arr):void=>{
			if (i === 0) {
				ship.x = pt.x;
				ship.y = pt.y;
				return;
			}
			tw.to({x: pt.x, y: pt.y}, this.durs[i-1], egret.Ease.getPowInOut(2));
		}, this);
		tw.call(():void=>{
			ship.status = UnitStatus.Dead;
		}, this);
	}
}

class GradientRush extends Rush {
	protected duration: number;
	protected from: {x: number, y: number};
	protected to: {x: number, y: number};

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, from: {x: number, y: number}, to: {x: number, y: number}) {
		super(delay, ships, interval);
		this.duration = duration;
		this.from = from;
		this.to = to;
	}

	// override
	protected onStart(world: World): void {
		this.convertPointToWorldPer(world, this.from);
		this.convertPointToWorldPer(world, this.to);
	}

	// override
	protected onRushOne(index: number, ship: Ship): void {
		ship.x = index===0 ? this.from.x : this.from.x+(this.to.x-this.from.x)*index/(this.ships.length-1);
		ship.y = index===0 ? this.from.y : this.from.y+(this.to.y-this.from.y)*index/(this.ships.length-1);
		let toY = ship.world.height+ship.height;
		let dis = toY - ship.y;
		let speed = dis / this.duration * tutils.SpeedFactor;
		ship.moveTo(ship.x, toY, speed, this.fixedRotation, null, ():void=>{
			ship.status = UnitStatus.Dead;
		}, this);
	}
}

class CallbackRush extends Rush {
	public constructor(delay: number, callback: Function, callbackThisObj?: any) {
		super(delay, null, 0, true, callback, callbackThisObj);
	}
}

class CustomRush extends Rush {
	protected onStartListener: (world: World)=>void;
	protected onRushOneListener: (index: number, ship: Ship)=>void;
	protected thisObj: any;

	public constructor(delay: number, ships: Ship[], interval: number, onStart: (world: World)=>void, onRushOne: (index: number, ship: Ship)=>void, thisObj: any) {
		super(delay, ships, interval);
		this.onStartListener = onStart;
		this.onRushOneListener = onRushOne;
		this.thisObj = thisObj;
	}

	// override
	protected onStart(world: World): void {
		if (this.onStartListener) {
			this.onStartListener.call(this.thisObj, world);
		}
	}

	// override
	protected onRushOne(index: number, ship: Ship): void {
		if (this.onRushOneListener) {
			this.onRushOneListener.call(this.thisObj, index, ship);
		}
	}
}