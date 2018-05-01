class HpUnit extends Unit {
	status: UnitStatus = UnitStatus.Alive;
	private readonly $hp: Health = new Health();

	// from unit
	private onHpChangedListener: (unit: HpUnit, changed: number)=>void = null;
	private onHpChangedThisObject: any;

	public get hp(): number {
		return this.$hp.hp;
	}

	public damaged(value: number, src: HpUnit): void {
		this.$hp.hp -= value;
		this.onHpChanged(-value);
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

	protected onCleanup(): void {
		// this.onHpChangedListener = null;
		// this.onHpChangedThisObject = null;
		super.onCleanup();
	}

	public onHpChanged(changed: number) {
		if (this.onHpChangedListener != null) {
			this.onHpChangedListener.call(this.onHpChangedThisObject, this, changed);
		}
	}

	public setOnHpChangedListener(listener: (unit: HpUnit, changed: number)=>void, thisObject?: any) {
		this.onHpChangedListener = listener;
		this.onHpChangedThisObject = thisObject;
	}
}

enum UnitStatus {
	Alive,
	Dying,
	Dead,
	Removed
}