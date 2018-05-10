class Unit {
	gameObject: egret.DisplayObject;
	id: string;
	world: World;
	pools: tutils.ObjectPools;
	staticBounds: boolean = true;
	private boundsRect: egret.Rectangle;
	protected boundsDirty: boolean = true;
	private waitToRemove: boolean = false;

	public constructor() {
		this.boundsRect===undefined ? this.boundsRect=new egret.Rectangle() : this.boundsRect.constructor();
	}

	public cleanup() {
		this.onCleanup();
	}

	public get x(): number {
		return this.gameObject.x;
	}

	public set x(value: number) {
		this.gameObject.x = value;
	}

	public get y(): number {
		return this.gameObject.y;
	}

	public set y(value: number) {
		this.gameObject.y = value;
	}

	public get angle(): number {
		return this.gameObject.rotation;
	}

	public set angle(value: number) {
		this.gameObject.rotation = value;
		this.boundsDirty = true;
	}

	public getBounds(): egret.Rectangle {
		if (!this.staticBounds || this.boundsDirty) {
			this.boundsRect = this.gameObject.getBounds();
		}
		this.boundsRect.x = this.gameObject.x - this.gameObject.width * 0.5;
		this.boundsRect.y = this.gameObject.y - this.gameObject.height * 0.5;
		return this.boundsRect;
	}

	// override
	protected onCreate(): egret.DisplayObject {
		return this.gameObject;
	}

	// override
	public onAddToWorld(): void {
		this.gameObject = this.onCreate();
		this.pools = this.world.pools;
	}

	// override
	protected onCleanup(): void {
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.gameObject);
	}

	// override
	public hitTest(other: Unit): boolean {
		return this.getBounds().intersects(other.getBounds());
	}

	public static getDirectionPoint(x: number, y: number, angle: number, dis: number) {
		return tutils.getDirectionPoint(x, y, (angle-90)/tutils.DegPerRad, dis);
	}

	public static getForwardPoint(x0: number, y0: number, x1: number, y1: number, dis: number): {x: number, y: number} {
		let a = Math.atan2(y1-y0, x1-x0)
		return tutils.getDirectionPoint(x0, y0, a, dis);
	}

	public getDistance(x: number, y: number) {
		let dtx = this.gameObject.x - x;
		let dty = this.gameObject.y - y;
		return Math.sqrt(dtx*dtx+dty*dty);
	}

	public getAngle(x: number, y: number) {
		let angle = Math.atan2(y - this.gameObject.y, x - this.gameObject.x) * tutils.DegPerRad + 90;
		let dt = angle - this.angle;
		// console.log(this.angle+' <to> '+angle);
		if (dt > 180) {
			angle = angle - 360;
		} else if (dt < -180) {
			angle = angle + 360;
		}
		return angle;
	}

	public moveStraight(angle: number, speed: number, fixedRotation?: boolean, ease?: Function) {
		if (fixedRotation != true) {
			this.angle = angle;
		}
		let tw = egret.Tween.get(this.gameObject);
		let toPos = Unit.getDirectionPoint(this.gameObject.x, this.gameObject.y, angle, tutils.LongDistance);
		tw.to({x: toPos.x, y: toPos.y}, tutils.LongDistance*tutils.SpeedFactor/speed, ease);
	}

	// fixedRotation=false
	public moveTo(x: number, y: number, speed: number, fixedRotation: boolean=false, ease?: Function, onMoveEnd?: ()=>void, thisObject?: any): void {
		let xx = x-this.gameObject.x;
		let yy = y-this.gameObject.y;
		if (fixedRotation != true) {
			let angle = Math.atan2(yy, xx);
			this.angle = angle * tutils.DegPerRad + 90;
		}
		let dis = Math.sqrt(xx*xx+yy*yy);
        let dur = dis * tutils.SpeedFactor / speed;
        egret.Tween.removeTweens(this);
        let tw = egret.Tween.get(this);
        tw.to({x: x, y: y}, dur, ease);
		if (onMoveEnd != null) {
			tw.call(onMoveEnd, thisObject, [this]);
		}
	}
}
