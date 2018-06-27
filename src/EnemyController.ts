class EnemyController {
	readonly world: World;
	private rushes: Rush[] = [];
	private tick: number = 0;
	// private timer: tutils.Timer = new tutils.Timer();
	private rushTimerAct: tutils.TimerAction;

	private hero: Ship = null;
	private rushHashObj: egret.HashObject = new egret.HashObject();

	public constructor(world: World) {
		this.world = world;
	}

	public createEnemyShip(model: string, modelScale: number=0.4): EnemyShip {
		let enemyShip = new EnemyShip(model, modelScale);
		enemyShip.force.force = tutils.EnemyForce;
		return enemyShip;
	}

	public clearRushes() {
		this.rushes.length = 0;
	}

	public addRush(rush: Rush) {
		this.rushes.push(rush);
	}

	public startRush(frameRate: number=10): void {
		// if (!this.timer.hasOnTimerListener()) {
		// 	this.timer.setOnTimerListener(this.onRushStep, this);
		// }
		this.tick = 0;
		// this.timer.start(1000/frameRate, true, 0);
		if (!this.rushTimerAct) {
			this.rushTimerAct = new tutils.TimerAction(1000/frameRate, true, 0);
			this.rushTimerAct.setOnTimerListener(this.onRushStep, this);
		}

		// if (this.rushes.length === 0) {
		// 	return;
		// }

		// let top: Rush = this.rushes.splice(0, 1)[0];
		// let seqAct = new tutils.Sequence(
		// 	new tutils.DelayTime(top.delay),
		// 	new tutils.CallFunc(():void=>{
		// 		do {
		// 			top.start(this.world);
		// 			if (this.rushes.length === 0) {
		// 				GameController.instance.actionManager.removeAllActions(this.rushHashObj);
		// 				return;
		// 			}
		// 			top = this.rushes.splice(0, 1)[0];
		// 		} while (top.delay === 0);
		// 		seqAct.one.duration = top.delay;
		// 		seqAct.recalcDuration();
		// 	}, this)
		// );
		// let act = new tutils.RepeatForever(seqAct);
		GameController.instance.actMgr.addAction(this.rushHashObj, this.rushTimerAct);
	}

	public stopRush(): void {
		// this.timer.stop();
		GameController.instance.actMgr.removeAllActions(this.rushHashObj);
	}

	private onRushStep(dt: number): void {
		for (;;) {
			if (this.rushes.length <= 0) {
				// this.timer.stop();
				GameController.instance.actMgr.removeAllActions(this.rushHashObj);
				this.tick = 0;
				return;
			}

			let topRush = this.rushes[0];
			this.tick += dt;

			if (this.tick >= topRush.delay) {
				topRush.start(this.world);
				this.tick = 0;
				dt = 0;
				this.rushes.splice(0, 1);
			} else {
				break;
			}
		}
	}

	public getHero(): Ship {
		if (this.hero == null || !this.hero.alive) {
			this.hero = this.world.findNearestHeroShip(this.world.width*0.5, this.world.height*0.5);
		}
		return this.hero;
	}

	public getHeroPos(): {x: number, y: number} {
		let x = this.world.width * 0.5;
		let y = this.world.height;
		let hero = this.getHero();
		if (hero != null) {
			x = hero.x;
			y = hero.y;
		}
		return {x: x, y: y};
	}

	public adjustAngle(ship: Ship, dt: number, angleSpeed: number, x?: number, y?: number): void {
		if (!ship.alive) {
			return;
		}
		let pos: {x: number, y: number};
		if (x===undefined || y===undefined) {
			pos = this.getHeroPos();
		} else {
			pos = {x: x, y: y};
		}
		ship.adjustAngle(dt, angleSpeed, pos.x, pos.y);
	}

	public createBoss1(): MotherShip {
		let boss = new MotherShip("TwoGunBOSSBody_png", 0.5);
        this.world.addShip(boss);
        boss.rotation = 180;
        boss.x = this.world.width * 0.5;
        boss.y = -boss.height;
        boss.force.force = tutils.EnemyForce;

        let gunShipL = new MotherGunShip("TwoGunBOSSGun_png", 0.5);
        boss.addGunShip(gunShipL, -110, 20);
        gunShipL.rotation = 180;
        let gunL = Gun.createGun(Gun, RedWaveBullet);
        gunShipL.addGun(gunL);
        
        let gunShipR = new MotherGunShip("TwoGunBOSSGun_png", 0.5);
        boss.addGunShip(gunShipR, 110, 20);
        gunShipR.rotation = 180;
        let gunR = Gun.createGun(ShotGun, RedWaveBullet);
		gunR.bulletAngleDelta = 10;
        gunR.fireCooldown.baseValue = 1000;
        gunShipR.addGun(gunR);

		boss.resetHp(2000);
        gunShipL.resetHp(500);
		gunShipR.resetHp(100);

		let moveMotherShip = (ship: MotherShip)=>{
			let act = new tutils.RepeatForever(new tutils.Sequence(
				new tutils.MoveTo(2000, this.world.width*0.4, ship.y),
				new tutils.MoveTo(4000, this.world.width*0.6, ship.y),
				new tutils.MoveTo(2000, this.world.width*0.5, ship.y)
			));
			ship.runAction(act);
		}
		let rotateGunShip = (gunShip: MotherGunShip)=>{
			let act = new tutils.RepeatForever(new tutils.Sequence(
				new tutils.To(1000, {rotation: tutils.getRotateAngle(180, +45)}),
				new tutils.To(2000, {rotation: tutils.getRotateAngle(180+45, -90)}),
				new tutils.To(2000, {rotation: tutils.getRotateAngle(180+45-90, +45)})
			));
			gunShip.runAction(act);
		}
		let act = new tutils.Sequence(
			new tutils.MoveTo(5000, boss.x, boss.height*0.5+100),
			new tutils.DelayTime(1000),
			new tutils.CallFunc(()=>{
				moveMotherShip(boss);
				rotateGunShip(gunShipL);
				rotateGunShip(gunShipR);
				gunL.autoFire = true;
				gunR.autoFire = true;
			}, this)
		);
		boss.runAction(act);

		return boss;
	}

	public createBoss2(): MotherShip {
		let w = this.world.width;
        let h = this.world.height;

		let boss = new MotherShip("BossShip1_png", 2.0);
        this.world.addShip(boss);
        boss.rotation = 180;
        boss.x = this.world.width * 0.5;
        boss.y = -boss.height;
        boss.force.force = tutils.EnemyForce;

		let gunShip = new MotherGunShip("GunShip2_png", 2.0);
        boss.addGunShip(gunShip, 0, 100);
        gunShip.rotation = 180;
        let gun = Gun.createGun(ShotGun, RedStarBullet);
		gun.bulletAngleDelta = 10;
		gunShip.addGun(gun, true);
		gun.bulletLeft = 0;
		gun.autoFire = true;
		
		boss.speed.baseValue = 10;
		boss.resetHp(4000);
		gunShip.resetHp(2000);
		gun.fireCooldown.baseValue = 100;
		gun.bulletSpeed.baseValue = 40;
		let angleSpeed = 20/1000;
		let bulletLeft = 20;

		let smgr = new tutils.StateManager();
        let moveToRight = new tutils.CustomState();
		let moveToLeft = new tutils.CustomState();
		let moveToBottom = new tutils.CustomState();
        let ajustAngle = new tutils.CustomState();
        let fire = new tutils.CustomState();

		moveToRight.setListener(()=>{
            boss.moveTo(w-boss.width*0.5-20, boss.height*0.5+70, boss.speed.value, true, null, false, ()=>{
                smgr.change(ajustAngle, moveToLeft);
            }, this);
        }, (dt: number)=>{
			this.adjustAngle(gunShip, dt, angleSpeed);
        }, this, 100);

        moveToLeft.setListener(()=>{
            boss.moveTo(boss.width*0.5+20, boss.height*0.5+70, boss.speed.value, true, null, false, ()=>{
                smgr.change(ajustAngle, moveToRight);
            }, this);
        }, (dt: number)=>{
			this.adjustAngle(gunShip, dt, angleSpeed);
        }, this, 100);

        ajustAngle.setListener(()=>{
			gunShip.mainGun.bulletLeft = bulletLeft;
        }, (dt: number)=>{
			this.adjustAngle(gunShip, dt, angleSpeed);
            if (gunShip.mainGun.bulletLeft == 0) {
                smgr.change(ajustAngle.args[0]);
            }
        }, this, 100);

		moveToBottom.setListener(()=>{
			boss.moveTo(boss.x, h+boss.height+100, boss.speed.value*0.5, true, null, false, ()=>{
				boss.damaged(boss.hp, null, null);
			})
		}, null, this);

        smgr.change(moveToLeft);

		return boss;
	}

	public createBoss3(): MotherShip {
		let w = this.world.width;
        let h = this.world.height;

		let boss = new MotherShip("TwoGunBOSSBody_png", 0.5);
        this.world.addShip(boss);
        boss.rotation = 180;
        boss.x = this.world.width * 0.5;
        boss.y = -boss.height;
        boss.force.force = tutils.EnemyForce;

		let gunShip = new MotherGunShip("TwoGunBOSSGun_png", 0.5);
        boss.addGunShip(gunShip, 0, 100);
        gunShip.rotation = 180;
        let gun = Gun.createGun(Gun, ShakeWave2Bullet);
		gunShip.addGun(gun, true);
		gun.bulletLeft = 0;
		gun.autoFire = true;

		let gunShipL = new MotherGunShip("TwoGunBOSSGun_png", 0.5);
        boss.addGunShip(gunShipL, -110, 20);
        gunShipL.rotation = 180;
        let gunL = Gun.createGun(Gun, RedEllipseBullet);
		gunShipL.addGun(gunL, true);
		gunL.bulletLeft = 0;
		gunL.autoFire = true;

		let gunShipR = new MotherGunShip("TwoGunBOSSGun_png", 0.5);
        boss.addGunShip(gunShipR, 110, 20);
        gunShipR.rotation = 180;
        let gunR = Gun.createGun(Gun, RedEllipseBullet);
		gunShipR.addGun(gunR, true);
		gunR.bulletLeft = 0;
		gunR.autoFire = true;
		
		boss.speed.baseValue = 10;
		boss.resetHp(6000);
		gunShip.resetHp(2000);
		gunShipL.resetHp(1800);
		gunShipR.resetHp(1600);
		gun.bulletSpeed.baseValue = 150;
		gunL.bulletSpeed.baseValue = 100;
		gunR.bulletSpeed.baseValue = 100;
		gun.fireCooldown.baseValue = 50;
		gunL.fireCooldown.baseValue = 80;
		gunR.fireCooldown.baseValue = 80;
		let gunReloadCDLR = 500;
		let angleSpeed = 50/1000;
		let angleSpeedLR = 40/1000;
		let bulletReload = 20;
		let gunReloadLR = 3;

		let smgr = new tutils.StateManager();
		let moveTo = new tutils.CustomState();
		let moveToBottom = new tutils.CustomState();
		let adjustAngle = new tutils.CustomState();
		let wait = new tutils.CustomState();
		let fire = new tutils.CustomState();
		let tick = 0;
		boss.ai = smgr;

		moveTo.setListener((pos: {x: number, y: number})=>{
			boss.moveTo(pos.x, pos.y, boss.speed.value, true, null, false, ()=>{
				if (pos.x == w*0.7) {
					smgr.change(adjustAngle, {x: w*0.3, y: boss.height*0.5+70}); 
				} else {
					smgr.change(adjustAngle, {x: w*0.7, y: boss.height*0.5+70});
				}
			}, this)
			tick = 0;
		}, (dt: number)=>{
			if (!gunShip.alive && !gunShipL.alive && !gunShipR.alive) {
				smgr.change(moveToBottom);
				return;
			}
			tick += dt;
			this.adjustAngle(gunShip, dt, angleSpeed, gunShip.x, gunShip.y+100);
			if (tick > gunReloadCDLR) {
				tick -= gunReloadCDLR;
				gunL.bulletLeft = gunReloadLR;
				gunR.bulletLeft = gunReloadLR;
			} else if (gunL.bulletLeft == 0 || gunR.bulletLeft == 0) {
				if (gunL.bulletLeft == 0) {
					this.adjustAngle(gunShipL, dt, angleSpeedLR);
				}
				if (gunR.bulletLeft == 0) {
					this.adjustAngle(gunShipR, dt, angleSpeedLR);
				}
			}
		}, this, 0);

		adjustAngle.setListener(()=>{
			tick = 0;
		}, (dt: number)=>{
			if (!gunShip.alive && !gunShipL.alive && !gunShipR.alive) {
				smgr.change(moveToBottom);
				return;
			}
			tick += dt;
			if (tick < 5000) {
				this.adjustAngle(gunShip, dt, angleSpeed);
			} else {
				smgr.change(wait, 100, fire, adjustAngle.args[0])
			}
		}, this, 0);

		wait.setListener(()=>{
			tick = 0;
		}, (dt: number)=>{
			if (!gunShip.alive && !gunShipL.alive && !gunShipR.alive) {
				smgr.change(moveToBottom);
				return;
			}
			tick += dt;
			if (tick >= wait.args[0]) {
				if (wait.args[1] === fire) {
					smgr.change(fire, wait.args[2]);
				} else {
					smgr.change(moveTo, wait.args[1]);
				}
			}
		}, this, 0);

		fire.setListener(()=>{
			tick = 0;
			gun.bulletLeft = bulletReload;
		}, (dt: number)=>{
			if (gun.bulletLeft == 0 || !gunShip.alive) {
				smgr.change(wait, 1000, fire.args[0]);
			}
		}, this, 0);

		moveToBottom.setListener(()=>{
			boss.moveTo(boss.x, h-boss.height*0.5, boss.speed.value*0.5, true, null, false, ()=>{
				boss.damaged(boss.hp, null, null);
			})
		}, null, this);
		smgr.change(moveTo, {x: w*0.3, y: boss.height*0.5+70});

		return boss;
	}

	public createEnemyShips(num: number, hp: number, model: string, modelScale: number=0.4): EnemyShip[] {
		let ships: EnemyShip[] = [];
		for (let i=0; i<num; i++) {
			let ship = this.createEnemyShip(model, modelScale);
			ship.resetHp(hp);
			ships.push(ship);
		}
		return ships;
	}

	public putEnemyShipsIntoGroup(...shipsArrs: EnemyShip[][]): EnemyGroup {
		let group = new EnemyGroup();
		for (let i=0, len=shipsArrs.length; i<len; i++) {
			let ships = shipsArrs[i];
			group.incMember(ships.length);
			for (let j=0, len=ships.length; j<len; j++) {
				let ship = ships[j];
				ship.setGroup(group);
			}
		}
		return group;
	}

	public addRushMeteoroid(delay: number, hp: number, x: number, speedFactor: number=1): StraightRush {
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips(1, hp, "Meteoroid_png", 0.25);
		rush = new StraightRush(delay/speedFactor, ships, 300/speedFactor, 4000/speedFactor, {x: x, y: 0}, {x: x, y: 100});
		this.addRush(rush);
		return rush as StraightRush;
	}

	public addRushes1(delay: number, hp: number, speedFactor: number=1): void {
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips(5, hp, "RedEnemyShip_png");
		this.putEnemyShipsIntoGroup(ships);
		rush = new StraightRush(delay/speedFactor, ships, 300/speedFactor, 4000/speedFactor, {x: 50, y: 0}, {x: 50, y: 100});
		this.addRush(rush);
	}

	public addRushes2(delay: number, hp: number, speedFactor: number=1): void {
		// 先后左右两列
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips(5, hp, "RedEnemyShip_png");
		this.putEnemyShipsIntoGroup(ships);
		rush = new StraightRush(delay/speedFactor, ships, 200/speedFactor, 3000/speedFactor, {x: 30, y: 0}, {x: 30, y: 100});
		this.addRush(rush);

		ships = this.createEnemyShips(5, hp, "RedEnemyShip_png");
		this.putEnemyShipsIntoGroup(ships);
		rush = new StraightRush(2000/speedFactor, ships, 200/speedFactor, 3000/speedFactor, {x: 70, y: 0}, {x: 70, y: 100});
		this.addRush(rush);
	}

	public addRushes3(delay: number, hp: number, speedFactor: number=1): void {
		// V字形
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new GradientRush(delay/speedFactor, ships, 300/speedFactor, 5000/speedFactor, {x: 40, y: 0}, {x: 10, y: 0});
		this.addRush(rush);
		let ships2 = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new GradientRush(0/speedFactor, ships2, 300/speedFactor, 5000/speedFactor, {x: 60, y: 0}, {x: 90, y: 0});
		this.addRush(rush);
		this.putEnemyShipsIntoGroup(ships, ships2);
	}

	public addRushes4(delay: number, hp: number, speedFactor: number=1): void {
		// 交叉曲线
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips(5, hp, "RedEnemyShip_png");
		rush = new BezierRush(delay/speedFactor, ships, 200/speedFactor, 2000/speedFactor, {x: 30, y: 0}, {x: 100, y: 50}, {x: 30, y: 50});
        this.addRush(rush);
		let ships2 = this.createEnemyShips(5, hp, "RedEnemyShip_png");
        rush = new BezierRush(0/speedFactor, ships2, 200/speedFactor, 2000/speedFactor, {x: 70, y: 0}, {x: 0, y: 50}, {x: 70, y: 50});
        this.addRush(rush);
		this.putEnemyShipsIntoGroup(ships, ships2);
	}

	public addRushes5(delay: number, hp: number, speedFactor: number=1): void {
		// 交叉正弦
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips(5, hp, "RedEnemyShip_png");
		rush = new SineRush(delay/speedFactor, ships, 200/speedFactor, 3000/speedFactor, {x: 50, y: 0}, {x: 50, y: 100}, 100, 20);
        this.addRush(rush);
		let ships2 = this.createEnemyShips(5, hp, "RedEnemyShip_png");
        rush = new SineRush(0/speedFactor, ships2, 200/speedFactor, 3000/speedFactor, {x: 50, y: 0}, {x: 50, y: 100}, 100, -20);
        this.addRush(rush);
		this.putEnemyShipsIntoGroup(ships, ships2);
	}

	public addRushes6(delay: number, hp: number, speedFactor: number=1): void {
		// BOSS前列兵
		let ships: EnemyShip[];
		let rush: Rush;
		ships = this.createEnemyShips(5, hp, "RedEnemyShip_png");
		rush = new BezierRush(delay/speedFactor, ships, 400/speedFactor, 4000/speedFactor, {x: 20, y: 0}, {x: 100, y: 70}, {x: 20, y: 70});
		this.addRush(rush);
		let ships2 = this.createEnemyShips(5, hp, "RedEnemyShip_png");
		rush = new BezierRush(3000/speedFactor, ships2, 400/speedFactor, 4000/speedFactor, {x: 80, y: 0}, {x: 0, y: 70}, {x: 80, y: 70});
		this.addRush(rush);
		this.putEnemyShipsIntoGroup(ships, ships2);

		ships = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new StraightRush(3000/speedFactor, ships, 400/speedFactor, 4000/speedFactor, {x: 20, y: 0}, {x: 20, y: 100});
		this.addRush(rush);
		ships2 = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new StraightRush(400*3/speedFactor, ships2, 400/speedFactor, 4000/speedFactor, {x: 40, y: 0}, {x: 40, y: 100});
		this.addRush(rush);
		let ships3 = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new StraightRush(400*3/speedFactor, ships3, 400/speedFactor, 4000/speedFactor, {x: 60, y: 0}, {x: 60, y: 100});
		this.addRush(rush);
		let ships4 = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new StraightRush(400*3/speedFactor, ships4, 400/speedFactor, 4000/speedFactor, {x: 80, y: 0}, {x: 80, y: 100});
		this.addRush(rush);
		let ships5 = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new StraightRush(400*3/speedFactor, ships5, 400/speedFactor, 4000/speedFactor, {x: 60, y: 0}, {x: 60, y: 100});
		this.addRush(rush);
		let ships6 = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new StraightRush(400*3/speedFactor, ships6, 400/speedFactor, 4000/speedFactor, {x: 40, y: 0}, {x: 40, y: 100});
		this.addRush(rush);
		let ships7 = this.createEnemyShips(3, hp, "RedEnemyShip_png");
		rush = new StraightRush(400*3/speedFactor, ships7, 400/speedFactor, 4000/speedFactor, {x: 20, y: 0}, {x: 20, y: 100});
		this.addRush(rush);
		this.putEnemyShipsIntoGroup(ships, ships2, ships3, ships4, ships5, ships6, ships7);
	}

	public addRushes7(delay: number, hp: number, num: number, speedFactor: number=1): void {
		// N个散弹兵
		let ships: EnemyShip[];
		let rush: Rush;
		
		ships = this.createEnemyShips(num, hp, "PurpleEnemyShip_png");
		rush = new CustomRush(delay/speedFactor, ships, 0, null, (index: number, ship: Ship):void=>{
			ship.x = (index + 1) * ship.world.width / (num + 1);
			ship.y = -ship.height;
			ship.speed.baseValue = 20;
			ship.rotation = 180;

			let gun = Gun.createGun(ShotGun, RedEllipseBullet);
			gun.bulletAngleDelta = 10;
			gun.bulletNum = 3;
			gun.bulletPower.baseValue = 1;
			gun.bulletSpeed.baseValue = 50;
			gun.fireCooldown.baseValue = 3000/speedFactor;
			ship.addGun(gun, true);

			let ai = new tutils.StateManager();
			ship.ai = ai;
			let arrive = new MoveState(ai, ship, ship.x, 100, ship.speed.value*speedFactor, true, egret.Ease.getPowOut(2));
			let beginFire = new FireState(ai, ship, true);
			let wait = new WaitState(ai, ship, 10000/speedFactor);
			let endFire = new FireState(ai, ship, false);
			let leave = new MoveState(ai, ship, ship.x, ship.world.height+ship.height, Math.min(100, ship.speed.value*speedFactor), true, egret.Ease.getPowIn(2));
			let dead = new DeadState(ai, ship);
			arrive.setNext(beginFire).setNext(wait).setNext(endFire).setNext(leave).setNext(dead);
			ai.change(arrive);
		}, this);
		this.addRush(rush);
	}

	public addRushes8(delay: number, hp: number, num: number, speedFactor: number=1): void {
		// N个排弹兵
		let ships: EnemyShip[];
		let rush: Rush;
		
		ships = this.createEnemyShips(num, hp, "PurpleEnemyShip2_png");
		rush = new CustomRush(delay/speedFactor, ships, 0, null, (index: number, ship: Ship):void=>{
			ship.x = (index + 1) * ship.world.width / (num + 1);
			ship.y = -ship.height;
			ship.speed.baseValue = 20;
			ship.rotation = 180;

			let gun = Gun.createGun(RowGun, RedEllipseBullet);
			gun.bulletXDelta = 50;
			gun.bulletNum = 4;
			gun.bulletPower.baseValue = 1;
			gun.bulletSpeed.baseValue = 50;
			gun.fireCooldown.baseValue = 3000/speedFactor;
			ship.addGun(gun, true);

			let ai = new tutils.StateManager();
			ship.ai = ai;
			let arrive = new MoveState(ai, ship, ship.x, 100, ship.speed.value*speedFactor, false, egret.Ease.getPowOut(2));
			let beginFire = new FireState(ai, ship, true);
			let wait = new WaitState(ai, ship, 10000/speedFactor);
			let endFire = new FireState(ai, ship, false);
			let leave = new MoveState(ai, ship, ship.x, ship.world.height+ship.height, Math.min(100, ship.speed.value*speedFactor), false, egret.Ease.getPowIn(2));
			let dead = new DeadState(ai, ship);
			arrive.setNext(beginFire).setNext(wait).setNext(endFire).setNext(leave).setNext(dead);
			ai.change(arrive);
		}, this);
		this.addRush(rush);
	}

	public addRushes9(delay: number, hp: number, num: number, speedFactor: number=1): void {
		// 瞄准的排炮兵
	}

	public addRushes10(delay: number, hp: number, speedFactor: number=1): void {
		// 跟随的敌兵
		let num = 1;
		let ships = this.createEnemyShips(1, hp, "GreenEnemyShip_png", 0.8);
		let rush = new CustomRush(delay/speedFactor, ships, 0, null, (index: number, ship: Ship):void=>{
			ship.x = (index + 1) * ship.world.width / (num + 1);
			ship.y = -ship.height;
			ship.speed.baseValue = 5 * speedFactor;
			ship.rotation = 180;

			let ai = new tutils.StateManager();
			ship.ai = ai;
			let arrive = new MoveState(ai, ship, ship.x, 100, ship.speed.value*5*speedFactor, false, egret.Ease.getPowOut(2));
			let follow = new tutils.CustomState();

			let shipId = ship.id;
			let targetId = "";
			let target: Ship = null;
			let xspeedDelta = 30/1000 * speedFactor;
			let xspeed = 0;
			follow.setListener(():void=>{
				ship.moveTo(ship.x, ship.world.height+ship.height, ship.speed.value, true, null, true, ():void=>{
					ship.status = UnitStatus.Dead;
				}, this);
			}, (dt: number):void=>{
				if (!ship.alive || ship.id!=shipId) {
					return;
				}
				if ((target==null || !target.alive || target.id!=targetId) && ship.alive) {
					targetId = "";
					target = this.world.findNearestAliveEnemyShip(ship.gameObject.x, ship.gameObject.y, ship.force);
					if (target != null) {
						targetId = target.id;
					}
				}
				if (target!=null && ship.gameObject.y<target.y) {
					let dt = target.x - ship.x;
					if (dt > 0) {
						xspeed += dt*xspeed<0 ? xspeedDelta*2 : xspeedDelta;
					} else if (dt < 0) {
						xspeed -= dt*xspeed<0 ? xspeedDelta*2 : xspeedDelta;
					}
				}
				ship.x += xspeed;
			}, this, 0);
			arrive.setNext(follow);
			ai.change(arrive);
		}, this);
		this.addRush(rush);
	}

	public addRushes11(delay: number, hp: number, num: number, speedFactor: number=1): void {
		// 随即正弦
		let es = this.createEnemyShips(num, hp, "RedEnemyShip_png");
		this.putEnemyShipsIntoGroup(es);
		
		let dur = Math.random() * 3000 + 3000;
		let interval = Math.random() * 200 + 300;
		let a = Math.random() * 150 + 50
		let x = (Math.random() * (this.world.width - a * 2) + a) * 100 / this.world.width;
		let wavelen = Math.random() * 30 + 50;
		let sign = Math.floor(Math.random()*2) * 2 - 1;
		a *= 100 / this.world.width * sign;
		let rush = new SineRush(delay/speedFactor, es, interval/speedFactor, dur/speedFactor, {x: x, y: 0}, {x: x, y: 100}, wavelen, a);
		this.addRush(rush);
	}
}
