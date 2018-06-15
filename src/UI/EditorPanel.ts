class EditorPanel extends eui.Component {
    private world: World = null;
    private enemyCtrl: EnemyController = null;
    pressLayer: boolean = false;
    cur: egret.DisplayObject = null;
    private pts: egret.DisplayObject[] = [];
    private static typeTxts = ["straight", "bezier", "sine", "gradient", "path"];

    private grpWorld: eui.Group;
    private grpPathCtrl: eui.Group;
    private grpEditorTab: eui.Group;
    private grpGridV: eui.Group;
    private grpGridH: eui.Group;
    private grpSinA: eui.Group;
    private grpSinWL: eui.Group;
    private btnTabPath: eui.RadioButton;
    private vsEditors: eui.ViewStack;
    private btnRun: eui.Button;
    private btnClear: eui.Button;
    private sldType: eui.HSlider;
    private txtType: eui.Label;
    private sldDur: eui.HSlider;
    private txtDur: eui.Label;
    private sldNum: eui.HSlider;
    private txtNum: eui.Label;
    private sldItv: eui.HSlider;
    private txtItv: eui.Label;
    private sldSinA: eui.HSlider;
    private txtSinA: eui.Label;
    private sldSinWL: eui.HSlider;
    private txtSinWL: eui.Label;
    private iptCode: eui.EditableText;
    private txtPos: eui.Label;

    // override
    protected createChildren(): void {
        super.createChildren();

        this.skinName = "resource/custom_skins/EditorPanelSkin.exml";
        this.width = egret.MainContext.instance.stage.stageWidth;

        let hLayout = this.grpGridV.layout as eui.HorizontalLayout;
        hLayout.gap = (this.width-30) / 10;
        let vLayout = this.grpGridH.layout as eui.VerticalLayout;
        vLayout.gap = (this.height-30) / 10;

        this.btnTabPath.group.addEventListener(eui.UIEvent.CHANGE, this.onEditorTabChange, this);
        
        this.btnRun.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnRun, this);
        this.btnClear.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClear, this);

        this.sldType.addEventListener(eui.UIEvent.CHANGE, this.onTypeChanged, this);
        this.sldNum.addEventListener(eui.UIEvent.CHANGE, this.onNumChanged, this);
        this.sldItv.addEventListener(eui.UIEvent.CHANGE, this.onItvChanged, this);
        this.sldDur.addEventListener(eui.UIEvent.CHANGE, this.onDurChanged, this);
        this.sldSinA.addEventListener(eui.UIEvent.CHANGE, this.onSinAChanged, this);
        this.sldSinWL.addEventListener(eui.UIEvent.CHANGE, this.onSinWLChanged, this);
        this.iptCode.addEventListener(eui.UIEvent.FOCUS_IN, this.onCodeFocus, this);

        this.grpSinA.visible = false;
        this.grpSinWL.visible = false;

        this.txtType.text = "Type: " + EditorPanel.typeTxts[this.sldType.value];
        this.txtNum.text = "Num: " + this.sldNum.value;
        this.txtItv.text = "Itv: " + this.sldItv.value;
        this.txtDur.text = "Dur: " + this.sldDur.value;
        this.txtSinA.text = "SinA: " + this.sldSinA.value;
        this.txtSinWL.text = "SinWL: " + this.sldSinWL.value;
        this.txtPos.text = "(x, y): (0%, 0%)";

        this.grpWorld.touchEnabled = true;
        this.grpWorld.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.grpWorld.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.grpWorld.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

        this.world = new World(this.grpWorld, this.width, this.height);
        this.world.start(30);

        this.enemyCtrl = new EnemyController(this.world);
    }

    private onEditorTabChange(e: eui.UIEvent){
        let radioGroup: eui.RadioButtonGroup = e.target;
        this.vsEditors.selectedIndex = radioGroup.selectedValue;
    }

    protected onBtnRun(evt: egret.TouchEvent) {
        let pts = [];
        for (let i in this.pts) {
            let pt = this.pts[i];
            pts.push({x: pt.x*100/this.width, y: pt.y*100/this.height});
        }
        let ships: EnemyShip[] = []
        for (let i=0; i< this.sldNum.value; i++) {
            let ship = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
            ships.push(ship);
        }
        let rush: Rush;
        switch (EditorPanel.typeTxts[this.sldType.value]) {
        case "straight":
            for (let i=pts.length; i<2; i++) {
                pts.push({x: 0, y: 0});
            }
            rush = new StraightRush(0, ships, this.sldItv.value, this.sldDur.value, pts[0], pts[1]);
            this.iptCode.text = "ships = this.createEnemyShips(\"RedEnemyShip_png\", "+this.sldNum.value+", hp);rush = new StraightRush(delay/speedFactor, ships, "+this.sldItv.value+"/speedFactor, "+this.sldDur.value+"/speedFactor, {x: "+pts[0].x+", y: "+pts[0].y+"}, {x: "+pts[1].x+", y: "+pts[1].y+"});this.addRush(rush);this.putEnemyShipSinWLoGroup(ships);";
            break;
        case "bezier":
            for (let i=pts.length; i<3; i++) {
                pts.push({x: 0, y: 0});
            }
            rush = new BezierRush(0, ships, this.sldItv.value, this.sldDur.value, pts[0], pts[1], pts[2]);
            this.iptCode.text = "ships = this.createEnemyShips(\"RedEnemyShip_png\", "+this.sldNum.value+", hp);rush = new BezierRush(delay/speedFactor, ships, "+this.sldItv.value+"/speedFactor, "+this.sldDur.value+"/speedFactor, {x: "+pts[0].x+", y: "+pts[0].y+"}, {x: "+pts[1].x+", y: "+pts[1].y+"}, {x: "+pts[2].x+", y: "+pts[2].y+"});this.addRush(rush);this.putEnemyShipSinWLoGroup(ships);";
            break;
        case "sine":
            for (let i=pts.length; i<2; i++) {
                pts.push({x: 0, y: 0});
            }
            rush = new SineRush(0, ships, this.sldItv.value, this.sldDur.value, pts[0], pts[1], this.sldSinWL.value, this.sldSinA.value);
            this.iptCode.text = "ships = this.createEnemyShips(\"RedEnemyShip_png\", "+this.sldNum.value+", hp);rush = new SineRush(delay/speedFactor, ships, "+this.sldItv.value+"/speedFactor, "+this.sldDur.value+"/speedFactor, {x: "+pts[0].x+", y: "+pts[0].y+"}, {x: "+pts[1].x+", y: "+pts[1].y+"}, "+this.sldSinWL.value+", "+this.sldSinA.value+");this.addRush(rush);this.putEnemyShipSinWLoGroup(ships);";
            break;
        case "gradient":
            for (let i=pts.length; i<2; i++) {
                pts.push({x: 0, y: 0});
            }
            rush = new GradientRush(0, ships, this.sldItv.value, this.sldDur.value, pts[0], pts[1]);
            this.iptCode.text = "ships = this.createEnemyShips(\"RedEnemyShip_png\", "+this.sldNum.value+", hp);rush = new GradientRush(delay/speedFactor, ships, "+this.sldItv.value+"/speedFactor, "+this.sldDur.value+"/speedFactor, {x: "+pts[0].x+", y: "+pts[0].y+"}, {x: "+pts[1].x+", y: "+pts[1].y+"});this.addRush(rush);this.putEnemyShipSinWLoGroup(ships);";
            break;
        case "path":
            for (let i=pts.length; i<1; i++) {
                pts.push({x: 0, y: 0});
            }
            rush = new PathRush(0, ships, this.sldItv.value, this.sldDur.value, pts);
            this.iptCode.text = "ships = this.createEnemyShips(\"RedEnemyShip_png\", "+this.sldNum.value+", hp);rush = new PathRush(delay/speedFactor, ships, "+this.sldItv.value+"/speedFactor, "+this.sldDur.value+"/speedFactor, pts);this.addRush(rush);this.putEnemyShipSinWLoGroup(ships);";
            break;
        }
        this.enemyCtrl.addRush(rush);
        this.enemyCtrl.startRush(30);
    }

    protected onCodeFocus(evt: eui.UIEvent): void {
    }

    protected onBtnClear(evt: egret.TouchEvent): void {
        for (let i in this.pts) {
            let pt = this.pts[i];
            this.grpWorld.removeChild(pt);
        }
        this.pts = [];
    }

    protected onTypeChanged(evt: eui.UIEvent): void {
        const align = 1;
        let value = evt.target.value;
        // let dt = (value/align) - Math.floor(value/align);
        // if (dt < 0.5) {
        //     value = Math.floor(value/align) * align;
        // } else {
        //     value = Math.floor(value/align) * align + align;
        // }
        evt.target.value = value;
        let txt = EditorPanel.typeTxts[this.sldType.value];
        this.grpSinA.visible = txt=="sine";
        this.grpSinWL.visible = txt=="sine";
        this.txtType.text = "Type: " + txt;
    }

    protected onDurChanged(evt: eui.UIEvent): void {
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

    protected onNumChanged(evt: eui.UIEvent): void {
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

    protected onItvChanged(evt: eui.UIEvent): void {
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

    protected onSinAChanged(evt: eui.UIEvent): void {
        const align = 1;
        let value = evt.target.value;
        // let dt = (value/align) - Math.floor(value/align);
        // if (dt < 0.5) {
        //     value = Math.floor(value/align) * align;
        // } else {
        //     value = Math.floor(value/align) * align + align;
        // }
        evt.target.value = value;
        this.txtSinA.text = "SinA: " + this.sldSinA.value;
    }

    protected onSinWLChanged(evt: eui.UIEvent): void {
        const align = 5;
        let value = evt.target.value;
        let dt = (value/align) - Math.floor(value/align);
        if (dt < 0.5) {
            value = Math.floor(value/align) * align;
        } else {
            value = Math.floor(value/align) * align + align;
        }
        evt.target.value = value;
        this.txtSinWL.text = "SinWL: " + this.sldSinWL.value;
    }

    protected onCreatePoint(): egret.DisplayObject {
        let gameObject = new egret.Shape();
        let g = gameObject.graphics;
        g.lineStyle(5, 0xFF3D3D);
        g.drawCircle(0, 0, 10);
        return gameObject;
    }

    protected fixPosition(cur: egret.DisplayObject, x: number, y: number) {
        let xPer = x * 100 / this.width;
        let yPer = y * 100 / this.height; 
        let align = 1;

        let dtX = (xPer/align) - Math.floor(xPer/align);
        if (dtX < 0.5) {
            xPer = Math.floor(xPer/align) * align;
        } else {
            xPer = Math.floor(xPer/align) * align + align;
        }
        cur.x = xPer * this.width / 100;

        let dtY = (yPer/align) - Math.floor(yPer/align);
        if (dtY < 0.5) {
            yPer = Math.floor(yPer/align) * align;
        } else {
            yPer = Math.floor(yPer/align) * align + align;
        }
        cur.y = yPer * this.height / 100;
        this.txtPos.text = "(x, y): ("+xPer+"%, "+yPer+"%)";
    }

    protected onTouchBegin(evt: egret.TouchEvent) {
        // if (evt.target != this.layer) {
        //     return;
        // }
        if (this.grpEditorTab.hitTestPoint(evt.stageX, evt.stageY) || this.grpPathCtrl.hitTestPoint(evt.stageX, evt.stageY)) {
            return;
        }
        this.pressLayer = true;
        if (this.cur == null) {
            this.cur = this.onCreatePoint();
        }
        this.grpWorld.addChild(this.cur);
        this.fixPosition(this.cur, evt.stageX, evt.stageY);
        this.grpEditorTab.alpha = 0.5;
        this.grpPathCtrl.alpha = 0.5;
    }

    protected onTouchMove(evt: egret.TouchEvent) {
        if (!this.pressLayer) {
            return;
        }
        this.fixPosition(this.cur, evt.stageX, evt.stageY);
    }

    protected onTouchEnd(evt: egret.TouchEvent) {
        if (!this.pressLayer) {
            return;
        }
        this.pts.push(this.cur);
        this.cur = null;
        this.pressLayer = false;
        this.grpEditorTab.alpha = 1.0;
        this.grpPathCtrl.alpha = 1.0;
    }
}