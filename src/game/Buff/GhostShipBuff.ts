class GhostShipBuff extends Buff {
	shipsNum: number = 3;
	powerPer: number = 0.3;

	private readonly ships: Ship[] = [];
	private readonly buffIds: string[] = [];
	private timer: tutils.Timer;

	public constructor(duration: number, num: number=3, powerPer: number=0.3) {
		super(duration, ShipTrigger.OnInterval | HeroShipTrigger.OnPowerEmpty);
		this.setInterval(0);
		this.shipsNum = num;
		this.powerPer = powerPer;
		this.timer===undefined ? this.timer=new tutils.Timer() : this.timer.constructor();
		this.timer.setOnTimerListener(this.onTimer, this);
	}

	// override
	public onAddBuff(): void {
		if (this.ships.length > 0) {
			return;
		}

		let shipData = GameController.instance.getShipDataByKey(this.ship.key);
		for (let i=0; i<this.shipsNum; i++) {
			let ghost = new IntervalHitShip(this.ship.model, this.ship.modelScale, this.ship);
			this.ship.world.addShip(ghost);
			ghost.resetHp(this.ship.maxHp);
			ghost.force = this.ship.force;

			if (shipData) {
				ghost.speed.baseValue = shipData.speed;
				let gun = Gun.createGun(shipData.gun, shipData.bullet);
				gun.bulletSpeed.baseValue = this.ship.mainGun.bulletSpeed.baseValue;
				gun.fireCooldown.baseValue = this.ship.mainGun.fireCooldown.baseValue;
				gun.bulletPowerLossPer = this.ship.mainGun.bulletPowerLossPer;
				gun.bulletPower.baseValue = Math.max(1, Math.floor(this.ship.mainGun.bulletPower.baseValue * this.powerPer));
				gun.bulletNum = this.ship.mainGun.bulletNum;
				ghost.addGun(gun, true).autoFire = true;
			}

			let buff = new UnhitBuff(-1);
			ghost.addBuff(buff);

			ghost.x = this.ship.x;
			ghost.y = this.ship.y;
			ghost.gameObject.alpha = 0.5;

			this.buffIds.push(buff.id);
			this.ships.push(ghost);
		}

		this.timer.start(0, true, 0);
	}

	// override
	public onRemoveBuff(): void {
		this.cleanup();
	}

	private onTimer(dt: number): void {
		if (!this.ship.alive) {
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

	// override
	protected onCleanup(): void {
		if (!this.timer.running) {
			return;
		}
		this.timer.stop();
		for (let i in this.ships) {
			let ship = this.ships[i];
			let buffId = this.buffIds[i];
			ship.removeBuff(buffId);
			ship.status = UnitStatus.Dead;
		}
		this.ships.length = 0;
		this.buffIds.length = 0;
	}

	// override
	public onInterval(dt: number): void {
		if (this.ship instanceof HeroShip) {
			this.ship.addPower(-10);
		}
	}

	// override
	public onPowerEmpty(): void {
		this.ship.removeBuff(this.id);
	}
}