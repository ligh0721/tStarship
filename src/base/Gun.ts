class Gun {
	id: string;
	ship: Ship;
	readonly fireCooldown: Value;
	readonly bulletPower: Value;
	bulletPowerLossPer: number = 1.0;  // 子弹能量下降系数
	readonly bulletPowerLossInterval: Value;  // 子弹能量下降时间间隔
	readonly bulletSpeed: Value;
	bulletType: new(gun: Gun)=>Bullet = Bullet;
	bulletColor: number = 0xffffff;

	private autoFireTimer: tutils.Timer;

	public constructor() {
		this.fireCooldown===undefined ? this.fireCooldown=new Value(500, 50, 10000) : this.fireCooldown.constructor(500, 50, 1000);
		this.bulletPower===undefined ? this.bulletPower=new Value(1, 1, tutils.LargeNumber) : this.bulletPower.constructor(1, 1, tutils.LargeNumber);
		this.bulletPowerLossInterval===undefined ? this.bulletPowerLossInterval=new Value(500, 100) : this.bulletPowerLossInterval.constructor(500, 100);
		this.bulletSpeed===undefined ? this.bulletSpeed=new Value(50, 0, 200) : this.bulletSpeed.constructor(50, 0, 200);
		this.autoFireTimer===undefined ? this.autoFireTimer=new tutils.Timer() : this.autoFireTimer.constructor();
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

	public createBulletWithType<BulletType extends Bullet>(bulletType: new(gun: Gun)=>BulletType): BulletType {
		//let bullet = new bulletType(this);
		let bullet = this.ship.pools.newObject(bulletType, this);
		//bullet.reset();
		//bullet.setGun(this);
		return bullet;
	}

	public createBullet(): Bullet {
		//let bullet = new this.bulletType(this);
		let bullet = this.ship.pools.newObject(this.bulletType, this);
		//bullet.reset();
		//bullet.setGun(this);
		return bullet;
	}

	public addBulletToWorld(bullet: Bullet): Bullet {
		return this.ship.world.addBullet(bullet);
	}

	protected fireBulletStraight(bullet: Bullet, angle?: number, fixedRotation?: boolean, ease?: Function) {
		bullet.moveStraight(angle==undefined?this.ship.angle:angle, this.bulletSpeed.value, fixedRotation, ease)
	}

	public fire(): void {
		if (this.ship == null || !this.ship.isAlive()) {
			return;
		}
		this.onFire();
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		this.fireBulletStraight(bullet);
	}

	public get autoFire(): boolean {
		return this.autoFireTimer.running;
	}

	public set autoFire(value: boolean) {
		if (this.ship == null || !this.ship.isAlive()) {
			this.autoFireTimer.stop();
			return;
		}
		if (this.autoFireTimer.running) {
			this.autoFireTimer.stop();
		}
		if (this.autoFireTimer.running == value) {
			return;
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

	public cleanup(): void {
		this.autoFireTimer.stop();
		this.onCleanup();
	}

	// override
	protected onFire(): void {
		tutils.playSound("GunShoot_mp3");
	}

	// override
	protected onCleanup(): void {
		egret.Tween.removeTweens(this);
	}

	public getFirePosition(): {x: number, y: number} {
		return Unit.getDirectionPoint(this.ship.x, this.ship.y, this.ship.angle, this.ship.height*0.5);
	}
}
