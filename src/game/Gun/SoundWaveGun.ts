class SoundWaveGun extends Gun {
	bulletWidth: number = 80;
	bulletHeight: number = 20;

	public fire() {
		let firePos = this.getFirePosition();
		let n = 4;
		for (let i=0; i<n; i++) {
			let bullet = new SoundWaveBullet(this, this.bulletWidth*(1+i*0.15), this.bulletHeight*(1+i*0.15));
			this.ship.world.addBullet(bullet);
			bullet.x = firePos.x;
			bullet.y = firePos.y - i * 20;
			let tw = egret.Tween.get(bullet.gameObject);
			let toY = -this.ship.world.height * 0.2 - i * 10;
			tw.to({y: toY}, (bullet.y-toY)/this.bulletSpeed*tutils.SpeedFactor);
			tw.call(() => {
				this.ship.world.removeBullet(bullet.id);
			});
		}
	}
}
