class BezierCurve {
	private point0: {x: number, y: number} = {x: 0, y: 0};
	private point1: {x: number, y: number} = {x: 0, y: 0};
	private point2: {x: number, y: number} = {x: 0, y: 0};
	private ship: Ship;

	public constructor(ship: Ship, point0: {x: number, y: number},  point1: {x: number, y: number},  point2: {x: number, y: number}) {
		this.ship = ship;
		this.point0 = point0;
		this.point1 = point1;
		this.point2 = point2;
	}

	startMove(callBack) {
		let tw = egret.Tween.get(this);
		tw.to({factor: 1}, 2000);
		tw.call(callBack);
	}

	private get factor() {
		return 0;
	}

	private set factor(value: number) {
	    this.ship.x = (1 - value) * (1 - value) * this.point0.x + 2 * value * (1 - value) * this.point1.x + value * value * this.point2.x;
        this.ship.y = (1 - value) * (1 - value) * this.point0.y + 2 * value * (1 - value) * this.point1.y + value * value * this.point2.y;
	}
}