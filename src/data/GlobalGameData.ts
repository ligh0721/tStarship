const GlobalShipsData: ShipsData = {
	ship_test: {
		name: "测试号",
		model: "Energy_png",
		maxHp: 10,
		speed: 200,
		gunName: "测试炮",
		gun: SatelliteGun,
		bullet: StormBullet,
		bulletSpeed: 100,
        fireCD: 10000,
		bulletPower: 10,
		bulletNum: 3,
		bulletHitTimes: 10,
		bulletHitInterval: 1000,
		skillName: "turbo"
	},
    ship_hero: {
		name: "英雄号",
		model: "Hero_png",
		maxHp: 12,
		speed: 200,
		gunName: "单束粒子炮",
		gun: Gun,
		bullet: Bullet,
		bulletSpeed: 100,
        fireCD: 150,
		bulletPower: 10,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skillName: "turbo"
	},
    ship_soundwave: {
		name: "音波使者",
		model: "SoundWave_png",
		maxHp: 12,
		speed: 200,
		gunName: "多重音波炮(低穿透)",
		gun: SoundWaveGun,
		bullet: SoundWaveBullet,
		bulletSpeed: 60,
        fireCD: 800,
		bulletPower: 5,
		bulletNum: 5,
		bulletHitTimes: 2,
		bulletHitInterval: 200,
		skillName: "turbo"
    },
    ship_energy: {
		name: "超能之翼",
		model: "Energy_png",
		maxHp: 15,
		speed: 200,
		gunName: "能量波动(高穿透)",
		gun: EaseGun,
		bullet: ShakeWaveBullet,
		bulletSpeed: 100,
        fireCD: 1000,
		bulletPower: 13,
		bulletNum: 1,
		bulletHitTimes: 10,
		bulletHitInterval: 500,
		skillName: "turbo"
    },
    ship_hunter: {
		name: "赏金猎人",
		model: "Energy_png",
		maxHp: 16,
		speed: 200,
		gunName: "制导能量弹(制导)",
		gun: GuideGun,
		bullet: ShakeWave2Bullet,
		bulletSpeed: 80,
        fireCD: 300,
		bulletPower: 8,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skillName: "turbo"
    },
    ship_explosion: {
		name: "爆破者",
		model: "Energy_png",
		maxHp: 20,
		speed: 200,
		gunName: "离子炸弹(溅射)",
		gun: ExplosionGun,
		bullet: ExplosionBullet,
		bulletSpeed: 60,
        fireCD: 500,
		bulletPower: 13,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skillName: "turbo"
    },
    ship_focus: {
		name: "和谐号",
		model: "Energy_png",
		maxHp: 12,
		speed: 200,
		gunName: "聚焦粒子束(中穿透)",
		gun: FocusGun,
		bullet: Bullet,
		bulletSpeed: 80,
        fireCD: 200,
		bulletPower: 3,
		bulletNum: 2,
		bulletHitTimes: 5,
		bulletHitInterval: 1000,
		skillName: "turbo"
    },
    ship_row: {
		name: "开拓者",
		model: "Solar_png",
		maxHp: 14,
		speed: 200,
		gunName: "多重粒子炮",
		gun: RowGun,
		bullet: Bullet,
		bulletSpeed: 60,
        fireCD: 400,
		bulletPower: 8,
		bulletNum: 2,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skillName: "turbo"
    },
    ship_shot: {
		name: "游荡者",
		model: "Solar_png",
		maxHp: 15,
		speed: 200,
		gunName: "发散粒子炮",
		gun: ShotGun,
		bullet: Bullet,
		bulletSpeed: 60,
        fireCD: 600,
		bulletPower: 10,
		bulletNum: 5,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skillName: "turbo"
    }
};

const GlobalAllShips: string[] = [
	"ship_test",
	"ship_hero",
	"ship_soundwave",
	"ship_energy",
	"ship_row",
	"ship_shot",
	"ship_hunter",
	"ship_explosion",
	"ship_focus"
];

const GlobalPlayerInitData: PlayPrefsData = {
    highscore: {
        score: 0,
        stage: 0,
        shipId: "",
    },
    maxStage: 0,
    coins: 0,
    ships: {},
};

const GlobalExpTable = [100, 200, 300, 500, 800, 1300, 2100, 3400, 5500, 8900, 14400, 23300, 37700, 61000, 98700, 159700, 258400, 418100, 676500, 1094600];

const GlobalMaxHp = 50;
const GlobalMaxPower = 100;
const GlobalMaxFireRate = 10;