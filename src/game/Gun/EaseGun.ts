class EaseGun extends Gun {
	ease: Function;

	public fire() {
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		bullet.fireStraight(0, this.bulletSpeed, this.ease);
	}
}
