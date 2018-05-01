class ShapeProgress {
	gameObject: egret.Shape;
	readonly type: ProgressType = ProgressType.BottomToTop;
	width: number;
	height: number;
	colorBorder: number;
	colorFilled: number;
	protected $percent: number = 0;

	public constructor(layer: egret.DisplayObjectContainer, type: ProgressType, width: number, height: number, colorBorder: number, colorFilled: number) {
		this.type = type;
		this.width = width;
		this.height = height;
		this.colorBorder = colorBorder;
		this.colorFilled = colorFilled;
		this.gameObject = this.onCreate();
		layer.addChild(this.gameObject);
	}

	protected onCreate(): egret.Shape {
		let gameObject = new egret.Shape();
		let g = gameObject.graphics;
		g.lineStyle(4, this.colorBorder);
		g.drawRoundRect(0, 0, this.width, this.height, 8, 8);
		g.lineStyle(0, this.colorFilled);
		this.update(g);
		return gameObject;
	}

	public get percent(): number {
		return this.$percent;
	}

	public set percent(value: number) {
		if (this.$percent == value) {
			return;
		}
		
		this.$percent = value;
		let g = this.gameObject.graphics;
		this.update(g);
	}

	protected update(g: egret.Graphics) {
		g.beginFill(0x000000);
		g.drawRoundRect(2, 2, this.width-4, this.height-4, 8, 8);
		g.endFill();

		if (this.$percent > 0) {
			g.beginFill(this.colorFilled);
			switch (this.type) {
				case ProgressType.BottomToTop:
				g.drawRoundRect(5, (this.height-15)*(1-this.$percent)+5, this.width-10, (this.height-10)*this.$percent, 8, 8);
				break;

				case ProgressType.LeftToRigh:
				g.drawRoundRect(5, 5, (this.width-15)*this.$percent+5, this.height-10, 8, 8);
				break;
			}
			g.endFill();
		}
	}

	public cleanup() {
		this.onCleanup();
	}

	protected onCleanup() {
		egret.Tween.removeTweens(this);
	}
}

enum ProgressType {
	BottomToTop,
	LeftToRigh
}