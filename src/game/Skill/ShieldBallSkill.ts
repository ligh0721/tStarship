class ShieldBallSkill extends Skill {
	power: number = 20;
	hitShipInterval: number = 200;

	public constructor() {
		super();
	}

	// override
	protected onCast(): void {
		let ship = new IntervalHitShip("BlueBallBullet_png", 2, this.ship);
		this.ship.world.addShip(ship);
		ship.resetHp(this.power);
		ship.hitShipInterval = this.hitShipInterval;
		ship.speed.baseValue = 10;
		ship.force = this.ship.force;

		let gun = Gun.createGun(StormGun, Bullet);
		gun.fireCooldown.baseValue = 0;
		gun.bulletPower.baseValue = this.power/2;
		gun.bulletSpeed.baseValue = 50;
		gun.period = 500;

		ship.addGun(gun, true).autoFire = true;

		let buff = GameController.instance.createBuff("shield_ball");
		ship.addBuff(buff);

		ship.x = this.ship.x;
		ship.y = this.ship.y;
		ship.moveTo(ship.x, -ship.height, ship.speed.value, true, null, ()=>{
			ship.removeBuff(buff.id);
			ship.damaged(ship.hp, null);
		}, this);
	}
}