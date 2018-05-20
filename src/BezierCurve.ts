class BezierCurve {
	private point0: {x: number, y: number} = {x: 0, y: 0};
	private point1: {x: number, y: number} = {x: 0, y: 0};
	private point2: {x: number, y: number} = {x: 0, y: 0};
	private readonly obj: Unit;
	private readonly objId: string;
	private fixedRotation: boolean = false;

	public constructor(obj: Unit, point0: {x: number, y: number},  point1: {x: number, y: number},  point2: {x: number, y: number}, fixedRotation: boolean) {
		this.obj = obj;
		this.objId = obj.id;
		this.point0 = point0;
		this.point1 = point1;
		this.point2 = point2;
		this.fixedRotation = fixedRotation;
	}

	startMove(dur: number, onMoveEnd?: Function) {
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
		if (this.obj.id != this.objId) {
			egret.Tween.removeTweens(this);
			return;
		}
		if ((this.obj instanceof HpUnit && !this.obj.isAlive()) || (this.obj instanceof Supply && !this.obj.isAlive())) {
			egret.Tween.removeTweens(this);
			return;
		}
	    this.obj.x = (1-value)*(1-value)*this.point0.x + 2*value*(1-value)*this.point1.x + value*value*this.point2.x;
        this.obj.y = (1-value)*(1-value)*this.point0.y + 2*value*(1-value)*this.point1.y + value*value*this.point2.y;
		
		if (!this.fixedRotation) {
			let x0 = this.point0.x + (this.point1.x - this.point0.x) * value;
			let y0 = this.point0.y + (this.point1.y - this.point0.y) * value;

			let x1 = this.point1.x + (this.point2.x - this.point1.x) * value;
			let y1 = this.point1.y + (this.point2.y - this.point1.y) * value;

			let angle = Math.atan2(y1-y0, x1-x0) * tutils.DegPerRad;
			//this.ship.gameObject.rotation = angle - 90;
			this.obj.angle = angle + 90;
		}
	}
}