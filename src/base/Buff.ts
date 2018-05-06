class Buff {
	public id: string;
	public ship: Ship;
	public readonly duration: number;
	public name: string = "";
	private $left: number;
	public uniq: string = "";

	public constructor(duration: number) {
		this.duration = duration;
		this.$left = duration;
	}

	public reset(): void {
		this.$left = this.duration;
	}

	// override
	public onAddBuff(): void {
	}

	// override
	public onRemoveBuff(): void {
	}

	public step(dt: number): boolean {
		this.$left -= dt;
		return this.$left > 0;
	}
}