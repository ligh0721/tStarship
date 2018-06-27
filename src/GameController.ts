class GameController {
	private static $inst: GameController;
	root: Main;
	timer: tutils.Timer = new tutils.Timer();
	curRootLayer: tutils.Layer;

	private readonly allGunsData: GunsData;
	private readonly allSkillsData: SkillsData;
	private readonly allPartsData: PartsData;
	readonly expTable: number[];
	readonly gunExpTable: number[];
	readonly skillExpTable: number[];

	readonly allGuns: string[];
	readonly allSkills: string[];
	readonly allParts: string[];

	readonly allChestDrop: DropTable<any>[];

	playerData: PlayerData = null;
	private static KeyData: string = "PlayPrefsData";

	// battleShips: string[];

	actionManager: tutils.ActionManager = new tutils.ActionManager();
	hud: BattleHUD;

	public constructor() {
		this.allGunsData = this.fixGunsData(GlobalGunsData);
		this.allSkillsData = this.fixSkillsData(GlobalSkillsData);
		this.allPartsData = this.fixPartsData(GlobalPartsData);
		this.expTable = GlobalExpTable;
		this.gunExpTable = GlobalGunExpTable;
		this.skillExpTable = GlobalSkillExpTable;

		this.allGuns = this.loadAndCheckAllGuns(GlobalAllGuns);
		this.allSkills = this.loadAndCheckAllSkills(GlobalAllSkills);
		this.allParts = this.loadAndCheckAllParts(GlobalAllParts);
		this.allChestDrop = this.loadAllChestDropTable();
		
		console.log("load guns data", this.allGunsData);
		console.log("load skills data", this.allSkillsData);
		console.log("load parts data", this.allPartsData);
	}

	public static get instance(): GameController {
		return GameController.$inst!==undefined ? GameController.$inst : GameController.$inst=new GameController();
	}

	public init(root: Main): void {
		this.root = root;
		this.actionManager.start(60);
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

	public setBattleHUD(hud: BattleHUD): void {
		this.hud = hud;
	}

	public deletePlayerData(): void {
		egret.localStorage.clear();
		this.playerData = null;
	}

	public resetPlayerData(): PlayerData {
		this.playerData = GlobalPlayerInitData;
		egret.localStorage.clear();
		this.savePlayerData();
		return this.playerData;
	}

	public loadPlayerData(): PlayerData {
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

	public addNewGun(key: string): void {
		console.assert(this.playerData != null);
		console.assert(GameController.instance.getGunDataByKey(key) != null);
		let playerGunData = this.playerData.guns[key];
		console.assert(playerGunData===undefined, "gun("+key+") is already exists");
		this.playerData.gunsNum++;
		this.playerData.guns[key] = {
			exp: 0,
			use: 0
		};
	}

	public addNewSkill(key: string): void {
		console.assert(this.playerData != null);
		console.assert(GameController.instance.getSkillDataByKey(key) != null);
		let playerSkillData = this.playerData.skills[key];
		console.assert(playerSkillData===undefined, "skill("+key+") is already exists");
		this.playerData.skillsNum++;
		this.playerData.skills[key] = {
			exp: 0,
			use: 0
		};
	}

	public showGameOverPanel(parent: egret.DisplayObjectContainer, data: any): GameOverPanel {
		let panel = new GameOverPanel(data);
        parent.addChild(panel);
		let stage = egret.MainContext.instance.stage;
        panel.x = (stage.stageWidth - panel.width) / 2;
        panel.y = (stage.stageHeight - panel.height) / 2;
		return panel;
	}

	public async showNewGunPanel(parent: egret.DisplayObjectContainer, data: any): Promise<any> {
		let p = new Promise<any>((resolve, reject)=>{
			let panel = new NewShipPanel(data, (res: any):void=>{
				resolve(res);
			});
			parent.addChild(panel);
			let stage = egret.MainContext.instance.stage;
			panel.x = (stage.stageWidth - panel.width) / 2;
			panel.y = (stage.stageHeight - panel.height) / 2;
		});
		return p;
	}
	public showPartsPanel(parent: egret.DisplayObjectContainer, data: any): PartsPanel {
		let speed = GameController.instance.actionManager.speed;
		GameController.instance.actionManager.speed = 0;
		// ectrl.stopRush();
		let panel = new PartsPanel(data, (res)=>{
			GameController.instance.actionManager.speed = speed;
			// ectrl.startRush();
		});
        parent.addChild(panel);
		let stage = egret.MainContext.instance.stage;
        panel.x = (stage.stageWidth - panel.width) / 2;
        panel.y = (stage.stageHeight - panel.height) / 2;
		return panel;
	}

	private fixGunsData(data: GunsData): GunsData {
		for (let key in data) {
			let gunData = data[key];
			gunData.key = key;
		}
		return data;
	}

	private loadAndCheckAllGuns(guns: string[]): string[] {
		for (let i in guns) {
			let gunKey = guns[i];
			console.assert(this.getGunDataByKey(gunKey)!==null);
		}
		return guns;
	}

	private fixSkillsData(data: SkillsData): SkillsData {
		for (let key in data) {
			let skillData = data[key];
			skillData.key = key;
		}
		return data;
	}

	private loadAndCheckAllSkills(skills: string[]): string[] {
		for (let i in skills) {
			let skillKey = skills[i];
			console.assert(this.getSkillDataByKey(skillKey)!==null);
		}
		return skills;
	}

	private fixPartsData(data: PartsData): PartsData {
		for (let key in data) {
			let partInfo = data[key];
			partInfo.key = key;
		}
		return data;
	}

	private loadAndCheckAllParts(parts: string[]): string[] {
		for (let i in parts) {
			let partKey = parts[i];
			console.assert(this.getPartDataByKey(partKey)!==null);
		}
		return parts;
	}

	private loadAllChestDropTable(): DropTable<any>[] {
		let ret: DropTable<any>[] = [];
		let chest1 = this.loadDropTable(GlobalChest1Drop);
		ret.push(chest1);
		return ret;
	}

	private loadDropTable(rawTable: any[]): DropTable<any> {
		let ret: DropTable<any> = new DropTable<any>();
		for (let i in rawTable) {
			let drop = rawTable[i];
			let item = drop[0];
			let weight = drop[1];
			if (typeof(drop) === "string") {
				ret.push(item, weight);
			} else {
				ret.push(this.loadDropTable(item), weight);
			}
		}
		return ret;
	}

	public createHeroShip(world: World): HeroShip {
		let hero = new HeroShip(GlobalHeroModel, GlobalHeroModelScale);
		world.addShip(hero);
		hero.resetHp(this.playerData.maxHp);
		hero.force.force = tutils.Player1Force;
		hero.force.ally(tutils.AllyForce);
		hero.speed.baseValue = this.playerData.speed;

		let gunKey = this.playerData.gun;
		let gunData = this.getGunDataByKey(gunKey);
		let gun = Gun.createGun(gunData.gun, gunData.bullet);
		gun.bulletSpeed.baseValue = gunData.bulletSpeed;
		gun.fireCooldown.baseValue = gunData.fireCD;
		gun.bulletPowerLossPer = 1 / gunData.bulletHitTimes;
		gun.bulletPower.baseValue = gunData.bulletPower * gunData.bulletHitTimes;
		gun.bulletPowerLossInterval.baseValue = gunData.bulletHitInterval;
		gun.bulletNum = gunData.bulletNum;
		hero.addGun(gun, true);

		let playerGunData = this.getPlayerGunData();
		let level = this.expToGunLevel(playerGunData.exp);
		gun.levelUp(level-1, false);

		let skillKey = this.playerData.skill;
		let skillData = this.getSkillDataByKey(skillKey);
		let skill = this.createSkill(this.playerData.skill);
		hero.setSkill(skill);

		let playerSkillData = this.getPlayerSkillData();
		level = this.expToSkillLevel(playerSkillData.exp);
		skill.levelUp(level-1, false);
		return hero;
	}

	public getGunDataByKey(key: string): GunDataItem {
		let item = this.allGunsData[key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getSkillDataByKey(key: string): SkillDataItem {
		let item = this.allSkillsData[key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getPartDataByKey(key: string): PartDataItem {
		let item = this.allPartsData[key];
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

	public expToGunLevel(exp: number): number {
		for (let i=1; i<=this.gunExpTable.length; i++) {
			if (this.gunExpTable[i-1] > exp) {
				return i;
			}
		}
		return this.gunExpTable.length+1;
	}

	public expToSkillLevel(exp: number): number {
		for (let i=1; i<=this.skillExpTable.length; i++) {
			if (this.skillExpTable[i-1] > exp) {
				return i;
			}
		}
		return this.skillExpTable.length;
	}

	public getPlayerGunData(): PlayerGunData {
		let item = this.playerData.guns[this.playerData.gun];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getPlayerGunDataByKey(key: string): PlayerGunData {
		let item = this.playerData.guns[key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getPlayerSkillData(): PlayerSkillData {
		let item = this.playerData.skills[this.playerData.skill];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getPlayerSkillDataByKey(key: string): PlayerSkillData {
		let item = this.playerData.skills[key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public createBuff(key: string): Buff {
		let buff: Buff;
		switch (key) {
		case "gun_power_up":
			buff = new GunBuff(8000, 0, +0.20, 0);
			buff.model = "GunPower_png";
			buff.name = "Power Up!";
			buff.key = key;
			break;
		case "gun_cdr_up":
			buff = new GunBuff(8000, -0.20, 0, 0);
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
		
		// runtime buff
		case "elec_induced":
			buff = new ElecBuff(5000, 10);
			buff.key = key;
			break;

		// skill's buffs
		case "skill_ghost_ships":
			buff = new GhostShipBuff(Buff.Infinite, 3, 0.2);
			buff.name = "Ghost Ships!";
			buff.key = key;
			break;
		case "skill_turbo_fire_gun":
			buff = new GunBuff(5000, -0.50, 0, +0.50);
			buff.name = "Turbo Fire!";
			buff.key = key;
			break;
		case "skill_turbo_fire_ship":
			buff = new ShipBuff(5000, -0.80);
			buff.name = "Turbo Fire!";
			buff.key = key;
			break;
		case "shield_ball_shield":
			buff = new ShieldBuff(Buff.Infinite, tutils.LargeNumber);
			break;
		case "super_hero_ghost_ships":
			buff = new GhostShipBuff(Buff.Infinite, 3, 0.2);
			buff.name = "Ghost Ships!";
			buff.key = key;
			break;
		case "skill_super_hero":
			buff = new SuperHeroBuff(30000);
			buff.name = "Super Hero!";
			buff.key = key;
			break;
		case "skill_shield_ball":
			buff = new ShieldBallBuff();
			buff.name = "Shield Ball";
			break;
		case "skill_meteoroid_rush":
			buff = new MeteoroidRushBuff();
			buff.name = "Meteoroid Rush";
			break;

		// part's buffs
		case "part_meteoroid":
			buff = new MeteoroidBuff(Buff.Infinite, 0.20, 200);
			buff.name = "Meteoroid Rush";
			buff.key = key;
			// buff.model = "PartMeteoroid_png";
			break;
		case "part_power_speed_up_2":
			buff = new PowerSpeedUpBuff(Buff.Infinite, 1.25);
			buff.key = key;
			// buff.name = "";
			// buff.model = "_png";
			break;
		case "part_power_battery_2":
			buff = new PowerNeverEmptyBuff(Buff.Infinite, 0.30);
			buff.key = key;
			// buff.name = "";
			// buff.model = "_png";
			break;
		case "part_critical_2":
			buff = new CriticalBuff(Buff.Infinite, 0.20, 2.0);
			buff.key = key;
			break;
		case "part_elec_induced_gun":
			let gun2 = Gun.createGun(SineGun, BlueDiamondBullet);
			gun2.fireCooldown.baseValue = 5000;
			gun2.amplitudeDelta = 150;
			gun2.bulletNum = 2;
			gun2.bulletSpeed.baseValue = 100;
			gun2.bulletPowerLossInterval.baseValue = 10000;
			gun2.bulletPowerLossPer = 0.001;
			gun2.bulletPower.baseValue = 5/gun2.bulletPowerLossPer;
			let buff2 = new AddTargetBuffBuff(Buff.Infinite, 0.2, ["elec_induced"]);
			buff2.key = "part_elec_induced_buff";
			buff = new AddGunAndBuffBuff(Buff.Infinite, gun2, [buff2]);
			buff.key = key;
			break;
		case "part_test1":
			buff = new GunBuff(Buff.Infinite, -0.10, 0, +0.10);
			buff.key = key;
			// buff.name = "Test Part1";
			// buff.model = "GunCDR_png";
			break;
		case "part_test2":
			buff = new GunBuff(Buff.Infinite, 0.00, +0.10, 0.00);
			buff.key = key;
			// buff.name = "Test Part2";
			// buff.model = "GunPower_png";
			break;
		default:
			console.assert(false, "invalid buff key("+key+")");
		}
		return buff;
	}

	public createSkill(key: string): Skill {
		let skill: Skill;
		switch (key) {
		case "skill_turbo_fire":
			skill = new AddBuffSkill(1000, [this.createBuff("skill_turbo_fire_gun"), this.createBuff("skill_turbo_fire_ship")]);
			break;
		case "skill_shield_ball":
			skill = new AddBuffSkill(1000, [this.createBuff("skill_shield_ball")]);
			break;
		case "skill_ghost_ships":
        	skill = new AddBuffSkill(100, [this.createBuff("skill_ghost_ships")]);
			break;
		case "skill_super_hero":
			skill = new AddBuffSkill(1000, [this.createBuff("skill_super_hero")]);
			break;
		case "skill_meteoroid_rush":
			skill = new AddBuffSkill(1000, [this.createBuff("skill_meteoroid_rush")]);
			break;
		default:
			console.assert(false, "invalid skill key("+key+")");
		}
		return skill;
	}

	public createPart(key: string): Part {
		if (this.allParts.indexOf(key) < 0) {
			console.assert(false, "invalid part key("+key+")");
			return null;
		}

		let partInfo = this.getPartDataByKey(key);
		if (!partInfo) {
			return null;
		}

		let buffs: Buff[] = [];
		for (let i in partInfo.buffs) {
			let buff = this.createBuff(partInfo.buffs[i]);
			if (buff) {
				buffs.push(buff);
			}
		}

		let part = new Part(buffs);
		part.key = key;
		part.name = partInfo.name;
		part.model = partInfo.model;
		part.desc = partInfo.desc;
		return part;
	}

	public addAction(target: egret.IHashObject, action: tutils.Action): tutils.Action {
		this.actionManager.addAction(target, action);
		return action;
	}

	public setActionSpeed(speed: number): void {
		this.actionManager.speed = speed;
	}
}

// type PlayerShipData = {
// 	exp: number,
// 	use: number,
// 	enemy: number
// }

type PlayerGunData = {
	exp: number,
	use: number
}

type PlayerSkillData = {
	exp: number,
	use: number
}

type PlayerData = {
	ver: number,
    highscore: {
        score: number,
        stage: number,
        gunKey: string,
		skillKey: string
    },
    maxStage: number,
    coins: number,
	maxHp: number,
	speed: number,
	exp: number,
	enemies: number,
	gunsNum: number,
    guns: {[key: string]: PlayerGunData},
	gun: string,
	skillsNum: number,
    skills: {[key: string]: PlayerSkillData},
	skill: string,
	freeChestTs: number,
	adChestTs: number,
	sharechestTs: number,
	allChests: number[]
};

type GunDataItem = {
	key?: string,
	
	name: string,
	desc: string,
	model: string,
	gun: tutils.Constructor<Gun>,
	bullet: tutils.Constructor<Bullet>,
	bulletSpeed: number,
	fireCD: number,
	bulletPower: number,
	bulletNum: number,
	bulletHitTimes: number,
	bulletHitInterval: number,
	coins: number
}

type GunsData = {
	[key: string]: GunDataItem
};

type SkillDataItem = {
	key?: string,

	name: string,
	desc: string,
	model: string,
	coins: number
}

type SkillsData = {
	[key: string]: SkillDataItem
}


type PartDataItem = {
	key?: string,

	name: string,
	model: string,
	desc: string,
	buffs: string[]
}

type PartsData = {
	[key: string]: PartDataItem
};