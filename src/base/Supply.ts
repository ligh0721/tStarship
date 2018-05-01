class Supply extends Unit {
	text: string;
	color: number = 0xffffff;
	status: UnitStatus = UnitStatus.Alive;
	speed: number = 10;

	// override
	protected onCreate(): egret.DisplayObject {
		let gameObject = new egret.Sprite();
		let txt = new egret.TextField();
		gameObject.addChild(txt);
		txt.x = 8;
		txt.y = 8;
		txt.textColor = this.color;
		txt.text = this.text;
		let width = txt.textWidth + txt.x * 2;
		let height = txt.textHeight + txt.y * 2;
		gameObject.graphics.lineStyle(5, this.color);
		gameObject.graphics.drawRect(0, 0, width, height);
        gameObject.anchorOffsetX = width * 0.5;
        gameObject.anchorOffsetY = height * 0.5;
		return gameObject;
	}

	public isAlive(): boolean {
		return this.status == UnitStatus.Alive;
	}

	// override
	public onHitShip(ship: Ship): void {
	}

	public drop(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.moveStraight(180, this.speed, true);
	}
}
