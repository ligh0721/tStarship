class BombBuff extends Buff {
	rate: number;
	power: number;
	explosionRadius: number;
	explosionForceIndex: number;
	
	public constructor(duration: number, rate: number, power: number, explosionRadius: number, explosionForceIndex?: number) {
		super(duration, ShipTrigger.OnDying);
		this.rate = rate;
		this.power = power;
		this.explosionRadius = explosionRadius;
		this.explosionForceIndex = explosionForceIndex;
	}

	// override
	public onDying(src: Ship): void {
		if (Math.random() < this.rate) {
			this.explosion(src);
		}
	}

	private explosion(src: Ship): void {
		if (this.explosionForceIndex != null) {
			this.ship.force.force = this.explosionForceIndex;
		}
		let gun = Gun.createGun(Gun);
		this.ship.addGun(gun);
		let bullet = this.ship.pools.newObject(ExplosionEffectBullet, gun);
		bullet.radius = 30;
		bullet.explosionRadius = this.explosionRadius;
		bullet.resetHp(this.power*bullet.maxHitTimes);
		bullet.staticBounds = false;
		this.ship.world.addBullet(bullet);
		bullet.gameObject.x = this.ship.x;
		bullet.gameObject.y = this.ship.y;
		bullet.explosionClearly(src);
	}
}