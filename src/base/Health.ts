class Health {
	hp: number = 1;
	maxHp: number = 1;

	public constructor() {
	}

	public reset(maxHp: number) {
		this.maxHp = maxHp;
		this.hp = maxHp;
	}

	public isDead(): boolean {
		return this.hp <= 0;
	}
}