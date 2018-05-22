class ShieldBuff extends Buff {
	shield: number;
	public constructor(duration: number, shield: number) {
		super(duration);
		this.shield = shield;
	}
}