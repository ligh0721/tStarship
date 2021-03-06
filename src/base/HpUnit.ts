class HpUnit extends Unit {
	status: UnitStatus = UnitStatus.Alive;
	private readonly $hp: Health;

	// from unit
	private onHpChangedListener: (unit: HpUnit, changed: number)=>void = null;
	private onHpChangedThisObject: any = null;

	// override
	public constructor() {
		super();
		this.$hp===undefined ? this.$hp=new Health() : this.$hp.constructor();
	}

	public get hp(): number {
		return this.$hp.hp;
	}

	public damaged(value: number, src: HpUnit, unit: HpUnit): void {
		this.damagedLow(value, src);
	}

	public damagedLow(value: number, src: HpUnit): void {
		this.$hp.hp -= value;
		this.onHpChanged(-value);
		if (this.$hp.hp <= 0) {
			this.$hp.hp = 0;
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

	public resetHp(maxHp?: number) {
		if (maxHp != null) {
			this.$hp.reset(maxHp);
		} else {
			this.$hp.hp = this.$hp.maxHp;
		}
	}

	public get alive(): boolean {
		return this.status == UnitStatus.Alive;
	}

	// override
	protected onDying(src: HpUnit) {
		this.stopAllActions();
		GameController.instance.actMgr.removeAllActions(this.gameObject);
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