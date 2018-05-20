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
	private readonly data: ShipsData = {};
	private static $inst;

	public constructor() {
		this.data = this.fix(GlobalShipsData);
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
}