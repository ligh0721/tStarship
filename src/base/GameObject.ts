class GameObject {
	gameObject: egret.DisplayObject;
	id: number;
	world: World;
	staticBounds: boolean = true;
	private boundsRect: egret.Rectangle = null;

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

	public getBounds(): egret.Rectangle {
		if (!this.staticBounds) {
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
		this.boundsRect = this.gameObject.getBounds();
	}

	protected onCleanup(): void {
		egret.Tween.removeTweens(this.gameObject);
	}

	public hitTest(other: GameObject): boolean {
		return this.getBounds().intersects(other.getBounds());
	}
}