class HeroShip extends Ship {
    public constructor(width: number, height: number) {
		super(width, height);
        this.hero = true;
	}

    protected onCreate(): egret.DisplayObject {
		let gameObject = new egret.Shape();
		gameObject.graphics.lineStyle(10, 0x9cdcfe);
        gameObject.graphics.moveTo(this.width * 0.5, 0);
        gameObject.graphics.lineTo(0, this.height);
        gameObject.graphics.lineTo(this.width, this.height);
        gameObject.graphics.lineTo(this.width * 0.5, 0);
        gameObject.anchorOffsetX = this.width * 0.5;
        gameObject.anchorOffsetY = this.height * 0.5;
		return gameObject;
	}
}
