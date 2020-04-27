class AddBuffSkill extends Skill {
	private readonly buffs: Buff[];

	public constructor(power: number, buffs: Buff[]) {
		super(power);
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