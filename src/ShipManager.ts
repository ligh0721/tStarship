type ShipInfo = {
	name: string,
	mainGun: tutils.Constructor<Gun>,
	mainGunBullet: tutils.Constructor<Bullet>,
	mainGunBulletPower: number,
	mainGunBulletSpeed: number,
	mainGunBulletHitTimes: number,
	mainGunCD: number,
	skillName: string,
	maxHp: number,
	speed: number
};

type ShipInfoMap = {[name: string]: ShipInfo};

class ShipManager {
	shipInfos: ShipInfoMap = {};
	private static $inst;
	
	public static get instance(): ShipManager {
		return ShipManager.$inst!==undefined ? ShipManager.$inst : ShipManager.$inst=new ShipManager();
	}

	public createHeroShip(name: string): HeroShip {
		let shipInfo = this.shipInfos[name];
		if (shipInfo === undefined) {
			return null;
		}
		let hero = new HeroShip(40, 80);
		hero.resetHp(shipInfo.maxHp);
		hero.speed.baseValue = shipInfo.speed;
		let gun = Gun.createGun(shipInfo.mainGun, shipInfo.mainGunBullet);
		gun.bulletPowerLossPer = 1 / shipInfo.mainGunBulletHitTimes;
		gun.bulletPower.baseValue = shipInfo.mainGunBulletPower * shipInfo.mainGunBulletHitTimes;
		gun.bulletSpeed.baseValue = shipInfo.mainGunBulletSpeed;
		gun.fireCooldown.baseValue = shipInfo.mainGunCD;
		hero.addGun(gun, true);
		return hero;
	}
}