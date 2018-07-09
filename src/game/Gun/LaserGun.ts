class LaserGun extends Gun {
	ease: Function = egret.Ease.quadIn;
	laser: LaserBullet = null;
	maxLength: number = 1000;
	private timer: tutils.ITimer = new tutils.TimerByAction(GameController.instance.actMgr);

	public constructor() {
		super();
		this.bulletType = LaserBullet;
		this.bulletHitInterval.baseValue = this.fireCooldown.baseValue;
	}

	public fire(): void {
		if (this.ship==null || !this.ship.alive) {
			return;
		}
		this.playFireSound();
		if (this.laser) {
			return;
		}
		let firePos = this.getFirePosition();
		this.laser = this.createBulletWithType(LaserBullet);
		this.addBulletToWorld(this.laser)
		this.laser.x = firePos.x;
		this.laser.y = firePos.y;
		if (this.laser instanceof LaserBullet) {
			this.fireLaser();
		}
	}

	protected fireLaser(): void {
		if (!this.timer.running) {
			this.timer.setOnTimerListener(this.onTimer, this);
			this.timer.start(0, true, 0);
		}
		this.laser.gameObject.height = tutils.LongDistance;
		this.laser.gameObject.anchorOffsetY = this.laser.gameObject.height;
	}

	private onTimer(dt: number): void {
		this.laser.resetHp();
		let firePos = this.getFirePosition();
		this.laser.x = firePos.x;
		this.laser.y = firePos.y;
		if (this.laser instanceof LaserBullet && this.laser.target && this.laser.target.alive && this.laser.hitTest(this.laser.target)) {
			this.laser.resize(Math.max(1, this.ship.y-this.laser.target.y));
		} else {
			this.laser.resize(this.maxLength);
		}
	}

	// override
	protected onCleanup(): void {
		this.timer.stop();
	}

	// override
	protected onLevelUp(): void {
		this.bulletPower.baseValue += 2;
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("EaseGunShoot_mp3");
		}
	}
}
