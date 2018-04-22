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

class SoundWaveBullet extends Bullet {
	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        bullet.graphics.beginFill(0x000000, 1.0);
		bullet.graphics.lineStyle(2, 0xffffff);
		bullet.graphics.drawEllipse(0, 0, 100, 40);
		bullet.anchorOffsetX = 50;
		bullet.anchorOffsetY = 20;
        bullet.graphics.endFill();
		return bullet;
	}
}