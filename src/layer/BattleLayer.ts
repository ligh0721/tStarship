class BattleLayer extends Layer {
	private world: World;
    private ship: Ship;
	private score: Score;
	
	protected onInit() {
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
        let world = new World(this.layer, stageW, stageH);
        //world.debugDrawSprite = <egret.Sprite>tutils.createLayer(this.layer, 0x000000, 0.0);
        world.setOnShipDeadListener(this.onShipDead, this);
        this.world = world

        // 创建玩家飞船
        let ship = new Ship(40, 80);
        this.world.addShip(ship);
        ship.force.force = 1;
        ship.x = stageW * 0.5;
        ship.y = stageH - ship.height * 0.5;
        ship.speed = 50;
        //let gun = Gun.createGun(Gun);
        //let gun = Gun.createGun(SoundWaveGun);
        let gun = Gun.createGun(ShotGun);
		gun.bulletNum = 10;
		gun.bulletAngleDelta = 2;
        gun.fireInterval = 300;
        gun.bulletSpeed = 100;
        ship.addGun(gun);
        ship.gun.autofire();
        this.ship = ship;

        // 创建测试敌军
        this.createTestEnemyShip();
        
        // 创建分数板
		let score = new Score(this.layer);
		score.digits = 10;
		score.score = 0;
		score.setScore(10000, 5000);
        this.score = score;

        // 创建敌军小队
        let enemyController = EnemyController.instance;
        enemyController.world = this.world;
        let enemies: EnemyShip[] = [];
        let n = 0;
        for (let i=0; i<n; i++) {
            let enemy = enemyController.createEnemyShip();
            enemy.hp.reset(5);
            enemies.push(enemy);
        }

        // enemyController.enemyShipMoveInStraightLine(enemyShip, enemyShip.width * 0.5);
        enemyController.arrEnemyShipsMoveInBezierCurve(enemies, {x: this.world.width * 0.5, y: 0}, {x: this.world.width * 0.5, y: this.world.height* 0.5}, {x: this.world.width, y: this.world.height * 0.8});
        // enemyController.enemyShipMoveInBezierCurve(enemyShip1, {x: this.world.width * 0.5, y: 0}, {x: this.world.width * 0.5, y: this.world.height* 0.5}, {x: this.world.width, y: this.world.height * 0.8});
	}

    private onShipDead(ship: Ship, killer: Ship) {
        this.score.setScore(this.score.score+100, 1);
    }

	private onTouchBegin(evt: egret.TouchEvent) {
        this.ship.move(evt.localX, evt.localY);
    }

    private onTouchMove(evt: egret.TouchEvent) {
        this.ship.move(evt.localX, evt.localY);
    }

    private onTimer(evt: egret.TimerEvent) {
        this.world.step(1000/this.stage.frameRate);
    }

	// FIXME: test
	createTestEnemyShip() {
		let n = 1;
		for (let i=0; i<n; i++) {
			let ship = new Ship(30, 60);
			this.world.addShip(ship);
			ship.force.force = 2;
			ship.hp.reset(Math.random()*10);
			ship.hp.hp = ship.hp.maxHp;
			ship.x = this.layer.width*Math.random();
			ship.y = this.layer.height*Math.random();
		}
	}
}