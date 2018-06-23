class ShipPanel extends eui.Component {
    private open: egret.tween.TweenGroup;
    private openEquip: egret.tween.TweenGroup;
    private closeEquip: egret.tween.TweenGroup;
    private btnStart: eui.Button;
    private btnChangeGun: eui.Button;
    private btnChangeSkill: eui.Button;
    private btnEquipGun: eui.Button;
    private btnEquipSkill: eui.Button;
    private grpGunDetail: eui.Group;
    private grpPop: eui.Group;

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
        this.openEquip.addEventListener("complete", this.onTweenGroupComplete, this);
        this.closeEquip.addEventListener("complete", this.onTweenGroupComplete, this);
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnStart, this);
        this.btnChangeGun.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnChangeGun, this);
        this.btnChangeSkill.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnChangeSkill, this);
        this.btnEquipGun.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnEquipGun, this);
        this.btnEquipSkill.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnEquipSkill, this);

        this.grpPop.visible = false;
        this.btnChangeGun.touchEnabled = false;
        this.btnChangeSkill.touchEnabled = false;
        this.btnStart.touchEnabled = false;
        this.btnEquipGun.touchEnabled = false;
        this.btnEquipSkill.touchEnabled = false;

        this.open.play(0);
    }

    private onTweenGroupComplete(evt: egret.Event): void {
        switch (evt.target) {
        case this.open:
            this.currentState = "final";
            this.btnStart.touchEnabled = true;
            this.btnChangeGun.touchEnabled = true;
            this.btnChangeSkill.touchEnabled = true;
            break;

        case this.openEquip:
            this.btnEquipGun.touchEnabled = true;
            this.btnEquipSkill.touchEnabled = true;
            break;

        case this.closeEquip:
            this.currentState = "final";
            this.btnChangeGun.touchEnabled = true;
            this.btnChangeSkill.touchEnabled = true;
            this.grpPop.visible = false;
            break;
        }
    }

    private onBtnStart(evt: egret.TouchEvent): void {
    }

    private onBtnChangeGun(evt: egret.TouchEvent): void {
        this.grpPop.visible = true;
        this.btnChangeGun.touchEnabled = false;
        this.btnChangeSkill.touchEnabled = false;
        this.btnEquipGun.visible = true;
        this.grpGunDetail.visible = true;
        this.btnEquipSkill.visible = false;
        this.openEquip.play(0);
    }

    private onBtnChangeSkill(evt: egret.TouchEvent): void {
        this.grpPop.visible = true;
        this.btnChangeGun.touchEnabled = false;
        this.btnChangeSkill.touchEnabled = false;
        this.btnEquipGun.visible = false;
        this.grpGunDetail.visible = false;
        this.btnEquipSkill.visible = true;
        this.openEquip.play(0);
    }

    private onBtnEquipGun(evt: egret.TouchEvent): void {
        this.btnEquipGun.touchEnabled = false;
        this.btnEquipSkill.touchEnabled = false;
        this.closeEquip.play(0);
    }

    private onBtnEquipSkill(evt: egret.TouchEvent): void {
        this.btnEquipGun.touchEnabled = false;
        this.btnEquipSkill.touchEnabled = false;
        this.closeEquip.play(0);
    }
}