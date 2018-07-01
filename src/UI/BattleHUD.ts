class BattleHUD extends tutils.Component implements IHeroHUD {
    private grpBossHpBar: eui.Group;
    private grpScore: eui.Group;
    private grpHighScore: eui.Group;
    private lblScore: eui.BitmapLabel;
    private lblHighScore: eui.BitmapLabel;
    private grpTip: eui.Group;
    private imgTipIcon: eui.Image;
    private lblTipNum: eui.Label;
    private lblTipDesc: eui.Label;
    private progHpBar: eui.Rect;
    private progPowerBar: eui.Rect;
    private progBossHpBar: eui.Rect;
    private lblPowerMax: eui.BitmapLabel;
    private lblPowerPress: eui.BitmapLabel;
    private btnPower: eui.Button;
    private grpBuffs: eui.Group;
    private grpParts: eui.Group;
    private lblGunLevel: eui.BitmapLabel;
    private grpShieldBar: eui.Group;
    private progShieldBar: eui.Rect;
    private lblHpV: eui.BitmapLabel;
    private lblPowerV: eui.BitmapLabel;
    private lblShieldV: eui.BitmapLabel;

    private onUsePowerListener: Function = null;
    private onUsePowerThisObj: any = null;
    
    private tipQueue: {icon: string, num: string, desc: string}[] = [];
    private tipShowing: boolean = false;

    private bossHpBarShowing: boolean = false;

    private data: {};
    private hero: HeroShip;

    public constructor(data: {}) {
        super();
        this.data = data;
    }

    // override
    protected onInit(): void {
        this.skinName = "resource/custom_skins/BattleHUDSkin.exml";
        this.currentState = "init";

        this.width = egret.MainContext.instance.stage.stageWidth;
        let playerData = GameController.instance.playerData;
        this.lblHighScore.text = playerData.highscore.score.toString();
        this.lblScore.text = "0";
        this.grpBossHpBar.visible = false;
        this.evtMgr.regEvent(this.btnPower, egret.TouchEvent.TOUCH_TAP, this.onBtnPower);
        this.evtMgr.regEvent(this.grpParts, egret.TouchEvent.TOUCH_TAP, this.onTapGrpParts);

        this.grpShieldBar.visible = false;
    }

    public setHero(hero: HeroShip): void {
        this.hero = hero;
        this.updateHpBar(hero.hp, hero.maxHp);
        this.updateEnergyBar(hero.energy, hero.maxEnergy);
        this.setGunLevel(hero.mainGun.level);
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
            tw.to({right: 0}, 500, egret.Ease.getPowOut(3));
            tw.wait(waitTime);
            let checkTipQueue = () => {
                if (this.tipQueue.length === 0) {
                    // 队列里没有tip
                    this.tipShowing = false;
                    let tw = egret.Tween.get(this.grpTip);
                    tw.to({right: -this.grpTip.width}, 500, egret.Ease.getPowOut(3));
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

    public updateHpBar(hp: number, maxHp: number): void {
        this.progHpBar.percentHeight = hp * 100 / maxHp;
        this.lblHpV.text = hp.toFixed(0) + "/" + maxHp.toFixed(0);
    }

    public updateEnergyBar(power: number, maxPower: number): void {
        let per = power * 100 / maxPower;
        this.progPowerBar.percentHeight = per;
        this.lblPowerV.text = (power*100/maxPower).toFixed(0) + "%";
        if (per===100 && this.lblPowerMax.visible===false) {
            this.lblPowerMax.alpha = 0;
            this.lblPowerMax.visible = true
            this.lblPowerPress.alpha = 0;
            this.lblPowerPress.visible = true
            this.lblPowerV.visible = false;
            let repeat = ()=>{
                let tw = egret.Tween.get(this.lblPowerMax);
                tw.to({alpha: 1}, 1000);
                tw.wait(1000);
                tw.to({alpha: 0}, 1000);
                tw.call(()=>{
                    let tw = egret.Tween.get(this.lblPowerPress);
                    tw.to({alpha: 1}, 1000);
                    tw.wait(1000);
                    tw.to({alpha: 0}, 1000);
                    tw.call(repeat, this);
                });
            };
            repeat();
            this.btnPower.visible = true;
        } else if (per!==100 && this.lblPowerMax.visible===true) {
            egret.Tween.removeTweens(this.lblPowerMax);
            egret.Tween.removeTweens(this.lblPowerPress);
            this.lblPowerMax.visible = false;
            this.lblPowerPress.visible = false;
            this.btnPower.visible = false;
            this.lblPowerV.visible = true;
        }
    }

    public updateShieldBar(shield: number, maxShield: number): void {
        if (maxShield>0 && this.grpShieldBar.visible===false) {
            // 开启指示器
            this.grpShieldBar.visible = true;
        } else if (maxShield<=0 && this.grpShieldBar.visible===true) {
            // 关闭指示器
            this.grpShieldBar.visible = false;
            return;
        }
        this.progShieldBar.percentHeight = shield * 100 / maxShield;
        this.lblShieldV.text = shield.toFixed(0);
    }

    private onBtnPower(evt: egret.TouchEvent): void {
        if (this.onUsePowerListener) {
            this.onUsePowerListener.call(this.onUsePowerThisObj);
        }
    }

    public setOnUseEnergyListener(listener: Function, thisObj: any): void {
        this.onUsePowerListener = listener;
        this.onUsePowerThisObj = thisObj;
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

    public addBuffUI(buff: Buff): void {
        let buffui = new BuffUI(buff);
        this.grpBuffs.addChild(buffui);
    }

    public updateBuffUI(buff: Buff): void {
    }

    public removeBuffUI(buff: Buff): void {
        for (let i=0, len=this.grpBuffs.numChildren; i<len; i++) {
            let child = this.grpBuffs.getChildAt(i) as BuffUI;
            if (child && child.buff==buff) {
                this.grpBuffs.removeChildAt(i);
                return;
            }
        }
    }

    public addPartUI(part: Part): void {
        let partui = new PartUI(part);
        this.grpParts.addChild(partui);
    }

    public removePartUI(part: Part): void {
        for (let i=0, len=this.grpParts.numChildren; i<len; i++) {
            let child = this.grpParts.getChildAt(i) as PartUI;
            if (child && child.part==part) {
                this.grpParts.removeChildAt(i);
                return;
            }
        }
    }

    public addBattleTip(x: number, y: number, text: string, angleRange: number, font: string, scale: number): void {
        let lbl = new egret.BitmapText();
        lbl.font = RES.getRes(font);
        lbl.text = text;
        this.addChild(lbl);
        lbl.anchorOffsetX = lbl.width * 0.5;
        lbl.anchorOffsetY = lbl.height * 0.5;
        lbl.x = x;
        lbl.y = y;
        lbl.scaleX = scale;
        lbl.scaleY = scale;
        let angle = (Math.random() - 0.5) * angleRange;
        let pos = Unit.getDirectionPoint(0, 0, angle, 100);
        let act = new tutils.Sequence(
            new tutils.Spawn(
                new tutils.To(500, {alpha: 0}),
                new tutils.MoveBy(500, pos.x, pos.y)
            ),
            new tutils.CallFunc(():void=>{
                GameController.instance.actMgr.removeAllActions(lbl);
                this.removeChild(lbl);
            }, this)
        );
        GameController.instance.actMgr.addAction(lbl, act);
    }

    private onTweenGroupComplete(evt: egret.Event): void {
    }

    private onTapGrpParts(evt: egret.TouchEvent): void {
        if (this.alpha!=1 || !this.hero || !this.hero.alive) {
            return;
        }
        
        let parts: Part[] = [];
        for (let id in this.hero.parts) {
            let part = this.hero.parts[id];
            parts.push(part);
        }

        let panel = GameController.instance.showPartsPanel(this, {parts: parts});
        panel.setOnRemovePartListener((part: Part):void=>{
            this.hero.removePart(part.id);
        }, this);
    }

    public setGunLevel(level: number): void {
        this.lblGunLevel.text = "x" + level;
    }
}

interface IHeroHUD {
    updateHpBar(hp: number, maxHp: number): void;
    updateEnergyBar(power: number, maxPower: number): void;
    updateShieldBar(shield: number, maxShield: number): void;
}
