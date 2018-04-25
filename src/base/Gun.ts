class Gun {
	ship: Ship;
	fireInterval: number = 200;
	bulletPower: number = 1;
	bulletSpeed: number = 50;

	public constructor() {
	}

	public fire() {
		let n = 1;
		for (let i=0; i<n; i++) {
			let bullet = this.onCreateBullet();
			this.ship.world.addBullet(bullet);
			bullet.x = this.ship.x+(i-(n-1)/2)*50;
			bullet.y = this.ship.y-this.ship.height*0.5;
			let tw = egret.Tween.get(bullet.gameObject);
			let toY = -this.ship.world.height * 0.2
			tw.to({y: toY}, (bullet.y-toY)/this.bulletSpeed*100);
			tw.call(() => {
				this.ship.world.removeBullet(bullet.id);
			});
			// let tw2 = egret.Tween.get(bullet.gameObject, {loop: true});
			// let a = 50;
			// tw2.to({x: x-a}, 100, egret.Ease.sineOut);
			// tw2.to({x: x}, 100, egret.Ease.sineIn);
			// tw2.to({x: x+a}, 100, egret.Ease.sineOut);
			// tw2.to({x: x}, 100, egret.Ease.sineIn);
		}
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

	protected onCreateBullet(): Bullet {
		let bullet = new Bullet(this);
		return bullet;
	}
}
