class GameOverPanel extends eui.Component {
    private open: egret.tween.TweenGroup;
    private lblHighScore: eui.Label;
    private lblStages: eui.Label;
    private lblEnemies: eui.Label;
    private lblBosses: eui.Label;
    private lblScore: eui.Label;
    private btnReturn: eui.Button;
    private data: {high: number, stages: number, enemies: number, bosses: number, score: number};

	public constructor(data: {high: number, stages: number, enemies: number, bosses: number, score: number}) {
        super();
        this.data = data;
    }

    // override
    protected createChildren(): void {
        super.createChildren();

        this.skinName = "resource/custom_skins/GameOverPanelSkin.exml";
        this.currentState = "init";

        this.btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnReturn, this);
        this.lblHighScore.text = "HIGH SCORE: " + this.data.high;
        this.lblStages.text = "STAGES: " + this.data.stages;
        this.lblEnemies.text = "ENEMIES: " + this.data.enemies;
        this.lblBosses.text = "BOSSES: " + this.data.bosses;
        this.lblScore.text = this.data.score.toString();
        this.open.addEventListener("complete", this.onTweenGroupComplete, this);
        this.open.play();
    }

    private onTweenGroupComplete(evt: egret.Event): void {
    }

    private onBtnReturn(evt: egret.TouchEvent): void {
        GameController.instance.replaceRootLayerNextFrame(ShipLayer);
    }
}