class World {
	readonly gameObject: egret.DisplayObjectContainer;
	readonly width: number;
	readonly height: number;
	readonly rect: egret.Rectangle;
	ships: Object;
	shipsNum: number = 0;
	bullets: Object;
	bulletsNum: number = 0;
	debugDrawSprite: egret.Sprite = null;

	debugTextField: egret.TextField = null;
	onShipDeadListener: (ship: Ship, killer: Ship) => void;
	onShipDeadThisObject: any;

	public constructor(gameObject: egret.DisplayObjectContainer, width: number, height: number) {
		this.gameObject = gameObject;
		this.width = width;
		this.height = height;
		this.rect = new egret.Rectangle(0, 0, width, height);
		this.ships = {};
		this.bullets = {};
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
		this.gameObject.removeChild(ship.gameObject);
		ship.world = null;
		ship.cleanup();
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
			console.log('bullets not found');
			return;
		}
		let bullet: Bullet = this.bullets[id];
		this.gameObject.removeChild(bullet.gameObject);
		bullet.world = null;
		bullet.cleanup();
		delete this.bullets[id];
		this.bulletsNum--;
	}

	public step(dt: number) {
		if (this.debugDrawSprite != null) {
			this.debugDrawSprite.graphics.clear();
			this.debugDrawSprite.graphics.lineStyle(2, 0xffffff, 1);

			this.debugTextField.text = "ship: "+this.shipsNum+", bullet: "+this.bulletsNum;
			
			for (let shipId in this.ships) {
				let ship: Ship = this.ships[shipId];
				this.debugDrawSprite.graphics.moveTo(ship.gameObject.x, ship.gameObject.y);
				this.debugDrawSprite.graphics.drawRect(ship.gameObject.x-ship.gameObject.width*0.5, ship.gameObject.y-ship.gameObject.height*0.5, ship.gameObject.width, ship.gameObject.height);
			}

			for (let bulletId in this.bullets) {
				let bullet: Bullet = this.bullets[bulletId];
				this.debugDrawSprite.graphics.moveTo(bullet.gameObject.x, bullet.gameObject.y);
				this.debugDrawSprite.graphics.drawRect(bullet.gameObject.x-bullet.gameObject.width*0.5, bullet.gameObject.y-bullet.gameObject.height*0.5, bullet.gameObject.width, bullet.gameObject.height);
			}
		}

		let dyingBullets: Bullet[] = [];
		let dyingShips: Ship[] = [];

		for (let shipId in this.ships) {
			let ship: Ship = this.ships[shipId];
			if (ship.hp.isDead()) {
				console.log('ship('+shipId+') isDead');
				continue;
			}
			//console.log('ship('+shipId+') not Dead');

			// 检测子弹撞击
			for (let bulletId in this.bullets) {
				let bullet: Bullet = this.bullets[bulletId];
				if (bullet.power.isDead()) {
					continue;
				}
				if (!this.rect.intersects(bullet.getBounds())) {
					// 移除跑出边界的子弹
					bullet.power.hp = 0;
					dyingBullets.push(bullet);
					continue;
				}

				if (bullet.gun.ship.force.isMyEnemy(ship.force) && bullet.onHitEnemyShipTest(ship)) {
					//console.log("bullet hit!");
					let dt = Math.min(bullet.power.hp, Math.floor(bullet.power.maxHp*bullet.powerLossPer));
					//console.log('ship('+shipId+') hp('+ship.hp.hp+'-'+dt+')');
					ship.hp.hp -= dt;
					bullet.power.hp -= dt
					
					if (bullet.power.isDead()) {
						dyingBullets.push(bullet);
					}
					if (ship.hp.isDead()) {
						//console.log("dead!");
						//console.log('ship('+shipId+') push toDel '+ship.hp.hp);
						this.onShipDead(ship, bullet.gun.ship);
						dyingShips.push(ship);
						break;
					}
				}
			}

			// 检测飞船撞击
			for (let shipId2 in this.ships) {
				let ship2: Ship = this.ships[shipId2];
				if (ship2.hp.isDead()) {
					continue;
				}
				if (ship2.force.isMyEnemy(ship.force) && ship2.hitTest(ship)) {
					//console.log("ship hit!");
					ship.hp.hp -= ship2.hp.maxHp;
					ship2.hp.hp -= ship.hp.maxHp;
					if (ship2.hp.isDead()) {
						//console.log("dead!");
						dyingShips.push(ship2);
					}
					if (ship.hp.isDead()) {
						//console.log("dead!");
						this.onShipDead(ship, ship2);
						dyingShips.push(ship);
						break;
					}
				}
			}
		}

		for (let i in dyingBullets) {
			let bullet = dyingBullets[i];
			bullet.onDying();
			this.removeBullet(bullet.id);
		}
		for (let i in dyingShips) {
			let ship = dyingShips[i];
			ship.onDying();
			this.removeShip(ship.id);
		}
	}

	protected nextId(): number {
		return tutils.nextId();
	}

	protected onShipDead(ship: Ship, killer: Ship) {
		this.onShipDeadListener.call(this.onShipDeadThisObject, ship, killer);
	}

	public setOnShipDeadListener(listener: (ship: Ship, killer: Ship)=>void, thisObject: any) {
		this.onShipDeadListener = listener;
		this.onShipDeadThisObject = thisObject;
	}
}