class ExplosionBullet extends Bullet {
	radius: number = 30;
	explosionRadius: number = 100;
	explosionPowerEveryPer: number = 0.2;
	explosionPowerLossInterval: number = 10000;

	public constructor(gun: Gun) {
		super(gun, "BlueBallBullet_png");
	}

	protected onCreate(): egret.DisplayObject {
		if (this.gameObject !== undefined) {
			return this.gameObject;
		}
		let gameObject = this.createModel();
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
		bullet.factor = 0;

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
	private $factor: number = 0;
	private orgWidth: number;
	private orgHeight: number;

	public constructor(gun: Gun) {
		super(gun, "BlueBallBullet_png");
	}

	protected onCreate(): egret.DisplayObject {
		tutils.playSound("ExplosionBullet_mp3");
		let gameObject = this.gameObject!==undefined ? this.gameObject : tutils.createBitmapByName(this.model);
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
