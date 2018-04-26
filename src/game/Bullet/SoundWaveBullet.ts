class SoundWaveBullet extends Bullet {
    width: number = 100;
    height: number = 40;

    public constructor(gun: Gun, width: number=100, height: number=40) {
        super(gun);
		this.width = width;
		this.height = height;
    }
    
	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        bullet.graphics.beginFill(0x000000, 1.0);
		bullet.graphics.lineStyle(3, 0xffffff);
		bullet.graphics.drawEllipse(0, 0, this.width, this.height);
		bullet.anchorOffsetX = this.width * 0.5;
		bullet.anchorOffsetY = this.height * 0.5;
        bullet.graphics.endFill();
		return bullet;
	}
}
