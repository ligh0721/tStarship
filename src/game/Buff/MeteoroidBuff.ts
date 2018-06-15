class MeteoroidBuff extends Buff {
	rate: number;
	power: number;
	
	public constructor(rate: number, power: number) {
		super(-1, ShipTrigger.OnDestroyTarget);
		this.rate = rate;
		this.power = power;
	}

	// override
	public onDestroyTarget(target: Ship): void {
		if (Math.random() < this.rate) {
			this.rush(this.ship.force, this.ship.world, Math.random()*200-100+target.x);
		}
	}

	private rush(force: Force, world: World, x: number): void {
		tutils.playSound("Meteoroid_mp3");
		let ship = new IntervalHitShip("Meteoroid_png", 0.2, this.ship);
		world.addShip(ship);
		ship.force = force;
		ship.x = Math.min(world.width-ship.width*0.5, Math.max(ship.width*0.5, x));
		ship.y = world.height + ship.height;
		ship.resetHp(this.power);
		ship.speed.baseValue = 100;
		ship.moveTo(ship.x, -ship.height, ship.speed.value, false, null, false, ():void=>{
			ship.status = UnitStatus.Dead;
		})
	}
}