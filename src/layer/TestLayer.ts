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

        this.hero = new HeroShip("Test_png");
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
        let data = {high: 15454100, stages: 10, enemies: 212, bosses: 3, score: 5454100};
        let panel = new GameOverPanel(data);
        this.addChild(panel);
        panel.x = (this.stage.stageWidth - panel.width) / 2;
        panel.y = (this.stage.stageHeight - panel.height) / 2;
    }

    private onTouchBegin(evt: egret.TouchEvent) {
        this.hero.move(evt.localX, evt.localY);
    }

    public onTimer(dt: number) {
        console.log(egret.getTimer());
    }
}
