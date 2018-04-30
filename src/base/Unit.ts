class Unit {
	gameObject: egret.DisplayObject;
	id: string;
	world: World;
	staticBounds: boolean = true;
	private boundsRect: egret.Rectangle = null;
	private boundsDirty: boolean = true;
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

	protected onCreate(): egret.DisplayObject {
		return this.gameObject;
	}

	public onAddToWorld(): void {
		this.gameObject = this.onCreate();
	}

	protected onCleanup(): void {
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.gameObject);
	}

	public hitTest(other: Unit): boolean {
		return this.getBounds().intersects(other.getBounds());
	}

	public static getDirectionPoint(x: number, y: number, angle: number, dis: number) {
		return tutils.getDirectionPoint(x, y, (angle-90)/tutils.DegPerRad, dis);
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
