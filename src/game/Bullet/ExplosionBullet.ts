class ExplosionBullet extends Bullet {
	radius: number = 3;
	delayMove: number = 300;
	bombRadius: number = 200;
	protected onCreate(): egret.DisplayObject {
		let bullet = new egret.Shape();
        bullet.graphics.beginFill(0xffffff, 1.0);
		bullet.graphics.lineStyle(1, 0xffffff);
		bullet.graphics.drawCircle(0, 0, this.radius);
        bullet.graphics.endFill();
		return bullet;
	}

	public onDying() {
	}
}
