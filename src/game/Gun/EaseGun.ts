class EaseGun extends Gun {
	ease: Function = egret.Ease.quadIn;

	public fire(): void {
		this.playFireSound();
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		this.fireBulletStraight(bullet, this.ship.rotation, false, this.ease);
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("EaseGunShoot_mp3");
		}
	}

	// override
	protected onLevelUp(): void {
		this.bulletPower.baseValue += 4;
	}
}

class EnergyWaveGun extends EaseGun {
}
