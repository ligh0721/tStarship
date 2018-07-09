class GunSupply extends Supply {
	private readonly gun: Gun;

	public constructor(gun: Gun) {
		super();
		this.gun = gun;
	}

	// override
	public onHitShip(ship: Ship): void {
		if (ship.mainGun != null) {
			ship.removeGun(ship.mainGun.id);
		}
		ship.addGun(this.gun, true).autoFire = true;
	}
}