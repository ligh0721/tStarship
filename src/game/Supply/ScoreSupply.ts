class ScoreSupply extends Supply {
	score: number;

	public constructor(score: number) {
		super();
		this.score = score;
	}

	// override
	protected onCreate(): egret.DisplayObject {
		if (this.gameObject != null) {
			return this.gameObject;
		}
		let gameObject = tutils.createBitmapByName("coin_png");
        gameObject.anchorOffsetX = gameObject.width * 0.5;
        gameObject.anchorOffsetY = gameObject.height * 0.5;
		return gameObject;
	}

	// override
	public onHitShip(ship: Ship): void {
		tutils.playSound("PickPower_mp3");
	}
}