class ShipLayer extends tutils.Layer {
    panel: ShipPanel;

    // override
    protected onCfgStage(): void {
        this.stage.frameRate = 60;
        this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    }

    protected onInit() {
        this.panel = new ShipPanel();
        this.layer.addChild(this.panel);
        
        // let playerData = GameController.instance.loadPlayerData();
        // if (playerData.shipsNum === 0) {
        //     this.addShips();
        // }
    }

    public async addShips() {
        // GameController.instance.addNewHeroShip("ship_hero");
        // this.panel.updateList();
        // await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_hero"});

        // GameController.instance.savePlayerData();
    }
}
