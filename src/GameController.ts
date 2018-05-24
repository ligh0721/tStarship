class GameController {
	private static $inst: GameController;
	root: Main;
	timer: tutils.Timer;
	curRootLayer: tutils.Layer;

	private readonly allShipsData: ShipsData;
	readonly allShips: string[];
	readonly expTable: number[];

	playerData: PlayPrefsData = null;
	private static KeyData: string = "PlayPrefsData";

	battleShips: string[];

	public constructor() {
		this.timer = new tutils.Timer();
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
		this.playerData.ships[id] = {
			exp: 0,
			use: 0,
			enemy: 0,
		};
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
		let shipInfo = this.allShipsData[id];
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
}

type PlayPrefsData = {
    highscore: {
        score: number,
        stage: number,
        shipId: string,
    },
    maxStage: number,
    coins: number,
    ships: {[id: string]: {
        exp: number,
        use: number,
        enemy: number,
    }},
};

type ShipDataItem = {
	id?: string,
	
	name: string,
	model: string,
	skillName: string,
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
	bulletHitInterval: number
}

type ShipsData = {
	[id: string]: ShipDataItem
};