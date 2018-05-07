class TestLayer extends tutils.Layer {
	protected onInit() {
		let bar = new egret.Shape()
        bar.graphics.lineStyle(10, 0xffffff);
        bar.graphics.drawRoundRect(0, 0, 100, 100, 50, 50);
        bar.graphics.drawRect(0, 0, 100, 100);
		bar.x = 200;
		bar.y = 200;
        let fill = new tutils.ProgressFill(bar);
        this.layer.addChild(bar);

        fill.percent = 0;
        let tw = egret.Tween.get(fill);
        tw.to({percent: 1}, 5000);

        let ship = new Ship(100, 100);
        ship.resetHp(1000);
        let buff = new Buff(100);
        let prog = new BuffProgress(this.layer, buff, 0xffffff);
        prog.gameObject.x = 500;
        prog.gameObject.y = 500;
        //prog.percent = 1;
        let cl:any = TestLayer;
        console.log(cl.name);
        let p = new tutils.ObjectPools();
        let ship2: Ship = new HeroShip(1, 2);
        ship2.id = "11";
        p.delObject(ship2);
        let ship3 = p.newObject(HeroShip);
        console.log(ship3.id);
        let ship4 = p.newObject(HeroShip, 10, 20);
        console.log(ship4.width);

        let t = new tutils.Timer();
        t.setOnTimerListener(this.onTimer, this);
        t.start(1000, false, 0);
	}

    public onTimer(dt: number) {
        console.log(egret.getTimer());
    }
}
