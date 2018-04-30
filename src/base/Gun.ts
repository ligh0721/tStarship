class Gun {
	id: string;
	ship: Ship;
	fireCooldown: number = 200;
	bulletPower: number = 1;
	bulletPowerLossPer: number = 1.0;  // 子弹能量下降系数
	bulletPowerLossInterval: number = 500;  // 子弹能量下降时间间隔
	bulletSpeed: number = 50;
	bulletType: new(gun: Gun)=>Bullet = Bullet;

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
		bullet.moveStraight(0, this.bulletSpeed);
	}

	public autofire() {
		let tw = egret.Tween.get(this);
		tw.call(this.fire, this);
		tw.wait(this.fireCooldown);
		tw.call(this.autofire, this);
	}

	public cleanup() {
		egret.Tween.removeTweens(this);
	}

	public getFirePosition(): {x: number, y: number} {
		return {x: this.ship.x, y: this.ship.y-this.ship.height*0.5};
	}
}
