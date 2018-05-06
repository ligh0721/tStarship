class CoinSupply extends Supply {
	private coins: number;
	power: number;
	private score: Score;

	public constructor(coins: number, score: Score) {
		super();
		this.coins = coins;
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
		this.score.score += this.coins;
		if (ship instanceof HeroShip) {
			ship.addPower(this.power);
		}
	}
}