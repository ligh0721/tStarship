class ShipHpBar {
	gameObject: egret.DisplayObjectContainer;
	target: Ship;
	fill: egret.Bitmap;

	public constructor(target: Ship) {
		this.target = target;
		this.gameObject = this.onCreate();
	}

	public create(): ShipHpBar {
		this.gameObject = this.onCreate();
		return this;
	}

	// protected onCreate(): egret.Sprite {
	// 	let gameObject = this.gameObject===undefined ? new egret.Sprite() : <egret.Sprite>this.gameObject;
	// 	let g = gameObject.graphics;
	// 	g.clear();
	// 	g.lineStyle(0);
	// 	g.beginFill(0x252532);
	// 	g.drawRect(0, 0, this.target.gameObject.width, 5);
	// 	g.beginFill(0xff2929);
	// 	let width = this.target.gameObject.width*this.target.hp/this.target.maxHp;
	// 	let height = 5
	// 	g.drawRect(0, 0, width, height);
	// 	g.endFill();
	// 	gameObject.anchorOffsetX = this.target.gameObject.width * 0.5;
	// 	gameObject.anchorOffsetY = height * 0.5;

	// 	return gameObject;
	// }

	protected onCreate(): egret.DisplayObjectContainer {
		let gameObject: egret.DisplayObjectContainer;
		let bg: egret.Bitmap;
		let fill: egret.Bitmap;
		if (this.gameObject===undefined) {
			gameObject = new egret.DisplayObjectContainer;
			
			bg = tutils.createBitmapByName("GreyPixel_png");
			gameObject.addChildAt(bg, 0);
			bg.width = this.target.gameObject.width;
			bg.height = 5;

			fill = tutils.createBitmapByName("RedPixel_png");
			gameObject.addChildAt(fill, 1);
			
		} else {
			gameObject = this.gameObject;
			bg = gameObject.getChildAt(0) as egret.Bitmap;
			fill = gameObject.getChildAt(1) as egret.Bitmap;
		}
		bg.width = this.target.gameObject.width;
		bg.height = 5;
		fill.width = this.target.gameObject.width*this.target.hp/this.target.maxHp;
		fill.height = 5;
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
		this.fill = fill;

		return gameObject;
	}

	public update(): void {
		this.fill.width = this.target.gameObject.width*this.target.hp/this.target.maxHp;
	}
}
