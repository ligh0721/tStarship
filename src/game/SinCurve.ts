class SinCurve {
	private point0: {x: number, y: number} = {x: 0, y: 0};
	private point1: {x: number, y: number} = {x: 0, y: 0};
	private period: number;
	private amplitude: number;
	private duration: number;
	private obj: Unit;

	public constructor(obj: Unit, point0: {x: number, y: number},  point1: {x: number, y: number}, period: number, amplitude: number) {
		this.obj = obj;
		this.point0 = point0;
		this.point1 = point1;
		this.period = period;
		this.amplitude = amplitude;
	}

	startMove(dur: number, onMoveEnd?: Function) {
		this.duration = dur;

		this.factor = 0;
		let tw = egret.Tween.get(this);
		tw.to({factor: 1}, dur);
		if (onMoveEnd != undefined) {
			tw.call(onMoveEnd);
		}
	}

	private get factor() {
		return 0;
	}

	private set factor(value: number) {
	    let dis = this.point1.y - this.point0.y;
		let temp = Math.sin(this.duration * value / this.period  * 2 * Math.PI) * this.amplitude;

		this.obj.x = this.point0.x + temp;
		this.obj.y = dis * value;
	}
}