class World {
	readonly gameObject: egret.DisplayObjectContainer;
	readonly width: number;
	readonly height: number;
	readonly rect: egret.Rectangle;
	ships: Object = {};
	shipsNum: number = 0;
	bullets: Object = {};
	bulletsNum: number = 0;
	supplies: Object = {};
	suppliesNum: number = 0;

	debugDrawSprite: egret.Sprite = null;

	debugTextField: egret.TextField = null;
	onShipDeadListener: (ship: Ship, killer: Ship) => void;
	onShipDeadThisObject: any;

	

	public constructor(gameObject: egret.DisplayObjectContainer, width: number, height: number) {
		this.gameObject = gameObject;
		this.width = width;
		this.height = height;
		this.rect = new egret.Rectangle(0, 0, width, height);
	}

	public getShip(id: number): Ship {
		if (!this.ships.hasOwnProperty(id.toString())) {
			return null;
		}
		return this.ships[id];
	}

	public getBullet(id: number): Bullet {
		if (!this.bullets.hasOwnProperty(id.toString())) {
			return null;
		}
		return this.bullets[id];
	}

	public addShip(ship: Ship): Ship {
		ship.onAddToWorld();
		this.gameObject.addChild(ship.gameObject);
		ship.world = this;
		ship.id = this.nextId();
		this.ships[ship.id] = ship;
		this.shipsNum++;
		return ship;
	}

	public removeShip(id: number) {
		if (!this.ships.hasOwnProperty(id.toString())) {
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
		bullet.onAddToWorld();
		this.gameObject.addChild(bullet.gameObject);
		bullet.world = this;
		bullet.id = this.nextId();
		this.bullets[bullet.id] = bullet;
		this.bulletsNum++;
		return bullet;
	}

	public removeBullet(id: number) {
		if (!this.bullets.hasOwnProperty(id.toString())) {
			console.log('bullet('+id+') not found');
			return;
		}
		let bullet: Bullet = this.bullets[id];
		bullet.cleanup();
		this.gameObject.removeChild(bullet.gameObject);
		bullet.world = null;
		delete this.bullets[id];
		this.bulletsNum--;
	}

	public addSupply(supply: Supply): Supply {
		supply.onAddToWorld();
		this.gameObject.addChild(supply.gameObject);
		supply.world = this;
		supply.id = this.nextId();
		this.supplies[supply.id] = supply;
		this.suppliesNum++;
		return supply;
	}

	public removeSupply(id: number) {
		if (!this.supplies.hasOwnProperty(id.toString())) {
			console.log('supply('+id+') not found');
			return;
		}
		let supply: Ship = this.supplies[id];
		supply.cleanup();
		this.gameObject.removeChild(supply.gameObject);
		supply.world = null;
		delete this.supplies[id];
		this.suppliesNum--;
		//console.log('ship('+id+') removed');
	}

	public step(dt: number) {
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
			if (ship instanceof HeroShip) {
				for (let supplyId in this.supplies) {
					let supply: Supply = this.supplies[supplyId];
					if (supply.status == UnitStatus.Dead) {
						supply.status = UnitStatus.Removed;
						toDelSupplies.push(supply);
					}
					if (!supply.isAlive()) {
						continue;
					}
					if (ship.hitTest(supply)) {
						// TODO: !!!!!!!!!!!
					}
				}
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
					if (!ship.isAlive()) {
						//console.log("dead!");
						//console.log('ship('+shipId+') push toDel '+ship.hp.hp);
						break;
					}
				}
			}

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
				if (ship2.force.isMyEnemy(ship.force) && ship2.hitTest(ship)) {
					//console.log("ship hit!");
					ship.damaged(ship2.maxHp, ship2);
					ship2.damaged(ship.maxHp, ship);
					if (!ship.isAlive()) {
						//console.log("dead!");
						break;
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
		if (this.debugDrawSprite != null) {
			this.debugDrawSprite.graphics.clear();
			this.debugDrawSprite.graphics.lineStyle(2, 0xffffff, 1);

			this.debugTextField.text = "ship: "+this.shipsNum+", bullet: "+this.bulletsNum;
			
			let objsList = [this.ships, this.bullets, this.supplies];
			for (let i in objsList) {
				let objs = objsList[i];
				for (let objId in objs) {
					let obj = objs[objId];
					this.debugDrawSprite.graphics.moveTo(obj.gameObject.x, obj.gameObject.y);
					this.debugDrawSprite.graphics.drawRect(obj.gameObject.x-obj.gameObject.width*0.5, obj.gameObject.y-obj.gameObject.height*0.5, obj.gameObject.width, obj.gameObject.height);
				}
			}
		}
	}

	protected nextId(): number {
		return tutils.nextId();
	}

	public onShipDying(ship: Ship, killer: Ship) {
		this.onShipDeadListener.call(this.onShipDeadThisObject, ship, killer);
	}

	public setOnShipDeadListener(listener: (ship: Ship, killer: Ship)=>void, thisObject: any) {
		this.onShipDeadListener = listener;
		this.onShipDeadThisObject = thisObject;
	}
}