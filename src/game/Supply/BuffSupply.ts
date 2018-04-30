class BuffSupply extends Supply {
	private readonly buffs: Buff[];

	public constructor(buffs: Buff[]) {
		super();
		this.buffs = buffs;
	}

	// override
	public onHitShip(ship: Ship): void {
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			ship.addBuff(buff);
		}
	}
}