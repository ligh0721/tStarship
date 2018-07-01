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
        // this.world.addShip(this.hero);
        
        // let gun = Gun.createGun(StormGun, Bullet);
		// gun.fireCooldown.baseValue = 0;
		// gun.bulletPower.baseValue = 50/2;
		// gun.bulletSpeed.baseValue = 50;
		// gun.period = 500;
        // this.hero.addGun(gun).autoFire = true;
        
        // this.hero.x = w * 0.5;
        // this.hero.y = h * 0.9;
        // gun.bulletLeft = 0;
        // gun.autoFire = true;
        // this.layer.touchEnabled = true;
        // this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        
        // this.enemyCtrl = new EnemyController(this.world);
        // this.enemyCtrl.createBoss1();

        // let bmp = tutils.createBitmapByName("PartElecInducedGun_png");
        // this.addChild(bmp);
        // bmp.x = 100;
        // bmp.y = 100;

        // bmp = tutils.createBitmapByName("BuffGunCDR_png");
        // this.addChild(bmp);
        // bmp.x = 200;
        // bmp.y = 200;

        let partsDropTableRare = new DropTable<DropTable<string>>();
        let table = new DropTable<string>();
        table.push("part_cdr_up_1", 100);
        table.push("part_power_up_1", 100);
        table.push("part_critical_2", 50);
        partsDropTableRare.push(table, 1000);

        // blue
        // table = new DropTable<string>();
        // this.partsDropTableRare.push(table, 600);

        // purple
        table = new DropTable<string>();
        table.push("part_power_speed_up_2", 100);
        table.push("part_power_battery_2", 100);
        table.push("part_elec_induced_gun", 100);
        partsDropTableRare.push(table, 600);

        // orange
        table = new DropTable<string>();
        table.push("part_meteoroid", 100);
        partsDropTableRare.push(table, 300);

        let d: string = partsDropTableRare.randomR();
        console.log(d);
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
