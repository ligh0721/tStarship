class HeroShipsLayer extends tutils.Layer {
    panel: HeroShipsPanel;

    // override
    protected onCfgStage(): void {
        this.stage.frameRate = 60;
        this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    }

    protected onInit() {
        let initPlayerData = false;
        if (GameController.instance.loadPlayerData() === null) {
            // 初始化玩家存档
            GameController.instance.resetPlayerData();
            initPlayerData = true;
        }

        this.panel = new HeroShipsPanel();
        this.layer.addChild(this.panel);
        
        if (initPlayerData) {
            this.addShips();
        }
    }

    public async addShips() {
        // GameController.instance.addNewHeroShip("ship_test");
        // this.panel.updateList();
        // await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_test"});

        // GameController.instance.addNewHeroShip("ship_hero");
        // this.panel.updateList();
        // await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_hero"});

        // GameController.instance.addNewHeroShip("ship_soundwave");
        // this.panel.updateList();
        // await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_soundwave"});

        GameController.instance.addNewHeroShip("ship_energy");
        this.panel.updateList();
        await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_energy"});

        GameController.instance.addNewHeroShip("ship_explosion");
        this.panel.updateList();
        await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_explosion"});

        // GameController.instance.addNewHeroShip("ship_focus");
        // this.panel.updateList();
        // await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_focus"});

        // GameController.instance.addNewHeroShip("ship_row");
        // this.panel.updateList();
        // await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_row"});

        // GameController.instance.addNewHeroShip("ship_shot");
        // this.panel.updateList();
        // await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_shot"});

        // GameController.instance.addNewHeroShip("ship_hunter");
        // this.panel.updateList();
        // await GameController.instance.showNewShipPanel(this.layer, {shipId: "ship_hunter"});

        GameController.instance.savePlayerData();
    }
}
