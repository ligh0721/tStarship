class RushItem {
	readonly interval: number=200;
	readonly ships: EnemyShip[];
	readonly delay: number=2000;
	readonly path: any[];
	readonly duration: number=2000;
	readonly drop: any;
	readonly type: string;
	readonly period: number;
	readonly amplitude: number = 100;
	readonly callback: Function;
	readonly callbackThisObject: any;

	public constructor(ships: EnemyShip[], type: string, delay: number, duration: number, interval: number, path:any[], drop:any, period?: number, amplitude?: number, callback?: Function, thisObject?: any) {
		this.ships = ships;
		this.type = type;
		this.duration = duration;
		this.interval = interval;
		this.delay = delay;
		this.path = path;
		this.drop = drop;
		this.period = period==undefined ? 1000 : period;
		this.amplitude = amplitude==undefined ? 100 : amplitude;
		this.callback = callback==undefined ? null : callback;
		this.callbackThisObject = thisObject==undefined ? null : thisObject;
	}
}