class HeroShipsPanel extends eui.Component {
    fitHeightScroller: eui.Group;
    shipDetail: eui.Group;

	constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onUIComplete, this);
        this.skinName = "resource/custom_skins/HeroShipsPanelSkin.exml";
    }

    private onUIComplete():void {
	}
}