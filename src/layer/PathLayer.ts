class PathLayer extends tutils.Layer {
    private world: World;
    private enemyCtrl: EnemyController;
    pressLayer: boolean = false;
    cur: egret.DisplayObject = null;
    private pts: egret.DisplayObject[] = [];
    private static typeTxts = ["straight", "bezier", "sin", "path"];
    private sldType: eui.HSlider;
    private txtType: egret.TextField;
    private sldDur: eui.HSlider;
    private txtDur: egret.TextField;
    private sldNum: eui.HSlider;
    private txtNum: egret.TextField;
    private sldItv: eui.HSlider;
    private txtItv: egret.TextField;
    private sldSinA: eui.HSlider;
    private txtSinA: egret.TextField;
    private sldSinT: eui.HSlider;
    private txtSinT: egret.TextField;

	protected onInit() {
        this.stage.frameRate = 60;
        let bg = tutils.createBitmapByName("grid100_png");
        this.layer.addChild(bg);
        this.layer.touchEnabled = true;
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.layer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

        this.world = new World(this.layer, this.stage.stageWidth, this.stage.stageHeight);
        this.world.start(30);

        this.enemyCtrl = new EnemyController(this.world);

        let btn = new eui.Button();
        this.layer.addChild(btn);
        btn.x = 0;
        btn.y = 200;
        btn.label = "Run";
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickRun, this);

        btn = new eui.Button();
        this.layer.addChild(btn);
        btn.x = 100;
        btn.y = 200;
        btn.label = "Clear";
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickClear, this);

        // type
        this.sldType = new eui.HSlider();
        this.layer.addChild(this.sldType);
        this.sldType.x = 0;
        this.sldType.y = 300;
        this.sldType.width = 200;
        this.sldType.minimum = 0;
        this.sldType.maximum = 3;
        this.sldType.value = 1;
        this.sldType.addEventListener(eui.UIEvent.CHANGE, this.onTypeChanged, this)
        this.txtType = new egret.TextField();
        this.layer.addChild(this.txtType);
        this.txtType.x = 0;
        this.txtType.y = 270;
        this.txtType.text = "Type: " + PathLayer.typeTxts[this.sldType.value];

        // duration
        this.sldDur = new eui.HSlider();
        this.layer.addChild(this.sldDur);
        this.sldDur.x = 0;
        this.sldDur.y = 400;
        this.sldDur.width = 200;
        this.sldDur.minimum = 0;
        this.sldDur.maximum = 10000;
        this.sldDur.value = 2000;
        this.sldDur.addEventListener(eui.UIEvent.CHANGE, this.onDurChanged, this)
        this.txtDur = new egret.TextField();
        this.layer.addChild(this.txtDur);
        this.txtDur.x = 0;
        this.txtDur.y = 370;
        this.txtDur.text = "Dur: " + this.sldDur.value;

        // number
        this.sldNum = new eui.HSlider();
        this.layer.addChild(this.sldNum);
        this.sldNum.x = 0;
        this.sldNum.y = 500;
        this.sldNum.width = 200;
        this.sldNum.minimum = 0;
        this.sldNum.maximum = 10;
        this.sldNum.value = 5;
        this.sldNum.addEventListener(eui.UIEvent.CHANGE, this.onNumChanged, this)
        this.txtNum = new egret.TextField();
        this.layer.addChild(this.txtNum);
        this.txtNum.x = 0;
        this.txtNum.y = 470;
        this.txtNum.text = "Num: " + this.sldNum.value;

        // interval
        this.sldItv = new eui.HSlider();
        this.layer.addChild(this.sldItv);
        this.sldItv.x = 0;
        this.sldItv.y = 600;
        this.sldItv.width = 200;
        this.sldItv.minimum = 0;
        this.sldItv.maximum = 2000;
        this.sldItv.value = 200;
        this.sldItv.addEventListener(eui.UIEvent.CHANGE, this.onItvChanged, this)
        this.txtItv = new egret.TextField();
        this.layer.addChild(this.txtItv);
        this.txtItv.x = 0;
        this.txtItv.y = 570;
        this.txtItv.text = "Itv: " + this.sldItv.value;

        // sinA
        this.sldSinA = new eui.HSlider();
        this.layer.addChild(this.sldSinA);
        this.sldSinA.x = 0;
        this.sldSinA.y = 700;
        this.sldSinA.width = 200;
        this.sldSinA.minimum = 0;
        this.sldSinA.maximum = 1000;
        this.sldSinA.value = 100;
        this.sldSinA.addEventListener(eui.UIEvent.CHANGE, this.onSinAChanged, this)
        this.txtSinA = new egret.TextField();
        this.layer.addChild(this.txtSinA);
        this.txtSinA.x = 0;
        this.txtSinA.y = 670;
        this.txtSinA.text = "SinA: " + this.sldSinA.value;

        // sinT
        this.sldSinT = new eui.HSlider();
        this.layer.addChild(this.sldSinT);
        this.sldSinT.x = 0;
        this.sldSinT.y = 800;
        this.sldSinT.width = 200;
        this.sldSinT.minimum = 0;
        this.sldSinT.maximum = 5000;
        this.sldSinT.value = 2000;
        this.sldSinT.addEventListener(eui.UIEvent.CHANGE, this.onSinTChanged, this)
        this.txtSinT = new egret.TextField();
        this.layer.addChild(this.txtSinT);
        this.txtSinT.x = 0;
        this.txtSinT.y = 770;
        this.txtSinT.text = "SinT: " + this.sldSinT.value;
	}

    protected onClickRun(evt: egret.TouchEvent) {
        let pts = [];
        for (let i in this.pts) {
            let pt = this.pts[i];
            pts.push({x: pt.x, y: pt.y});
        }
        let ships: EnemyShip[] = []
        for (let i=0; i< this.sldNum.value; i++) {
            let ship = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
            ships.push(ship);
        }
        let item = new RushItem(ships, PathLayer.typeTxts[this.sldType.value], 0, this.sldDur.value, this.sldItv.value, pts, null, this.sldSinT.value, this.sldSinA.value);
        this.enemyCtrl.addRush(item);
        this.enemyCtrl.startRush(30);
    }

    protected onClickClear(evt: egret.TouchEvent) {
        for (let i in this.pts) {
            let pt = this.pts[i];
            this.layer.removeChild(pt);
        }
        this.pts = [];
    }

    protected onTypeChanged(evt: eui.UIEvent) {
        const align = 1;
        let value = evt.target.value;
        // let dt = (value/align) - Math.floor(value/align);
        // if (dt < 0.5) {
        //     value = Math.floor(value/align) * align;
        // } else {
        //     value = Math.floor(value/align) * align + align;
        // }
        evt.target.value = value;
        this.txtType.text = "Type: " + PathLayer.typeTxts[this.sldType.value];
    }

    protected onDurChanged(evt: eui.UIEvent) {
        const align = 500;
        let value = evt.target.value;
        let dt = (value/align) - Math.floor(value/align);
        if (dt < 0.5) {
            value = Math.floor(value/align) * align;
        } else {
            value = Math.floor(value/align) * align + align;
        }
        evt.target.value = value;
        this.txtDur.text = "Dur: " + this.sldDur.value;
    }

    protected onNumChanged(evt: eui.UIEvent) {
        const align = 1;
        let value = evt.target.value;
        // let dt = (value/align) - Math.floor(value/align);
        // if (dt < 0.5) {
        //     value = Math.floor(value/align) * align;
        // } else {
        //     value = Math.floor(value/align) * align + align;
        // }
        evt.target.value = value;
        this.txtNum.text = "Num: " + this.sldNum.value;
    }

    protected onItvChanged(evt: eui.UIEvent) {
        const align = 100;
        let value = evt.target.value;
        let dt = (value/align) - Math.floor(value/align);
        if (dt < 0.5) {
            value = Math.floor(value/align) * align;
        } else {
            value = Math.floor(value/align) * align + align;
        }
        evt.target.value = value;
        this.txtItv.text = "Itv: " + this.sldItv.value;
    }

    protected onSinAChanged(evt: eui.UIEvent) {
        const align = 50;
        let value = evt.target.value;
        let dt = (value/align) - Math.floor(value/align);
        if (dt < 0.5) {
            value = Math.floor(value/align) * align;
        } else {
            value = Math.floor(value/align) * align + align;
        }
        evt.target.value = value;
        this.txtSinA.text = "SinA: " + this.sldSinA.value;
    }

    protected onSinTChanged(evt: eui.UIEvent) {
        const align = 500;
        let value = evt.target.value;
        let dt = (value/align) - Math.floor(value/align);
        if (dt < 0.5) {
            value = Math.floor(value/align) * align;
        } else {
            value = Math.floor(value/align) * align + align;
        }
        evt.target.value = value;
        this.txtSinT.text = "SinT: " + this.sldSinT.value;
    }

    protected onCreatePoint(): egret.DisplayObject {
        let gameObject = new egret.Shape();
        let g = gameObject.graphics;
        g.lineStyle(5, 0xffffff);
        g.drawCircle(0, 0, 10);
        return gameObject;
    }

    protected fixPosition(cur: egret.DisplayObject, x: number, y: number) {
        let dt = (x/100) - Math.floor(x/100);
        if (dt < 0.2) {
            x = Math.floor(x/100) * 100;
        } else if (dt > 0.8) {
            x = Math.floor(x/100) * 100 + 100;
        }
        dt = (y/100) - Math.floor(y/100);
        if (dt < 0.2) {
            y = Math.floor(y/100) * 100;
        } else if (dt > 0.8) {
            y = Math.floor(y/100) * 100 + 100;
        }
        cur.x = x;
        cur.y = y;
    }

    protected onTouchBegin(evt: egret.TouchEvent) {
        if (evt.target != this.layer) {
            return;
        }
        this.pressLayer = true;
        if (this.cur == null) {
            this.cur = this.onCreatePoint();
        }
        this.layer.addChild(this.cur);
        this.fixPosition(this.cur, evt.localX, evt.localY);
    }

    protected onTouchMove(evt: egret.TouchEvent) {
        if (!this.pressLayer || evt.target != this.layer) {
            return;
        }
        this.fixPosition(this.cur, evt.localX, evt.localY);
    }

    protected onTouchEnd(evt: egret.TouchEvent) {
        if (!this.pressLayer || evt.target != this.layer) {
            return;
        }
        this.pts.push(this.cur);
        this.cur = null;
        this.pressLayer = false;
    }
}
