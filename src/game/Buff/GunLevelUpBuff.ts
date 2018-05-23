class GunLevelUpBuff extends Buff {
	levelChange: number = 1;

	public constructor(levelChange?: number) {
		super(0);
		this.levelChange = levelChange===undefined ? 1 : levelChange;
	}

	// override
	public onAddBuff(): void {
		this.ship.mainGun.levelUp();
	}
}