class Skill {
	ship: HeroShip;

	public constructor() {
	}

	public cast(): void {
		this.onCast();
	}

	// override
	protected onCast(): void {
	}
}