class ShapeProgress {
	//gameObject: egret.Shape;
	gameObject: egret.Sprite;
	readonly direction: tutils.ProgressFillDirection = tutils.ProgressFillDirection.LeftToRight;
	width: number;
	height: number;
	colorBorder: number;
	colorFilled: number;
	private fill: tutils.ProgressFill;

	public constructor(layer: egret.DisplayObjectContainer, type: tutils.ProgressFillDirection, width: number, height: number, colorBorder: number, colorFilled: number) {
		this.direction = type;
		this.width = width;
		this.height = height;
		this.colorBorder = colorBorder;
		this.colorFilled = colorFilled;
		this.gameObject = this.onCreate();
		layer.addChild(this.gameObject);
	}

	protected onCreate(): egret.Sprite {
		let gameObject = new egret.Sprite();
		let g = gameObject.graphics;
		g.lineStyle(4, this.colorBorder);
		g.drawRoundRect(0, 0, this.width, this.height, 8, 8);
		// g.lineStyle(0, this.colorFilled);
		// g.beginFill(0x000000);
		// g.drawRoundRect(2, 2, this.width-4, this.height-4, 8, 8);
		// g.endFill();
		//gameObject.cacheAsBitmap = true;
		let fill = new egret.Shape();
		g = fill.graphics;
		g.lineStyle(0, this.colorFilled);
		g.beginFill(this.colorFilled);
		g.drawRoundRect(0, 0, this.width-10, this.height-10, 8, 8);
		g.endFill();
		gameObject.addChild(fill);
		fill.x = 5;
		fill.y = 5;
		//fill.cacheAsBitmap = true;
		fill.width += 1;
		fill.height += 1;
		this.fill = new tutils.ProgressFill(fill, this.direction);
		return gameObject;
	}

	public get percent(): number {
		return this.fill.percent;
	}

	public set percent(value: number) {
		this.fill.percent = value;
	}

	public cleanup() {
		this.onCleanup();
	}

	protected onCleanup() {
		egret.Tween.removeTweens(this);
	}
}
