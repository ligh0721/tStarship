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
		bulletHitTimes: 5,
		bulletNum: 4,
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
		bulletHitTimes: 1,
		bulletNum: 1,
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
		skillName: "turbo"
    }
};