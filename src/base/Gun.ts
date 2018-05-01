class Gun {
	id: string;
	ship: Ship;
	readonly fireCooldown: Value = new Value(200, 0, 10000);
	readonly bulletPower: Value = new Value(1, 1, tutils.LargeNumber);
	bulletPowerLossPer: number = 1.0;  // 子弹能量下降系数
	readonly bulletPowerLossInterval: Value = new Value(500, 100);  // 子弹能量下降时间间隔
	readonly bulletSpeed: Value = new Value(50, 0, 200);
	bulletType: new(gun: Gun)=>Bullet = Bullet;

	private readonly autoFireTimer: tutils.Timer = new tutils.Timer();

	public constructor() {
	}

	public setBulletType<BulletType extends Bullet>(bulletType: new(gun: Gun)=>BulletType) {
		this.bulletType = bulletType;
	}

	public static createGun<GunType extends Gun, BulletType extends Bullet>(gunType: new()=>GunType, bulletType?: new(gun: Gun)=>BulletType): GunType {
		let gun = new gunType();
		if (bulletType != undefined) {
			gun.setBulletType(bulletType);
		}
		return gun;
	}

	protected createBulletWithType<BulletType extends Bullet>(bulletType: new(gun: Gun)=>BulletType): BulletType {
		let bullet = new bulletType(this);
		return bullet;
	}

	protected createBullet(): Bullet {
		let bullet = new this.bulletType(this);
		return bullet;
	}

	public addBulletToWorld(bullet: Bullet): Bullet {
		return this.ship.world.addBullet(bullet);
	}

	public fire() {
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		bullet.moveStraight(0, this.bulletSpeed.value);
	}

	public get autoFire(): boolean {
		return this.autoFireTimer.running;
	}

	public set autoFire(value: boolean) {
		if (this.autoFireTimer.running) {
			this.autoFireTimer.stop();
		}
		if (value) {
			if (!this.autoFireTimer.hasOnTimerListener()) {
				this.autoFireTimer.setOnTimerListener((dt: number): void=>{
					this.fire();
					if (this.autoFireTimer.interval != this.fireCooldown.value) {
						this.autoFireTimer.interval = this.fireCooldown.value
					}
				}, this);
			}
			this.autoFireTimer.start(this.fireCooldown.value, true, 0);
		}
	}

	public cleanup() {
		this.autoFireTimer.stop();
		this.onCleanup();
	}

	// override
	protected onCleanup() {
		egret.Tween.removeTweens(this);
	}

	public getFirePosition(): {x: number, y: number} {
		return {x: this.ship.x, y: this.ship.y-this.ship.height*0.5};
	}
}
