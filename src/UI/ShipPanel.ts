class ShipPanel extends eui.Component {
    private open: egret.tween.TweenGroup;
    private popEquip: egret.tween.TweenGroup;
    private btnStart: eui.Button;
    private btnChangeGun: eui.Button;
    private btnChangeSkill: eui.Button;

	public constructor() {
        super();
    }
    
    // override
    protected createChildren(): void {
        super.createChildren();

        this.skinName = "resource/custom_skins/ShipPanelSkin.exml";
        this.currentState = "init";
        this.height = egret.MainContext.instance.stage.stageHeight;
        this.open.addEventListener("complete", this.onTweenGroupComplete, this);
        this.open.play();
    }

    private onTweenGroupComplete(evt: egret.Event): void {
        this.btnChangeGun.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnChangeGun, this);
        this.btnChangeSkill.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnChangeSkill, this);
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnStart, this);
        this.currentState = "final";
    }

    private onBtnStart(evt: egret.TouchEvent): void {
    }

    private onBtnChangeGun(evt: egret.TouchEvent): void {
    }

    private onBtnChangeSkill(evt: egret.TouchEvent): void {
    }
}