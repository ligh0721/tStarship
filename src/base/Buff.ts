class Buff {
	public id: string;
	public ship: Ship;
	public triggerFlags: ShipTriggerFlags = 0;
	public readonly duration: number;
	public name: string = "";
	private $left: number;
	public uniq: string = "";

	public constructor(duration: number, triggerFlags?: ShipTriggerFlags) {
		this.duration = duration;
		this.triggerFlags = triggerFlags===undefined ? 0 : triggerFlags;
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

	// override
	public onDamaged(value: number, src: HpUnit): number {
		return value;
	}

	public step(dt: number): boolean {
		if (this.$left === -1) {
			return true;
		}
		this.$left -= dt;
		return this.$left > 0;
	}
}