class BattleHUD extends eui.Component implements IHeroHUD, IScoreHUD {
    private grpBossHpBar: eui.Group;
    private grpScore: eui.Group;
    private grpHighScore: eui.Group;
    private lblScore: eui.Label;
    private lblHighScore: eui.Label;
    private grpTip: eui.Group;
    private imgTipIcon: eui.Image;
    private lblTipNum: eui.Label;
    private lblTipDesc: eui.Label;
    private progHpBar: eui.Rect;
    private progPowerBar: eui.Rect;
    private progBossHpBar: eui.Rect;
    
    private orgGrpTipRight: number = 0;
    private tipQueue: {icon: string, num: string, desc: string}[] = [];
    private tipShowing: boolean = false;

    private bossHpBarShowing: boolean = false;

	constructor() {
        super();

        this.addEventListener(eui.UIEvent.COMPLETE, this.onUIComplete, this);
        this.skinName = "resource/custom_skins/BattleHUDSkin.exml";
        this.currentState = "init";

        this.orgGrpTipRight = this.grpTip.right;
    }

    private onUIComplete(): void {
        this.width = egret.MainContext.instance.stage.stageWidth;
        let playerData = GameController.instance.playerData;
        this.lblHighScore.text = playerData.highscore.score.toString();
        this.lblScore.text = "0";
        this.grpBossHpBar.visible = false;
	}

    public updateScore(score: number): void {
        this.lblScore.text = score.toString();
    }

    public updateHighScore(score: number): void {
        this.lblHighScore.text = score.toString();
    }

    public updateHighScoreText(text: string): void {
        this.lblHighScore.text = text;
    }

    private updateTip(icon: string, num: string, desc: string): void {
        this.imgTipIcon.source = icon;
        this.lblTipNum.text = num;
        this.lblTipDesc.text = desc;
    }

    public showTip(icon: string, num: string, desc: string): void {
        const waitTime = 1000;
        if (this.tipShowing === false) {
            // 隐藏或隐去中
            this.tipShowing = true;
            this.updateTip(icon, num, desc);
            egret.Tween.removeTweens(this.grpTip);
            let tw = egret.Tween.get(this.grpTip);
            tw.to({right: -20}, 500, egret.Ease.getPowOut(3));
            tw.wait(waitTime);
            let checkTipQueue = () => {
                if (this.tipQueue.length === 0) {
                    // 队列里没有tip
                    this.tipShowing = false;
                    let tw = egret.Tween.get(this.grpTip);
                    tw.to({right: this.orgGrpTipRight}, 500, egret.Ease.getPowOut(3));
                } else {
                    // 仍有未显示的tips
                    let info = this.tipQueue.splice(0, 1)[0];
                    this.updateTip(info.icon, info.num, info.desc);
                    let tw = egret.Tween.get(this.grpTip);
                    tw.wait(waitTime);
                    tw.call(checkTipQueue, this);
                }
            }
            tw.call(checkTipQueue, this);
        } else {
            // 正在显示中
            this.tipQueue.push({icon: icon, num: num, desc: desc});
        }
    }

    public updateHpBar(hpPer: number): void {
        this.progHpBar.percentHeight = hpPer;
    }

    public updatePowerBar(powerPer: number): void {
        this.progPowerBar.percentHeight = powerPer;
    }

    public showBossHpBar(callback?: ()=>void, thisObj?: any): void {
        this.bossHpBarShowing = true;
        this.grpScore.visible = false;
        this.grpHighScore.visible = false;
        this.grpBossHpBar.visible = true;
        let tw = egret.Tween.get(this.progBossHpBar);
		tw.to({percentWidth: 100}, 2000);
		tw.call(()=>{
			this.bossHpBarShowing = false;
            if (callback) {
                callback.call(thisObj);
            }
		}, this);
    }

    public hideBossHpBar(): void {
        this.bossHpBarShowing = false;
        this.grpScore.visible = true;
        this.grpHighScore.visible = true;
        egret.Tween.removeTweens(this.progBossHpBar);
        this.grpBossHpBar.visible = false;
    }

    public updateBossHpBar(hpPer: number): void {
        if (this.bossHpBarShowing) {
            return;
        }
        this.progBossHpBar.percentWidth = hpPer;
    }

    private onTweenGroupComplete(evt: egret.Event): void {
    }
}

interface IHeroHUD {
    updateHpBar(hpPer: number): void;
    updatePowerBar(powerPer: number): void;
}

interface IScoreHUD {
    updateScore(score: number): void;
}