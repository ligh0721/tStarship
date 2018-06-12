class Part {
	ship: Ship = null;
	name: string = "";
	desc: string = "";
	model: string = "";
	id: string;
	key: string = "";
	protected buffs: Buff[] = [];

	public constructor(buffs: Buff[]) {
		this.buffs = buffs;
	}

	public onAddPart(): void {
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			this.ship.addBuff(buff);
		}
	}

	public onRemovePart(): void {
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			this.ship.removeBuff(buff.id);
		}
	}
}