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

	public constructor(ships: EnemyShip[], type: string, delay: number, duration: number, interval: number, path:any[], drop:any, period: number=1000, amplitude: number= 100) {
		this.ships = ships;
		this.type = type;
		this.duration = duration;
		this.interval = interval;
		this.delay = delay;
		this.path = path;
		this.drop = drop;
		this.period = period;
		this.amplitude = amplitude;
	}
}