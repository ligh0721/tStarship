class ExplosionBullet extends Bullet {
	radius: number = 20;
	explosionRadius: number = 100;
	explosionPowerEvery: number = 2;
	explosionPowerLossInterval: number = 200;

	// override
	protected onCreate(): egret.DisplayObject {
		if (this.gameObject !== undefined) {
			return this.gameObject;
		}
		let bullet = new egret.Shape();
		bullet.graphics.beginFill(this.gun.bulletColor, 1.0);
		bullet.graphics.lineStyle(1, this.gun.bulletColor);
		bullet.graphics.drawCircle(0, 0, this.radius);
		bullet.graphics.endFill();
		return bullet;
	}

	protected onDying(src: HpUnit) {
		super.onDying(src);
		let bullet = this.pools.newObject(ExplosionEffectBullet, this.gun);
		bullet.radius = this.radius;
		bullet.explosionRadius = this.explosionRadius;
		bullet.powerLossPer = 0.0001;
		bullet.resetHp(this.explosionPowerEvery/bullet.powerLossPer);
		bullet.powerLossInterval = this.explosionPowerLossInterval;
		bullet.staticBounds = false;
		this.world.addBullet(bullet);
		bullet.gameObject.x = this.gameObject.x;
		bullet.gameObject.y = this.gameObject.y;

		let tw = egret.Tween.get(bullet);
		tw.to({factor: 1}, 400, egret.Ease.getPowOut(3));
		tw.call(()=>{
			bullet.damaged(bullet.hp, null);
		}, this);
	}
}

class ExplosionEffectBullet extends Bullet {
	radius: number = 20;
	explosionRadius: number = 100;
	explosionPowerEvery:number = 2;
	explosionPowerLossInterval: number = 200;
	private $factor: number = 0;
	private orgWidth: number;
	private orgHeight: number;

	// override
	protected onCreate(): egret.DisplayObject {
		tutils.playSound("Explosion1_mp3");
		if (this.gameObject !== undefined) {
			return this.gameObject;
		}
		let bullet = new egret.Shape();
		bullet.graphics.beginFill(this.gun.bulletColor, 1.0);
		bullet.graphics.lineStyle(1, this.gun.bulletColor);
		bullet.graphics.drawCircle(0, 0, this.explosionRadius);
		bullet.graphics.endFill();
		this.orgWidth = bullet.width;
		this.orgHeight = bullet.height;
		bullet.scaleX = this.radius / this.explosionRadius;
		bullet.scaleY = bullet.scaleX;
		bullet.width = this.orgWidth * bullet.scaleX;
		bullet.height = this.orgHeight * bullet.scaleY;
		return bullet;
	}

	public get factor(): number {
		return this.$factor;
	}

	public set factor(value: number) {
		this.$factor = value;
		this.gameObject.scaleX = value - (this.radius / this.explosionRadius) * (value - 1);
		this.gameObject.scaleY = this.gameObject.scaleX;
		this.gameObject.width = this.orgWidth * this.gameObject.scaleX;
		this.gameObject.height = this.orgHeight * this.gameObject.scaleY;
		this.gameObject.alpha = (1-value);
		//console.log(this.gameObject.scaleX);
	}
}
