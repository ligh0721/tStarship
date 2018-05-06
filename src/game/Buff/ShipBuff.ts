class ShipBuff extends Buff {
	private readonly speedA: number;
	public constructor(duration: number, speedA: number) {
		super(duration);
		this.speedA = speedA;
	}

	// override
	public onAddBuff(): void {
		this.ship.speed.addFactor({a: this.speedA});
	}

	// override
	public onRemoveBuff(): void {
		this.ship.speed.subFactor({a: this.speedA});
	}
}