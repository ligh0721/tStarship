class HeroShipsLayer extends tutils.Layer {
    protected onInit() {
        let shipList = new ShipListUI();
        // shipList.width = this.stage.stageWidth;
        // shipList.height = this.stage.stageHeight;
        // let scale = this.stage.stageWidth / shipList.width;
        // shipList.scaleX = scale;
        // shipList.scaleY = scale;

        this.addChild(shipList);
    }
}
