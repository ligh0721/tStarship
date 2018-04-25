class World {
	readonly gameObject: egret.DisplayObjectContainer;
	readonly width: number;
	readonly height: number;
	ships: Object;
	bullets: Object;
	debugDrawSprite: egret.Sprite = null;

	public constructor(gameObject: egret.DisplayObjectContainer, width: number, height: number) {
		this.gameObject = gameObject;
		this.width = width;
		this.height = height;
		this.ships = {};
		this.bullets = {};
	}

	public addShip(ship: Ship): Ship {
		ship.onAddToWorld();
		this.gameObject.addChild(ship.gameObject);
		ship.world = this;
		ship.id = this.nextId();
		this.ships[ship.id] = ship;
		return ship;
	}

	public removeShip(id: number) {
		if (!this.ships.hasOwnProperty(id.toString())) {
			console.log('ship not found');
			return;
		}
		let ship: Ship = this.ships[id];
		this.gameObject.removeChild(ship.gameObject);
		ship.world = null;
		ship.cleanup();
		delete this.ships[id];
	}

	public addBullet(bullet: Bullet): Bullet {
		bullet.onAddToWorld();
		this.gameObject.addChild(bullet.gameObject);
		bullet.world = this;
		bullet.id = this.nextId();
		this.bullets[bullet.id] = bullet;
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
	}

	public step(dt: number) {
		if (this.debugDrawSprite != null) {
			this.debugDrawSprite.graphics.clear();
			this.debugDrawSprite.graphics.lineStyle(2, 0xffffff, 1);
			
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

		let toDelBullet = [];
		let toDelShip = [];

		for (let shipId in this.ships) {
			let ship: Ship = this.ships[shipId];
			if (ship.hp.isDead()) {
				continue;
			}
			for (let bulletId in this.bullets) {
				let bullet: Bullet = this.bullets[bulletId];
				if (bullet.gun.ship.force.isMyEnemy(ship.force) && bullet.onHitEnemyShipTest(ship)) {
					console.log("bullet hit!");
					ship.hp.hp -= bullet.gun.bulletPower;
					toDelBullet.push(bullet.id);
					if (ship.hp.isDead()) {
						console.log("dead!");
						toDelShip.push(ship.id);
					}
				}
			}
			for (let shipId2 in this.ships) {
				let ship2: Ship = this.ships[shipId2];
				if (ship2.hp.isDead()) {
					continue;
				}
				if (ship2.force.isMyEnemy(ship.force) && ship2.hitTest(ship)) {
					console.log("ship hit!");
					ship.hp.hp -= ship2.hp.maxHp;
					ship2.hp.hp -= ship.hp.maxHp;
					if (ship.hp.isDead()) {
						console.log("dead!");
						toDelShip.push(ship.id);
					}
					if (ship2.hp.isDead()) {
						console.log("dead!");
						toDelShip.push(ship2.id);
					}
				}
			}
		}

		for (let i in toDelBullet) {
			this.removeBullet(toDelBullet[i]);
		}
		for (let i in toDelShip) {
			this.removeShip(toDelShip[i]);
		}
	}

	protected nextId(): number {
		return tutils.nextId();
	}
}