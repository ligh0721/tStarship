class SoundWaveGun extends Gun {
	public fire() {
		let bulletSpeed = 80;
		let n = 4;
		for (let i=0; i<n; i++) {
			let bullet = this.onCreateBullet();
			this.ship.world.addBullet(bullet);
			bullet.gameObject.scaleX = 1.0 + i*0.15;
			bullet.gameObject.scaleY = 1.0 + i*0.15;
			bullet.x = this.ship.x;
			bullet.y = this.ship.y-this.ship.height*0.5 -i*20;
			let tw = egret.Tween.get(bullet.gameObject);
			let x = bullet.x;
			tw.to({y: -this.ship.world.height*0.2-i*10}, (this.ship.y)/bulletSpeed*100);
			tw.call(() => {
				this.ship.world.removeBullet(bullet.id);
			});
		}
	}

	protected onCreateBullet(): Bullet {
		let bullet = new SoundWaveBullet(this);
		return bullet;
	}
}
