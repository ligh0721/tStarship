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
}

class Rush {
	delay: number;
	protected ships: Ship[];
	protected interval: number;
	protected duration: number;
	protected fixedRotation: boolean = true;

	protected callback: Function;
	protected callbackThisObj: any;

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, fixedRotaion?: boolean, callback?: Function, callbackThisObj?: any) {
		this.delay = delay;
		this.ships = ships;
		this.interval = interval;
		this.duration = duration;
		this.fixedRotation = fixedRotaion===undefined ? false : fixedRotaion;
		this.callback = callback;
		this.callbackThisObj = callbackThisObj;
	}

	public start(world: World): void {
		if (this.ships && this.ships.length > 0) {
			if ((this.ships.length>2) && (this.ships[0] instanceof EnemyShip)) {
				let group = new EnemyGroup();
				group.incMember(this.ships.length);
				this.ships.forEach((ship, i, arr)=>{
					(<EnemyShip>ship).setGroup(group);
				});
			}
			
			let t = new tutils.Timer();
			t.setOnTimerListener((dt: number):void=>{
				let ship = this.ships.pop();
				world.addShip(ship);
				this.rushOne(ship);
			}, this);
			t.start(this.interval, true, this.ships.length);
		}

		if (this.callback) {
			this.callback.call(this.callbackThisObj);
		}
	}

	// override
	protected rushOne(ship: Ship): void {
		ship.status = UnitStatus.Dead;
	}
}

class StraightRush extends Rush {
	protected from: {x: number, y: number};
	protected to: {x: number, y: number};

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, from: {x: number, y: number}, to: {x: number, y: number}) {
		super(delay, ships, interval, duration);
		this.from = from;
		this.to = to;
	}

	// override
	protected rushOne(ship: Ship): void {
		ship.x = this.from.x;
		ship.y = this.from.y;
		let dis = ship.getDistance(this.to.x, this.to.y);
		let speed = dis / this.duration * tutils.SpeedFactor;
		ship.moveTo(this.to.x, this.to.y, speed, this.fixedRotation, null, ():void=>{
			ship.status = UnitStatus.Dead;
		}, this);
	}
}

class BezierRush extends Rush {
	protected from: {x: number, y: number};
	protected to: {x: number, y: number};
	protected k: {x: number, y: number};

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, from: {x: number, y: number}, to: {x: number, y: number}, k: {x: number, y: number}) {
		super(delay, ships, interval, duration);
		this.from = from;
		this.to = to;
		this.k = k;
	}

	// override
	protected rushOne(ship: Ship): void {
		let bezier = new BezierCurve(ship, this.from, this.k, this.to, this.fixedRotation);
		bezier.startMove(this.duration, ()=>{
			ship.status = UnitStatus.Dead;
		});
	}
}

class SineRush extends Rush {
	protected from: {x: number, y: number};
	protected to: {x: number, y: number};
	protected period: number;
	protected amplitude: number;

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, from: {x: number, y: number}, to: {x: number, y: number}, period: number, amplitude: number) {
		super(delay, ships, interval, duration, true);
		this.from = from;
		this.to = to;
		this.period = period;
		this.amplitude = amplitude;
	}

	// override
	protected rushOne(ship: Ship): void {
		let sin = new SineCurve(ship, this.from, this.to, this.period, this.amplitude);
		sin.startMove(this.duration, ()=>{
			ship.status = UnitStatus.Dead;
		});
	}
}

class PathRush extends Rush {
	protected pts: {x: number, y: number}[];

	public constructor(delay: number, ships: Ship[], interval: number, duration: number, pts: {x: number, y: number}[]) {
		super(delay, ships, interval, duration);
		this.pts = pts;
	}
}

class CallbackRush extends Rush {
	public constructor(delay: number, callback: Function, callbackThisObj?: any) {
		super(delay, null, 0, 0, true, callback, callbackThisObj);
	}
}