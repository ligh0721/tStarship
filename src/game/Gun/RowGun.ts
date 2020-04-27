class RowGun extends Gun {
	bulletNum: number = 5;
	bulletXDelta: number = 30;
	bulletYDelta: number = 20;

	public fire(): void {
		this.playFireSound();
		let firePos = this.getFirePosition();
		let n = this.bulletNum;
		for (let i=0; i<n; i++) {
			let bullet = this.createBullet();
			this.addBulletToWorld(bullet);
			let xPos = Unit.getDirectionPoint(firePos.x, firePos.y, this.ship.rotation-90, (i-(n-1)/2)*this.bulletXDelta);
			let yPos = Unit.getDirectionPoint(xPos.x, xPos.y, this.ship.rotation, -(Math.abs(i-(n-1)/2))*this.bulletYDelta);
			bullet.x = yPos.x;
			bullet.y = yPos.y;
			this.fireBulletStraight(bullet);
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