class TestLayer extends tutils.Layer {
    private world: World;
    private hero: HeroShip;
    private enemyController: EnemyController;

	protected onInit() {
        let w = this.stage.stageWidth;
        let h = this.stage.stageHeight;
        // 创建世界
        this.world = new World(this.layer, this.stage.stageWidth, this.stage.stageHeight);
        this.world.start(30);

        this.hero = new HeroShip(40, 80);
        this.world.addShip(this.hero);
        let gun = Gun.createGun(Gun, EllipseBullet);
        this.hero.addGun(gun, true);
        this.hero.x = w * 0.5;
        this.hero.y = h * 0.9;
        gun.bulletLeft = 0;
        gun.autoFire = true;
        this.layer.touchEnabled = true;
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        
        let smgr = new tutils.StateManager();
        let moveToLeftBottom = new tutils.State();
        let moveToRightBottom = new tutils.State();
        let moveToMiddleTop = new tutils.State();
        let fire5 = new tutils.State();
        
        moveToLeftBottom.setListener(()=>{
            this.hero.moveTo(w*0.1, h*0.9, this.hero.speed.value, false, null, ()=>{
                smgr.change(fire5, moveToRightBottom);
            }, this);
        }, null, this);
        moveToRightBottom.setListener(()=>{
            this.hero.moveTo(w*0.9, h*0.9, this.hero.speed.value, false, null, ()=>{
                smgr.change(fire5, moveToMiddleTop);
            }, this);
        }, null, this);
        moveToMiddleTop.setListener(()=>{
            this.hero.moveTo(w*0.5, h*0.1, this.hero.speed.value, false, null, ()=>{
                smgr.change(fire5, moveToLeftBottom);
            }, this);
        }, null, this);
        fire5.setListener((nextState: tutils.State)=>{
            this.hero.mainGun.bulletLeft = 5;
        }, (dt: number)=>{
            if (this.hero.mainGun.bulletLeft == 0) {
                smgr.change(fire5.args[0]);
            }
        }, this);
        // smgr.start(10, moveToMiddleTop);

        this.enemyController = new EnemyController(this.world);
        this.enemyController.createBoss1();
	}

    private onTouchBegin(evt: egret.TouchEvent) {
        this.hero.move(evt.localX, evt.localY);
    }

    public onTimer(dt: number) {
        console.log(egret.getTimer());
    }
}
