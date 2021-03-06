class ShotGun extends Gun {
	bulletNum: number = 5;
	bulletAngleDelta: number = 6;
	
	public fire(): void {
		this.playFireSound();
		let firePos = this.getFirePosition();
		let n = this.bulletNum;
		let r = Math.sqrt(this.ship.width*this.ship.width+this.ship.height*this.ship.height) / 2;
		for (let i=0; i<n; i++) {
			let bullet = this.createBullet();
			this.addBulletToWorld(bullet)
			let angle = (i - (n - 1) / 2) * this.bulletAngleDelta + this.ship.rotation;
			let firePos = this.ship.getDirectionPoint(r, angle);
			bullet.x = firePos.x;
			bullet.y = firePos.y;
			this.fireBulletStraight(bullet, angle);
		}
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("ShotGunShoot_mp3");
		}
	}

	// override
	protected onLevelUp(): void {
		this.bulletNum++;
	}
}