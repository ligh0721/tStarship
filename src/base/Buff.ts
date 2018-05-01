class Buff {
	public id: string;
	public ship: Ship = null;
	public readonly duration: number;
	private $left: number;

	public constructor(duration: number) {
		this.duration = duration;
		this.$left = duration;
	}

	// override
	public onAddBuff() {
	}

	// override
	public onRemoveBuff() {
	}

	public step(dt: number): boolean {
		this.$left -= dt;
		return this.$left > 0;
	}
}