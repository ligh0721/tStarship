const GlobalConfig = {
	ver: 0,
	reset: true
}

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
		skill: "shield_ball",
		coins: 10
	},
    ship_hero: {
		name: "英雄号",
		model: "Hero_png",
		maxHp: 12,
		speed: 200,
		gunName: "单束粒子炮",
		gun: Gun,
		bullet: Bullet,
		bulletSpeed: 200,
        fireCD: 100,
		bulletPower: 10,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skill: "super_hero",
		coins: 0
	},
    ship_soundwave: {
		name: "音波使者",
		model: "SoundWave_png",
		maxHp: 12,
		speed: 200,
		gunName: "多重音波炮(低穿透)",
		gun: SoundWaveGun,
		bullet: SoundWaveBullet,
		bulletSpeed: 100,
        fireCD: 300,
		bulletPower: 4,
		bulletNum: 5,
		bulletHitTimes: 2,
		bulletHitInterval: 500,
		skill: "turbo_fire",
		coins: 2500
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
        fireCD: 600,
		bulletPower: 25,
		bulletNum: 1,
		bulletHitTimes: 20,
		bulletHitInterval: 200,
		skill: "shield_ball",
		coins: 2000
    },
    ship_hunter: {
		name: "赏金猎人",
		model: "Energy3_png",
		maxHp: 16,
		speed: 200,
		gunName: "制导能量弹(制导)",
		gun: GuideGun,
		bullet: ShakeWave2Bullet,
		bulletSpeed: 100,
        fireCD: 150,
		bulletPower: 18,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skill: "turbo_fire",
		coins: 1000
    },
    ship_explosion: {
		name: "爆破者",
		model: "Energy4_png",
		maxHp: 20,
		speed: 200,
		gunName: "离子炸弹(溅射)",
		gun: ExplosionGun,
		bullet: ExplosionBullet,
		bulletSpeed: 160,
        fireCD: 300,
		bulletPower: 15,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skill: "meteorolite_rush",
		coins: 3000
    },
    ship_focus: {
		name: "和谐号",
		model: "Energy2_png",
		maxHp: 12,
		speed: 200,
		gunName: "聚焦粒子束(中穿透)",
		gun: FocusGun,
		bullet: Bullet,
		bulletSpeed: 180,
        fireCD: 200,
		bulletPower: 5,
		bulletNum: 2,
		bulletHitTimes: 5,
		bulletHitInterval: 1000,
		skill: "shield_ball",
		coins: 2800
    },
    ship_row: {
		name: "开拓者",
		model: "Solar2_png",
		maxHp: 14,
		speed: 200,
		gunName: "多重粒子炮",
		gun: RowGun,
		bullet: Bullet,
		bulletSpeed: 160,
        fireCD: 200,
		bulletPower: 9,
		bulletNum: 2,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skill: "ghost_ships",
		coins: 500
    },
    ship_shot: {
		name: "游荡者",
		model: "Solar_png",
		maxHp: 15,
		speed: 200,
		gunName: "发散粒子炮",
		gun: ShotGun,
		bullet: Bullet,
		bulletSpeed: 160,
        fireCD: 300,
		bulletPower: 10,
		bulletNum: 5,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skill: "shield_ball",
		coins: 1200
    },
	ship_missile: {
		name: "导弹天使",
		model: "Energy_png",
		maxHp: 20,
		speed: 200,
		gunName: "制导导弹(制导爆炸)",
		gun: MissileGun,
		bullet: MissileBullet,
		bulletSpeed: 200,
        fireCD: 1000,
		bulletPower: 25,
		bulletNum: 3,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skill: "turbo_fire",
		coins: 5000
    },
};

const GlobalAllShips: string[] = [
	//"ship_test",
	"ship_hero",
	"ship_row",
	"ship_shot",
	"ship_hunter",
	"ship_soundwave",
	"ship_energy",
	"ship_explosion",
	"ship_focus",
	"ship_missile",
];

const GlobalPlayerInitData: PlayPrefsData = {
	ver: GlobalConfig.ver,
    highscore: {
        score: 0,
        stage: 0,
        shipId: "",
    },
    maxStage: 0,
    coins: 0,
	shipsNum: 0,
    ships: {},
};

const GlobalExpTable = [300, 600, 900, 1500, 2400, 3900, 6300, 10200, 16500, 26700, 43200, 69900, 113100, 183000, 296100, 479100, 775200, 1254300, 2029500, 3283800];

const GlobalMaxHp = 50;
const GlobalMaxPower = 100;
const GlobalMaxFireRate = 10;
