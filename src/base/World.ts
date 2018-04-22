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
		this.gameObject.addChild(ship.gameObject);
		ship.world = this;
		ship.id = this.nextId();
		this.ships[ship.id] = ship;
		return ship;
	}

	public addBullet(bullet: Bullet): Bullet {
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
		let bullet = this.bullets[id];
		this.gameObject.removeChild(bullet.gameObject);
		bullet.world = null;
		delete this.bullets[id];
	}

	public step(dt: number) {
		for (let bulletId in this.bullets) {
		}
	}

	protected nextId(): number {
		return tutils.nextId();
	}
}