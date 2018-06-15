class TestLayer extends tutils.Layer {
    private world: World;
    private hero: HeroShip;
    private enemyCtrl: EnemyController;

    private $dur: number = 5000;
    private $factor: number = 0;
    private $drawFunc: (value: number)=>void;

	protected onInit() {
        let w = this.stage.stageWidth;
        let h = this.stage.stageHeight;
        // 创建世界
        let bg = tutils.createBitmapByName("grid100_png");
        this.layer.addChild(bg);
        this.world = new World(this.layer, this.stage.stageWidth, this.stage.stageHeight);
        this.world.start(30);

        this.hero = new HeroShip("Hero_png");
        this.world.addShip(this.hero);
        let gun = Gun.createGun(Gun, Bullet);
        this.hero.addGun(gun, true);
        this.hero.x = w * 0.5;
        this.hero.y = h * 0.1;
        // gun.bulletLeft = 0;
        // // gun.autoFire = true;
        this.layer.touchEnabled = true;
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        
        // this.enemyCtrl = new EnemyController(this.world);
        // this.enemyCtrl.createBoss1();

        // let act = new Repeat(new Sequence(new DelayTime(2000), new CallFunc((n: number):void=>{
        //     console.log(n);
        // }, this, 5010)), 10);
        // let act: tutils.Action = new tutils.Repeat(new tutils.CallFunc((n: number):void=>{
        //     console.log(n);
        // }, this, 5010), 1);
        // GameController.instance.actionManager.addAction(this.hero.gameObject, act);

        // let act = new tutils.Speed(new tutils.Sequence(new tutils.Bezier(2000, 0, 0, 700, 600, 300, 600, false), new tutils.Bezier(2000, 300, 600, 0, 1200, 0, 1200, false), new tutils.Bezier(2000, 0, 1200, 700, 600, 0, 0, false), new tutils.Sine(5000, 0, 0, 700, 1200, 200, 100, false), new tutils.CallFunc(():void=>{
        //     console.log("MoveEnd");
        // }, this)), 2.0);
        // GameController.instance.actionManager.speed = 1;
        // GameController.instance.actionManager.addAction(this.hero.gameObject, act);
        // let tw = egret.Tween.get(GameController.instance.actionManager);
        // tw.to({speed: 0.01}, 10000);
        // this.drawPaths();

        // let act = new tutils.RepeatForever(new tutils.Sequence(
		// 	new tutils.MoveBy(2000, -170, 0),
		// 	new tutils.MoveBy(2000, 170, 0)
		// ));
		// this.hero.runAction(act);
        // this.hero.moveStraight(180, 20);
        // let buff = GameController.instance.createBuff("super_hero");
        // this.hero.addBuff(buff);
        let act = new tutils.CallFunc(()=>{
            this.hero.stopAllActions();
            let act2 = new tutils.CallFunc(()=>{
                console.log("act2 run");
            }, this);
            this.hero.runAction(act2);
            this.hero.stopAllActions();
        }, this);
        this.hero.runAction(act);
    }

    private onTouchBegin(evt: egret.TouchEvent) {
        this.hero.move(evt.localX, evt.localY);
    }

    public onTimer(dt: number) {
        console.log(egret.getTimer());
    }

    public async drawPaths() {
        this.$dur = 1000;
        this.layer.graphics.lineStyle(3, 0xffffff, 1);

        await this.drawPath(this.drawLine);
        await this.drawPath(this.drawSine);
        await this.drawPath(this.drawSine2);
    }

    public async drawPath(drawFunc: (value: number)=>void): Promise<void> {
        let p = new Promise<void>((resolve: (value)=>void, reject: (reason)=>void):void=>{
            let tw = egret.Tween.get(this);
            tw.set({$drawFunc: drawFunc});
            tw.set({factor: 0});
            tw.to({factor: 1.0}, this.$dur);
            tw.call(()=>{
                resolve(null);
            }, this);
        });
        return p;
    }

    public get factor(): number {
        return this.$factor;
    }

    public set factor(value: number) {
        this.$drawFunc.call(this, value);
        this.$factor = value;
    }

    private drawPoint(x, y, value: number) {
        if (value === 0) {
            this.layer.graphics.moveTo(x, y);
        } else {
            this.layer.graphics.lineTo(x, y);
        }
    }

    private drawLine(value: number): void {
        const x0 = 100;
        const y0 = 700;
        const x1 = 500;
        const y1 = 300;

        const dis = tutils.getDistance(x0, y0, x1, y1);
        const dtx = x1 - x0;
        const dty = y1 - y0;
        let x = dtx * value;
        let y = dty * value;
        this.drawPoint(x+x0, y+y0, value);
    }

    private drawSine(value: number): void {
        const x0 = 100;
        const y0 = 700;
        const x1 = 500;
        const y1 = 700;
        const wavelen = 200;
        const a = 100;
        const dis = tutils.getDistance(x0, y0, x1, y1);
        let temp = Math.sin(value*dis/wavelen*2*Math.PI)*a;
        const dtx = x1 - x0;
        const dty = y1 - y0;
        let x = dtx * value;
        let y = temp;
        this.drawPoint(x+x0, y+y0, value);
    }

    private drawSine2(value: number): void {
        const x0 = 100;
        const y0 = 700;
        const x1 = 500;
        const y1 = 300;
        const wavelen = 200*Math.SQRT2;
        const a = 100;
        const angle = Math.atan2(y1-y0, x1-x0);
        const dis = tutils.getDistance(x0, y0, x1, y1);
        let temp = Math.sin(value*dis/wavelen*2*Math.PI)*a;
        const dtx = x1 - x0;
        const dty = y1 - y0;
        let x = dis * value;
        let y = temp;
        this.drawPoint(x*Math.cos(angle)-y*Math.sin(angle)+x0, y*Math.cos(angle)+x*Math.sin(angle)+y0, value);
    }
}
