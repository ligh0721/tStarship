class SineGun extends Gun {
	bulletNum: number = 5;
	amplitudeDelta: number = 100;
	waveLen: number = 600;

	public fire(): void {
		this.playFireSound();
		let firePos = this.getFirePosition();
		let n = this.bulletNum;
		for (let i=0; i<n; i++) {
			let bullet = this.createBullet();
			this.addBulletToWorld(bullet);
			bullet.x = firePos.x;
			bullet.y = firePos.y;
			let amplitude = (i-(n-1)/2)*this.amplitudeDelta;
			bullet.moveSine(this.ship.rotation, this.bulletSpeed.value, this.waveLen, amplitude);
		}
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("RowGunShoot_mp3");
		}
	}

	// override
	protected onLevelUp(): void {
		this.bulletNum++;
	}
}