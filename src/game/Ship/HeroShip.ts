class HeroShip extends Ship {
    hitRadius: number = 5;
    private hitRect: egret.Rectangle = new egret.Rectangle();

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
        gameObject.graphics.lineStyle(0);
        gameObject.graphics.beginFill(0x9cdcfe);
        gameObject.graphics.drawCircle(gameObject.anchorOffsetX, gameObject.anchorOffsetY, this.hitRadius);
        gameObject.graphics.endFill();
        this.hitRect.width = this.hitRadius * 2;
        this.hitRect.height = this.hitRadius * 2;
		return gameObject;
	}

    public getBounds(): egret.Rectangle {
        this.hitRect.x = this.gameObject.x - this.hitRadius;
        this.hitRect.y = this.gameObject.y - this.hitRadius;
        return this.hitRect;
    }
}
