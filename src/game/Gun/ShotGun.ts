class ShotGun extends Gun {
	bulletNum: number = 5;
	bulletAngleDelta: number = 10;
	
	public fire() {
		let firePos = this.getFirePosition();
		let n = this.bulletNum;
		let r = Math.sqrt(this.ship.width*this.ship.width+this.ship.height*this.ship.height) / 2;
		for (let i=0; i<n; i++) {
			let bullet = this.createBullet();
			this.addBulletToWorld(bullet)
			let angle = (i - (n - 1) / 2) * this.bulletAngleDelta;
			let firePos = Bullet.getDirectionPoint(this.ship.x, this.ship.y, angle, r);
			bullet.x = firePos.x;
			bullet.y = firePos.y;
			bullet.fireStraight(angle, this.bulletSpeed);
		}
	}
}