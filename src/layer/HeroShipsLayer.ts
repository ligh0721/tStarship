class HeroShipsLayer extends tutils.Layer {
    // override
    protected onCfgStage(): void {
        this.stage.frameRate = 60;
        this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    }

    protected onInit() {
        let layer = new eui.UILayer();
        this.addChild(layer);
        let list = new HeroShipsPanel();
        list.height = this.stage.stageHeight;
        list.fitHeightScroller.height = list.height - list.shipDetail.height - 135;
        layer.addChild(list);
    }
}
