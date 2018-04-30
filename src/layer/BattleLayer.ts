class BattleLayer extends tutils.Layer {
	private world: World;
    private hero: HeroShip;
	private score: Score;
    private enemyCtrl: EnemyController;
    private worldStep: number = 0;
	
	protected onInit() {
        let bg = tutils.createBitmapByName("grid100_png");
        this.layer.addChild(bg);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.layer.touchEnabled = true;
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.layer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onTimer, this);
        //let timer = new egret.Timer(20, 0);
        //timer.layer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        //timer.start();
		
        // 创建世界
        this.world = new World(this.layer, stageW, stageH);
        this.enemyCtrl = new EnemyController(this.world);
        this.world.setOnShipDyingListener(this.onShipDying, this);
        this.world.setOnShipHitSupplyListener(this.onShipHitSupply, this);

        // this.world.debugDrawSprite = <egret.Sprite>tutils.createLayer(this.layer, 0x000000, 0.0);
        // this.world.debugTextField = new egret.TextField()
        // this.world.debugDrawSprite.addChild(this.world.debugTextField);


        // 创建玩家飞船
        let hero = new HeroShip(40, 80);
        this.hero = hero;
        this.world.addShip(hero);
        hero.force.force = tutils.Player1Force;
        hero.x = stageW * 0.5;
        hero.y = stageH - hero.height * 0.5;
        hero.speed.baseValue = 50;
        //let gun = Gun.createGun(Gun, ExplosionBullet);
        let gun = Gun.createGun(SoundWaveGun, SoundWaveBullet);
        //let gun = Gun.createGun(ShotGun, ShakeWaveBullet);
        //let gun = Gun.createGun(EaseGun, ShakeWaveBullet);
        //let gun = Gun.createGun(ShotGun, ShakeWaveBullet);
        //gun.ease = egret.Ease.getPowIn(2);
		gun.bulletNum = 4;
		//gun.bulletAngleDelta = 10;
        gun.fireCooldown.baseValue = 500;
        gun.bulletSpeed.baseValue = 60;
        gun.bulletPower.baseValue = 2;
        gun.bulletPowerLossPer = 1;
        gun.bulletPowerLossInterval.baseValue = 1000;
        hero.addGun(gun).autofire();
        

        let supply = new Supply();
        supply.text = "Satellite";
        this.world.addSupply(supply);
        supply.x = 300;
        supply.y = 10;
        supply.moveStraight(180, 10, true);

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
        let n = 100;
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
        let gun = Gun.createGun(SatelliteGun, ExplosionBullet);
        gun.fireCooldown.baseValue = 1000;
        gun.bulletPower.baseValue = 5;
        gun.bulletPowerLossPer = 1.0;
        gun.bulletPowerLossInterval.baseValue = 1000;
        
        let buff = new AddGunBuff(6000);
        buff.guns.push(gun);

        ship.addBuff(buff);
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

    private onTimer(evt: egret.TimerEvent) {
        if (this.worldStep < 1) {
            this.world.step(1000/30);
            this.worldStep++;
        } else {
            this.worldStep = 0;
        }
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
}