class Supply extends Unit {
	text: string;
	status: UnitStatus = UnitStatus.Alive;

	protected onCreate(): egret.DisplayObject {
		let gameObject = new egret.Sprite();
		let txt = new egret.TextField();
		gameObject.addChild(txt);
		txt.x = 8;
		txt.y = 8;
		txt.textColor = 0xdcdcaa;
		txt.text = this.text;
		let width = txt.textWidth + txt.x * 2;
		let height = txt.textHeight + txt.y * 2;
		gameObject.graphics.lineStyle(5, 0xdcdcaa);
		gameObject.graphics.drawRect(0, 0, width, height);
        gameObject.anchorOffsetX = width * 0.5;
        gameObject.anchorOffsetY = height * 0.5;
		return gameObject;
	}

	public isAlive(): boolean {
		return this.status == UnitStatus.Alive;
	}
}
