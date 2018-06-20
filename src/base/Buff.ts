class Buff {
	id: string;
	ship: Ship;
	triggerFlags: ShipTriggerFlags = 0;
	readonly duration: number;
	static readonly Infinite = -1;
	name: string = null;
	model: string = null;
	key: string = null;
	left: number;
	$elapsed: number = 0;  // for interval
	$interval: number = 0;

	public constructor(duration: number, triggerFlags?: ShipTriggerFlags) {
		this.duration = duration;
		this.triggerFlags = triggerFlags===undefined ? 0 : triggerFlags;
		this.left = duration;
		this.$elapsed = 0;
	}

	public setInterval(value: number): void {
		this.$interval = value<Ship.TimerInterval ? Ship.TimerInterval : value;
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
	public onDamaged(value: number, src: Ship, unit: HpUnit): number {
		return value;
	}

	// override
	public onDamageTarget(value: number, target: Ship, unit: HpUnit): number {
		return value;
	}

	// override
	public onDestroyTarget(target: Ship): void {
	}

	// override
	public onInterval(dt: number): void {
	}

	// override
	public onPowerChange(change: number): number {
		return change;
	}

	// override
	public onPowerEmpty(): void {
	}

	public step(dt: number): boolean {
		if (this.left !== Buff.Infinite) {
			this.left -= dt;
			if (this.left < 0) {
				this.left = 0;
			}
		}
		if (this.triggerFlags & ShipTrigger.OnInterval) {
			this.$elapsed += dt;
			if (this.$elapsed >= this.$interval) {
				this.onInterval(this.$elapsed);
				do {
					this.$elapsed -= this.$interval;
				} while (this.$elapsed >= this.$interval);
			}
		}
		
		return this.left !== 0;
	}

	public cleanup(): void {
		this.onCleanup();
	}

	// override
	protected onCleanup(): void {
	}
}