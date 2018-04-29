class ExplosionBullet extends Bullet {
	radius: number = 20;
	explosionRadius: number = 200;
	explosionPowerEvery = 2;
	explosionPowerLossInterval = 200;
	isExplosion: boolean = false;
	$_explosion: number = 0;
	

	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
		if (!this.isExplosion) {
			bullet.graphics.beginFill(0xffffff, 1.0);
			bullet.graphics.lineStyle(1, 0xffffff);
			bullet.graphics.drawCircle(0, 0, this.radius);
			bullet.graphics.endFill();
		}
        
		return bullet;
	}

	public get $explosion(): number {
		return this.$_explosion;
	}

	public set $explosion(value: number) {
		this.$_explosion = value;
		let r = this.radius + (this.explosionRadius - this.radius) * value
		let g = (<egret.Shape>this.gameObject).graphics;
		g.clear();
		g.lineStyle(10, 0xffffff);
		g.drawCircle(0, 0, r);
		this.gameObject.alpha = (1-value);
	}

	protected onDying(src: HpUnit) {
		super.onDying(src);
		if (this.isExplosion) {
			return;
		}

		let explosion = new ExplosionBullet(this.gun);
		explosion.isExplosion = true;
		explosion.radius = this.radius;
		explosion.explosionRadius = this.explosionRadius;
		explosion.powerLossPer = 0.0001;
		explosion.resetHp(this.explosionPowerEvery/explosion.powerLossPer);
		explosion.powerLossInterval = this.explosionPowerLossInterval;
		explosion.staticBounds = false;
		this.world.addBullet(explosion);
		explosion.x = this.gameObject.x;
		explosion.y = this.gameObject.y;

		let tw = egret.Tween.get(explosion);
		tw.to({$explosion: 1}, 500, egret.Ease.getPowOut(3));
		//tw.wait(2000);
		tw.call(()=>{
			explosion.damaged(explosion.hp, null);
		}, this);
		tw = egret.Tween.get(explosion.gameObject);
		tw.to({alpha: 0}, 500, egret.Ease.getPowOut(5));
	}
}
