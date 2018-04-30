class Buff {
	public id: string;
	public owner: Ship = null;
	public readonly duration: number;
	public left: number;

	public constructor(duration: number) {
		this.duration = duration;
		this.left = duration;
	}

	// override
	public onAddBuff() {
	}

	// override
	public onRemoveBuff() {
	}
}