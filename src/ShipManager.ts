type ShipDataItem = {
	id?: string,
	name: string,
	model: string,
	skillName: string,
	maxHp: number,
	speed: number,
	gun: tutils.Constructor<Gun>,
	bullet: tutils.Constructor<Bullet>,
	bulletSpeed: number,
	fireCD: number,
	bulletPower: number,
	bulletNum: number,
	bulletHitTimes: number,
	bulletHitInterval: number
}

type ShipsData = {
	[id: string]: ShipDataItem
};

class ShipManager {
	private readonly data: ShipsData;
	readonly allShips: string[];
	private readonly expTable: number[];
	private static $inst: ShipManager;

	public constructor() {
		this.data = this.fix(GlobalShipsData);
		this.allShips = this.checkAllShips(GlobalAllShips);
		this.expTable = GlobalExpTable;
		console.log("load ships data", this.data);
	}
	
	public static get instance(): ShipManager {
		return ShipManager.$inst!==undefined ? ShipManager.$inst : ShipManager.$inst=new ShipManager();
	}

	private fix(data: ShipsData): ShipsData {
		for (let id in data) {
			let shipInfo = data[id];
			shipInfo.id = id;
		}
		return data;
	}

	private checkAllShips(ships: string[]): string[] {
		for (let i in ships) {
			let shipId = ships[i];
			console.assert(this.getShipDataItem(shipId)!==null);
		}
		return ships;
	}

	public createHeroShip(id: string, world: World): HeroShip {
		let shipInfo = this.data[id];
		if (shipInfo === undefined) {
			return null;
		}
		let hero = new HeroShip(shipInfo.model);
		world.addShip(hero);
		hero.resetHp(shipInfo.maxHp);
		hero.speed.baseValue = shipInfo.speed;

		let gun = Gun.createGun(shipInfo.gun, shipInfo.bullet);
		gun.bulletSpeed.baseValue = shipInfo.bulletSpeed;
		gun.fireCooldown.baseValue = shipInfo.fireCD;
		gun.bulletPowerLossPer = 1 / shipInfo.bulletHitTimes;
		gun.bulletPower.baseValue = shipInfo.bulletPower * shipInfo.bulletHitTimes;
		gun.bulletNum = shipInfo.bulletNum;
		hero.addGun(gun, true);
		return hero;
	}

	public getShipDataItem(id: string): ShipDataItem {
		let item = this.data[id];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public expToLevel(exp: number): number {
		for (let i=0; i<this.expTable.length; i++) {
			if (this.expTable[i] > exp) {
				return i + 1;
			}
		}
		return this.expTable.length;
	}
}