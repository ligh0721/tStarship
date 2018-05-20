class ExplosionBullet extends Bullet {
	radius: number = 30;
	explosionRadius: number = 100;
	explosionPowerEveryPer: number = 0.2;
	explosionPowerLossInterval: number = 10000;

	// override
	// protected onCreate(): egret.DisplayObject {
	// 	if (this.gameObject !== undefined) {
	// 		return this.gameObject;
	// 	}
	// 	let bullet = new egret.Shape();
	// 	bullet.graphics.beginFill(this.gun.bulletColor, 1.0);
	// 	bullet.graphics.lineStyle(1, this.gun.bulletColor);
	// 	bullet.graphics.drawCircle(0, 0, this.radius);
	// 	bullet.graphics.endFill();
	// 	return bullet;
	// }

	protected onCreate(): egret.DisplayObject {
		if (this.gameObject !== undefined) {
			return this.gameObject;
		}
		let gameObject = tutils.createBitmapByName("BlueBallBullet_png");
		gameObject.width = this.radius * 2;
		gameObject.height = this.radius * 2;
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
		return gameObject;
	}

	protected onDying(src: HpUnit) {
		super.onDying(src);
		let bullet = this.pools.newObject(ExplosionEffectBullet, this.gun);
		bullet.radius = this.radius;
		bullet.explosionRadius = this.explosionRadius;
		bullet.powerLossPer = 0.0001;
		bullet.resetHp(this.explosionPowerEveryPer*this.maxHp*this.powerLossPer/bullet.powerLossPer);
		bullet.powerLossInterval = this.explosionPowerLossInterval;
		bullet.staticBounds = false;
		this.world.addBullet(bullet);
		bullet.gameObject.x = this.gameObject.x;
		bullet.gameObject.y = this.gameObject.y;

		let tw = egret.Tween.get(bullet);
		tw.to({factor: 1}, 400, egret.Ease.getPowOut(3));
		tw.call(()=>{
			bullet.damaged(bullet.hp, src);
		}, this);
	}
}

class ExplosionEffectBullet extends Bullet {
	radius: number = 30;
	explosionRadius: number = 200;
	explosionPowerEvery:number = 2;
	explosionPowerLossInterval: number = 200;
	private $factor: number = 0;
	private orgWidth: number;
	private orgHeight: number;

	// override
	// protected onCreate(): egret.DisplayObject {
	// 	tutils.playSound("ExplosionBullet_mp3");
	// 	if (this.gameObject !== undefined) {
	// 		return this.gameObject;
	// 	}
	// 	let bullet = new egret.Shape();
	// 	bullet.graphics.beginFill(this.gun.bulletColor, 1.0);
	// 	bullet.graphics.lineStyle(1, this.gun.bulletColor);
	// 	bullet.graphics.drawCircle(0, 0, this.explosionRadius);
	// 	bullet.graphics.endFill();
	// 	this.orgWidth = bullet.width;
	// 	this.orgHeight = bullet.height;
	// 	bullet.scaleX = this.radius / this.explosionRadius;
	// 	bullet.scaleY = bullet.scaleX;
	// 	bullet.width = this.orgWidth * bullet.scaleX;
	// 	bullet.height = this.orgHeight * bullet.scaleY;
	// 	return bullet;
	// }

	protected onCreate(): egret.DisplayObject {
		tutils.playSound("ExplosionBullet_mp3");
		let gameObject = this.gameObject!==undefined ? this.gameObject : tutils.createBitmapByName("BlueBallBullet_png");
		gameObject.width = this.explosionRadius * 2;
		gameObject.height = this.explosionRadius * 2;
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
		this.orgWidth = gameObject.width;
		this.orgHeight = gameObject.height;
		
		return gameObject;
	}

	public get factor(): number {
		return this.$factor;
	}

	public set factor(value: number) {
		this.$factor = value;
		let scaleX = value - (this.radius / this.explosionRadius) * (value - 1);
		let scaleY = scaleX;
		this.gameObject.width = this.orgWidth * scaleX;
		this.gameObject.height = this.orgHeight * scaleY;
		this.gameObject.anchorOffsetX = this.gameObject.width * 0.5;
		this.gameObject.anchorOffsetY = this.gameObject.height * 0.5;
		this.gameObject.alpha = (1-value);
		//console.log(this.gameObject.scaleX);
	}
}
