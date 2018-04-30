class BattleLayer extends Layer {
	private world: World;
    private ship: HeroShip;
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
        this.world.setOnShipDyingListener(this.onShipDead, this);

        // this.world.debugDrawSprite = <egret.Sprite>tutils.createLayer(this.layer, 0x000000, 0.0);
        // this.world.debugTextField = new egret.TextField()
        // this.world.debugDrawSprite.addChild(this.world.debugTextField);


        // 创建玩家飞船
        let ship = new HeroShip(40, 80);
        this.world.addShip(ship);
        ship.force.force = tutils.Player1Force;
        ship.x = stageW * 0.5;
        ship.y = stageH - ship.height * 0.5;
        ship.speed = 50;
        //let gun = Gun.createGun(Gun, ExplosionBullet);
        let gun = Gun.createGun(SoundWaveGun, SoundWaveBullet);
        //let gun = Gun.createGun(ShotGun, ShakeWaveBullet);
        //let gun = Gun.createGun(EaseGun, ShakeWaveBullet);
        //let gun = Gun.createGun(ShotGun, ShakeWaveBullet);
        //gun.ease = egret.Ease.getPowIn(2);
		gun.bulletNum = 4;
		//gun.bulletAngleDelta = 10;
        gun.fireCooldown = 500;
        gun.bulletSpeed = 60;
        gun.bulletPower = 2;
        gun.bulletPowerLossPer = 1;
        gun.bulletPowerLossInterval = 1000;
        ship.addGun(gun).autofire();


        let gun2 = Gun.createGun(SatelliteGun, ExplosionBullet);
        gun2.fireCooldown = 1000;
        gun2.bulletPower = 5;
        gun2.bulletPowerLossPer = 1.0;
        gun2.bulletPowerLossInterval = 1000;
        ship.addGun(gun2).autofire();
        this.ship = ship;

        let supply = new Supply();
        supply.text = "ShotGun";
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

    private onShipDead(ship: Ship, killer: Ship) {
        this.score.setScore(this.score.score+100, 1);
    }

	private onTouchBegin(evt: egret.TouchEvent) {
        if (!this.ship.isAlive()) {
            return;
        }
        this.ship.move(evt.localX, evt.localY);
    }

    private onTouchMove(evt: egret.TouchEvent) {
        if (!this.ship.isAlive()) {
            return;
        }
        this.ship.move(evt.localX, evt.localY);
    }

    private onTimer(evt: egret.TimerEvent) {
        if (this.worldStep < 1) {
            this.world.step(1000/this.stage.frameRate*2);
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