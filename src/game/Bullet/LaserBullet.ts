class LaserBullet extends Bullet {
	target: Ship = null;

	public constructor(gun: Gun) {
		super(gun, "BlueBullet2_png", 3.0);
	}
	
	// override
	protected onCreate(): egret.DisplayObject {
		let ret = super.onCreate();
		ret.anchorOffsetY = ret.height;
		let act = new tutils.RepeatForever(new tutils.Sequence(
			new tutils.To(200, {scaleX: 0.5}),
			new tutils.To(200, {scaleX: 1.0})
		));
		GameController.instance.actMgr.addAction(ret, act);
		return ret;
	}

	// override
	public onHitEnemyShipTest(ship: Ship): boolean {
		let ret = super.onHitEnemyShipTest(ship);
		if (ret) {
			this.target = ship;
			this.resize(Math.max(1, this.gun.ship.y-this.target.y));
		}
		return ret;
	}

	public resize(height: number): void {
		this.gameObject.height = height;
		this.gameObject.anchorOffsetY = this.gameObject.height;
		this.boundsDirty = true;
	}
}