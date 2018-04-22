class Health {
	hp: number = 1;
	maxHp: number = 1;
	public constructor() {
	}

	public isDead(): boolean {
		return this.hp <= 0;
	}
}