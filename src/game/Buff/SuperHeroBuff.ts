class SuperHeroBuff extends Buff {
	private bye: tutils.CustomState;
	private superHero: Ship;
	private setTimeoutKeys: number[] = [];

	// override
	public onAddBuff(): void {
		this.superHero = this.createSuperHero();
	}

	// override
	public onRemoveBuff(): void {
		this.cleanup();
	}

	// override
	protected onCleanup(): void {
		this.superHero.ai.change(this.bye);
	}

	private createSuperHero(): Ship {
		let world = this.ship.world;
		let ship = new Ship("GreenHeroShip_png", 0.4);
		world.addShip(ship);
		ship.hero = true;
		ship.x = world.width * 0.5;
		ship.y = world.height + 200;
		ship.resetHp(100);
		ship.force = this.ship.force;
		ship.speed.baseValue = 50;

		let gun = Gun.createGun(RowGun, Bullet);
		gun.bulletSpeed.baseValue = 200;
		gun.fireCooldown.baseValue = 150;
		gun.bulletPowerLossPer = 1;
		gun.bulletPower.baseValue = 3;
		gun.bulletPowerLossInterval.baseValue = 1000;
		gun.bulletNum = 4;
		ship.addGun(gun, true);

		let gun1 = Gun.createGun(SatelliteGun, ExplosionBullet);
		gun1.fireCooldown.baseValue = 50;
		gun1.bulletNum = 6;
		gun1.bulletPowerLossPer = 0.001;
		gun1.bulletPower.baseValue = 100/gun1.bulletPowerLossPer;
		gun1.bulletPowerLossInterval.baseValue = 200;
		gun1.period = 800;
		ship.addGun(gun1);

		let gun2 = Gun.createGun(EaseGun, ShakeWaveBullet);
		gun2.bulletSpeed.baseValue = 150;
		gun2.fireCooldown.baseValue = 1400;
		gun2.bulletPowerLossPer = 0.001;
		gun2.bulletPower.baseValue = 30/gun2.bulletPowerLossPer;
		gun2.bulletPowerLossInterval.baseValue = 100;
		gun2.bulletNum = 1;
		ship.addGun(gun2);

		let gun3 = Gun.createGun(MissileGun, MissileBullet);
		gun3.bulletSpeed.baseValue = 200;
		gun3.fireCooldown.baseValue = 1000;
		gun3.bulletPowerLossPer = 1;
		gun3.bulletPower.baseValue = 20;
		gun3.bulletPowerLossInterval.baseValue = 500;
		gun3.bulletNum = 3;
		gun3.explosionRadius = 150;
		gun3.explosionPowerEveryPer = 0.5;
		ship.addGun(gun3);

		let buff = GameController.instance.createBuff("shield_ball_shield");
		ship.addBuff(buff);

		let ai = new tutils.StateManager();
		let hello = new tutils.CustomState();
		let randMove = new tutils.CustomState();
		let randWait = new tutils.CustomState();
		this.bye = new tutils.CustomState();
		let startTick: number = 0;
		hello.setListener(():void=>{
			gun1.autoFire = true;
			ship.moveTo(ship.x, world.height-200, ship.speed.value, true, null, false, ():void=>{
				startTick = egret.getTimer();
				this.setTimeoutKeys.push(egret.setTimeout(():void=>{
					gun1.cleanup();
					ai.change(randWait, 1000);
				}, this, 5000));
				this.setTimeoutKeys.push(egret.setTimeout(():void=>{
					gun.autoFire = true;
				}, this, 6000));
				this.setTimeoutKeys.push(egret.setTimeout(():void=>{
					gun.autoFire = false;
				}, this, 11000));
				this.setTimeoutKeys.push(egret.setTimeout(():void=>{
					gun2.autoFire = true;
					gun.autoFire = true;
				}, this, 12000));
				this.setTimeoutKeys.push(egret.setTimeout(():void=>{
					gun.autoFire = false;
					gun2.autoFire = false;
				}, this, 17000));
				this.setTimeoutKeys.push(egret.setTimeout(():void=>{
					gun.autoFire = true;
					gun2.autoFire = true;
					gun3.autoFire = true;
				}, this, 18000));
			}, this);
		}, null, this);
		randMove.setListener((x: number, y: number):void=>{
			if (!gun.autoFire && !gun2.autoFire) {
				let dur = Math.random() * 500;
				ai.change(randWait, dur);
				return;
			}
			ship.moveTo(x, y, ship.speed.value, true, egret.Ease.getPowInOut(2), false, ():void=>{
				let dur = Math.random() * 500;
				ai.change(randWait, dur);
			}, this);
		}, null, this);
		randWait.setListener((dur: number):void=>{
			this.setTimeoutKeys.push(egret.setTimeout(():void=>{
				let x = (Math.random()*0.8+0.1) * world.width;
				let target = world.findNearestFrontAliveEnemyShip(ship.x, ship.y, ship.force);
				if (target) {
					x = target.x + (Math.random()*0.6+0.2-0.5) * target.width;
				}
				let y = ship.y;
				ai.change(randMove, x, y);
			}, this, dur));
		}, null, this);
		this.bye.setListener(():void=>{
			for (let i in this.setTimeoutKeys) {
				egret.clearTimeout(this.setTimeoutKeys[i]);
			}
			for (let i in ship.guns) {
				ship.guns[i].cleanup();
			}
			ship.moveTo(world.width*0.5, ship.y+50, ship.speed.value*0.5, true, egret.Ease.getPowOut(2), false, ():void=>{
				ship.canHit = false;
				let buff = GameController.instance.createBuff("super_hero_ghost_ships");
				ship.addBuff(buff);
				ship.moveTo(ship.x, -300, ship.speed.value*3, true, egret.Ease.getPowIn(2), false, ():void=>{
					ship.status = UnitStatus.Dead;
				}, this);
			}, this);
		}, null, this);
		ship.ai = ai;
		ai.change(hello);

		return ship;
	}
}