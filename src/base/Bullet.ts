class Bullet extends GameObject {
	gun: Gun;
	
	public constructor(gun: Gun) {
		super();
		this.gun = gun;
	}

	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        bullet.graphics.beginFill(0xffffff, 1.0);
        bullet.graphics.drawCircle(0, 0, 6);
        bullet.graphics.endFill();
		return bullet;
	}
}
