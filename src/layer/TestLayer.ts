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

        this.hero = new HeroShip(40, 80);
        this.world.addShip(this.hero);
        let gun = Gun.createGun(Gun, EllipseBullet);
        this.hero.addGun(gun, true);
        this.hero.x = w * 0.5;
        this.hero.y = h * 0.9;
        gun.bulletLeft = 0;
        // gun.autoFire = true;
        this.layer.touchEnabled = true;
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        
        // this.enemyCtrl = new EnemyController(this.world);
        // this.enemyCtrl.createBoss1();

        if (PlayerPrefs.instance.load() == null) {
            PlayerPrefs.instance.data = {
                highscore: {
                    score: 10000,
                    stage: 12,
                    shipId: 'hero_001',
                },
                maxStage: 12,
                coins: 25000,
                ships: [{
                    id: 'hero_001',
                    exp: 3000,
                    use: 10,
                    enemy: 1210,
                }, {
                    id: 'solar_001',
                    exp: 1200,
                    use: 4,
                    enemy: 350,
                }]
            };
            PlayerPrefs.instance.save();
        }
        ShipManager.instance;
    }

    private onTouchBegin(evt: egret.TouchEvent) {
        this.hero.move(evt.localX, evt.localY);
    }

    public onTimer(dt: number) {
        console.log(egret.getTimer());
    }
}
