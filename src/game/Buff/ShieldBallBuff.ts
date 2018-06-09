class ShieldBallBuff extends Buff {
	power: number;
	hitInterval: number;

	public constructor(power: number=20, hitInterval: number=200) {
		super(0);
		this.power = power;
		this.hitInterval = hitInterval;
	}

	// override
	public onAddBuff(): void {
		let ship = new IntervalHitShip("BlueBallBullet_png", 2, this.ship);
		this.ship.world.addShip(ship);
		ship.resetHp(this.power);
		ship.hitShipInterval = this.hitInterval;
		ship.speed.baseValue = 10;
		ship.force = this.ship.force;

		let gun = Gun.createGun(StormGun, Bullet);
		gun.fireCooldown.baseValue = 0;
		gun.bulletPower.baseValue = this.power/2;
		gun.bulletSpeed.baseValue = 50;
		gun.period = 500;

		ship.addGun(gun, true).autoFire = true;

		let buff = GameController.instance.createBuff("shield_ball_shield");
		ship.addBuff(buff);

		ship.x = this.ship.x;
		ship.y = this.ship.y;
		ship.moveTo(ship.x, -ship.height, ship.speed.value, true, null, ()=>{
			ship.removeBuff(buff.id);
			ship.damaged(ship.hp, null);
		}, this);
	}
}