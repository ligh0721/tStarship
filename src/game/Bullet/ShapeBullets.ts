class SoundWaveBullet extends Bullet {
    width: number = 100;
    height: number = 40;
    
	// override
	public reset(): void {
		super.reset();
		this.width = 100;
		this.height = 40;
	}

	// override
	protected onCreate(): egret.DisplayObject {
		let bullet = this.gameObject==null ? new egret.Shape() : <egret.Shape>this.gameObject;
		bullet.graphics.clear();
		bullet.graphics.lineStyle(3, this.gun.bulletColor);
		bullet.graphics.drawEllipse(0, 0, this.width, this.height);
		bullet.anchorOffsetX = this.width * 0.5;
		bullet.anchorOffsetY = this.height * 0.5;
		return bullet;
	}
}

class ShakeWaveBullet extends Bullet {
	// override
	public reset(): void {
		super.reset();
	}

	// override
	protected onCreate(): egret.DisplayObject {
		if (this.gameObject != null) {
			return this.gameObject;
		}
		let bullet = new egret.Shape();
		bullet.graphics.lineStyle(3, this.gun.bulletColor);
		bullet.graphics.drawArc(0, 0, 50, -175/tutils.DegPerRad, -5/tutils.DegPerRad);
		bullet.graphics.drawArc(0, 20, 55, -155/tutils.DegPerRad, -25/tutils.DegPerRad);
        
		return bullet;
	}
}

class EllipseWaveBullet extends Bullet {
	width: number = 10;
    height: number = 50;

	// override
	public reset(): void {
		super.reset();
		this.width = 10;
		this.height = 50;
	}

	// override
	protected onCreate(): egret.DisplayObject {
		if (this.gameObject != null) {
			return this.gameObject;
		}
		let bullet = new egret.Shape();
		bullet.graphics.lineStyle(0, this.gun.bulletColor);
		bullet.graphics.beginFill(this.gun.bulletColor);
		bullet.graphics.drawEllipse(0, 0, this.width, this.height);
		bullet.graphics.endFill();
		bullet.anchorOffsetX = this.width * 0.5;
		bullet.anchorOffsetY = this.height * 0.5;
        
		return bullet;
	}
}