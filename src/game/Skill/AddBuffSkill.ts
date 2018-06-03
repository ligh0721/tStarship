class AddBuffSkill extends Skill {
	private readonly buffs: Buff[];

	public constructor(buffs: Buff[]) {
		super();
		this.buffs = buffs;
	}

	// override
	protected onCast(): void {
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			buff.reset();
			if (!buff.ship) {
				this.ship.addBuff(buff);
			}
		}
	}
}