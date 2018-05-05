class EnemyShip extends Ship {
	readonly type: string;
	private hpBar: ShipHpBar = null;

	public constructor(width: number, height: number, type: string) {
		super(width, height);
		this.type = type;
	}

	public damaged(value: number, src: HpUnit): void {
		super.damaged(value, src);
		if (this.isAlive()) {
			if (this.hpBar == null) {
				this.hpBar = this.pools.newObject(ShipHpBar, this).create();
				this.world.gameObject.addChild(this.hpBar.gameObject);
				this.hpBar.gameObject.x = this.gameObject.x;
				this.hpBar.gameObject.y = this.gameObject.y + this.gameObject.height - this.gameObject.anchorOffsetY;
			}
			this.hpBar.update();
		} else {
			if (this.hpBar != null) {
				this.world.gameObject.removeChild(this.hpBar.gameObject);
				this.pools.delObject(this.hpBar);
				this.hpBar = null;
			}
		}
	}

	public get x(): number {
		return this.gameObject.x;
	}

	public set x(value: number) {
		this.gameObject.x = value;
		if (this.hpBar != null) {
			this.hpBar.gameObject.x = this.gameObject.x;
		}
	}

	public get y(): number {
		return this.gameObject.y;
	}

	public set y(value: number) {
		this.gameObject.y = value;
		if (this.hpBar != null) {
			this.hpBar.gameObject.y = this.gameObject.y + this.gameObject.height - this.gameObject.anchorOffsetY;
		}
	}

	protected onCreate(): egret.DisplayObject {
		let gameObject = this.createByType(this.type);
		gameObject.y = this.height * 0.5;
		
		return gameObject;
	}

	protected onCleanup(): void {
		if (this.hpBar != null) {
			this.world.gameObject.removeChild(this.hpBar.gameObject);
			this.pools.delObject(this.hpBar);
			this.hpBar = null;
		}
		super.onCleanup();
	}

	private createByType(type: string): egret.DisplayObject {
		let gameObject: egret.Shape = null;
		switch (type) {
			case "rect":
				gameObject = new egret.Shape();
				gameObject.graphics.lineStyle(5, 0xf48771);
				gameObject.graphics.drawRect(0, 0, this.width, this.height);
				gameObject.anchorOffsetX = this.width * 0.5;
				gameObject.anchorOffsetY = this.height * 0.5;
				break;
			case "tri":
				gameObject = new egret.Shape();
				gameObject.graphics.lineStyle(5, 0xf48771);
				gameObject.graphics.moveTo(0, 0);
				gameObject.graphics.lineTo(this.width, 0);
				gameObject.graphics.lineTo(this.width * 0.5, this.height);
				gameObject.graphics.lineTo(0, 0);
				gameObject.anchorOffsetX = this.width * 0.5;
				gameObject.anchorOffsetY = this.height * 0.5;
				break;
			case "ell":
				gameObject = new egret.Shape();
				gameObject.graphics.lineStyle(5, 0xf48771);
				gameObject.graphics.drawEllipse(0, 0, this.width, this.height);
				gameObject.anchorOffsetX = this.width * 0.5;
				gameObject.anchorOffsetY = this.height * 0.5;
				break;
			default:  
		}
		return gameObject;
	}
}
