class UnhitBuff extends Buff {
	private orgCanHit: boolean;

	// override
	public onAddBuff(): void {
		this.orgCanHit = this.ship.canHit;
		this.ship.canHit = false;
	}

	// override
	public onRemoveBuff(): void {
		this.ship.canHit = this.orgCanHit;
	}
}