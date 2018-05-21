class EnemyController {
	readonly world: World;
	private rushes: RushItem[] = [];
	private tick: number = 0;
	private timer: tutils.Timer = new tutils.Timer();;
	private hero: Ship = null;

	public constructor(world: World) {
		this.world = world;
	}

	public createEnemyShip(model: string): EnemyShip {
		let enemyShip = new EnemyShip(model, 0.3);

		enemyShip.speed.baseValue = 50;
		enemyShip.force.force = tutils.EnemyForce;

		return enemyShip;
	}

	public rushStraight(ships: EnemyShip[], startX: number, interval: number) {
		if (ships.length == 0) {
			return;
		}

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);
			ship.x = startX;
			let dis = this.world.height + ship.height;
			let dur = dis * tutils.SpeedFactor / ship.speed.value;
			let tw = egret.Tween.get(ship);
			tw.to({y: this.world.height+ship.height}, dur);
			tw.call(()=>{
				ship.status = UnitStatus.Dead;
			}, this);
		}, this);

		t.start(interval, true, ships.length);
	}

	public rushBezier(ships: EnemyShip[], point0: {x: number, y: number},  point1: {x: number, y: number},  point2: {x: number, y: number}, interval: number, duration: number, fixedRotation: boolean=false) {
		if (ships.length == 0) {
			return;
		}

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);
			let bezier = new BezierCurve(ship, point0, point1, point2, fixedRotation);
			bezier.startMove(duration, ()=>{
				ship.status = UnitStatus.Dead;
			});
		}, this);

		t.start(interval, true, ships.length);
	}

	public rushSin(ships: EnemyShip[], point0: {x: number, y: number},  point1: {x: number, y: number}, interval: number, duration: number, period: number, amplitude: number) {
		if (ships.length == 0) {
			return;
		}

		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number)=>{
			let ship = ships.pop();
			this.world.addShip(ship);
			let sin = new SinCurve(ship, point0, point1, period, amplitude);
			sin.startMove(duration, ()=>{
			ship.status = UnitStatus.Dead;
		});
		
		}, this);

		t.start(interval, true, ships.length);
	}

	public clearRushes() {
		this.rushes = [];
	}

	public addRush(rushItem: RushItem) {
		this.rushes.push(rushItem);
	}

	public startRush(frameRate: number) {
		if (!this.timer.hasOnTimerListener()) {
			this.timer.setOnTimerListener(this.rushStep, this);
		}
		this.timer.start(1000/frameRate, true, 0);
		this.tick = 0;
	}

	public rushStep(dt: number) {
		if(this.rushes.length <= 0) {
			this.timer.stop();
			this.tick = 0;
			return;
		}

		let topItem = this.rushes[0];
		this.tick += dt;

		if(this.tick >= topItem.delay) {
			this.rush(topItem);
			this.tick = 0;
			this.rushes.splice(0, 1);
		}
	}

	private rush(rushItem: RushItem) {
		switch(rushItem.type) {
		case "bezier":
			if(rushItem.path.length < 3) {
				break;
			}
			this.rushBezier(rushItem.ships, rushItem.path[0], rushItem.path[1], rushItem.path[2], rushItem.interval, rushItem.duration, false);
			break;

		case "straight":
			if(rushItem.path.length < 1) {
				break;
			}
			this.rushStraight(rushItem.ships, (rushItem.path[0]).x, rushItem.interval);
			break;

		case "sin":
			if(rushItem.path.length < 2) {
				break;
			}
			this.rushSin(rushItem.ships, rushItem.path[0], rushItem.path[1], rushItem.interval, rushItem.duration, rushItem.period, rushItem.amplitude);
			break;
		}

		if (rushItem.callback != null) {
			rushItem.callback.call(rushItem.callbackThisObject);
		}
	}

	public getHero(): Ship {
		if (this.hero == null || !this.hero.isAlive()) {
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
		if (!ship.isAlive()) {
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
		
		boss.speed.baseValue = 30;
		boss.resetHp(1000);
		gunShip.resetHp(500);
		gun.fireCooldown.baseValue = 20;
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
		boss.resetHp(1000);
		gunShip.resetHp(500);
		gunShipL.resetHp(500);
		gunShipR.resetHp(500);
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
			if (!gunShip.isAlive() && !gunShipL.isAlive() && !gunShipR.isAlive()) {
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
			if (!gunShip.isAlive() && !gunShipL.isAlive() && !gunShipR.isAlive()) {
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
			if (!gunShip.isAlive() && !gunShipL.isAlive() && !gunShipR.isAlive()) {
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
			if (gun.bulletLeft == 0 || !gunShip.isAlive()) {
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
}

class RushItem {
	readonly interval: number=200;
	readonly ships: EnemyShip[];
	readonly delay: number=2000;
	readonly path: any[];
	readonly duration: number=2000;
	readonly drop: any;
	readonly type: string;
	readonly period: number;
	readonly amplitude: number = 100;
	readonly callback: Function;
	readonly callbackThisObject: any;

	public constructor(ships: EnemyShip[], type: string, delay: number, duration: number, interval: number, path:any[], drop:any, period?: number, amplitude?: number, callback?: Function, thisObject?: any) {
		this.ships = ships;
		this.type = type;
		this.duration = duration;
		this.interval = interval;
		this.delay = delay;
		this.path = path;
		this.drop = drop;
		this.period = period==undefined ? 1000 : period;
		this.amplitude = amplitude==undefined ? 100 : amplitude;
		this.callback = callback==undefined ? null : callback;
		this.callbackThisObject = thisObject==undefined ? null : thisObject;
	}
}