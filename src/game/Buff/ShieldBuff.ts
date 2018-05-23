class ShieldBuff extends Buff {
	shield: number;
	
	public constructor(duration: number, shield: number) {
		super(duration, ShipTrigger.OnDamaged);
		this.shield = shield;
	}

	public onDamaged(value: number, src: HpUnit): number {
		let dt = value - this.shield;
		if (dt > 0) {
			value = dt;
			this.shield = 0;
		} else {
			this.shield = -dt;
			value = 0;
		}
		return value;
	}
}