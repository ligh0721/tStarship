class EnemyShip extends Ship{
	readonly type: string;

	public constructor(width: number, height: number, type: string) {
		super(width, height);

		this.type = type;
	}

	protected onCreate(): egret.DisplayObject {
		let gameObject = this.createByType(this.type);
		
		return gameObject;
	}

	private createByType(type: string): egret.DisplayObject {
		switch (type) {
			case "rect" :
				let gameObject = new egret.Shape();
				gameObject.graphics.lineStyle(10, 0xffffff);
				gameObject.graphics.moveTo(0, 0);
				gameObject.graphics.lineTo(this.width, 0);
				gameObject.graphics.lineTo(this.width, this.height);
				gameObject.graphics.lineTo(0, this.height);
				gameObject.anchorOffsetX = this.width * 0.5;
				gameObject.$anchorOffsetY = this.height * 0.5;
				gameObject.graphics.endFill();
				return gameObject;
			default:  
				return null;
		}
	}
}
