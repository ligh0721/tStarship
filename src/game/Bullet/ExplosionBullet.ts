class ExplosionBullet extends Bullet {
	radius: number = 20;
	explosionRadius: number = 200;
	explosionPowerEvery:number = 2;
	explosionPowerLossInterval: number = 200;
	isExplosion: boolean = false;
	$_explosion: number = 0;
	
	// override
	public reset(): void {
		super.reset();
		this.radius = 20;
		this.explosionRadius = 200;
		this.explosionPowerEvery = 2;
		this.explosionPowerLossInterval = 200;
		this.isExplosion = false;
		this.$_explosion = 0;
	}

	// override
	protected onCreate(): egret.DisplayObject {
		if (!this.isExplosion && this.gameObject != null) {
			return this.gameObject;
		}
		let bullet = new egret.Shape();
		if (!this.isExplosion) {
			bullet.graphics.beginFill(this.gun.bulletColor, 1.0);
			bullet.graphics.lineStyle(1, this.gun.bulletColor);
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
		g.lineStyle(10, this.gun.bulletColor);
		g.drawCircle(0, 0, r);
		this.gameObject.alpha = (1-value);
	}

	protected onDying(src: HpUnit) {
		super.onDying(src);
		if (this.isExplosion) {
			return;
		}

		let bullet = <ExplosionBullet>this.gun.createBullet();
		bullet.isExplosion = true;
		bullet.radius = this.radius;
		bullet.explosionRadius = this.explosionRadius;
		bullet.powerLossPer = 0.0001;
		bullet.resetHp(this.explosionPowerEvery/bullet.powerLossPer);
		bullet.powerLossInterval = this.explosionPowerLossInterval;
		bullet.staticBounds = false;
		this.world.addBullet(bullet);
		bullet.x = this.gameObject.x;
		bullet.y = this.gameObject.y;

		let tw = egret.Tween.get(bullet);
		tw.to({$explosion: 1}, 400, egret.Ease.getPowOut(3));
		//tw.wait(2000);
		tw.call(()=>{
			bullet.damaged(bullet.hp, null);
		}, this);
		tw = egret.Tween.get(bullet.gameObject);
		tw.to({alpha: 0}, 500, egret.Ease.getPowOut(5));
	}
}
