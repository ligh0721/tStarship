class GameController {
	private static $inst: GameController;
	root: Main;
	timer: tutils.Timer = new tutils.Timer();
	curRootLayer: tutils.Layer;

	private readonly allGunsData: GunsData;
	private readonly allSkillsData: SkillsData;
	private readonly allPartsData: PartsData;
	private readonly allShipExpsData: ShipExpsData;
	readonly expTable: number[];
	readonly gunExpTable: number[];
	readonly skillExpTable: number[];

	readonly allGuns: string[];
	readonly allSkills: string[];
	readonly allParts: string[];
	readonly allShipExps: string[];

	readonly allChestDrop: DropTable<any>[];
	readonly dropTableForNormalEnemy: DropTable<any>;
    readonly dropTableForSeniorEnemy: DropTable<any>;
    readonly dropTableForEliteEnemy: DropTable<any>;
    readonly dropTableForBossEnemy: DropTable<any>;
	readonly dropTableForMeteoroidEnemy: DropTable<any>;
	readonly dropTableForBuffSupply: DropTable<any>;

	playerData: PlayerData = null;
	private static KeyData: string = "PlayPrefsData";
	fbPlayerData: FBPlayerData;

	actMgr: tutils.ActionManager = new tutils.ActionManager();
	hud: BattleHUD;

	public constructor() {
		this.allGunsData = this.fixGunsData(GlobalGunsData);
		this.allSkillsData = this.fixSkillsData(GlobalSkillsData);
		this.allShipExpsData = this.fixShipExpsData(GlobalShipExpData);
		this.allPartsData = this.fixPartsData(GlobalPartsData);
		this.expTable = GlobalExpTable;
		this.gunExpTable = GlobalGunExpTable;
		this.skillExpTable = GlobalSkillExpTable;

		this.allGuns = this.loadAndCheckAllGuns(GlobalAllGuns);
		this.allSkills = this.loadAndCheckAllSkills(GlobalAllSkills);
		this.allShipExps = this.loadAndCheckAllShipExps(GlobalAllShipExps);
		this.allParts = this.loadAndCheckAllParts(GlobalAllParts);
		this.allChestDrop = this.loadAllChestDropTable();
		this.dropTableForNormalEnemy = this.loadDropTable(GlobalNormalEnemyDrop);
		this.dropTableForSeniorEnemy = this.loadDropTable(GlobalSeniorEnemyDrop);
		this.dropTableForEliteEnemy = this.loadDropTable(GlobalEliteEnemyDrop);
		this.dropTableForBossEnemy = this.loadDropTable(GlobalBossEnemyDrop);
		this.dropTableForMeteoroidEnemy = this.loadDropTable(GlobalMeteoroidEnemyDrop);
		this.dropTableForBuffSupply = this.loadDropTable(GlobalBuffSupplyDrop);
		
		console.log("load guns data", this.allGunsData);
		console.log("load skills data", this.allSkillsData);
		console.log("load parts data", this.allPartsData);
	}

	public static get instance(): GameController {
		return GameController.$inst!==undefined ? GameController.$inst : GameController.$inst=new GameController();
	}

	public init(root: Main): void {
		this.root = root;
		this.actMgr.start(60);
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

	public loadFBPlayerData(): FBPlayerData {
		this.fbPlayerData = {
			name: FBInstant.player.getName(),
			portrait: FBInstant.player.getPhoto()
		};
		return this.fbPlayerData;
	}

	public deletePlayerData(): void {
		egret.localStorage.clear();
		this.playerData = null;
	}

	public resetPlayerData(): PlayerData {
		this.playerData = JSON.parse(JSON.stringify(GlobalPlayerInitData));
		this.playerData.sharechestTs = egret.getTimer();  // FIXME
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
		this.playerData.sharechestTs = egret.getTimer();  // FIXME
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
		console.assert(GameController.instance.getGunData(key) != null);
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
		console.assert(GameController.instance.getSkillData(key) != null);
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
		let speed = GameController.instance.actMgr.speed;
		GameController.instance.actMgr.speed = 0;
		// ectrl.stopRush();
		let panel = new PartsPanel(data, (res)=>{
			GameController.instance.actMgr.speed = speed;
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
			console.assert(this.getGunData(gunKey)!==null);
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
			console.assert(this.getSkillData(skillKey)!==null);
		}
		return skills;
	}

	private fixShipExpsData(data: ShipExpsData): ShipExpsData {
		for (let key in data) {
			let shipExpInfo = data[key];
			shipExpInfo.key = key;
		}
		return data;
	}

	private loadAndCheckAllShipExps(shipExps: string[]): string[] {
		for (let i in shipExps) {
			let shipExpKey = shipExps[i];
			console.assert(this.getShipExpData(shipExpKey)!==null);
		}
		return shipExps;
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
			console.assert(this.getPartData(partKey)!==null);
		}
		return parts;
	}

	private loadDropTable(rawTable: any[]): DropTable<any> {
		let ret: DropTable<any> = new DropTable<any>();
		for (let i in rawTable) {
			let drop = rawTable[i];
			let item = drop[0];
			let weight = drop[1];
			if (typeof(item) === "string") {
				ret.push(item, weight);
			} else {
				ret.push(this.loadDropTable(item), weight);
			}
		}
		return ret;
	}

	private loadAllChestDropTable(): DropTable<any>[] {
		let ret: DropTable<any>[] = [];
		let chest1 = this.loadDropTable(GlobalChest1Drop);
		ret.push(chest1);
		return ret;
	}

	public calcHeroMaxHp(level: number): number {
		return Math.floor(GlobalConfig.baseMaxHp+level*0.5);
	}

	public calcHeroSpeed(level: number): number {
		return Math.floor(GlobalConfig.baseSpeed+level*10);
	}

	public calcHeroPowerIncPer(level: number): number {
		return GlobalConfig.basePowerIncPer+level*0.01;
	}

	public spawnHeroShip(world: World): HeroShip {
		let hero = new HeroShip(GlobalHeroModel, GlobalHeroModelScale);
		world.addShip(hero);
		let level = this.getHeroLevel();
		hero.resetHp(this.calcHeroMaxHp(level));
		hero.force.force = tutils.Player1Force;
		hero.force.ally(tutils.AllyForce);
		hero.speed.baseValue = this.calcHeroSpeed(level);
		let gunPowerIncPer = this.calcHeroPowerIncPer(level);

		let gunKey = this.playerData.gun;
		let gunData = this.getGunData(gunKey);
		let gunLevel = this.getGunLevel(gunKey);
		let gun = Gun.createGun(gunData.gun, tutils.levelValue(gunData.bullet, gunLevel));
		gun.bulletSpeed.baseValue = tutils.levelValue(gunData.bulletSpeed, gunLevel);
		gun.fireCooldown.baseValue = tutils.levelValue(gunData.fireCD, gunLevel);
		gun.bulletPower.baseValue = tutils.levelValue(gunData.bulletPower, gunLevel) * (1 + gunPowerIncPer);
		gun.bulletMaxHitTimes = tutils.levelValue(gunData.bulletHitTimes, gunLevel);
		gun.bulletHitInterval.baseValue = tutils.levelValue(gunData.bulletHitInterval, gunLevel);
		gun.bulletNum = tutils.levelValue(gunData.bulletNum, gunLevel);
		hero.addGun(gun, true);
		// gun.levelUp(gunLevel-1, false);

		let skillKey = this.playerData.skill;
		let skillData = this.getSkillData(skillKey);
		let skill = this.createSkill(this.playerData.skill);
		hero.setSkill(skill);

		let skillLevel = this.getSkillLevel(skillKey);
		skill.levelUp(skillLevel-1, false);
		return hero;
	}

	public getGunData(key?: string): GunDataItem {
		let item = this.allGunsData[key===undefined ? this.playerData.gun : key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getSkillData(key?: string): SkillDataItem {
		let item = this.allSkillsData[key===undefined ? this.playerData.skill : key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getPartData(key: string): PartDataItem {
		let item = this.allPartsData[key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getShipExpData(key: string): ShipExpDataItem {
		let item = this.allShipExpsData[key];
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

	public getHeroLevel(): number {
		return this.expToLevel(this.playerData.exp);
	}

	public expToGunLevel(exp: number): number {
		for (let i=1; i<=this.gunExpTable.length; i++) {
			if (this.gunExpTable[i-1] > exp) {
				return i;
			}
		}
		return this.gunExpTable.length+1;
	}

	public getGunLevel(key?: string): number {
		let playerGunData = this.getPlayerGunData(key);
		if (!playerGunData) {
			return -1;
		}
		return this.expToGunLevel(playerGunData.exp);
	}

	public expToSkillLevel(exp: number): number {
		for (let i=1; i<=this.skillExpTable.length; i++) {
			if (this.skillExpTable[i-1] > exp) {
				return i;
			}
		}
		return this.skillExpTable.length;
	}

	public getSkillLevel(key?: string): number {
		let playerSkillData = this.getPlayerSkillData(key);
		if (!playerSkillData) {
			return -1;
		}
		return this.expToSkillLevel(playerSkillData.exp);
	}

	public getPlayerGunData(key?: string): PlayerGunData {
		let item = this.playerData.guns[key===undefined ? this.playerData.gun : key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public getPlayerSkillData(key?: string): PlayerSkillData {
		let item = this.playerData.skills[key===undefined ? this.playerData.skill : key];
		if (item === undefined) {
			return null;
		}
		return item;
	}

	public createBuff(key: string): Buff {
		let buff: Buff;
		switch (key) {
		case "buff_gun_level_up":
			buff = new GunLevelUpBuff(1);
			buff.model = "BuffGunLevelUp_png";
            buff.name = "Power Level Up!";
			break;
		case "buff_gun_power_up":
			buff = new GunBuff(8000, 0, +0.20, 0);
			buff.model = "BuffGunPower_png";
			buff.name = "Fire Power Up!";
			buff.key = key;
			break;
		case "buff_gun_cdr_up":
			buff = new GunBuff(8000, -0.20, 0, 0);
			buff.model = "BuffGunCDR_png";
			buff.name = "Fire Rate Up!";
			buff.key = key;
			break;
		case "buff_satellite_ball":
			let gun = Gun.createGun(SatelliteGun, ExplosionBallBullet);
            gun.fireCooldown.baseValue = 1000;
            gun.bulletPower.baseValue = 50;
            gun.bulletNum = 5;
            gun.bulletMaxHitTimes = 1;
            gun.bulletHitInterval.baseValue = 1000;
			gun.period = 1000;
            buff = new AddGunBuff(10000, [gun]);
			buff.model = "BuffSatelliteGun_png";
            buff.name = "Satellite Ball!";
			buff.key = key;
			break;
		case "buff_ship_shield":
			buff = new ShieldBuff(20000, 1000);
			buff.model = "BuffShield_png";
            buff.name = "Get Shield!";
			buff.key = key;
			break;
		case "buff_add_energy":
			buff = new AddEnergyBuff(150);
			buff.model = "BuffAddEnergy_png";
            buff.name = "Energy Inc!";
			buff.key = key;
			break;
		
		// runtime buff
		case "elec_induced":
			buff = new ElecBuff(5000, 10);
			buff.key = key;
			break;
		case "dying_bomb_neutral":
			buff = new BombBuff(Buff.Infinite, 1.00, 1000, 300, tutils.NeutralForce);
			buff.key = key;
			break;
		case "drop_coins_buff":
			buff = new CoinsDropBuff(Buff.Infinite, 0.20, this.dropTableForBossEnemy);
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
		case "part_energy_speed_up_2":
			buff = new EnergySpeedUpBuff(Buff.Infinite, 1.25);
			buff.key = key;
			// buff.name = "";
			// buff.model = "_png";
			break;
		case "part_energy_battery_2":
			buff = new EnergyNeverEmptyBuff(Buff.Infinite, 0.30);
			buff.key = key;
			// buff.name = "";
			// buff.model = "_png";
			break;
		case "part_critical_2":
			buff = new CriticalBuff(Buff.Infinite, 0.25, 2.0);
			buff.key = key;
			break;
		case "part_elec_induced_gun":
			let gun2 = Gun.createGun(SineGun, BlueDiamondBullet);
			gun2.fireCooldown.baseValue = 2000;
			gun2.amplitudeDelta = 150;
			gun2.bulletNum = 2;
			gun2.bulletSpeed.baseValue = 100;
			gun2.bulletPower.baseValue = 5;
			gun2.bulletMaxHitTimes = 1000;
			gun2.bulletHitInterval.baseValue = 10000;
			let buff2 = new AddTargetBuffBuff(Buff.Infinite, 0.2, ["elec_induced"]);
			buff2.key = "part_elec_induced_buff";
			buff = new AddGunAndBuffBuff(Buff.Infinite, gun2, [buff2]);
			buff.key = key;
			break;
		case "part_cdr_up_1":
			buff = new GunBuff(Buff.Infinite, -0.10, 0, +0.10);
			buff.key = key;
			// buff.name = "Test Part1";
			// buff.model = "BuffGunCDR_png";
			break;
		case "part_power_up_1":
			buff = new GunBuff(Buff.Infinite, 0.00, +0.10, 0.00);
			buff.key = key;
			// buff.name = "Test Part2";
			// buff.model = "BuffGunPower_png";
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

		let partInfo = this.getPartData(key);
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

	public runAction(target: egret.IHashObject, action: tutils.Action): tutils.Action {
		this.actMgr.addAction(target, action);
		return action;
	}

	public stopAllActions(target: egret.IHashObject): void {
		this.actMgr.removeAllActions(target);
	}

	public stopActionByTag(target: egret.IHashObject, tag: number): void {
		this.actMgr.removeActionByTag(target, tag);
	}

	public getActionByTag(target: egret.IHashObject, tag: number): tutils.Action {
		return this.actMgr.getActionByTag(target, tag);
	}

	public setActionSpeed(speed: number): void {
		this.actMgr.speed = speed;
	}

	public spawnSupply(world: World, dropKey: string, x: number, y: number, jump: boolean=false, delay: number=0): void {
        let supply: Supply;
		let ease: Function;
        if (dropKey.indexOf("coin_") === 0) {
            supply = world.pools.newObject(ScoreSupply, 1);
            supply.speed = 100;
			ease = egret.Ease.quadIn;
        } else if (dropKey.indexOf("part_") === 0) {
            let part = GameController.instance.createPart(dropKey);
            supply = world.pools.newObject(PartSupply, part.model, [part]);
            supply.speed = 20;
			supply.pickDist = 0;
        } else if (dropKey.indexOf("buff_") === 0) {
			let buff = this.createBuff(dropKey);
			supply = world.pools.newObject(BuffSupply, buff.model, [buff]);
			supply.speed = 20;
		}
        if (!supply) {
            return;
        }

        let act = new tutils.Sequence(
            new tutils.DelayTime(delay),
            new tutils.CallFunc(():void=>{
                world.addSupply(supply);
                if (jump) {
                    supply.jump(x, y, 500, 300, ():void=>{
                        supply.drop(supply.x, supply.y, ease);
                    }, this);
                } else {
                    supply.drop(x, y, ease);
                }
            }, this)
        );
        supply.runAction(act);
    }
}

// type PlayerShipData = {
// 	exp: number,
// 	use: number,
// 	enemy: number
// }

type FBPlayerData = {
	name: string,
	portrait: string
}

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
	bullet: tutils.Constructor<Bullet>|tutils.Constructor<Bullet>[],
	bulletSpeed: number|number[],
	fireCD: number|number[],
	bulletPower: number|number[],
	bulletNum: number|number[],
	bulletHitTimes: number|number[],
	bulletHitInterval: number|number[],
	coins?: number
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

type ShipExpDataItem = {
	key?: string,
	
	name: string,
	model: string,
	exp: number
}

type ShipExpsData = {
	[key: string]: ShipExpDataItem
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