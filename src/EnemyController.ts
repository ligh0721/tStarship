class EnemyController {
	readonly world: World;
	private rushes: Rush[] = [];
	private tick: number = 0;
	private timer: tutils.Timer = new tutils.Timer();
	private hero: Ship = null;

	public constructor(world: World) {
		this.world = world;
	}

	public createEnemyShip(model: string): EnemyShip {
		let enemyShip = new EnemyShip(model, 0.3);
		enemyShip.force.force = tutils.EnemyForce;
		return enemyShip;
	}

	public clearRushes() {
		this.rushes.length = 0;
	}

	public addRush(rush: Rush) {
		this.rushes.push(rush);
	}

	public startRush(frameRate: number): void {
		if (!this.timer.hasOnTimerListener()) {
			this.timer.setOnTimerListener(this.onRushStep, this);
		}
		this.tick = 0;
		this.timer.start(1000/frameRate, true, 0);
	}

	public stopRush(): void {
		this.timer.stop();
	}

	private onRushStep(dt: number): void {
		if(this.rushes.length <= 0) {
			this.timer.stop();
			this.tick = 0;
			return;
		}

		let topRush = this.rushes[0];
		this.tick += dt;

		if(this.tick >= topRush.delay) {
			topRush.start(this.world);
			this.tick = 0;
			this.rushes.splice(0, 1);
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
		let orgAngle = ship.angle;
		let angle = ship.getAngle(pos.x, pos.y);
		let dtAngle = dt * angleSpeed;
		if (angle > orgAngle) {
			if (orgAngle + dtAngle > angle) {
				ship.angle = angle;
			} else {
				ship.angle += dtAngle;
			}
		} else if (angle < orgAngle) {
			if (orgAngle - dtAngle < angle) {
				ship.angle = angle;
			} else {
				ship.angle -= dtAngle;
			}
		}
	}

	public createBoss1(): MotherShip {
		let ship = new MotherShip("BossShip1_png", 1.5);
        this.world.addShip(ship);
        ship.angle = 180;
        ship.x = this.world.width * 0.5;
        ship.y = -ship.height;
        ship.force.force = tutils.EnemyForce;
        ship.resetHp(500);

        let gunShip = new MotherGunShip("GunShip2_png", 1.5);
        ship.addGunShip(gunShip, -100, 100);
        gunShip.resetHp(300);
        gunShip.angle = 180;
        let gun = Gun.createGun(Gun, RedEllipseBullet);
        gunShip.addGun(gun);
        
        let gunShip2 = new MotherGunShip("GunShip2_png", 1.5);
        ship.addGunShip(gunShip2, 100, 100);
        gunShip2.resetHp(250);
        gunShip2.angle = 180;
        let gun2 = Gun.createGun(ShotGun, RedEllipseBullet);
        gun2.fireCooldown.baseValue = 1000;
        gunShip2.addGun(gun2);

        let moveMotherShip = (ship: MotherShip)=>{
            let tw = egret.Tween.get(ship);
            tw.to({x: this.world.width * 0.4}, 2000);
            tw.to({x: this.world.width * 0.6}, 4000);
            tw.to({x: this.world.width * 0.5}, 2000);
            tw.call(moveMotherShip, this, [ship]);
        };

        let rotateGunShip = (gunShip: MotherGunShip)=>{
            let tw = egret.Tween.get(gunShip);
            tw.set({angle: 180});
            tw.to({angle: 180+45}, 1000);
            tw.to({angle: 180-45}, 2000);
            tw.to({angle: 180}, 2000);
            tw.call(rotateGunShip, this, [gunShip]);
        };

        let tw = egret.Tween.get(ship);
        tw.to({y: ship.height*0.5+100}, 5000)
        tw.wait(1000);
        tw.call(()=>{
            moveMotherShip(ship);
            rotateGunShip(gunShip);
            rotateGunShip(gunShip2);
            gun.autoFire = true;
            gun2.autoFire = true;
        }, this);
		return ship;
	}

	public createBoss2(): MotherShip {
		let w = this.world.width;
        let h = this.world.height;

		let boss = new MotherShip("BossShip1_png", 2.0);
        this.world.addShip(boss);
        boss.angle = 180;
        boss.x = this.world.width * 0.5;
        boss.y = -boss.height;
        boss.force.force = tutils.EnemyForce;

		let gunShip = new MotherGunShip("GunShip2_png", 2.0);
        boss.addGunShip(gunShip, 0, 100);
        gunShip.angle = 180;
        let gun = Gun.createGun(ShotGun, RedEllipseBullet);
		gunShip.addGun(gun, true);
		gun.bulletLeft = 0;
		gun.autoFire = true;
		
		boss.speed.baseValue = 10;
		boss.resetHp(1000);
		gunShip.resetHp(500);
		gun.fireCooldown.baseValue = 100;
		gun.bulletSpeed.baseValue = 40;
		let angleSpeed = 20/1000;
		let bulletLeft = 20;

		let smgr = new tutils.StateManager();
        let moveToRight = new tutils.State();
		let moveToLeft = new tutils.State();
		let moveToBottom = new tutils.State();
        let ajustAngle = new tutils.State();
        let fire = new tutils.State();

		moveToRight.setListener(()=>{
            boss.moveTo(w-boss.width*0.5-20, boss.height*0.5+70, boss.speed.value, true, null, ()=>{
                smgr.change(ajustAngle, moveToLeft);
            }, this);
        }, (dt: number)=>{
			this.adjustAngle(gunShip, dt, angleSpeed);
        }, this);

        moveToLeft.setListener(()=>{
            boss.moveTo(boss.width*0.5+20, boss.height*0.5+70, boss.speed.value, true, null, ()=>{
                smgr.change(ajustAngle, moveToRight);
            }, this);
        }, (dt: number)=>{
			this.adjustAngle(gunShip, dt, angleSpeed);
        }, this);

        ajustAngle.setListener(()=>{
			gunShip.mainGun.bulletLeft = bulletLeft;
        }, (dt: number)=>{
			this.adjustAngle(gunShip, dt, angleSpeed);
            if (gunShip.mainGun.bulletLeft == 0) {
                smgr.change(ajustAngle.args[0]);
            }
        }, this);

		moveToBottom.setListener(()=>{
			boss.moveTo(boss.x, h+boss.height+100, boss.speed.value*0.5, true, null, ()=>{
				boss.damaged(boss.hp, null);
			})
		}, null, this);

        smgr.start(10, moveToLeft);

		return boss;
	}

	public createBoss3(): MotherShip {
		let w = this.world.width;
        let h = this.world.height;

		let boss = new MotherShip("BossShip1_png", 2.0);
        this.world.addShip(boss);
        boss.angle = 180;
        boss.x = this.world.width * 0.5;
        boss.y = -boss.height;
        boss.force.force = tutils.EnemyForce;

		let gunShip = new MotherGunShip("GunShip2_png", 2.0);
        boss.addGunShip(gunShip, 0, 100);
        gunShip.angle = 180;
        let gun = Gun.createGun(Gun, ShakeWave2Bullet);
		gunShip.addGun(gun, true);
		gun.bulletLeft = 0;
		gun.autoFire = true;

		let gunShipL = new MotherGunShip("GunShip2_png", 2.0);
        boss.addGunShip(gunShipL, -80, 60);
        gunShipL.angle = 180;
        let gunL = Gun.createGun(Gun, RedEllipseBullet);
		gunShipL.addGun(gunL, true);
		gunL.bulletLeft = 0;
		gunL.autoFire = true;

		let gunShipR = new MotherGunShip("GunShip2_png", 2.0);
        boss.addGunShip(gunShipR, 80, 60);
        gunShipR.angle = 180;
        let gunR = Gun.createGun(Gun, RedEllipseBullet);
		gunShipR.addGun(gunR, true);
		gunR.bulletLeft = 0;
		gunR.autoFire = true;
		
		boss.speed.baseValue = 10;
		boss.resetHp(4000);
		gunShip.resetHp(1600);
		gunShipL.resetHp(1800);
		gunShipR.resetHp(1600);
		gun.bulletSpeed.baseValue = 150;
		gunL.bulletSpeed.baseValue = 100;
		gunR.bulletSpeed.baseValue = 100;
		gun.fireCooldown.baseValue = 20;
		gunL.fireCooldown.baseValue = 30;
		gunR.fireCooldown.baseValue = 30;
		let gunReloadCDLR = 500;
		let angleSpeed = 50/1000;
		let angleSpeedLR = 40/1000;
		let bulletReload = 20;
		let gunReloadLR = 3;

		let smgr = new tutils.StateManager();
		let moveTo = new tutils.State();
		let moveToBottom = new tutils.State();
		let adjustAngle = new tutils.State();
		let wait = new tutils.State();
		let fire = new tutils.State();
		let tick = 0;
		boss.ai = smgr;

		moveTo.setListener((pos: {x: number, y: number})=>{
			boss.moveTo(pos.x, pos.y, boss.speed.value, true, null, ()=>{
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
			} else if (gunL.bulletLeft == 0 && gunR.bulletLeft == 0) {
				if (gunL.bulletLeft == 0) {
					this.adjustAngle(gunShipL, dt, angleSpeedLR);
				}
				if (gunR.bulletLeft == 0) {
					this.adjustAngle(gunShipR, dt, angleSpeedLR);
				}
			}
		}, this);

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
		}, this);

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
		}, this);

		fire.setListener(()=>{
			tick = 0;
			gun.bulletLeft = bulletReload;
		}, (dt: number)=>{
			if (gun.bulletLeft == 0 || !gunShip.alive) {
				smgr.change(wait, 1000, fire.args[0]);
			}
		}, this);

		moveToBottom.setListener(()=>{
			boss.moveTo(boss.x, h-boss.height*0.5, boss.speed.value*0.5, true, null, ()=>{
				boss.damaged(boss.hp, null);
			})
		}, null, this);
		smgr.start(60, moveTo, {x: w*0.3, y: boss.height*0.5+70});

		return boss;
	}

	public createEnemyShips(model: string, num: number, hp: number): EnemyShip[] {
		let ships: EnemyShip[] = [];
		for (let i=0; i<num; i++) {
			let ship = this.createEnemyShip("RedEnemyShip_png");
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

	public addRushes1(delay: number, hp: number, speedFactor: number=1): void {
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips("RedEnemyShip_png", 5, 5);
		this.putEnemyShipsIntoGroup(ships);
		rush = new StraightRush(delay, ships, 300/speedFactor, 4000/speedFactor, {x: 50, y: 0}, {x: 50, y: 100});
		this.addRush(rush);
	}

	public addRushes2(delay: number, hp: number, speedFactor: number=1): void {
		// 先后左右两列
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips("RedEnemyShip_png", 5, 5);
		this.putEnemyShipsIntoGroup(ships);
		rush = new StraightRush(delay, ships, 200/speedFactor, 3000/speedFactor, {x: 30, y: 0}, {x: 30, y: 100});
		this.addRush(rush);

		ships = this.createEnemyShips("RedEnemyShip_png", 5, 5);
		this.putEnemyShipsIntoGroup(ships);
		rush = new StraightRush(5000, ships, 200/speedFactor, 3000/speedFactor, {x: 70, y: 0}, {x: 70, y: 100});
		this.addRush(rush);
	}

	public addRushes3(delay: number, hp: number, speedFactor: number=1): void {
		// V字形
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips("RedEnemyShip_png", 3, 5);
		rush = new GradientRush(delay, ships, 300/speedFactor, 5000/speedFactor, {x: 40, y: 0}, {x: 10, y: 0});
		this.addRush(rush);
		let ships2 = this.createEnemyShips("RedEnemyShip_png", 3, 5);
		rush = new GradientRush(0, ships2, 300/speedFactor, 5000/speedFactor, {x: 60, y: 0}, {x: 90, y: 0});
		this.addRush(rush);
		this.putEnemyShipsIntoGroup(ships, ships2);
	}

	public addRushes4(delay: number, hp: number, speedFactor: number=1): void {
		// 交叉曲线
		let ships: EnemyShip[];
		let rush: Rush;

		ships = this.createEnemyShips("RedEnemyShip_png", 5, 5);
		rush = new BezierRush(delay, ships, 200/speedFactor, 2000/speedFactor, {x: 30, y: 0}, {x: 100, y: 50}, {x: 30, y: 50});
        this.addRush(rush);
		let ships2 = this.createEnemyShips("RedEnemyShip_png", 3, 5);
        rush = new BezierRush(0, ships2, 200/speedFactor, 2000/speedFactor, {x: 70, y: 0}, {x: 0, y: 50}, {x: 70, y: 50});
        this.addRush(rush);
		this.putEnemyShipsIntoGroup(ships, ships2);
	}
}
