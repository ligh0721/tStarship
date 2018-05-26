class HeroShipsLayer extends tutils.Layer {
    // override
    protected onCfgStage(): void {
        this.stage.frameRate = 60;
        this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    }

    protected onInit() {
        // 初始化玩家存档
        //egret.localStorage.clear();  // FIXME
        if (GameController.instance.loadPlayerData() === null) {
            GameController.instance.resetPlayerData();
            GameController.instance.addNewHeroShip("ship_test");
            GameController.instance.addNewHeroShip("ship_hero");
            GameController.instance.addNewHeroShip("ship_soundwave");
            GameController.instance.addNewHeroShip("ship_energy");
            GameController.instance.addNewHeroShip("ship_hunter");
            // GameController.instan ce.addNewHeroShip("ship_row");
            // GameController.instance.addNewHeroShip("ship_shot");
            GameController.instance.addNewHeroShip("ship_explosion");
            GameController.instance.addNewHeroShip("ship_focus");
            GameController.instance.savePlayerData();
        }
        
        let layer = new eui.UILayer();
        this.addChild(layer);
        let panel = new HeroShipsPanel();
        
        layer.addChild(panel);
    }
}
