class Unit {
	gameObject: egret.DisplayObject;
	id: string;
	world: World;
	staticBounds: boolean = true;
	private boundsRect: egret.Rectangle = null;
	protected boundsDirty: boolean = true;
	private waitToRemove: boolean = false;

	public constructor() {
	}

	public cleanup() {
		this.onCleanup();
	}

	public set(prop: Object) {
		if (prop.hasOwnProperty('x')) {
			this.gameObject.x = prop['x'];
		}
		if (prop.hasOwnProperty('y')) {
			this.gameObject.y = prop['y'];
		}
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

	public static getDistance(unit0: Unit, unit1: Unit) {
		let dtx = unit0.gameObject.x - unit1.gameObject.x;
		let dty = unit0.gameObject.y - unit1.gameObject.y;
		return Math.sqrt(dtx*dtx+dty*dty);
	}

	public moveStraight(angle: number, speed: number, fixedRotation?: boolean, ease?: Function) {
		if (fixedRotation != true) {
			this.angle = angle;
		}
		let tw = egret.Tween.get(this.gameObject);
		let toPos = Unit.getDirectionPoint(this.gameObject.x, this.gameObject.y, angle, tutils.LongDistance);
		tw.to({x: toPos.x, y: toPos.y}, tutils.LongDistance*tutils.SpeedFactor/speed, ease);
	}
}
