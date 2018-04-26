class Gun {
	ship: Ship;
	fireInterval: number = 200;
	bulletPower: number = 1;
	bulletSpeed: number = 50;

	public constructor() {
	}

	public static createGun<GUN extends Gun>(t: new() => GUN): GUN {
		return new t();
	}

	public fire() {
		let firePos = this.getFirePosition();
		let bullet = new Bullet(this);
		this.ship.world.addBullet(bullet);
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		let tw = egret.Tween.get(bullet.gameObject);
		let toY = -this.ship.world.height * 0.3;
		tw.to({y: toY}, (bullet.y-toY)/this.bulletSpeed*tutils.SpeedFactor);
	}

	public autofire() {
		let tw = egret.Tween.get(this);
		tw.call(this.fire, this);
		tw.wait(this.fireInterval);
		tw.call(this.autofire, this);
	}

	public cleanup() {
		egret.Tween.removeTweens(this);
	}

	public getFirePosition(): {x: number, y: number} {
		return {x: this.ship.x, y: this.ship.y-this.ship.height*0.5};
	}
}
