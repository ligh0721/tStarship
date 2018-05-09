class EnemyController {
	readonly world: World;
	private rushes: RushItem[] = [];
	private tick: number = 0;
	private timer: tutils.Timer = null;

	public constructor(world: World) {
		this.world = world;
	}

	public createEnemyShip(width: number, height: number, type: string): EnemyShip {
		let enemyShip = new EnemyShip(width, height, type);

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
		if (this.timer == null) {
			this.timer = new tutils.Timer();
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

	public createBoss1():MotherShip {
		let w = this.world.width;
        let h = this.world.height;

		let ship = new MotherShip(400, 200);
        this.world.addShip(ship);
        ship.angle = 180;
		ship.speed.baseValue = 20;
        ship.x = this.world.width * 0.5;
        ship.y = -ship.height;
        ship.force.force = tutils.EnemyForce;
        ship.resetHp(1000);

		let gunShip = new MotherGunShip(40, 80, "tri");
        ship.addGunShip(gunShip, 0, 100);
        gunShip.resetHp(200);
        gunShip.angle = 180;
        let gun = Gun.createGun(ShotGun, Bullet);
		gun.fireCooldown.baseValue = 20;
		gun.bulletSpeed.baseValue = 30;
		gunShip.addGun(gun, true);
		gun.bulletLeft = 0;
		gun.autoFire = true;
        
		let smgr = new tutils.StateManager();
        let moveToRight = new tutils.State();
		let moveToLeft = new tutils.State();
        let ajustAngle = new tutils.State();
        let fire5 = new tutils.State();

		moveToRight.setListener(()=>{
            ship.moveTo(w*0.8, h*0.1, ship.speed.value, true, null, (unit: Unit)=>{
                smgr.change(ajustAngle, moveToLeft);
            });
        }, null, this);

        moveToLeft.setListener(()=>{
            ship.moveTo(w*0.2, h*0.1, ship.speed.value, true, null, (unit: Unit)=>{
                smgr.change(ajustAngle, moveToRight);
            });
        }, null, this);

        ajustAngle.setListener(()=>{
			let hero = this.world.findNearestHeroShip(ship.x, ship.y);

			let x = w * 0.5;
			let y = h;
			if (hero) {
				x = hero.x;
				y = hero.y;
			}

			let targetAngle = Unit.getAngle(gunShip.x, gunShip.y, x, y);
			console.log(gunShip.angle+" to "+targetAngle);
			// if (targetAngle - gunShip.angle > 180) {
			//  	targetAngle = targetAngle - 360;
			// }

			gunShip.mainGun.bulletLeft = 50;
			egret.Tween.get(gunShip).to({angle: targetAngle}, 1000);
        }, (dt: number, state: tutils.State)=>{
            if (gunShip.mainGun.bulletLeft == 0) {
                smgr.change(state.args[0]);
            }
        }, this);

        smgr.start(10, moveToLeft);

		return ship;
	}
}