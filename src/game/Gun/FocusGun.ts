class FocusGun extends Gun {
	bulletNum: number = 2;
	bulletAngleDelta: number = 20;
	turnBefore: number = 400;
	turnAfter: number = 300;
	
	
	public fire(): void {
		this.playFireSound();
		let firePos = this.getFirePosition();
		let n = this.bulletNum;
		let r = Math.sqrt(this.ship.width*this.ship.width+this.ship.height*this.ship.height) / 2;
		let focus = Unit.getDirectionPoint(this.ship.x, this.ship.y, this.ship.angle, this.turnBefore+this.turnAfter);
		for (let i=0; i<n; i++) {
			let bullet = this.createBullet();
			this.addBulletToWorld(bullet)
			let angle = (i - (n - 1) / 2) * this.bulletAngleDelta + this.ship.angle;
			let firePos = Unit.getDirectionPoint(this.ship.x, this.ship.y, angle, r);
			bullet.x = firePos.x;
			bullet.y = firePos.y;
			this.fireBulletTurnToFocus(bullet, angle, this.turnBefore, focus.x, focus.y);
		}
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("ShotGunShoot_mp3");
		}
	}

	protected fireBulletTurnToFocus(bullet: Bullet, angle: number, turnBefore: number, focusX: number, focusY: number) {
		bullet.angle = angle;
		let tw = egret.Tween.get(bullet.gameObject);
		let toPos = Unit.getDirectionPoint(bullet.gameObject.x, bullet.gameObject.y, angle, turnBefore);
		tw.to({x: toPos.x, y: toPos.y}, turnBefore*tutils.SpeedFactor/this.bulletSpeed.value, egret.Ease.getPowOut(1));
		let toPos1 = Unit.getForwardPoint(toPos.x, toPos.y, focusX, focusY, tutils.LongDistance);
		let angle1 = Math.atan2(toPos1.y-toPos.y, toPos1.x-toPos.x) * tutils.DegPerRad + 90;
		tw.call(()=>{
			bullet.angle = angle1;
		}, this);
		tw.to({x: toPos1.x, y: toPos1.y}, tutils.LongDistance*tutils.SpeedFactor/this.bulletSpeed.value, egret.Ease.getPowIn(1));
	}
}