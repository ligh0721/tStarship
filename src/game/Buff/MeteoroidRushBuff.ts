class MeteoroidRushBuff extends Buff {
	private num: number;
	power: number;
	hitInterval: number;

	public constructor(num: number=10, power: number=300, hitInterval: number=200) {
		super(0);
		this.num = num;
		this.power = power;
		this.hitInterval = hitInterval;
	}

	// override
	public onAddBuff(): void {
		const delay = 300;
		let rushes = {};
		let world = this.ship.world;
		let force = this.ship.force;
		let tw = egret.Tween.get(rushes);
		for (let i=0; i<this.num; i++) {
			if (i > 0) {
				tw.wait(delay);
			}
			tw.call(this.rush, this, [force, world]);
		}
		tutils.playSound("Meteoroid_mp3");
	}

	private rush(force: Force, world: World): void {
		let ship = new IntervalHitShip("Meteoroid_png", 0.2, this.ship);
		world.addShip(ship);
		ship.force = force;
		ship.x = ship.width * 0.5 + Math.random() * (world.width - ship.width);
		ship.y = world.height + ship.height;
		ship.resetHp(this.power);
		ship.speed.baseValue = 100;
		ship.moveTo(ship.x, -ship.height, ship.speed.value, false, null, ():void=>{
			ship.status = UnitStatus.Dead;
		})
	}
}