class PowerSupply extends Supply {
	private power: number;

	public constructor(power: number) {
		super();
		this.power = power;
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
		if (ship instanceof HeroShip) {
			ship.addPower(this.power);
			tutils.playSound("PickPower_mp3");
		}
	}
}