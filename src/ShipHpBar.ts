class ShipHpBar {
	gameObject: egret.Sprite;
	target: Ship;

	public constructor(target: Ship) {
		this.target = target;
		this.gameObject = this.onCreate();
	}

	public create(): ShipHpBar {
		this.gameObject = this.onCreate();
		return this;
	}

	protected onCreate(): egret.Sprite {
		let gameObject = this.gameObject===undefined ? new egret.Sprite() : <egret.Sprite>this.gameObject;
		let g = gameObject.graphics;
		g.clear();
		g.lineStyle(0);
		g.beginFill(0x252532);
		g.drawRect(0, 0, this.target.width, 5);
		g.beginFill(0xff2929);
		let width = this.target.width*this.target.hp/this.target.maxHp;
		let height = 5
		g.drawRect(0, 0, width, height);
		g.endFill();
		gameObject.anchorOffsetX = this.target.width * 0.5;
		gameObject.anchorOffsetY = height * 0.5;

		return gameObject;
	}

	public update(): void {
		let g = this.gameObject.graphics;
		g.beginFill(0x252532);
		g.drawRect(0, 0, this.target.width, 5);
		g.beginFill(0xff2929);
		let width = this.target.width*this.target.hp/this.target.maxHp;
		let height = 5
		g.drawRect(0, 0, width, height);
		g.endFill();
	}
}
