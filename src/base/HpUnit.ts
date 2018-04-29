class HpUnit extends Unit {
	status: UnitStatus = UnitStatus.Alive;
	private readonly $hp: Health = new Health();

	public get hp(): number {
		return this.$hp.hp;
	}

	public damaged(value: number, src: HpUnit): void {
		this.$hp.hp -= value;
		if (this.$hp.hp <= 0) {
			if (this.status == UnitStatus.Alive) {
				this.status = UnitStatus.Dying;
			}
			this.onDying(src);
		}
	}

	public get maxHp(): number {
		return this.$hp.maxHp;
	}

	public set maxHp(value: number) {
		this.$hp.maxHp = value;
	}

	public resetHp(maxHp: number) {
		this.$hp.reset(maxHp);
	}

	public isAlive(): boolean {
		return this.status == UnitStatus.Alive;
	}

	// override
	protected onDying(src: HpUnit) {
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.gameObject);
		this.status = UnitStatus.Dead;
	}
}

enum UnitStatus {
	Alive,
	Dying,
	Dead,
	Removed
}