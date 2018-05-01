class HideShip extends Ship {
	protected onCreate(): egret.DisplayObject {
		let gameObject = new egret.Shape();
		gameObject.width = this.width;
		gameObject.height = this.height;
        gameObject.anchorOffsetX = this.width * 0.5;
        gameObject.anchorOffsetY = this.height * 0.5;
		return gameObject;
	}
}