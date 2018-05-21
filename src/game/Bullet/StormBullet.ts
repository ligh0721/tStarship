class StormBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun);
	}

	// override
	public onAddToWorld(): void {
		super.onAddToWorld();
	}
}