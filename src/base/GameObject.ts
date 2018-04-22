class GameObject {
	gameObject: egret.DisplayObject;
	id: number;
	world: World;

	public constructor() {
	}

	public create(): GameObject {
		this.gameObject = this.onCreate();
		return this;
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

	protected onCreate(): egret.DisplayObject {
		return this.gameObject;
	}
}