class World {
	readonly gameObject: egret.DisplayObjectContainer;
	readonly width: number;
	readonly height: number;
	ships: Object;
	bullets: Object;

	public constructor(gameObject: egret.DisplayObjectContainer, width: number, height: number) {
		this.gameObject = gameObject;
		this.width = width;
		this.height = height;
		this.ships = {};
		this.bullets = {};
	}

	public addShip(ship: Ship): Ship {
		ship.create();
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
		bullet.create();
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
		let toDelBullet = [];
		let toDelShip = [];
		for (let bulletId in this.bullets) {
			let bullet: Bullet = this.bullets[bulletId];
			for (let shipId in this.ships) {
				let ship: Ship = this.ships[shipId];
				if (ship.hp.isDead()) {
					continue;
				}
				if (bullet.gun.ship.force.isMyEnemy(ship.force) && ship.gameObject.hitTestPoint(bullet.x, bullet.y)) {
					ship.hp.hp -= 1;
					console.log("hit!");
					toDelBullet.push(bullet.id);
					if (ship.hp.isDead()) {
						console.log("dead!");
						toDelShip.push(ship.id);
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