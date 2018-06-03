class BuffSupply extends Supply {
	private readonly buffs: Buff[];

	public constructor(model: string, buffs: Buff[]) {
		super(model);
		this.buffs = buffs;
	}

	public drop(x: number, y: number, ease?: Function) {
		this.x = x + 85;
		this.y = y;
		let tw = egret.Tween.get(this.gameObject, {loop: true});
		tw.to({x: this.x-170}, 2000, egret.Ease.getPowInOut(2));
		tw.to({x: this.x}, 2000, egret.Ease.getPowInOut(2));
		this.moveStraight(180, this.speed, true, ease);
		if (this.pickDist > 0) {
			this.moveToShip(null);
		}
	}

	// override
	public onHitShip(ship: Ship): void {
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			ship.addBuff(buff);
		}
	}
}