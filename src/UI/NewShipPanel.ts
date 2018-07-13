class NewShipPanel extends eui.Component {
    private imgShip: eui.Image;
    private lblShipName: eui.Label;
    private btnReturn: eui.Button;
    private btnShare: eui.Button;
    private open: egret.tween.TweenGroup;
    private data: {shipId: string};
    private onClose: (res: any)=>void;

	public constructor(data: {shipId: string}, onClose?: (res: any)=>void) {
        super();
        this.data = data;
        this.onClose = onClose;
    }
    
    // override
    protected createChildren(): void {
        super.createChildren();

        this.skinName = "resource/custom_skins/NewShipPanelSkin.exml";
        this.currentState = "init";
        this.height = egret.MainContext.instance.stage.stageHeight;
        let gunData = GameController.instance.getGunData(this.data.shipId);
        this.imgShip.source = gunData.model;
        this.lblShipName.text = gunData.name;
        this.btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnReturn, this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnShare, this);
        this.open.addEventListener("complete", this.onTweenGroupComplete, this);
        this.open.play();
    }

    private onBtnReturn(evt: egret.TouchEvent): void {
        this.parent.removeChild(this);
        if (this.onClose) {
            this.onClose(0);
        }
    }

    private onBtnShare(evt: egret.TouchEvent): void {
    }

    private onTweenGroupComplete(evt: egret.Event): void {
    }
}