class HeroShipsLayer extends tutils.Layer {
    // override
    protected onCfgStage(): void {
        this.stage.frameRate = 60;
        this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    }

    protected onInit() {
        // 初始化玩家存档
        egret.localStorage.clear();
        if (PlayerPrefs.instance.load() == null) {
            PlayerPrefs.instance.reset();
            PlayerPrefs.instance.addNewShip("ship_test");
            PlayerPrefs.instance.save();
        }
        
        let layer = new eui.UILayer();
        this.addChild(layer);
        let panel = new HeroShipsPanel();
        panel.height = this.stage.stageHeight;
        panel.fitHeightScroller.height = panel.height - panel.shipDetail.height - 135;
        layer.addChild(panel);
    }
}
