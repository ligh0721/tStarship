class GhostShipSkill extends Skill {
	// power: number = 10;
	hitShipInterval: number = 100;
	shipsNum: number = 3;
	duration: number = 20000;

	private readonly ships: Ship[] = [];
	private readonly buffIds: string[] = [];
	private timer: tutils.Timer;

	public constructor() {
		super();
		this.timer===undefined ? this.timer=new tutils.Timer() : this.timer.constructor();
		this.timer.setOnTimerListener(this.onTimer, this);
	}

	// override
	protected onCast(): void {
		if (this.ships.length > 0) {
			return;
		}

		let shipInfo = GameController.instance.getShipDataById(GameController.instance.battleShips[0]);
		if (shipInfo === undefined) {
			return null;
		}

		for (let i=0; i<this.shipsNum; i++) {
			let ghost = new IntervalHitShip(shipInfo.model);
			this.ship.world.addShip(ghost);
			ghost.ship = this.ship;
			ghost.hitShipInterval = this.hitShipInterval;
			ghost.resetHp(this.ship.maxHp);
			ghost.force = this.ship.force;
			ghost.speed.baseValue = shipInfo.speed;

			let gun = Gun.createGun(shipInfo.gun, shipInfo.bullet);
			gun.bulletSpeed.baseValue = this.ship.mainGun.bulletSpeed.baseValue;
			gun.fireCooldown.baseValue = this.ship.mainGun.fireCooldown.baseValue;
			gun.bulletPowerLossPer = this.ship.mainGun.bulletPowerLossPer;
			gun.bulletPower.baseValue = this.ship.mainGun.bulletPower.baseValue;
			gun.bulletNum = shipInfo.bulletNum;
			ghost.addGun(gun, true).autoFire = true;

			let buff = new ShieldBuff(-1, 10000000);
			ghost.addBuff(buff);

			ghost.x = this.ship.x;
			ghost.y = this.ship.y;
			ghost.gameObject.alpha = 0.5;

			this.buffIds.push(buff.id);
			this.ships.push(ghost);
		}

		this.timer.start(0, true, 0);

		let timer = new tutils.Timer();
		timer.setOnTimerListener((dt: number):void=>{
			this.cleanup();
		}, this);
		timer.start(this.duration, false, 1);
	}

	private onTimer(dt: number): void {
		if (!this.ship.isAlive()) {
			this.cleanup();
			return;
		}
		for (let i=0; i<this.ships.length; i++) {
			let dstX = i===0 ? this.ship.x : this.ships[i-1].x;
			let dstY = i===0 ? this.ship.y : this.ships[i-1].y;
			let ship = this.ships[i];
			
			let d = tutils.getDistance(ship.x, ship.y, dstX, dstY);
			let a = Math.atan2(dstY-ship.y, dstX-ship.x);
			let v = this.calcV(d);
			let vx = v * Math.cos(a) * v;
			let vy = v * Math.sin(a) * v;
			ship.x += vx * dt;
			ship.y += vy * dt;
		}
	}

	private calcV(d: number): number {
        let v = Math.log(d*0.015+1);
        return v;
    }

	private cleanup(): void {
		if (!this.timer.running) {
			return;
		}
		this.timer.stop();
		for (let i in this.ships) {
			let ship = this.ships[i];
			let buffId = this.buffIds[i];
			ship.removeBuff(buffId);
			ship.damaged(ship.hp, null);
		}
		this.ships.length = 0;
		this.buffIds.length = 0;
	}
}