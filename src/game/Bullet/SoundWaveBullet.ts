class SoundWaveBullet extends Bullet {
    width: number = 100;
    height: number = 40;
    size: number = 1;

    public constructor(gun: Gun, width: number = 100, height: number = 40) {
        super(gun);
    }
    
	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        bullet.graphics.beginFill(0x000000, 1.0);
		bullet.graphics.lineStyle(3, 0xffffff);
		bullet.graphics.drawEllipse(0, 0, this.width, 40);
		bullet.anchorOffsetX = 50;
		bullet.anchorOffsetY = 20;
        bullet.graphics.endFill();
		return bullet;
	}
}
