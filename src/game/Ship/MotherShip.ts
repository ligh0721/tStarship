class MotherShip extends Ship {
	readonly gunShips: { [id: string]: {gunShip: MotherGunShip, offsetX: number, offsetY: number} };

	public constructor(model: string, scale?: number) {
		super(model, scale);
		this.gunShips===undefined ? this.gunShips={} : this.gunShips.constructor();
	}

	public addGunShip(gunShip: MotherGunShip, offsetX: number, offsetY: number): MotherGunShip {
		this.world.addShip(gunShip);
		gunShip.x = this.x + offsetX;
		gunShip.y = this.y + offsetY;
		gunShip.ship = this;
		gunShip.force = this.force;
		this.gunShips[gunShip.id] = {gunShip: gunShip, offsetX: offsetX, offsetY: offsetY};
		return gunShip;
	}

	public removeGun(id: string): void {
		if (!this.gunShips.hasOwnProperty(id)) {
			console.log('gunShip('+id+') not found');
			return;
		}
		let gunShip = this.gunShips[id].gunShip;
		this.world.removeShip(id);
		//gunShips.ship = null;
		delete this.gunShips[id];
	}

	protected onDying(src: HpUnit): void {
		for (let i in this.gunShips) {
			let gunShip = this.gunShips[i].gunShip;
			if (gunShip.alive) {
				gunShip.damaged(gunShip.hp, null);
			}
		}
		this.gameObject.cacheAsBitmap = false;
		super.onDying(src);
	}

	// protected onCreate(): egret.DisplayObject {
	// 	let gameObject = new egret.Shape();
	// 	gameObject.graphics.lineStyle(0);
	// 	gameObject.graphics.beginFill(0x993333);
	// 	gameObject.graphics.drawRoundRect(0, 0, this.width, this.height, 20, 20);
	// 	gameObject.graphics.endFill();
	// 	gameObject.graphics.lineStyle(10, 0xf48771);
    //     gameObject.graphics.drawRoundRect(0, 0, this.width, this.height, 20, 20);
    //     gameObject.anchorOffsetX = this.width * 0.5;
    //     gameObject.anchorOffsetY = this.height * 0.5;
	// 	gameObject.cacheAsBitmap = true;
	// 	return gameObject;
	// }

	protected onCleanup(): void {
		for (let i in this.gunShips) {
			let gunShip = this.gunShips[i].gunShip;
			this.world.removeShip(gunShip.id);
		}
		super.onCleanup();
	}

	public get x(): number {
		return this.gameObject.x;
	}

	public set x(value: number) {
		this.gameObject.x = value;
		for (let i in this.gunShips) {
			let gunShipInfo = this.gunShips[i];
			gunShipInfo.gunShip.x = value + gunShipInfo.offsetX;
		}
	}

	public get y(): number {
		return this.gameObject.y;
	}

	public set y(value: number) {
		this.gameObject.y = value;
		for (let i in this.gunShips) {
			let gunShipInfo = this.gunShips[i];
			gunShipInfo.gunShip.y = value + gunShipInfo.offsetY;
		}
	}
}