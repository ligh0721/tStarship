class BattleLayer extends tutils.Layer {
	private world: World;
    private hero: HeroShip;
	private score: Score;
    private enemyCtrl: EnemyController;
	
	protected onInit() {
        let bg = tutils.createBitmapByName("grid100_png");
        this.layer.addChild(bg);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.layer.touchEnabled = true;
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		
        // 创建世界
        this.world = new World(this.layer, stageW, stageH);
        this.world.start(30);
        this.world.setOnShipDyingListener(this.onShipDying, this);
        this.world.setOnShipHitSupplyListener(this.onShipHitSupply, this);

        // 开启调试辅助线
        // this.world.dbgDrawSprite = <egret.Sprite>tutils.createLayer(this.layer, 0x000000, 0.0);
        // this.world.dbgTextField = new egret.TextField()
        // this.world.dbgDrawSprite.addChild(this.world.dbgTextField);

        // 创建敌军控制器
        this.enemyCtrl = new EnemyController(this.world);

        // 创建玩家飞船
        let hero = new HeroShip(40, 80);
        this.hero = hero;
        this.world.addShip(hero);
        hero.force.force = tutils.Player1Force;
        hero.x = stageW * 0.5;
        hero.y = stageH - hero.height * 0.5;
        hero.speed.baseValue = 50;
        let gun = Gun.createGun(Gun, Bullet);
        gun.fireCooldown.baseValue = 200;
        gun.bulletSpeed.baseValue = 80;
        gun.bulletPower.baseValue = 2;
        gun.bulletPowerLossPer = 1;
        gun.bulletPowerLossInterval.baseValue = 1000;
        hero.addGun(gun, true).autoFire = true;
        
        // 创建测试补给箱
        let testSupplyTimer = new tutils.Timer();
        testSupplyTimer.setOnTimerListener((dt: number): void=>{
            this.createTestSupply();
        });
        testSupplyTimer.start(5000, true, 0);

        // 创建测试敌军
        //this.createTestEnemyShip(10);
        
        // 创建分数板
		let score = new Score(this.layer);
		score.digits = 10;
		score.score = 0;
		//score.setScore(10000, 5000);
        this.score = score;
        this.score.bmpText.x = this.stage.stageWidth - this.score.bmpText.textWidth;

        // 创建敌军小队
        let enemies: EnemyShip[] = [];
        let n = 1000;
        for (let i=0; i<n; i++) {
            let enemy = this.enemyCtrl.createEnemyShip(40, 60, "tri");
            enemy.resetHp(5);
            enemies.push(enemy);
        }

        // this.enemyCtrl.enemyShipMoveInStraightLine(enemyShip, enemyShip.width*0.5);
        this.enemyCtrl.rushBezier(enemies, {x: this.world.width*0.5, y: 0}, {x: this.world.width*0.5, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.5}, false);
        // this.enemyCtrl.enemyShipMoveInBezierCurve(enemyShip1, {x: this.world.width*0.5, y: 0}, {x: this.world.width*0.5, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.8});
	}

    private onShipDying(ship: Ship, killer: Ship) {
        if (this.hero == ship) {
            // TODO: GAME OVER
        } else if (this.hero.force.isMyEnemy(ship.force)) {
            this.score.setScore(this.score.score+100, 1);
        }
    }

    private onShipHitSupply(ship: Ship, supply: Supply) {
    }

	private onTouchBegin(evt: egret.TouchEvent) {
        if (!this.hero.isAlive()) {
            return;
        }
        this.hero.move(evt.localX, evt.localY);
    }

    private onTouchMove(evt: egret.TouchEvent) {
        if (!this.hero.isAlive()) {
            return;
        }
        this.hero.move(evt.localX, evt.localY);
    }

	// FIXME: test
	private createTestEnemyShip(n: number) {
		for (let i=0; i<n; i++) {
			let ship = new Ship(30, 60);
			this.world.addShip(ship);
			ship.force.force = tutils.EnemyForce;
            ship.resetHp(Math.floor(Math.random()*10)+1);
            ship.x = this.stage.stageWidth*(0.1+Math.random()*0.8);
            ship.y = this.stage.stageHeight*(0.1+Math.random()*0.7);
		}
	}

    private createTestSupply() {
        let buff: Buff;
        let supply: Supply;
        let gun: Gun;
        let i = Math.floor(Math.random()*9);
        switch (i) {
            case 0:
            buff = new GunBuff(8000, -0.30, 0, 0);
            supply = new BuffSupply([buff]);
            supply.text = "GunCDR";
            supply.color = 0x365e84;
            break;

            case 1:
            buff = new GunBuff(8000, 0, +0.50, 0);
            supply = new BuffSupply([buff]);
            supply.text = "GunPower";
            supply.color = 0xf48771;
            break;

            case 2:
            buff = new GunBuff(8000, 0, 0, +1.00);
            supply = new BuffSupply([buff]);
            supply.text = "GunSpeed";
            supply.color = 0x49bba4;
            break;

            case 3:
            gun = Gun.createGun(SatelliteGun, ExplosionBullet);
            gun.fireCooldown.baseValue = 1000;
            gun.bulletPower.baseValue = 5;
            gun.bulletPowerLossPer = 1.0;
            gun.bulletPowerLossInterval.baseValue = 1000;
            buff = new AddGunBuff(8000, [gun]);
            supply = new BuffSupply([buff]);
            supply.text = "SatelliteGun";
            supply.color = 0xdcdcaa;
            break;

            case 4:
            gun = Gun.createGun(SoundWaveGun, SoundWaveBullet);
            gun.fireCooldown.baseValue = 800;
            (<SoundWaveGun>gun).bulletNum = 5;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 4;
            gun.bulletPowerLossPer = 0.5;
            gun.bulletPowerLossInterval.baseValue = 200;
            supply = new GunSupply(gun);
            supply.text = "SoundWaveGun";
            supply.color = 0xc586c0;
            break;

            case 5:
            gun = Gun.createGun(EaseGun, ShakeWaveBullet);
            (<EaseGun>gun).ease = egret.Ease.getPowIn(2);
            gun.fireCooldown.baseValue = 1000;
            gun.bulletSpeed.baseValue = 200;
            gun.bulletPower.baseValue = 20;
            gun.bulletPowerLossPer = 0.2;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "ShakeWaveGun";
            supply.color = 0xc586c0;
            break;

            case 6:
            gun = Gun.createGun(ShotGun, Bullet);
            (<ShotGun>gun).bulletAngleDelta = 10;
            (<ShotGun>gun).bulletNum = 5;
            gun.fireCooldown.baseValue = 600;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 2;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 1000;
            supply = new GunSupply(gun);
            supply.text = "ShotGun";
            supply.color = 0xc586c0;
            break;

            case 7:
            gun = Gun.createGun(RowGun, Bullet);
            (<RowGun>gun).bulletNum = 3;
            gun.fireCooldown.baseValue = 400;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 2;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "RowGun";
            supply.color = 0xc586c0;
            break;

            case 8:
            gun = Gun.createGun(Gun, ExplosionBullet);
            gun.fireCooldown.baseValue = 500;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 5;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "ExplosionGun";
            supply.color = 0xc586c0;
            break;
        }

        this.world.addSupply(supply);
        supply.drop(Math.floor((0.2+Math.random()*0.6)*this.stage.stageWidth), 10);
    }
}