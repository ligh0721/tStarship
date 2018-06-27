class ShipLayer extends tutils.Layer {
    panel: ShipPanel;

    // override
    protected onCfgStage(): void {
        this.stage.frameRate = 60;
        this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    }

    protected onInit() {
        this.panel = new ShipPanel();
        this.addChild(this.panel);
    }

    // override
    protected onRemoved(): void {
        this.removeChild(this.panel);
        this.panel = null;
    }
}
