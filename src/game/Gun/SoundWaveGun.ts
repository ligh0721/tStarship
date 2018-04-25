class SoundWaveGun extends Gun {
	bulletWidth: number = 80;
	bulletHeight: number = 20;

	public fire() {
		let bulletSpeed = 80;
		let n = 4;
		for (let i=0; i<n; i++) {
			let bullet = this.onCreateBullet();
			(<SoundWaveBullet>bullet).width = this.bulletWidth * (1 + i * 0.15);
			(<SoundWaveBullet>bullet).height = this.bulletHeight * (1 + i * 0.15);
			this.ship.world.addBullet(bullet);

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
