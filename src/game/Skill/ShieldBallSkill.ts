class ShieldBallSkill extends Skill {
	power: number = 1;
	hitShipInterval: number = 200;

	public constructor() {
		super();
	}

	// override
	protected onCast(): void {
		let ship = new IntervalHitShip("BlueBallBullet_png", 2);
		ship.ship = this.ship;
		this.ship.world.addShip(ship);
		ship.resetHp(this.power);
		ship.hitShipInterval = this.hitShipInterval;
		ship.speed.baseValue = 10;
		ship.force = this.ship.force;

		let gun = Gun.createGun(StormGun, Bullet);
		gun.fireCooldown.baseValue = 0;
		gun.bulletPower.baseValue = 2;
		gun.bulletSpeed.baseValue = 50;
		gun.period = 500;

		ship.addGun(gun, true).autoFire = true;

		let buff = new ShieldBuff(-1, 10000000);
		ship.addBuff(buff);

		ship.x = this.ship.x;
		ship.y = this.ship.y;
		ship.moveTo(ship.x, -ship.height, ship.speed.value, true, null, ()=>{
			ship.removeBuff(buff.id);
			ship.damaged(ship.hp, null);
		}, this);
	}
}