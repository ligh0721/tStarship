class World {
	readonly gameObject: egret.DisplayObjectContainer;
	readonly width: number;
	readonly height: number;
	readonly rect: egret.Rectangle;
	readonly pools: tutils.ObjectPools = new tutils.ObjectPools();

	readonly ships: { [id: string]: Ship } = {};
	shipsNum: number = 0;
	readonly bullets: { [id: string]: Bullet } = {};
	bulletsNum: number = 0;
	readonly supplies: { [id: string]: Supply } = {};
	suppliesNum: number = 0;

	private readonly obShip: Ship;

	// 部分监听器可以从world广播优化成ship单播 
	// from unit
	private onShipDyingListener: (ship: Ship, killer: Ship)=>void = null;
	private onShipDyingThisObject: any;

	// from world
	private onShipHitSupplyListener: (ship: Ship, supply: Supply)=>void = null;
	private onShipHitSupplyThisObject: any;

	dbgDrawSprite: egret.Sprite = null;
	dbgTextField: egret.TextField = null;
	dbgFpsTicks: number = 0;
	dbgFpsFrames: number = 0;
	dbgFps: number = 0;

	public constructor(gameObject: egret.DisplayObjectContainer, width: number, height: number) {
		this.gameObject = gameObject;
		this.width = width;
		this.height = height;
		this.rect = new egret.Rectangle(0, 0, width, height);

		// 创建观察者飞船，用于保持持续碰撞检测
        this.obShip = new Ship("");
		this.obShip.hero = true;
        this.obShip.force.force = tutils.EnemyForce;
        this.addShip(this.obShip);
        this.obShip.x = -200;
        this.obShip.y = -200;
	}

	public start(frameRate: number): void {
		let t = new tutils.Timer();
		t.setOnTimerListener((dt: number): void=> {
			this.step(dt);
		}, this);
		t.start(1000/frameRate, true, 0);
	}

	public getShip(id: string): Ship {
		if (!(id in this.ships)) {
			return null;
		}
		return this.ships[id];
	}

	public getBullet(id: string): Bullet {
		if (!(id in this.bullets)) {
			return null;
		}
		return this.bullets[id];
	}

	public findNearestFrontAliveEnemyShip(x: number, y: number, force: Force, maxDist?: number): Ship {
		let min = -1;
		let target: Ship = null;
		if (maxDist == undefined) {
			maxDist = tutils.LongDistance;
		}
		for (let i in this.ships) {
			let ship = this.ships[i];
			if (!ship.isAlive() || !ship.force.isMyEnemy(force) || ship.gameObject.y>y || ship==this.obShip) {
				continue;
			}
			let dis = tutils.getDistance(ship.gameObject.x, ship.gameObject.y, x, y);
			if (dis <= maxDist && (target==null || min>dis)) {
				min = dis;
				target = ship;
			}
		}
		return target;
	}

	public findNearestHeroShip(x: number, y: number, maxDist?: number): Ship {
		let min = -1;
		let target: Ship = null;
		if (maxDist === undefined) {
			maxDist = tutils.LongDistance;
		}
		for (let i in this.ships) {
			let ship = this.ships[i];
			if (ship==this.obShip || !ship.hero || !ship.isAlive()) {
				continue;
			}
			let dis = tutils.getDistance(ship.gameObject.x, ship.gameObject.y, x, y);
			if (dis <= maxDist && (target==null || min>dis)) {
				min = dis;
				target = ship;
			}
		}
		return target;
	}

	public addShip(ship: Ship): Ship {
		ship.world = this;
		ship.id = this.nextId();
		this.ships[ship.id] = ship;
		this.shipsNum++;
		ship.onAddToWorld();
		this.gameObject.addChild(ship.gameObject);
		return ship;
	}

	public removeShip(id: string) {
		if (!(id in this.ships)) {
			console.log('ship('+id+') not found');
			return;
		}
		let ship: Ship = this.ships[id];
		ship.cleanup();
		this.gameObject.removeChild(ship.gameObject);
		ship.world = null;
		delete this.ships[id];
		this.shipsNum--;
		//console.log('ship('+id+') removed');
	}

	public addBullet(bullet: Bullet): Bullet {
		bullet.world = this;
		bullet.id = this.nextId();
		this.bullets[bullet.id] = bullet;
		this.bulletsNum++;
		bullet.onAddToWorld();
		this.gameObject.addChild(bullet.gameObject);
		return bullet;
	}

	public removeBullet(id: string) {
		if (!(id in this.bullets)) {
			console.log('bullet('+id+') not found');
			return;
		}
		let bullet: Bullet = this.bullets[id];
		bullet.cleanup();
		this.gameObject.removeChild(bullet.gameObject);
		bullet.world = null;
		delete this.bullets[id];
		this.bulletsNum--;
		this.pools.delObject(bullet);
	}

	public addSupply(supply: Supply): Supply {
		supply.world = this;
		supply.id = this.nextId();
		this.supplies[supply.id] = supply;
		this.suppliesNum++;
		supply.onAddToWorld();
		this.gameObject.addChild(supply.gameObject);
		return supply;
	}

	public removeSupply(id: string) {
		if (!(id in this.supplies)) {
			console.log('supply('+id+') not found');
			return;
		}
		let supply: Supply = this.supplies[id];
		supply.cleanup();
		this.gameObject.removeChild(supply.gameObject);
		supply.world = null;
		delete this.supplies[id];
		this.suppliesNum--;
		this.pools.delObject(supply);
	}

	public createSupply<SupplyType extends Supply>(ctor: new(...args: any[])=>SupplyType, ...args: any[]): SupplyType {
		let supply = this.pools.newObject(ctor, ...args);
		return supply;
	}

	protected step(dt: number) {
		let toDelShips: Ship[] = [];
		let toDelBullets: Bullet[] = [];
		let toDelSupplies: Supply[] = [];

		// 最外层，遍历所有飞船
		for (let shipId in this.ships) {
			let ship: Ship = this.ships[shipId];
			if (ship.status == UnitStatus.Dead) {
				ship.status = UnitStatus.Removed;
				toDelShips.push(ship);
			}
			if (!ship.isAlive()) {
				continue;
			}
			
			// 检测子弹撞击
			for (let bulletId in this.bullets) {
				let bullet: Bullet = this.bullets[bulletId];
				if (bullet.status == UnitStatus.Dead) {
					bullet.status = UnitStatus.Removed;
					toDelBullets.push(bullet);
				}
				if (!bullet.isAlive()) {
					continue;
				}
				if (bullet.removeOutOfWorld && !this.rect.intersects(bullet.getBounds())) {
					// 移除跑出边界的子弹
					bullet.status = UnitStatus.Dead;
					continue;
				}
				if (bullet.gun.ship.force.isMyEnemy(ship.force) && bullet.onHitEnemyShipTest(ship)) {
					//console.log("bullet hit!");
					let dt = Math.min(bullet.hp, Math.floor(bullet.maxHp*bullet.powerLossPer));
					//console.log('ship('+shipId+') hp('+ship.hp.hp+'-'+dt+')');
					ship.damaged(dt, bullet.gun.ship);
					bullet.damaged(dt, ship);
					//tutils.playSound("Hit_mp3");
					if (!ship.isAlive()) {
						//console.log("dead!");
						//console.log('ship('+shipId+') push toDel '+ship.hp.hp);
						break;
					}
				}
			}

			if (ship.hero) {
				// 子弹碰撞检测后，再次验活
				if (!ship.isAlive()) {
					continue;
				}

				// 检测飞船撞击
				for (let shipId2 in this.ships) {
					let ship2: Ship = this.ships[shipId2];
					if (!ship2.isAlive()) {
						continue;
					}
					if (ship.force.isMyEnemy(ship2.force) && ship.hitTest(ship2)) {
						//console.log("ship hit!");
						ship.damaged(ship2.maxHp, ship2);
						ship2.damaged(ship.maxHp, ship);
						if (!ship.isAlive()) {
							//console.log("dead!");
							break;
						}
					}
				}
				
				// 撞机检测后，再次验活
				if (!ship.isAlive()) {
					continue;
				}

				// 检测补给箱碰撞
				for (let supplyId in this.supplies) {
					let supply: Supply = this.supplies[supplyId];
					if (supply.status == UnitStatus.Dead) {
						supply.status = UnitStatus.Removed;
						toDelSupplies.push(supply);
					}
					if (!supply.isAlive()) {
						continue;
					}
					if (supply.y > this.height+supply.gameObject.height*0.5) {
						// 移除跑出边界的子弹
						supply.status = UnitStatus.Dead;
						continue;
					}
					if (supply.hitTest(ship)) {
						supply.onHitShip(ship);
						this.onShipHitSupply(ship, supply);
						supply.status = UnitStatus.Dead;
					}
				}
			}
		}

		for (let i in toDelShips) {
			let ship = toDelShips[i];
			console.assert(ship.status==UnitStatus.Removed);
			this.removeShip(ship.id);
		}
		for (let i in toDelBullets) {
			let bullet = toDelBullets[i];
			console.assert(bullet.status==UnitStatus.Removed);
			this.removeBullet(bullet.id);
		}
		for (let i in toDelSupplies) {
			let supply = toDelSupplies[i];
			console.assert(supply.status==UnitStatus.Removed);
			this.removeSupply(supply.id);
		}

		// Debug Draw
		if (this.dbgDrawSprite != null) {
			this.dbgDrawSprite.graphics.clear();
			this.dbgDrawSprite.graphics.lineStyle(2, 0xffffff, 1);
			let now = egret.getTimer();
			if (this.dbgFpsTicks == 0) {
				this.dbgFpsTicks = now;
			} else {
				this.dbgFpsFrames++;
				let dt = now-this.dbgFpsTicks;
				if (dt >= 1000) {
					this.dbgFps = Math.floor(this.dbgFpsFrames*1000/dt);
					this.dbgFpsFrames = 0;
					this.dbgFpsTicks = now;
				}
			}
			let fps = this.dbgFps==0 ? this.gameObject.stage.frameRate : this.dbgFps;
			this.dbgTextField.text = "FPS: "+fps+"\nships: "+this.shipsNum+", bullets: "+this.bulletsNum+", supplies: "+this.suppliesNum;
			let unitsList = [this.ships, this.bullets, this.supplies];
			for (let i in unitsList) {
				let units = unitsList[i];
				for (let untiId in units) {
					let unit = units[untiId];
					this.dbgDrawSprite.graphics.moveTo(unit.gameObject.x, unit.gameObject.y);
					this.dbgDrawSprite.graphics.drawRect(unit.gameObject.x-unit.gameObject.width*0.5, unit.gameObject.y-unit.gameObject.height*0.5, unit.gameObject.width, unit.gameObject.height);
				}
			}
		}
	}

	public nextId(): string {
		return tutils.nextId();
	}

	public onShipDying(ship: Ship, killer: Ship) {
		if (this.onShipDyingListener != null) {
			this.onShipDyingListener.call(this.onShipDyingThisObject, ship, killer);
		}
	}

	public setOnShipDyingListener(listener: (ship: Ship, killer: Ship)=>void, thisObject?: any) {
		this.onShipDyingListener = listener;
		this.onShipDyingThisObject = thisObject;
	}

	public onShipHitSupply(ship: Ship, supply: Supply) {
		if (this.onShipHitSupplyListener != null) {
			this.onShipHitSupplyListener.call(this.onShipHitSupplyThisObject, ship, supply);
		}
	}

	public setOnShipHitSupplyListener(listener: (ship: Ship, supply: Supply)=>void, thisObject?: any) {
		this.onShipHitSupplyListener = listener;
		this.onShipHitSupplyThisObject = thisObject;
	}
}