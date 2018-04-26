class BattleLayer extends Layer {
	private world: World;
    private ship: Ship;
	
	protected onInit() {
		let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.world = new World(this.layer, stageW, stageH);

        //this.world.debugDrawSprite = <egret.Sprite>tutils.createLayer(this.layer, 0x000000, 0.0);

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

        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.layer.touchEnabled = true;
        
        //let timer = new egret.Timer(20, 0);
        this.layer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onTimer, this);
        //timer.start();


        // FIXME: test
        ship = new Ship(80, 160);
        this.world.addShip(ship);
        ship.force.force = 2;
        ship.hp.reset(500);
        ship.hp.hp = ship.hp.maxHp;
        ship.x = stageW*0.2;
        ship.y = stageH*0.5;
        ship.speed = 50;



        let enemyController = EnemyController.instance;
        enemyController.world = this.world;
        let enemies = [];
        let n = 10;
        for (let i=0; i<n; i++) {
            let enemy = enemyController.createEnemyShip();
            enemy.hp.reset(5);
            enemies.push(enemy);
        }
        // enemyController.enemyShipMoveInStraightLine(enemyShip, enemyShip.width * 0.5);
        enemyController.arrEnemyShipsMoveInBezierCurve(enemies, {x: this.world.width * 0.5, y: 0}, {x: this.world.width * 0.5, y: this.world.height* 0.5}, {x: this.world.width, y: this.world.height * 0.8});
        // enemyController.enemyShipMoveInBezierCurve(enemyShip1, {x: this.world.width * 0.5, y: 0}, {x: this.world.width * 0.5, y: this.world.height* 0.5}, {x: this.world.width, y: this.world.height * 0.8});
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
}