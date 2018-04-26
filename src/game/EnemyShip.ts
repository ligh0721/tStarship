class EnemyShip extends Ship{
	readonly type: string;

	public constructor(width: number, height: number, type: string) {
		super(width, height);

		this.type = type;
	}

	protected onCreate(): egret.DisplayObject {
		let gameObject = this.createByType(this.type);
		gameObject.y = this.height * 0.5;
		
		return gameObject;
	}

	private createByType(type: string): egret.DisplayObject {
		let gameObject: egret.Shape;
		switch (type) {
			case "rect":
				gameObject = new egret.Shape();
				gameObject.graphics.lineStyle(5, 0xffffff);
				gameObject.graphics.moveTo(0, 0);
				gameObject.graphics.lineTo(this.width, 0);
				gameObject.graphics.lineTo(this.width, this.height);
				gameObject.graphics.lineTo(0, this.height);
				gameObject.graphics.lineTo(0, 0);
				gameObject.anchorOffsetX = this.width * 0.5;
				gameObject.anchorOffsetY = this.height * 0.5;
				return gameObject;
			case "tri":
				gameObject = new egret.Shape();
				gameObject.graphics.lineStyle(5, 0xffffff);
				gameObject.graphics.moveTo(0, 0);
				gameObject.graphics.lineTo(this.width, 0);
				gameObject.graphics.lineTo(this.width * 0.5, this.height);
				gameObject.graphics.lineTo(0, 0);
				// gameObject.anchorOffsetX = this.width * 0.5;
				// gameObject.anchorOffsetY = this.height * 0.5;
				return gameObject;
			default:  
				return null;
		}
	}
}
