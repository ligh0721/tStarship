class NewShipPanel extends eui.Component {
    private imgShip: eui.Image;
    private lblShipName: eui.Label;
    private btnReturn: eui.Button;
    private btnShare: eui.Button;
    private open: egret.tween.TweenGroup;
    private data: {shipId: string};
    private onClose: (res: any)=>void;

	constructor(data: {shipId: string}, onClose?: (res: any)=>void) {
        super();
        this.data = data;
        this.onClose = onClose;
        this.addEventListener(eui.UIEvent.COMPLETE, this.onUIComplete, this);
        this.skinName = "resource/custom_skins/NewShipPanelSkin.exml";
        this.currentState = "init";
    }

    private onUIComplete(): void {
        let shipData = GameController.instance.getShipDataById(this.data.shipId);
        this.imgShip.source = shipData.model;
        this.lblShipName.text = shipData.name;
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