class MoveState extends ShipAIChainState {
	protected x: number;
	protected y: number;
	protected speed: number;
	protected fixedRotation: boolean;
	protected ease: Function;


	public constructor(mgr: tutils.StateManager, ship: Ship, x: number, y: number, speed: number, fixedRotation: boolean, ease: Function) {
		super(mgr, ship);
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.fixedRotation = fixedRotation;
		this.ease = ease;
	}
	public onEnter(): void {
		this.ship.moveTo(this.x, this.y, this.speed, this.fixedRotation, this.ease, false, ():void=>{
			this.next();
		}, this);
	}
}

class WaitState extends ShipAIChainState {
	protected duration: number;

	public constructor(mgr: tutils.StateManager, ship: Ship, duration: number) {
		super(mgr, ship);
		this.duration = duration;
	}

	public onEnter(): void {
		let tw = egret.Tween.get(this.ship);
		tw.wait(this.duration);
		tw.call(():void=>{
			this.next();
		}, this);
	}
}

class FireState extends ShipAIChainState {
	protected autoFire: boolean;

	public constructor(mgr: tutils.StateManager, ship: Ship, autoFire: boolean) {
		super(mgr, ship);
		this.autoFire = autoFire;
	}

	public onEnter(): void {
		if (this.ship.mainGun) {
			this.ship.mainGun.autoFire = true;
		}
		this.next();
	}
}

class DeadState extends ShipAIChainState {
	public onEnter(): void {
		if (this.ship.alive) {
			this.ship.cleanup();
			this.ship.status = UnitStatus.Dead;
		}
		this.next();
	}
}

class CallbackState extends ShipAIChainState {
	protected callback: ()=>void = null;
	protected thisObj: any = null;

	public constructor(mgr: tutils.StateManager, callback: ()=>void, thisObj: any) {
		super(mgr, null);
		this.callback = callback;
		this.thisObj = thisObj;
	}
	public onEnter(): void {
		if (this.callback) {
			this.callback.call(this.thisObj);
		}
		this.next();
	}
}