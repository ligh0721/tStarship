const GlobalShipsData: ShipsData = {
	ship_test: {
		name: "Test",
		maxHp: 100,
		speed: 200,
		gun: FocusGun,
		bullet: EllipseBullet,
		bulletSpeed: 80,
        fireCD: 200,
		bulletPower: 3,
		bulletNum: 4,
		bulletHitTimes: 5,
		bulletHitInterval: 100,
		skillName: "turbo"
	},
    ship_hero: {
		name: "Hero",
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
    }
};