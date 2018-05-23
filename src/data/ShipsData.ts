const GlobalShipsData: ShipsData = {
	ship_test: {
		name: "Test",
		model: "Energy_png",
		maxHp: 5,
		speed: 200,
		gun: EaseGun,
		bullet: ShakeWaveBullet,
		bulletSpeed: 100,
        fireCD: 1000,
		bulletPower: 5,
		bulletNum: 1,
		bulletHitTimes: 1000,
		bulletHitInterval: 1000,
		skillName: "turbo"
	},
    ship_hero: {
		name: "Hero",
		model: "Hero_png",
		maxHp: 100,
		speed: 200,
		gun: Gun,
		bullet: Bullet,
		bulletSpeed: 80,
        fireCD: 200,
		bulletPower: 10,
		bulletNum: 1,
		bulletHitTimes: 1,
		bulletHitInterval: 1000,
		skillName: "turbo"
	},
    ship_soundwave: {
		name: "SoundWave",
		model: "SoundWave_png",
		maxHp: 100,
		speed: 200,
		gun: SoundWaveGun,
		bullet: SoundWaveBullet,
		bulletSpeed: 60,
        fireCD: 800,
		bulletPower: 10,
		bulletNum: 5,
		bulletHitTimes: 2,
		bulletHitInterval: 200,
		skillName: "turbo"
    },
    ship_energy: {
		name: "Energy",
		model: "Energy_png",
		maxHp: 5,
		speed: 200,
		gun: EaseGun,
		bullet: ShakeWaveBullet,
		bulletSpeed: 100,
        fireCD: 1000,
		bulletPower: 5,
		bulletNum: 1,
		bulletHitTimes: 10,
		bulletHitInterval: 500,
		skillName: "turbo"
    }
};

const GlobalAllShips: string[] = [
	"ship_test",
	"ship_hero",
	"ship_soundwave",
	"ship_energy"
];

const GlobalExpTable = [100, 200, 300, 500, 800, 1300, 2100, 3400, 5500, 8900, 14400, 23300, 37700, 61000, 98700, 159700, 258400, 418100, 676500, 1094600];