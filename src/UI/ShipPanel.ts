class ShipPanel extends tutils.Component {
    private openBattle: egret.tween.TweenGroup;
    private openPopEquip: egret.tween.TweenGroup;
    private closePopEquip: egret.tween.TweenGroup;
    private openShop: egret.tween.TweenGroup;
    private preOpenChest: egret.tween.TweenGroup;
    private endOpenChest: egret.tween.TweenGroup;
    private openChest1: egret.tween.TweenGroup;
    // private chestItemShine: egret.tween.TweenGroup;
    private vsMain: eui.ViewStack;
    private btnTab: eui.RadioButton;
    private grpShop: eui.Group;
    private grpBattle: eui.Group;
    private grpSocial: eui.Group;
    private btnStart: eui.Button;
    private btnChangeGun: eui.Button;
    private btnChangeSkill: eui.Button;
    private btnEquip: eui.Button;
    private grpGunDetail: eui.Group;
    private grpSkillDetail: eui.Group;
    private grpPopEquip: eui.Group;
    private imgGun: eui.Image;
    private imgSkill: eui.Image;
    private lblCoins: eui.BitmapLabel;
    private lblHpV: eui.BitmapLabel;
    private progHp: eui.Rect;
    private lblSpeedV: eui.BitmapLabel;
    private progSpeed: eui.Rect;
    private lblPowerV: eui.BitmapLabel;
    private progPower: eui.Rect;
    private lblFireRateV: eui.BitmapLabel;
    private progFireRate: eui.Rect;
    private lblExp: eui.BitmapLabel;
    private lblExpV: eui.BitmapLabel;
    private progExp: eui.Rect;
    private lblGunName: eui.Label;
    private lblGunDesc: eui.Label;
    private lblGunLevel: eui.BitmapLabel;
    private lblSkillName: eui.Label;
    private lblSkillDesc: eui.Label;
    private lblSkillLevel: eui.BitmapLabel;
    private lblEquipTypeName: eui.Label;
    private scrEquips: eui.Scroller;
    private lstEquips: eui.List;
    private lblEquipGunPowerV: eui.BitmapLabel;
    private progEquipGunPower: eui.Rect;
    private lblEquipGunFireRateV: eui.BitmapLabel;
    private progEquipGunFireRate: eui.Rect;
    private lblEquipGunExp: eui.BitmapLabel;
    private progEquipGunExp: eui.Rect;
    private lblEquipGunExpV: eui.BitmapLabel;
    private lblEquipSkillExp: eui.BitmapLabel;
    private progEquipSkillExp: eui.Rect;
    private lblEquipSkillExpV: eui.BitmapLabel;
    private lblEquipName: eui.Label;
    private lblEquipDesc: eui.Label;
    private rctPopEquipMask: eui.Rect;
    private btnFreeChest: eui.Button;
    private lblFreeChestLeft: eui.BitmapLabel;
    private lblFreeChestTitle: eui.BitmapLabel;
    private lblChestNum: eui.BitmapLabel;
    private btnOpenChest1: eui.Button;
    private btnOpenChest5: eui.Button;
    private btnOpenChestByCoins: eui.Button;
    private grpPopOpenChests: eui.Group;
    private rctPopOpenChestsMask: eui.Rect;
    private grpChestItem0: eui.Group;
    private grpChestItemLevel0: eui.Group;
    private lblChestItemLevel0: eui.BitmapLabel;
    private progChestItemExp0: eui.Rect;
    private progChestItemExpBg0: eui.Rect;
    private lblChestItemTip0: eui.BitmapLabel;
    private imgChestIcon0: eui.Image;
    private lblChestItemName0: eui.Label;
    private imgChestItemShine0: eui.Image;
    private lblChestItemType0: eui.BitmapLabel;
    private lblPlayerName: eui.BitmapLabel;
    private imgPlayerPortrait: eui.Image;
    
    private btnCheat: eui.Button;
    private btnClearArchives: eui.Button;
    private tabBottom: eui.TabBar;

    private playerData: PlayerData = null;
    private gun: string = null;
    private skill: string = null;
    private curEquipKey: string = null;
    private freeChestUpdate: tutils.ITimer = null;
    private chestDropKey: string = null;

    
    // override
    protected onInit(): void {
        this.skinName = "resource/custom_skins/ShipPanelSkin.exml";
        this.height = egret.MainContext.instance.stage.stageHeight;

        this.evtMgr.regEvent(this.btnCheat, egret.TouchEvent.TOUCH_TAP, this.onBtnCheat);
        this.evtMgr.regEvent(this.btnClearArchives, egret.TouchEvent.TOUCH_TAP, this.onBtnClearArchives);

        this.evtMgr.regEvent(this.btnTab.group, eui.UIEvent.CHANGE, this.onMainTabChange);
        this.evtMgr.regEvent(this.openBattle, "complete", this.onTweenGroupComplete);
        this.evtMgr.regEvent(this.openPopEquip, "complete", this.onTweenGroupComplete);
        this.evtMgr.regEvent(this.closePopEquip, "complete", this.onTweenGroupComplete);
        this.evtMgr.regEvent(this.openShop, "complete", this.onTweenGroupComplete);
        this.evtMgr.regEvent(this.preOpenChest, "complete", this.onTweenGroupComplete);
        this.evtMgr.regEvent(this.endOpenChest, "complete", this.onTweenGroupComplete);
        this.evtMgr.regEvent(this.openChest1, "complete", this.onTweenGroupComplete);
        // this.evtMgr.regEvent(this.chestItemShine, "complete", this.onTweenGroupComplete);
        this.evtMgr.regEvent(this.btnStart, egret.TouchEvent.TOUCH_TAP, this.onBtnStart);
        this.evtMgr.regEvent(this.btnChangeGun, egret.TouchEvent.TOUCH_TAP, this.onBtnChangeGun);
        this.evtMgr.regEvent(this.btnChangeSkill, egret.TouchEvent.TOUCH_TAP, this.onBtnChangeSkill);
        this.evtMgr.regEvent(this.btnEquip, egret.TouchEvent.TOUCH_TAP, this.onBtnEquip);
        this.evtMgr.regEvent(this.lstEquips, eui.ItemTapEvent.ITEM_TAP, this.onTapListItem);
        this.evtMgr.regEvent(this.rctPopEquipMask, egret.TouchEvent.TOUCH_TAP, this.onTapPopEquipMask);
        // this.evtMgr.regEvent(this.vsMain, eui.PropertyEvent.PROPERTY_CHANGE, this.onMainStackViewChange);
        this.evtMgr.regEvent(this.btnFreeChest, egret.TouchEvent.TOUCH_TAP, this.onBtnFreeChest);
        this.evtMgr.regEvent(this.btnOpenChest1, egret.TouchEvent.TOUCH_TAP, this.onBtnOpenChest1);
        // this.evtMgr.regEvent(this.btnOpenChest5, egret.TouchEvent.TOUCH_TAP, this.onBtnOpenChest5);
        this.evtMgr.regEvent(this.btnOpenChestByCoins, egret.TouchEvent.TOUCH_TAP, this.onBtnOpenChestByCoins);

        this.grpPopEquip.visible = false;
        this.grpPopOpenChests.visible = false;
        this.btnChangeGun.touchEnabled = false;
        this.btnChangeSkill.touchEnabled = false;
        this.btnStart.touchEnabled = false;
        this.btnEquip.touchEnabled = false;

        this.initTop();

        this.playerData = GameController.instance.playerData;
        this.setCoins(this.playerData.coins);

        this.btnTab.selected = true;

        this.tabBottom.dataProvider = this.vsMain;
        this.vsMain.selectedIndex = 1;

        this.initBattleView();
    }

    private initTop(): void {
        if (!GameController.instance.fbPlayerData) {
            // RES.getResByUrl("https://tools.tutils.com/t5w0rd.png", (data: egret.Texture, url: string):void=>{
            //     this.imgPlayerPortrait.texture = data;
            // }, this, RES.ResourceItem.TYPE_IMAGE);
            return;
        }
        this.lblPlayerName.text = GameController.instance.fbPlayerData.name;
        egret.ImageLoader.crossOrigin = "anonymous";
        RES.getResByUrl(GameController.instance.fbPlayerData.portrait, (data: egret.Texture, url: string):void=>{
            this.imgPlayerPortrait.texture = data;
        }, this, RES.ResourceItem.TYPE_IMAGE);
    }

    private onMainTabChange(e: eui.UIEvent):void {
        let radioGroup: eui.RadioButtonGroup = e.target;
        let lastSelectedIndex = this.vsMain.selectedIndex;
        
        this.commitProperties();

        // 设置前
        switch (lastSelectedIndex) {
        case 0:
            // for egret bug
            this.openShop.stop();
            this.openShop.play(0);
            this.openShop.stop();
            // this.currentState = "ShopFinal";
            break;
        case 1:
            // for egret bug
            this.openBattle.stop();
            this.openBattle.play(0);
            this.openBattle.stop();
            // this.currentState = "BattleFinal";
            // this.commitProperties();
            // this.currentState = "BattleInit";
            // this.commitProperties();
            // this.openPopEquip.stop();
            // this.closePopEquip.stop();
            break;
        case 2:
            // this.currentState = "SocialInit";
            break;
        }

        this.vsMain.selectedIndex = radioGroup.selectedValue;

        // 设置后
        switch (this.vsMain.selectedIndex) {
        case 0:
            this.initShopView();
            break;
        case 1:
            this.initBattleView();
            break;
        case 2:
            this.currentState = "SocialInit";
            break;
        }
    }

    private onTweenGroupComplete(evt: egret.Event): void {
        switch (evt.target) {
        case this.openBattle:
            // this.currentState = "BattleFinal";
            this.btnStart.touchEnabled = true;
            this.btnChangeGun.touchEnabled = true;
            this.btnChangeSkill.touchEnabled = true;
            break;

        case this.openPopEquip:
            this.btnEquip.touchEnabled = true;
            break;

        case this.closePopEquip:
            // this.currentState = "BattleFinal";
            this.btnChangeGun.touchEnabled = true;
            this.btnChangeSkill.touchEnabled = true;
            this.grpPopEquip.visible = false;
            break;

        case this.openShop:
            // this.commitProperties();
            // this.currentState = "ShopFinal";
            // this.commitProperties();
            break;

        case this.preOpenChest:
            this.openChest1.play(0);
            break;

        case this.endOpenChest:
            break;

        case this.openChest1:
            this.runShowChestDropAni();
            break;

        // case this.chestItemShine:
        //     this.chestItemShine.play(500);
        //     break;
        }
    }

    private initBattleView(): void {
        this.currentState = "BattleInit";
        this.commitProperties();
        this.setGun(this.gun ? this.gun : this.playerData.gun);
        this.setSkill(this.skill ? this.skill : this.playerData.skill);
        this.updateShipDetal();
        this.openBattle.play(0);
    }

    private initShopView(): void {
        this.currentState = "ShopInit";
        this.commitProperties();
        this.grpPopOpenChests.visible = false;

        // 免费宝箱时间
        if (!this.freeChestUpdate) {
            this.freeChestUpdate = new tutils.Timer();
            this.freeChestUpdate.setOnTimerListener((dt: number):void=>{
                let now = new Date();
                let left = this.playerData.freeChestTs + GlobalConfig.freeChestCD - now.getTime();
                if (left > 0) {
                    let str = new Date(left).toISOString().substr(11, 8);
                    this.lblFreeChestLeft.text = str;
                } else {
                    // 到时间了
                    this.freeChestUpdate.stop();
                    this.lblFreeChestTitle.visible = false;
                    this.lblFreeChestLeft.visible = false;
                    this.btnFreeChest.visible = true;
                }
            }, this);
        }
        
        let now = new Date();
        let left = this.playerData.freeChestTs + GlobalConfig.freeChestCD - now.getTime();
        if (left > 0) {
            // 显示剩余时间
            this.lblFreeChestTitle.visible = true;
            this.lblFreeChestLeft.visible = true;
            this.btnFreeChest.visible = false;

            let str = new Date(left).toISOString().substr(11, 8);
            this.lblFreeChestLeft.text = str;
            this.freeChestUpdate.start(0);
        } else {
            // 免费宝箱可以领取
            this.lblFreeChestTitle.visible = false;
            this.lblFreeChestLeft.visible = false;
            this.btnFreeChest.visible = true;
        }

        this.setChestNum(this.playerData.allChests[0]);
        this.openShop.play(0);
    }

    private setCoins(num: number): void {
        this.playerData.coins = num;
        this.lblCoins.text = num.toString();
    }

    private setChestNum(num: number): void {
        if (num === 0) {
            this.btnOpenChest1.visible = false;
            this.btnOpenChestByCoins.visible = true;
            this.btnOpenChestByCoins.label = GlobalConfig.chestPrice.toString();
            this.btnOpenChestByCoins.enabled = (this.playerData.coins>=GlobalConfig.chestPrice);
        } else {
            this.btnOpenChest1.visible = true;
            this.btnOpenChestByCoins.visible = false;
        }
        this.playerData.allChests[0] = num;
        this.lblChestNum.text = "x " + num.toString();
    }

    private onBtnCheat(evt: egret.TouchEvent): void {
        let curEquipKey = this.curEquipKey;
        if (this.editingGun) {
            let gunPlayerData = GameController.instance.getPlayerGunData(this.curEquipKey);
            if (gunPlayerData) {
                // add exp
                gunPlayerData.exp++;
            } else {
                // unlock
                GameController.instance.addNewGun(this.curEquipKey);
                this.btnEquip.enabled = true;
            }
            this.curEquipKey = null;
            this.updateEquipGunDetail(curEquipKey)
            this.updateEquipGunList();
        } else {
            let skillPlayerData = GameController.instance.getPlayerSkillData(this.curEquipKey);
            if (skillPlayerData) {
                // add exp
                skillPlayerData.exp++;
            } else {
                // unlock
                GameController.instance.addNewSkill(this.curEquipKey);
                this.btnEquip.enabled = true;
            }
            this.curEquipKey = null;
            this.updateEquipSkillDetail(curEquipKey)
            this.updateEquipSkillList();
        }
        GameController.instance.savePlayerData();
    }

    private onBtnClearArchives(evt: egret.TouchEvent): void {
        this.playerData = GameController.instance.resetPlayerData();
        this.gun = null;
        this.skill = null;
        this.setCoins(this.playerData.coins);
        this.commitProperties();
    }

    private onBtnStart(evt: egret.TouchEvent): void {
        this.playerData.gun = this.gun;
        this.playerData.skill = this.skill;
        GameController.instance.savePlayerData();
        GameController.instance.replaceRootLayerNextFrame(BattleLayer);
    }

    private onBtnChangeGun(evt: egret.TouchEvent): void {
        this.grpPopEquip.visible = true;
        this.btnChangeGun.touchEnabled = false;
        this.btnChangeSkill.touchEnabled = false;
        this.setupGunPopPanel();
        this.openPopEquip.play(0);
    }

    private onBtnChangeSkill(evt: egret.TouchEvent): void {
        this.grpPopEquip.visible = true;
        this.btnChangeGun.touchEnabled = false;
        this.btnChangeSkill.touchEnabled = false;
        this.setupSkillPopPanel();
        this.openPopEquip.play(0);
    }

    private onBtnEquip(evt: egret.TouchEvent): void {
        this.btnEquip.touchEnabled = false;
        if (this.editingGun) {
            this.setGun(this.curEquipKey);
        } else {
            this.setSkill(this.curEquipKey);
        }
        this.closePopEquip.play(0);
    }

    private onTapPopEquipMask(evt: egret.TouchEvent): void {
        if (evt.target === this.rctPopEquipMask) {
            this.closePopEquip.play(0);
        }
    }

    private onTapPopOpenChestsMask(evt: egret.TouchEvent): void {
        if (evt.target === this.rctPopOpenChestsMask) {
            this.evtMgr.unregEvent(this.rctPopOpenChestsMask, egret.TouchEvent.TOUCH_TAP, this.onTapPopOpenChestsMask);
            this.grpPopOpenChests.visible = false;
            this.grpPopOpenChests.alpha = 0;
            egret.Tween.removeTweens(this.imgChestItemShine0);
            this.endOpenChest.play(0);
        }
    }

    private updateShipDetal(): void {
        let level = GameController.instance.getHeroLevel();
        let maxHp = GameController.instance.calcHeroMaxHp(level);
        let speed = GameController.instance.calcHeroSpeed(level);

        this.lblHpV.text = maxHp.toString();
        this.lblSpeedV.text = speed.toString();
        let expText = "MAX";
        let expPerWidth = 100;
        if (level < GameController.instance.expTable.length+1) {
            // 没满级
            let expBase = level===1 ? 0 : GameController.instance.expTable[level-2];
            let expNext = GameController.instance.expTable[level-1];
            expPerWidth = (this.playerData.exp - expBase) * 100 / (expNext - expBase);
            expText = expPerWidth.toFixed(0) + "%";
        }
        this.lblExpV.text = expText;
        this.lblExp.text = "Exp(Lv." + level + ")";

        egret.Tween.removeTweens(this.progHp);
        egret.Tween.removeTweens(this.progSpeed);
        egret.Tween.removeTweens(this.progExp);
        let tw = egret.Tween.get(this.progHp)
        tw.to({percentWidth: Math.min(100, maxHp*100/GlobalUIMaxHp)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progSpeed)
        tw.to({percentWidth: Math.min(100, speed*100/GlobalUIMaxSpeed)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progExp)
        tw.to({percentWidth: expPerWidth}, 100, egret.Ease.getPowOut(2));
    }

    private setGun(key: string): void {
        let gunData = GameController.instance.getGunData(key);
        if (!gunData) {
            return;
        }

        let level = GameController.instance.getHeroLevel();
        let gunLevel = GameController.instance.getGunLevel(key);
        let powerIncPer = GameController.instance.calcHeroPowerIncPer(level);
        let playerGunData = GameController.instance.getPlayerGunData(key);
        this.gun = key;
        this.imgGun.source = gunData.model;
        this.lblGunName.text = gunData.name;
        this.lblGunDesc.text = gunData.desc;
        this.lblGunLevel.text = GameController.instance.expToGunLevel(playerGunData.exp).toString();
        this.lblPowerV.text = (tutils.levelValue(gunData.bulletPower, gunLevel) * (1 + powerIncPer)).toFixed(0) + (gunData.bulletNum===1 ? "" : " x " + tutils.levelValue(gunData.bulletNum, gunLevel).toString());
        this.lblFireRateV.text = (1000 / Math.max(1000/60, tutils.levelValue(gunData.fireCD, gunLevel))).toFixed(1) + "/s";
        
        egret.Tween.removeTweens(this.progPower);
        egret.Tween.removeTweens(this.progFireRate);
        let tw = egret.Tween.get(this.progPower)
        tw.to({percentWidth: Math.min(100, tutils.levelValue(gunData.bulletPower, level)*(1+powerIncPer)*tutils.levelValue(gunData.bulletNum, gunLevel)*100/GlobalUIMaxPower)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progFireRate)
        tw.to({percentWidth: Math.min(100, 100000/tutils.levelValue(gunData.fireCD, gunLevel)/GlobalUIMaxFireRate)}, 100, egret.Ease.getPowOut(2));
    }

    private setSkill(key: string): void {
        let skillData = GameController.instance.getSkillData(key);
        if (!skillData) {
            return;
        }
        let playerSkillData = GameController.instance.getPlayerSkillData(key);
        this.skill = key;
        this.imgSkill.source = skillData.model;
        this.lblSkillName.text = skillData.name;
        this.lblSkillDesc.text = skillData.desc;
        this.lblSkillLevel.text = GameController.instance.expToSkillLevel(playerSkillData.exp).toString();
    }

    private setupGunPopPanel(): void {
        this.lblEquipTypeName.text = "主炮";
        this.grpGunDetail.visible = true;
        this.grpSkillDetail.visible = false;
        this.updateEquipGunDetail(this.gun);
        this.updateEquipGunList();
    }

    private updateEquipGunList(): void {
        // setup list
        let unlockedSelectedIndex = -1;
        let firstUnlockedIndex = -1;
        let items: EquipsListItem[] = [];
        let lockedItems: EquipsListItem[] = [];
        for (let i in GameController.instance.allGuns) {
            let gunKey = GameController.instance.allGuns[i];
            let gunData = GameController.instance.getGunData(gunKey);
            let item: EquipsListItem = {key: gunKey, icon: gunData.model, level: "LK", selected: 0};

            let playerGunData = GameController.instance.getPlayerGunData(gunKey);
            if (playerGunData) {
                // player guns
                let exp = playerGunData.exp;
                item.level = GameController.instance.expToGunLevel(exp).toString();
                if (firstUnlockedIndex < 0) {
                    firstUnlockedIndex = items.length;
                }
                if (gunKey == this.curEquipKey) {
                    unlockedSelectedIndex = items.length;
                }
                items.push(item);
            } else {
                // locked guns
                item.filter = [tutils.greyFilter()];
                lockedItems.push(item);
            }
        }

        for (let i in lockedItems) {
            let item = lockedItems[i];
            items.push(item);
        }

        this.lstEquips.dataProvider = new eui.ArrayCollection(items);
        if (unlockedSelectedIndex > -1) {
            this.setListItemSelected(unlockedSelectedIndex);
        } else if (this.lstEquips.selectedIndex < 0) {
            this.setListItemSelected(0);
        } else {
            this.curEquipKey = null;
            if (unlockedSelectedIndex >= 0) {
                this.setListItemSelected(unlockedSelectedIndex);
            } else if (firstUnlockedIndex < 0) {
                this.setListItemSelected(this.lstEquips.selectedIndex);
            } else {
                this.setListItemSelected(firstUnlockedIndex);
            }
        }
        
        this.scrEquips.verticalScrollBar.thumb.height = Math.min(this.scrEquips.viewport.height, this.scrEquips.viewport.height*this.scrEquips.viewport.height/this.lstEquips.height);
    }

    private updateEquipGunDetail(gunKey: string): void {
        if (this.curEquipKey===gunKey) {
            return;
        }
        this.curEquipKey = gunKey;
        let gunData = GameController.instance.getGunData(gunKey);
        let playerGunData = GameController.instance.getPlayerGunData(gunKey);
        if (!playerGunData) {
            this.lblEquipName.text = gunData.name;
            this.lblEquipDesc.text = gunData.desc;
            this.lblEquipGunPowerV.text = "--";
            this.lblEquipGunFireRateV.text = "--";
            this.lblEquipGunExpV.text = "--";
            this.progEquipGunPower.percentWidth = 0;
            this.progEquipGunFireRate.percentWidth = 0;
            this.progEquipGunExp.percentWidth = 0;
            this.lblEquipGunExp.text = "Exp";
            this.btnEquip.enabled = false;

            // let playerData = GameController.instance.playerData;
            // this.btnUnlock.label = gunData.coins.toString();
            // this.btnUnlock.enabled = playerData.coins>=gunData.coins;
            return;
        }
        
        let level = GameController.instance.expToGunLevel(playerGunData.exp);
        this.btnEquip.enabled = true;
        this.lblEquipName.text = gunData.name;
        this.lblEquipDesc.text = gunData.desc;
        this.lblEquipGunPowerV.text = tutils.levelValue(gunData.bulletPower, level).toString() + (tutils.levelValue(gunData.bulletNum, level)===1 ? "" : " x " + tutils.levelValue(gunData.bulletNum, level).toString());
        this.lblEquipGunFireRateV.text = (1000 / Math.max(1000/60, tutils.levelValue(gunData.fireCD, level))).toFixed(1) + "/s";
        let expText = "MAX";
        let expPerWidth = 100;
        if (level !== GameController.instance.gunExpTable.length+1) {
            // 没满级
            let expBase = level===1 ? 0 : GameController.instance.gunExpTable[level-2];
            let expNext = GameController.instance.gunExpTable[level-1];
            expPerWidth = (playerGunData.exp - expBase) * 100 / (expNext - expBase);
            expText = expPerWidth.toFixed(0) + "%";
        }
        this.lblEquipGunExpV.text = expText;
        this.lblEquipGunExp.text = "Exp(Lv." + level + ")";

        egret.Tween.removeTweens(this.progEquipGunPower);
        egret.Tween.removeTweens(this.progEquipGunFireRate);
        egret.Tween.removeTweens(this.progEquipGunExp);
        let tw = egret.Tween.get(this.progEquipGunPower);
        tw.to({percentWidth: Math.min(100, tutils.levelValue(gunData.bulletPower, level)*tutils.levelValue(gunData.bulletNum, level)*100/GlobalUIMaxPower)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progEquipGunFireRate)
        tw.to({percentWidth: Math.min(100, 100000/tutils.levelValue(gunData.fireCD, level)/GlobalUIMaxFireRate)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progEquipGunExp)
        tw.to({percentWidth: expPerWidth}, 100, egret.Ease.getPowOut(2));
    }

    private setupSkillPopPanel(): void {
        this.lblEquipTypeName.text = "技能";
        this.grpGunDetail.visible = false;
        this.grpSkillDetail.visible = true;
        this.updateEquipSkillDetail(this.skill);
        this.updateEquipSkillList();
    }

    private updateEquipSkillList(): void {
        // setup list
        let unlockedSelectedIndex = -1;
        let firstUnlockedIndex = -1;
        let items: EquipsListItem[] = [];
        let lockedItems: EquipsListItem[] = [];
        for (let i in GameController.instance.allSkills) {
            let skillKey = GameController.instance.allSkills[i];
            let skillData = GameController.instance.getSkillData(skillKey);
            let item: EquipsListItem = {key: skillKey, icon: skillData.model, level: "LK", selected: 0};

            let playerSkillData = GameController.instance.getPlayerSkillData(skillKey);
            if (playerSkillData) {
                // player skills
                let exp = playerSkillData.exp;
                item.level = GameController.instance.expToSkillLevel(exp).toString();
                if (firstUnlockedIndex < 0) {
                    firstUnlockedIndex = items.length;
                }
                if (skillKey == this.curEquipKey) {
                    unlockedSelectedIndex = items.length;
                }
                items.push(item);
            } else {
                // locked skills
                item.filter = [tutils.greyFilter()];
                lockedItems.push(item);
            }
        }

        for (let i in lockedItems) {
            let item = lockedItems[i];
            items.push(item);
        }

        this.lstEquips.dataProvider = new eui.ArrayCollection(items);
        if (unlockedSelectedIndex > -1) {
            this.setListItemSelected(unlockedSelectedIndex);
        } else if (this.lstEquips.selectedIndex < 0) {
            this.setListItemSelected(0);
        } else {
            this.curEquipKey = null;
            if (unlockedSelectedIndex >= 0) {
                this.setListItemSelected(unlockedSelectedIndex);
            } else if (firstUnlockedIndex < 0) {
                this.setListItemSelected(this.lstEquips.selectedIndex);
            } else {
                this.setListItemSelected(firstUnlockedIndex);
            }
        }

        this.scrEquips.verticalScrollBar.thumb.height = Math.min(this.scrEquips.viewport.height, this.scrEquips.viewport.height*this.scrEquips.viewport.height/this.lstEquips.height);
    }

    private updateEquipSkillDetail(skillKey: string): void {
        if (this.curEquipKey===skillKey) {
            return;
        }
        this.curEquipKey = skillKey;
        let skillData = GameController.instance.getSkillData(skillKey);
        let playerSkillData = GameController.instance.getPlayerSkillData(skillKey);
        if (!playerSkillData) {
            this.lblEquipName.text = skillData.name;
            this.lblEquipDesc.text = skillData.desc;
            this.lblEquipSkillExpV.text = "--";
            this.progEquipSkillExp.percentWidth = 0;
            this.lblEquipSkillExp.text = "Exp";
            this.btnEquip.enabled = false;

            // let playerData = GameController.instance.playerData;
            // this.btnUnlock.label = skillData.coins.toString();
            // this.btnUnlock.enabled = playerData.coins>=skillData.coins;
            return;
        }
        
        this.btnEquip.enabled = true;
        this.lblEquipName.text = skillData.name;
        this.lblEquipDesc.text = skillData.desc;
        let level = GameController.instance.expToSkillLevel(playerSkillData.exp);
        let expText = "MAX";
        let expPerWidth = 100;
        if (level !== GameController.instance.skillExpTable.length+1) {
            // 没满级
            let expBase = level===1 ? 0 : GameController.instance.skillExpTable[level-2];
            let expNext = GameController.instance.skillExpTable[level-1];
            expPerWidth = (playerSkillData.exp - expBase) * 100 / (expNext - expBase);
            expText = expPerWidth.toFixed(0) + "%";
        }
        this.lblEquipSkillExpV.text = expText;
        this.lblEquipSkillExp.text = "Exp(Lv." + level + ")";

        egret.Tween.removeTweens(this.progEquipSkillExp);
        let tw = egret.Tween.get(this.progEquipSkillExp)
        tw.to({percentWidth: expPerWidth}, 100, egret.Ease.getPowOut(2));
    }

    private onTapListItem(e: eui.PropertyEvent): void {
        for (let i=0; i<this.lstEquips.dataProvider.length; i++) {
            let item: EquipsListItem = this.lstEquips.dataProvider.getItemAt(i);
            item.selected = this.lstEquips.selectedIndex===i ? 1 : 0;
            if (item.selected === 1) {
                let ir: any = this.lstEquips.getElementAt(i);
                if (!ir) {
                    break;
                }
                egret.Tween.removeTweens(ir.imgSelected);
                let tw = egret.Tween.get(ir.imgSelected);
                tw.set({scaleX: 0.8, scaleY: 0.8});
                tw.to({scaleX: 1, scaleY: 1}, 300, egret.Ease.getBackOut(4));
            }
        }

        if (this.editingGun) {
            this.updateEquipGunDetail(this.lstEquips.selectedItem.key);
        } else {
            this.updateEquipSkillDetail(this.lstEquips.selectedItem.key);
        }
    }

    private setListItemSelected(index: number): void {
        this.lstEquips.selectedIndex = index;
        this.onTapListItem(null);
    }

    private get editingGun(): boolean {
        return this.grpGunDetail.visible;
    }

    private onBtnFreeChest(evt: egret.TouchEvent): void {
        let targetTs = this.playerData.freeChestTs + GlobalConfig.freeChestCD;
        let now = new Date();
        let left = this.playerData.freeChestTs + GlobalConfig.freeChestCD - now.getTime();
        if (left > 0) {
            return;
        }
        this.setChestNum(this.playerData.allChests[0]+5);
        this.playerData.freeChestTs = now.getTime();
        this.lblFreeChestTitle.visible = true;
        this.lblFreeChestLeft.visible = true;
        this.btnFreeChest.visible = false;

        let str = new Date(GlobalConfig.freeChestCD).toISOString().substr(11, 8);
        this.lblFreeChestLeft.text = str;
        this.freeChestUpdate.start(0);
    }

    private onBtnOpenChest1(evt: egret.TouchEvent): void {
        let left = this.playerData.allChests[0] - 1;
        if (left < 0) {
            // 箱子不足
            return;
        }
        this.setChestNum(left);
        this.openChest();
    }

    private onBtnOpenChestByCoins(evt: egret.TouchEvent): void {
        let left = this.playerData.coins - GlobalConfig.chestPrice;
        if (left < 0) {
            return;
        }
        this.setCoins(left);
        this.btnOpenChestByCoins.enabled = (this.playerData.coins>=GlobalConfig.chestPrice);
        this.openChest();
    }

    private openChest(): void {
        this.grpPopOpenChests.alpha = 0;
        this.grpChestItem0.alpha = 0;
        this.grpChestItemLevel0.alpha = 0;
        this.imgChestIcon0.source = "shipitemunknown_png";
        this.imgChestItemShine0.alpha = 0;
        this.imgChestItemShine0.scaleX = 0;
        this.imgChestItemShine0.scaleY = 0;
        this.lblChestItemName0.text = "";
        this.preOpenChest.play(0);
        this.grpPopOpenChests.visible = true;
    }

    private runShowChestDropAni(): void {
        this.chestDropKey = GameController.instance.allChestDrop[0].randomR();
        let chestItemName: string;
        let chestItemModel: string;
        let chestItemWithExp: any;
        let chestItemExpToLevelFunc: Function;
        let chestItemExpTable: number[];
        let chestItemExpDelta: number;
        let chestItemNewTip: string;
        let newDrop = false;
        if (this.chestDropKey.indexOf("gun_") === 0) {
            let gunData = GameController.instance.getGunData(this.chestDropKey);
            chestItemName = gunData.name;
            chestItemModel = gunData.model;
            let playerGunData = GameController.instance.getPlayerGunData(this.chestDropKey);
            if (!playerGunData) {
                newDrop = true;
                GameController.instance.addNewGun(this.chestDropKey);
                playerGunData = GameController.instance.getPlayerGunData(this.chestDropKey);
                chestItemNewTip = "NEW CANNON!"
            }
            chestItemWithExp = playerGunData;
            chestItemExpToLevelFunc = GameController.instance.expToGunLevel;
            chestItemExpTable = GameController.instance.gunExpTable;
            chestItemExpDelta = 1;
            this.lblChestItemType0.text = "Cannon";
            this.lblChestItemType0.scaleX = this.lblChestItemType0.scaleY - 0.1;
		} else if (this.chestDropKey.indexOf("skill_") === 0) {
            let skillData = GameController.instance.getSkillData(this.chestDropKey);
            chestItemName = skillData.name;
            chestItemModel = skillData.model;
            let playerSkillData = GameController.instance.getPlayerSkillData(this.chestDropKey);
            if (!playerSkillData) {
                newDrop = true;
                GameController.instance.addNewSkill(this.chestDropKey);
                playerSkillData = GameController.instance.getPlayerSkillData(this.chestDropKey);
                chestItemNewTip = "NEW SKILL!"
            }
            chestItemWithExp = playerSkillData;
            chestItemExpToLevelFunc = GameController.instance.expToSkillLevel;
            chestItemExpTable = GameController.instance.skillExpTable;
            chestItemExpDelta = 1;
            this.lblChestItemType0.text = "Skill";
            this.lblChestItemType0.scaleX = this.lblChestItemType0.scaleY;
		} else if (this.chestDropKey.indexOf("shipexp_") === 0) {
            let shipExpData = GameController.instance.getShipExpData(this.chestDropKey);
            chestItemName = shipExpData.name;
            chestItemModel = shipExpData.model;
            chestItemWithExp = this.playerData;
            chestItemExpToLevelFunc = GameController.instance.expToLevel;
            chestItemExpTable = GameController.instance.expTable;
            chestItemExpDelta = shipExpData.exp;
            this.lblChestItemType0.text = "Ship";
            this.lblChestItemType0.scaleX = this.lblChestItemType0.scaleY;
		} else {
            console.assert(false, "invalied drop key("+this.chestDropKey+")");
            return;
        }

        let level = chestItemExpToLevelFunc.call(GameController.instance, chestItemWithExp.exp);
        this.lblChestItemLevel0.text = level.toString();
        let tw = egret.Tween.get(this.grpChestItemLevel0);
        tw.wait(200);
        tw.call(():void=>{
            this.imgChestIcon0.source = chestItemModel;
            this.lblChestItemName0.text = chestItemName;
            this.runChestItemShineAni();
        }, this);
        tw.to({alpha: 1}, 200);
        if (newDrop) {
            this.lblChestItemTip0.text = chestItemNewTip;
            this.progChestItemExpBg0.alpha = 0;
            this.progChestItemExp0.alpha = 0;
            tw.call(this.evtMgr.regEvent, this.evtMgr, [this.rctPopOpenChestsMask, egret.TouchEvent.TOUCH_TAP, this.onTapPopOpenChestsMask]);
        } else {
            this.progChestItemExpBg0.alpha = 1;
            this.progChestItemExp0.alpha = 1;
            let expPerWidth = 100;
            if (level !== chestItemExpTable.length+1) {
                // 没满级
                let expBase = level===1 ? 0 : chestItemExpTable[level-2];
                let expNext = chestItemExpTable[level-1];
                expPerWidth = (chestItemWithExp.exp - expBase) * 100 / (expNext - expBase);
            }
            this.progChestItemExp0.percentWidth = expPerWidth;
            this.lblChestItemTip0.text = expPerWidth.toFixed(0) + "%";
            tw.call(():void=>{
                chestItemWithExp.exp += chestItemExpDelta;
                let level2 = chestItemExpToLevelFunc.call(GameController.instance, chestItemWithExp.exp);
                let expPerWidth = 100;
                if (level2 !== chestItemExpTable.length+1) {
                    // 没满级
                    let expBase = level2===1 ? 0 : chestItemExpTable[level2-2];
                    let expNext = chestItemExpTable[level2-1];
                    expPerWidth = (chestItemWithExp.exp - expBase) * 100 / (expNext - expBase);
                }
                let tw2 = this.runProgAni(this.progChestItemExp0, 5, expPerWidth);
                if (level2 !== level) {
                    tw2.call(():void=>{
                        this.lblChestItemLevel0.text = level2.toString();
                    }, this);
                }
                tw2.call(this.evtMgr.regEvent, this.evtMgr, [this.rctPopOpenChestsMask, egret.TouchEvent.TOUCH_TAP, this.onTapPopOpenChestsMask]);
            }, this);
        }
    }

    private runProgAni(target: any, speed: number, toPerWidth: number): egret.Tween {
        let tw = egret.Tween.get(target, {onChange: ():void=>{
            if (this.lblChestItemTip0.text !== "LEVEL UP!") {
                this.lblChestItemTip0.text = target.percentWidth.toFixed(0) + "%";
            }
        }, onChangeObj: this});
        if (toPerWidth < target.percentWidth) {
            let dur1 = (100 - target.percentWidth) * tutils.SpeedFactor / speed;
            let dur2 = toPerWidth / speed;
            tw.to({percentWidth: 100}, dur1, egret.Ease.getPowOut(2));
            tw.set({percentWidth: 0});
            tw.to({percentWidth: toPerWidth}, dur2, egret.Ease.getPowOut(2));
            tw.call(():void=>{
                this.lblChestItemTip0.text = "LEVEL UP!";
            }, this);
        } else {
            let dur = (toPerWidth - target.percentWidth) * tutils.SpeedFactor / speed;
            tw.to({percentWidth: toPerWidth}, dur, egret.Ease.getPowOut(2));
        }
        return tw;
    }

    private runChestItemShineAni(): void {
        let tw = egret.Tween.get(this.imgChestItemShine0);
        tw.to({alpha: 1, scaleX: 1.5, scaleY: 1.5}, 500, egret.Ease.sineOut);
        tw.to({alpha: 0.75, scaleX: 1, scaleY: 1}, 500, egret.Ease.sineIn);
        tw.call(this.runChestItemShineAni, this);
    }
}

type EquipsListItem = {key: string, icon: string, level: string, selected: number, filter?: egret.Filter[]};