class SoundWaveBullet extends Bullet {
    width: number = 100;
    height: number = 40;
    
	public constructor(gun: Gun) {
		super(gun, "SoundWaveBullet_png");
	}

	protected onCreate(): egret.DisplayObject {
		if (this.gameObject !== undefined) {
			this.gameObject.width = this.width;
			this.gameObject.height = this.height;
			this.gameObject.anchorOffsetX = this.width * 0.5;
			this.gameObject.anchorOffsetY = this.height * 0.5;
			return this.gameObject;
		}
		let gameObject = tutils.createBitmapByName(this.model);
		gameObject.width = this.width;
		gameObject.height = this.height;
		gameObject.anchorOffsetX = this.width * 0.5;
		gameObject.anchorOffsetY = this.height * 0.5;
		return gameObject;
	}
}

class ShakeWaveBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "ShakeWaveBullet_png");
	}
}

class ShakeWave2Bullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "ShakeWaveBullet2_png");
	}
}

class RedEllipseBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "RedBullet1_png");
	}
}