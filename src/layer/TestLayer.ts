class TestLayer extends tutils.Layer {
    private world: World;
    private hero: HeroShip;
    private enemyCtrl: EnemyController;

	protected onInit() {
        let w = this.stage.stageWidth;
        let h = this.stage.stageHeight;
        // 创建世界
        this.world = new World(this.layer, this.stage.stageWidth, this.stage.stageHeight);
        this.world.start(30);

        this.hero = new HeroShip("Hero_png");
        this.world.addShip(this.hero);
        let gun = Gun.createGun(Gun, Bullet);
        this.hero.addGun(gun, true);
        this.hero.x = w * 0.5;
        this.hero.y = h * 0.9;
        gun.bulletLeft = 0;
        // gun.autoFire = true;
        this.layer.touchEnabled = true;
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        
        // this.enemyCtrl = new EnemyController(this.world);
        // this.enemyCtrl.createBoss1();

        // let act = new Repeat(new Sequence(new DelayTime(2000), new CallFunc((n: number):void=>{
        //     console.log(n);
        // }, this, 5010)), 10);
        let act: tutils.Action = new tutils.Repeat(new tutils.CallFunc((n: number):void=>{
            console.log(n);
        }, this, 5010), 1);
        GameController.instance.actionManager.addAction(this.hero.gameObject, act);

        act = new tutils.Speed(new tutils.RepeatForever(new tutils.Sequence(new tutils.Bezier(2000, 0, 0, 700, 600, 300, 600, true), new tutils.Bezier(2000, 300, 600, 0, 1200, 0, 1200, true), new tutils.Bezier(2000, 0, 1200, 700, 600, 0, 0, true), new tutils.CallFunc(():void=>{
            console.log("MoveEnd");
        }, this))), 2.0);
        GameController.instance.actionManager.addAction(this.hero.gameObject, act);
    }

    private onTouchBegin(evt: egret.TouchEvent) {
        this.hero.move(evt.localX, evt.localY);
    }

    public onTimer(dt: number) {
        console.log(egret.getTimer());
    }
}
