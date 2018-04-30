class EaseGun extends Gun {
	ease: Function;

	public fire() {
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		bullet.moveStraight(0, this.bulletSpeed.value, false, this.ease);
	}
}
