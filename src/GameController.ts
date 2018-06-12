class GameController {
	private static $inst: GameController;
	root: Main;
	timer: tutils.Timer = new tutils.Timer();
	curRootLayer: tutils.Layer;

	private readonly allShipsData: ShipsData;
	readonly allShips: string[];
	readonly expTable: number[];

	playerData: PlayPrefsData = null;
	private static KeyData: string = "PlayPrefsData";

	battleShips: string[];

	public constructor() {
		this.allShipsData = this.fixShipsData(GlobalShipsData);
		this.allShips = this.checkAllShips(GlobalAllShips);
		this.expTable = GlobalExpTable;
		console.log("load ships data", this.allShipsData);
	}

	public static get instance(): GameController {
		return GameController.$inst!==undefined ? GameController.$inst : GameController.$inst=new GameController();
	}

	public init(root: Main): void {
		this.root = root;
	}

	public createRootLayer<LAYER extends tutils.Layer>(t: new(r: Main) => LAYER): tutils.Layer {
		this.curRootLayer = tutils.Layer.createAt(t, this.root);
		return this.curRootLayer;
	}

	public replaceRootLayerNextFrame<LAYER extends tutils.Layer>(t: new(r: Main) => LAYER): void {
		if (this.timer.running) {
			this.timer.stop();
		}
		this.timer.setOnTimerListener((dt: number):void=>{
			if (this.curRootLayer) {
				this.curRootLayer.cleanup();
			}
			this.createRootLayer(t);
		}, this);
		this.timer.start(0, false, 1);
	}

	public setBattleShips(battleShips: string[]): void {
		this.battleShips = battleShips;
	}

	public deletePlayerData(): void {
		egret.localStorage.clear();
		this.playerData = null;
	}

	public resetPlayerData(): PlayPrefsData {
		this.playerData = GlobalPlayerInitData;
		egret.localStorage.clear();
		this.savePlayerData();
		return this.playerData;
	}

	public loadPlayerData(): PlayPrefsData {
		let data = egret.localStorage.getItem(GameController.KeyData);
		if (data == null) {
			this.playerData = null;
			return null;
		}
		data = this.decodePlayerData(data);
		this.playerData = JSON.parse(data);
		console.log("load player prefs", this.playerData);
		return this.playerData;
	}

	public savePlayerData(): void {
		if (this.playerData == null) {
			return;
		}
		let data = JSON.stringify(this.playerData);
		data = this.encodePlayerData(data);
		egret.localStorage.setItem(GameController.KeyData, data);
	}

	protected encodePlayerData(data: string): string {
		return data;
	}
	
	protected decodePlayerData(data: string): string {
		return data;
	}

	public addNewHeroShip(id: string): void {
		console.assert(this.playerData != null);
		console.assert(GameController.instance.getShipDataById(id) != null);
		let playerShipData = this.playerData.ships[id];
		console.assert(playerShipData===undefined, "ship("+id+") is already exists");
		this.playerData.shipsNum++;
		this.playerData.ships[id] = {
			exp: 0,
			use: 0,
			enemy: 0,
		};
		// this.savePlayerData();
	}

	public showGameOverPanel(parent: egret.DisplayObjectContainer, data: any): void {
		let panel = new GameOverPanel(data);
        parent.addChild(panel);
		let stage = egret.MainContext.instance.stage;
        panel.x = (stage.stageWidth - panel.width) / 2;
        panel.y = (stage.stageHeight - panel.height) / 2;
	}

	public async showNewShipPanel(parent: egret.DisplayObjectContainer, data: any): Promise<any> {
		let p = new Promise<any>((resolve, reject)=>{
			let panel = new NewShipPanel(data, (res: any): void=>{
				resolve(res);
			});
			parent.addChild(panel);
			let stage = egret.MainContext.instance.stage;
			panel.x = (stage.stageWidth - panel.width) / 2;
			panel.y = (stage.stageHeight - panel.height) / 2;
		});
		return p;
	}
	public showPartsPanel(parent: egret.DisplayObjectContainer, data: any): void {
		let panel = new PartsPanel(data);
        parent.addChild(panel);
		let stage = egret.MainContext.instance.stage;
        panel.x = (stage.stageWidth - panel.width) / 2;
        panel.y = (stage.stageHeight - panel.height) / 2;
	}

	private fixShipsData(data: ShipsData): ShipsData {
		for (let id in data) {
			let shipInfo = data[id];
			shipInfo.id = id;
		}
		return data;
	}

	private checkAllShips(ships: string[]): string[] {
		for (let i in ships) {
			let shipId = ships[i];
			console.assert(this.getShipDataById(shipId)!==null);
		}
		return ships;
	}

	public createHeroShip(id: string, world: World): HeroShip {
		let shipData = this.allShipsData[id];
		if (shipData === undefined) {
			return null;
		}
		let hero = new HeroShip(shipData.model, shipData.scale, id);
		world.addShip(hero);
		hero.resetHp(shipData.maxHp);
		hero.force.force = tutils.Player1Force;
		hero.force.ally(tutils.AllyForce);
		hero.speed.baseValue = shipData.speed;

		let gun = Gun.createGun(shipData.gun, shipData.bullet);
		gun.bulletSpeed.baseValue = shipData.bulletSpeed;
		gun.fireCooldown.baseValue = shipData.fireCD;
		gun.bulletPowerLossPer = 1 / shipData.bulletHitTimes;
		gun.bulletPower.baseValue = shipData.bulletPower * shipData.bulletHitTimes;
		gun.bulletPowerLossInterval.baseValue = shipData.bulletHitInterval;
		gun.bulletNum = shipData.bulletNum;
		hero.addGun(gun, true);

		let skill = this.createSkill(shipData.skill);
		hero.setSkill(skill);
		return hero;
	}

	public getShipDataById(id: string): ShipDataItem {
		let item = this.allShipsData[id];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public expToLevel(exp: number): number {
		for (let i=1; i<=this.expTable.length; i++) {
			if (this.expTable[i-1] > exp) {
				return i;
			}
		}
		return this.expTable.length;
	}

	public getPlayerShipDataById(id: string): PlayerShipData {
		let item = this.playerData.ships[id];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public createBuff(key: string): Buff {
		let buff: Buff;
		switch (key) {
		case "gun_power_up":
			buff = new GunBuff(8000, 0, +0.50, 0);
			buff.model = "GunPower_png";
			buff.name = "Power Up!";
			buff.key = key;
			break;
		case "gun_cdr_up":
			buff = new GunBuff(8000, -0.30, 0, 0);
			buff.model = "GunCDR_png";
			buff.name = "Fire Rate Up!";
			buff.key = key;
			break;
		case "gun_level_up":
			buff = new GunLevelUpBuff(1);
			buff.model = "GunLevelUp_png";
            buff.name = "Level Up!";
			break;
		case "satellite_ball":
			let gun = Gun.createGun(SatelliteGun, ExplosionBullet);
            gun.fireCooldown.baseValue = 1000;
            gun.bulletPower.baseValue = 50;
            gun.bulletNum = 5;
            gun.bulletPowerLossPer = 1.0;
            gun.bulletPowerLossInterval.baseValue = 1000;
			gun.period = 1000;
            buff = new AddGunBuff(10000, [gun]);
			buff.model = "SatelliteGun_png";
            buff.name = "Satellite Ball!";
			buff.key = key;
			break;
		case "ghost_ships":
			buff = new GhostShipBuff(10000, 3, 0.2);
			buff.name = "Ghost Ships!";
			buff.key = key;
			break;
		case "turbo_fire_gun":
			buff = new GunBuff(5000, -0.80, 0, +1.00);
			buff.name = "Turbo Fire!";
			buff.key = key;
			break;
		case "turbo_fire_ship":
			buff = new ShipBuff(5000, -0.80);
			buff.name = "Turbo Fire!";
			buff.key = key;
			break;
		case "shield_ball_shield":
			buff = new ShieldBuff(-1, tutils.LargeNumber);
			break;
		case "super_hero_ghost_ships":
			buff = new GhostShipBuff(-1, 3, 0.2);
			buff.name = "Ghost Ships!";
			buff.key = key;
			break;
		case "super_hero":
			buff = new SuperHeroBuff(30000);
			buff.name = "Super Hero!";
			buff.key = key;
			break;
		case "shield_ball":
			buff = new ShieldBallBuff();
			buff.name = "Shield Ball";
			break;
		case "meteorolite_rush":
			buff = new MeteoroliteRushBuff();
			buff.name = "Meteorolite Rush";
			break;
		default:
			console.assert(false, "invalid buff key("+key+")");
		}
		return buff;
	}

	public createSkill(key: string): Skill {
		let skill: Skill;
		switch (key) {
		case "turbo_fire":
			skill = new AddBuffSkill([this.createBuff("turbo_fire_gun"), this.createBuff("turbo_fire_ship")]);
			break;
		case "shield_ball":
			skill = new AddBuffSkill([this.createBuff("shield_ball")]);
			break;
		case "ghost_ships":
        	skill = new AddBuffSkill([this.createBuff("ghost_ships")]);
			break;
		case "super_hero":
			skill = new AddBuffSkill([this.createBuff("super_hero")]);
			break;
		case "meteorolite_rush":
			skill = new AddBuffSkill([this.createBuff("meteorolite_rush")]);
			break;
		default:
			console.assert(false, "invalid skill key("+key+")");
		}
		return skill;
	}
}

type PlayerShipData = {
	exp: number,
	use: number,
	enemy: number
}

type PlayPrefsData = {
	ver: number,
    highscore: {
        score: number,
        stage: number,
        shipId: string,
    },
    maxStage: number,
    coins: number,
	shipsNum: number,
    ships: {[id: string]: PlayerShipData},
};

type ShipDataItem = {
	id?: string,
	
	name: string,
	model: string,
	scale: number,
	maxHp: number,
	speed: number,
	gunName: string,
	gun: tutils.Constructor<Gun>,
	bullet: tutils.Constructor<Bullet>,
	bulletSpeed: number,
	fireCD: number,
	bulletPower: number,
	bulletNum: number,
	bulletHitTimes: number,
	bulletHitInterval: number,
	skill: string,
	coins: number
}

type ShipsData = {
	[id: string]: ShipDataItem
};
