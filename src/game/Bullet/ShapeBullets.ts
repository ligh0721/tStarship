class SoundWaveBullet extends Bullet {
    width: number = 100;
    height: number = 40;
    
	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        //bullet.graphics.beginFill(0x000000, 1.0);
		bullet.graphics.lineStyle(3, 0xffffff);
		bullet.graphics.drawEllipse(0, 0, this.width, this.height);
		bullet.anchorOffsetX = this.width * 0.5;
		bullet.anchorOffsetY = this.height * 0.5;
        //bullet.graphics.endFill();
		return bullet;
	}
}

class ShakeWaveBullet extends Bullet {
	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        bullet.graphics.beginFill(0xffffff, 1.0);
		bullet.graphics.lineStyle(3, 0xffffff);
		//bullet.graphics.drawEllipse(0, 0, this.width, this.height);
		bullet.graphics.drawArc(0, 0, 50, -175/tutils.DegPerRad, -5/tutils.DegPerRad);
		bullet.graphics.drawArc(0, 20, 55, -155/tutils.DegPerRad, -25/tutils.DegPerRad);
		//bullet.anchorOffsetX = this.width * 0.5;
		//bullet.anchorOffsetY = this.height * 0.5;
        bullet.graphics.endFill();
		return bullet;
	}
}