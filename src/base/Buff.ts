class Buff {
	id: string;
	ship: Ship;
	triggerFlags: ShipTriggerFlags = 0;
	readonly duration: number;
	name: string = null;
	model: string = null;
	key: string = null;
	left: number;

	public constructor(duration: number, triggerFlags?: ShipTriggerFlags) {
		this.duration = duration;
		this.triggerFlags = triggerFlags===undefined ? 0 : triggerFlags;
		this.left = duration;
	}

	public reset(): void {
		this.left = this.duration;
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
		if (this.left === -1) {
			return true;
		}
		this.left -= dt;
		if (this.left < 0) {
			this.left = 0;
		}
		return this.left > 0;
	}

	public cleanup(): void {
		this.onCleanup();
	}

	// override
	protected onCleanup(): void {
	}
}