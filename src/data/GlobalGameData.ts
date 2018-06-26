const GlobalConfig = {
	ver: 1,
	reset: true,
	freeChestCD: 3600
}

const GlobalMaxHp = 50;  // for UI
const GlobalMaxSpeed = 500;
const GlobalMaxPower = 100;  // for UI
const GlobalMaxFireRate = 10;  // for UI

const GlobalExpTable = [300, 600, 900, 1500, 2400, 3900, 6300, 10200, 16500, 26700, 43200, 69900, 113100, 183000, 296100, 479100, 775200, 1254300, 2029500, 3283800];
const GlobalGunExpTable = [2, 5, 10, 15, 20, 25, 30, 35, 40];
const GlobalSkillExpTable = [2, 5, 10, 15, 20, 25, 30, 35, 40];

const GlobalHeroModel = "RedHeroShip_png";
const GlobalHeroModelScale = 0.4;

const GUN_SINGLE = "gun_single";
const GUN_ROW = "gun_row";
const GUN_SHOT = "gun_shot";
const GUN_GUIDE = "gun_guide";
const GUN_SOUNDWAVE = "gun_soundwave";
const GUN_ENERGYWAVE = "gun_energywave";
const GUN_EXPLOSION = "gun_explosion";
const GUN_FOCUS = "gun_focus";
const GUN_MISSILE = "gun_missile";
const GUN_SINE = "gun_sine";

const SKILL_TURBO_FIRE = "skill_turbo_fire";
const SKILL_SHIELD_BALL = "skill_shield_ball";
const SKILL_GHOST_SHIPS = "skill_ghost_ships";
const SKILL_SUPER_HERO = "skill_super_hero";
const SKILL_METEOROID_RUSH = "skill_meteoroid_rush";

const PART_TEST1 = "part_test1";
const PART_TEST2 = "part_test2";
const PART_METEOROID = "part_meteoroid";
const PART_CRITICAL_2 = "part_critical_2";
const PART_ELEC_INDUCED_GUN = "part_elec_induced_gun";
const PART_POWER_SPEED_UP_2 = "part_power_speed_up_2";
const PART_POWER_BATTERY_2 = "part_power_battery_2";

const GlobalAllGuns: string[] = [
	//"gun_test",
	"gun_single",
	"gun_row",
	"gun_shot",
	"gun_guide",
	"gun_soundwave",
	"gun_energywave",
	"gun_explosion",
	"gun_focus",
	"gun_missile",
	"gun_sine",
];

const GlobalAllSkills: string[] = [
	"skill_turbo_fire",
	"skill_shield_ball",
	"skill_ghost_ships",
	"skill_super_hero",
	"skill_meteoroid_rush"
];

const GlobalAllParts: string[] = [
	"part_test1",
	"part_test2",
	"part_meteoroid",
	"part_critical_2",
	"part_elec_induced_gun",
	"part_power_speed_up_2",
	"part_power_battery_2"
];

const GlobalChest1Drop = [
	[
		[
			["shipexp_1", 100],
			["shipexp_2", 100],
			["shipexp_5", 100],
			["shipexp_10", 100]
		],
		100
	],
	[
		[
			["gun_single", 100],
			["gun_row", 100],
			["gun_shot", 100],
			["gun_guide", 100],
			["gun_soundwave", 100],
			["gun_energywave", 100],
			["gun_explosion", 100],
			["gun_focus", 100],
			["gun_missile", 100],
			["gun_sine", 100]
		],
		100
	],
	[
		[
			["skill_turbo_fire", 100],
			["skill_shield_ball", 100],
			["skill_ghost_ships", 100],
			["skill_super_hero", 100],
			["skill_meteoroid_rush", 100]
		],
		100
	]
];

const GlobalChest1SkillDrop: [string, number][] = [
	["skill_turbo_fire", 100],
	["skill_shield_ball", 100],
	["skill_ghost_ships", 100],
	["skill_super_hero", 100],
	["skill_meteoroid_rush", 100]
];

// all datas
const GlobalGunsData: GunsData = {
	gun_test: {
		name: "测试炮",
		desc: "测试用的",
		model: "Energy_png",
		gun: SatelliteGun,
		bullet: StormBullet,
		bulletSpeed: 100,
        fireCD: 10000,
		bulletPower: 10,
		bulletNum: 3,
		bulletHitTimes: 10,
		bulletHitInterval: 1000,
		coins: 10
	},
    gun_single: {
		name: "单束粒子炮",
		desc: "普通的主炮，只能发射一列粒子束，但射速很快",
		model: "Hero_png",
		gun: SingleGun,
		bullet: BlueWaveBullet,
		bulletSpeed: 200,
        fireCD: 100,
		bulletPower: 10,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		coins: 0
	},
    gun_soundwave: {
		name: "多重音波炮",
		desc: "很强力的主炮，有一定穿透效果，一次发射多枚弹药",
		model: "SoundWave_png",
		gun: SoundWaveGun,
		bullet: SoundWaveBullet,
		bulletSpeed: 100,
        fireCD: 300,
		bulletPower: 4,
		bulletNum: 5,
		bulletHitTimes: 2,
		bulletHitInterval: 500,
		coins: 2500
    },
    gun_energywave: {
		name: "能量波动炮",
		desc: "具有超强的贯穿力，每一发都威力巨大，但射速较慢",
		model: "Energy3_png",
		gun: EaseGun,
		bullet: ShakeWaveBullet,
		bulletSpeed: 100,
        fireCD: 600,
		bulletPower: 25,
		bulletNum: 1,
		bulletHitTimes: 20,
		bulletHitInterval: 200,
		coins: 2000
    },
    gun_guide: {
		name: "制导能量弹炮",
		desc: "子弹自动制导，射速较快",
		model: "OrangeFatHeroShip_png",
		gun: GuideGun,
		bullet: ShakeWave2Bullet,
		bulletSpeed: 150,
        fireCD: 150,
		bulletPower: 18,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		coins: 1000
    },
    gun_explosion: {
		name: "等离子炸弹炮",
		desc: "发射威力强大的等离子炸弹，炸弹命中目标会爆炸，对周围敌方目标造成溅射伤害",
		model: "Energy4_png",
		gun: ExplosionGun,
		bullet: ExplosionBullet,
		bulletSpeed: 160,
        fireCD: 300,
		bulletPower: 15,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		coins: 3000
    },
    gun_focus: {
		name: "聚焦粒子束炮",
		desc: "具备一定穿透能力，子弹先向四周射出，然后在前方聚焦于一点",
		model: "Energy2_png",
		gun: FocusGun,
		bullet: BlueWaveBullet,
		bulletSpeed: 180,
        fireCD: 200,
		bulletPower: 5,
		bulletNum: 2,
		bulletHitTimes: 5,
		bulletHitInterval: 1000,
		coins: 2800
    },
    gun_row: {
		name: "复束粒子炮",
		desc: "可以同时发射多列子弹",
		model: "RedHeroShip_png",
		gun: RowGun,
		bullet: BlueWaveBullet,
		bulletSpeed: 160,
        fireCD: 200,
		bulletPower: 9,
		bulletNum: 2,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		coins: 500
    },
    gun_shot: {
		name: "发散粒子炮",
		desc: "发射散弹，威力强大，射速一般",
		model: "GreenHeroShip_png",
		gun: ShotGun,
		bullet: BlueWaveBullet,
		bulletSpeed: 160,
        fireCD: 300,
		bulletPower: 10,
		bulletNum: 5,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		coins: 1200
    },
	gun_missile: {
		name: "导弹发射器",
		desc: "一次发射三枚制导导弹，导弹击中目标之后将爆炸，对周围敌方目标造成溅射伤害",
		model: "Energy_png",
		gun: MissileGun,
		bullet: MissileBullet,
		bulletSpeed: 200,
        fireCD: 1000,
		bulletPower: 20,
		bulletNum: 3,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		coins: 5000
    },
	gun_sine: {
		name: "正弦轨道炮",
		desc: "可同时发射多枚以相同波长、不同振幅的、且具备一定贯穿力的子弹",
		model: "WhiteFatHeroShip_png",
		gun: SineGun,
		bullet: BlueWaveBullet,
		bulletSpeed: 180,
        fireCD: 200,
		bulletPower: 5,
		bulletNum: 2,
		bulletHitTimes: 5,
		bulletHitInterval: 1000,
		coins: 2800
    },
};

const GlobalSkillsData: SkillsData = {
	skill_turbo_fire: {
		name: "火力倾泻",
		desc: "大幅度提高主炮发射速率，但是为了维持稳定，飞船会暂时降低一定机动性",
		model: "RedFatHeroShip_png",
		coins: 0
	},
	skill_shield_ball: {
		name: "风暴齿轮",
		desc: "向前发射一枚巨大的能量齿轮，能量齿轮高速旋转并缓慢向前移动，同时会射出大量能量弹，能量齿轮可以阻挡敌方子弹",
		model: "GearBullet_png",
		coins: 0
	},
	skill_super_hero: {
		name: "火力援助",
		desc: "请求银河号进行支援，银河号具备多重火力，并且可以阻挡敌方子弹",
		model: "GreenHeroShip_png",
		coins: 0
	},
	skill_ghost_ships: {
		name: "量子幻影",
		desc: "制造若干幻影协助战斗，幻影飞船将会继承母舰一部分基础火力",
		model: "PurpleFatHeroShip_png",
		coins: 0
	},
	skill_meteoroid_rush: {
		name: "流星灾难",
		desc: "召唤大量流星冲击前方区域，流星撞击可对敌方目标造成巨大伤害，流星可以阻挡敌方子弹",
		model: "Meteoroid_png",
		coins: 0
	},
};

const GlobalPartsData: PartsData = {
	part_meteoroid: {
		name: "流星之怒",
		model: "PartMeteoroid_png",
		desc: "击败敌方单位有20%几率召唤一颗流星，流星撞击敌方单位将造成200点伤害",
		buffs: ["part_meteoroid"],
	},
	part_power_speed_up_2: {
		name: "聚能回路",
		model: "PartPowerSpeedUp_png",
		desc: "收集能量的速度提升30%",
		buffs: ["part_power_speed_up_2"],
	},
	part_power_battery_2: {
		name: "蓄能器",
		model: "PartBattery_png",
		desc: "当能量耗尽时立即补充25%能量",
		buffs: ["part_power_battery_2"],
	},
	part_critical_2: {
		name: "暴击零件",
		model: "PartCritical2_png",
		desc: "击中敌方目标有20%概率对其造成200%伤害！",
		buffs: ["part_critical_2"],
	},
	part_elec_induced_gun: {
		name: "电磁发射器",
		model: "PartElecInducedGun_png",
		desc: "每5秒向前发射2枚电磁波弹，被每一枚子弹击中的目标有20%概率进入感电状态。攻击感电状态下的单位会额外附加10点感电伤害！",
		buffs: ["part_elec_induced_gun"],
	},
	part_test1: {
		name: "中级攻速零件(测试)",
		model: "PartCDRUp1_png",
		desc: "能够非常快、非常快地、超乎你想像的快，总之很快的去进行射击，通常来讲可以增加10%射速！",
		buffs: ["part_test1"],
	},
	part_test2: {
		name: "中级火力零件(测试)",
		model: "PartPowerUp1_png",
		desc: "增加10%主炮火力",
		buffs: ["part_test2"],
	}
};

const GlobalPlayerInitData: PlayerData = {
	ver: GlobalConfig.ver,
    highscore: {
        score: 0,
        stage: 0,
        gunKey: "",
		skillKey: "",
    },
    maxStage: 0,
    coins: 10000,
	maxHp: 3,
	speed: 150,
	exp: 0,
	enemies: 0,
	gunsNum: 1,
    guns: {
		gun_single: {
			exp: 0,
			use: 0
		}
	},
	gun: "gun_single",
	skillsNum: 1,
	skills: {
		skill_turbo_fire: {
			exp: 0,
			use: 0
		}
	},
	skill: "skill_turbo_fire",
	onlineChestTs: 0,
	adChestTs: 0,
	sharechestTs: 0,
	allChests: [0]
};
