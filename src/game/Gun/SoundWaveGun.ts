class SoundWaveGun extends Gun {
	bulletWidth: number = 40;
	bulletHeight: number = 10;
	bulletNum: number = 4;

	public fire() {
		let firePos = this.getFirePosition();
		let n = this.bulletNum;
		for (let i=0; i<n; i++) {
			//let bullet = new SoundWaveBullet(this, , this.bulletHeight*(1+i*0.15));
			let bullet = this.createBullet();
			if (this.bulletType == SoundWaveBullet) {
				let $bullet = <SoundWaveBullet>bullet;
				$bullet.width = this.bulletWidth*(1+i*0.4)
				$bullet.height = this.bulletHeight*(1+i*0.4);
			}
			this.addBulletToWorld(bullet);
			bullet.x = firePos.x;
			bullet.y = firePos.y - i * 15;
			bullet.fireStraight(0, this.bulletSpeed);
		}
	}
}
