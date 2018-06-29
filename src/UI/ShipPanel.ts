class ShipPanel extends tutils.Component {
    private openBattle: egret.tween.TweenGroup;
    private openPopEquip: egret.tween.TweenGroup;
    private closePopEquip: egret.tween.TweenGroup;
    private openShop: egret.tween.TweenGroup;
    private preOpenChest: egret.tween.TweenGroup;
    private endOpenChest: egret.tween.TweenGroup;
    private openChest1: egret.tween.TweenGroup;
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
    private grpPopOpenChests: eui.Group;
    private rctPopOpenChestsMask: eui.Rect;
    private grpChestItemLevel0: eui.Group;
    private lblChestItemLevel0: eui.BitmapLabel;
    private progChestItemExp0: eui.Rect;
    private imgChestIcon0: eui.Image;
    
    
    private btnCheat: eui.Button;
    private btnClearArchives: eui.Button;
    private tabBottom: eui.TabBar;

    private playerData: PlayerData = null;
    private gun: string = null;
    private skill: string = null;
    private curEquipKey: string = null;
    private freeChestUpdate: tutils.ITimer = null;
    private numChestOpened: 1|5 = 1;

    
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
        this.evtMgr.regEvent(this.btnStart, egret.TouchEvent.TOUCH_TAP, this.onBtnStart);
        this.evtMgr.regEvent(this.btnChangeGun, egret.TouchEvent.TOUCH_TAP, this.onBtnChangeGun);
        this.evtMgr.regEvent(this.btnChangeSkill, egret.TouchEvent.TOUCH_TAP, this.onBtnChangeSkill);
        this.evtMgr.regEvent(this.btnEquip, egret.TouchEvent.TOUCH_TAP, this.onBtnEquip);
        this.evtMgr.regEvent(this.lstEquips, eui.ItemTapEvent.ITEM_TAP, this.onTapListItem);
        this.evtMgr.regEvent(this.rctPopEquipMask, egret.TouchEvent.TOUCH_TAP, this.onTapShipPopMask);
        // this.evtMgr.regEvent(this.vsMain, eui.PropertyEvent.PROPERTY_CHANGE, this.onMainStackViewChange);
        this.evtMgr.regEvent(this.btnFreeChest, egret.TouchEvent.TOUCH_TAP, this.onBtnFreeChest);
        this.evtMgr.regEvent(this.btnOpenChest1, egret.TouchEvent.TOUCH_TAP, this.onBtnOpenChest1);
        this.evtMgr.regEvent(this.btnOpenChest5, egret.TouchEvent.TOUCH_TAP, this.onBtnOpenChest5);

        this.grpPopEquip.visible = false;
        this.grpPopOpenChests.visible = false;
        this.btnChangeGun.touchEnabled = false;
        this.btnChangeSkill.touchEnabled = false;
        this.btnStart.touchEnabled = false;
        this.btnEquip.touchEnabled = false;

        this.playerData = GameController.instance.playerData;
        this.lblCoins.text = this.playerData.coins.toString();

        this.btnTab.selected = true;

        this.tabBottom.dataProvider = this.vsMain;

        this.initBattleView();
    }

    private onMainTabChange(e: eui.UIEvent):void {
        console.log('tab'+this.hashCode+', '+this.playerData.sharechestTs);
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
            this.runShowChestDrop(1);
            break;
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

        this.lblChestNum.text = "x " + this.playerData.allChests[0].toString();
        this.openShop.play(0);
    }

    private onBtnCheat(evt: egret.TouchEvent): void {
        let curEquipKey = this.curEquipKey;
        if (this.editingGun) {
            let gunPlayerData = GameController.instance.getPlayerGunDataByKey(this.curEquipKey);
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
            let skillPlayerData = GameController.instance.getPlayerSkillDataByKey(this.curEquipKey);
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
        console.log('before clear'+this.hashCode+', '+this.playerData.sharechestTs);
        this.playerData = GameController.instance.resetPlayerData();
        console.log('after clear'+this.hashCode+', '+this.playerData.sharechestTs);
        this.gun = null;
        this.skill = null;
        this.lblCoins.text = this.playerData.coins.toString();
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

    private onTapShipPopMask(evt: egret.TouchEvent): void {
        if (evt.target === this.rctPopEquipMask) {
            this.closePopEquip.play(0);
        }
    }

    private onTapOpenChestsMask(evt: egret.TouchEvent): void {
        if (evt.target === this.rctPopOpenChestsMask) {
            this.grpPopOpenChests.visible = false;
            this.grpPopOpenChests.alpha = 0;
            this.endOpenChest.play(0);
        }
    }

    private updateShipDetal(): void {
        this.lblHpV.text = this.playerData.maxHp.toString();
        this.lblSpeedV.text = this.playerData.speed.toString();
        let level = GameController.instance.expToLevel(this.playerData.exp);
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
        egret.Tween.removeTweens(this.progPower);
        let tw = egret.Tween.get(this.progHp)
        tw.to({percentWidth: Math.min(100, this.playerData.maxHp * 100 / GlobalMaxHp)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progSpeed)
        tw.to({percentWidth: Math.min(100, this.playerData.speed * 100 / GlobalMaxSpeed)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progExp)
        tw.to({percentWidth: expPerWidth}, 100, egret.Ease.getPowOut(2));
    }

    private setGun(key: string): void {
        let gunData = GameController.instance.getGunDataByKey(key);
        if (!gunData) {
            return;
        }
        let playerGunData = GameController.instance.getPlayerGunDataByKey(key);
        this.gun = key;
        this.imgGun.source = gunData.model;
        this.lblGunName.text = gunData.name;
        this.lblGunDesc.text = gunData.desc;
        this.lblGunLevel.text = GameController.instance.expToGunLevel(playerGunData.exp).toString();
        this.lblPowerV.text = gunData.bulletPower.toString() + (gunData.bulletNum===1 ? "" : " x " + gunData.bulletNum.toString());
        this.lblFireRateV.text = (1000 / Math.max(1000/60, gunData.fireCD)).toFixed(1) + "/s";
        
        egret.Tween.removeTweens(this.progFireRate);
        egret.Tween.removeTweens(this.progExp);
        let tw = egret.Tween.get(this.progPower)
        tw.to({percentWidth: Math.min(100, gunData.bulletPower * gunData.bulletNum * 100 / GlobalMaxPower)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progFireRate)
        tw.to({percentWidth: Math.min(100, 100000 / gunData.fireCD / GlobalMaxFireRate)}, 100, egret.Ease.getPowOut(2));
    }

    private setSkill(key: string): void {
        let skillData = GameController.instance.getSkillDataByKey(key);
        if (!skillData) {
            return;
        }
        let playerSkillData = GameController.instance.getPlayerSkillDataByKey(key);
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
            let gunData = GameController.instance.getGunDataByKey(gunKey);
            let item: EquipsListItem = {key: gunKey, icon: gunData.model, level: "LK", selected: 0};

            let playerGunData = GameController.instance.getPlayerGunDataByKey(gunKey);
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
        let gunData = GameController.instance.getGunDataByKey(gunKey);
        let playerGunData = GameController.instance.getPlayerGunDataByKey(gunKey);
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
        
        this.btnEquip.enabled = true;
        this.lblEquipName.text = gunData.name;
        this.lblEquipDesc.text = gunData.desc;
        this.lblEquipGunPowerV.text = gunData.bulletPower.toString() + (gunData.bulletNum===1 ? "" : " x " + gunData.bulletNum.toString());
        this.lblEquipGunFireRateV.text = (1000 / Math.max(1000/60, gunData.fireCD)).toFixed(1) + "/s";
        let level = GameController.instance.expToGunLevel(playerGunData.exp);
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
        tw.to({percentWidth: Math.min(100, gunData.bulletPower * gunData.bulletNum * 100 / GlobalMaxPower)}, 100, egret.Ease.getPowOut(2));
        tw = egret.Tween.get(this.progEquipGunFireRate)
        tw.to({percentWidth: Math.min(100, 100000/gunData.fireCD/GlobalMaxFireRate)}, 100, egret.Ease.getPowOut(2));
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
            let skillData = GameController.instance.getSkillDataByKey(skillKey);
            let item: EquipsListItem = {key: skillKey, icon: skillData.model, level: "LK", selected: 0};

            let playerSkillData = GameController.instance.getPlayerSkillDataByKey(skillKey);
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
        let skillData = GameController.instance.getSkillDataByKey(skillKey);
        let playerSkillData = GameController.instance.getPlayerSkillDataByKey(skillKey);
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
        this.playerData.allChests[0]++;
        this.playerData.freeChestTs = now.getTime();
        this.lblFreeChestTitle.visible = true;
        this.lblFreeChestLeft.visible = true;
        this.btnFreeChest.visible = false;

        let str = new Date(GlobalConfig.freeChestCD).toISOString().substr(11, 8);
        this.lblFreeChestLeft.text = str;
        this.freeChestUpdate.start(0);

        this.lblChestNum.text = "x " + this.playerData.allChests[0].toString();
    }

    private onBtnOpenChest1(evt: egret.TouchEvent): void {
        this.openChest(1);
    }

    private onBtnOpenChest5(evt: egret.TouchEvent): void {
        this.openChest(5);
    }

    private openChest(num: 1|5): void {
        let left = this.playerData.allChests[0] - num;
        if (left < 0) {
            // 箱子不足
            return;
        }

        this.playerData.allChests[0] = left;
        this.lblChestNum.text = "x " + left;
        this.numChestOpened = num;
        this.preOpenChest.play(0);
        this.grpPopOpenChests.visible = true;
        this.evtMgr.regEvent(this.rctPopOpenChestsMask, egret.TouchEvent.TOUCH_TAP, this.onTapOpenChestsMask);
    }

    private runShowChestDrop(num: 1|5): void {
        let playerGunData = GameController.instance.getPlayerGunDataByKey("gun_single");
        let level = GameController.instance.expToGunLevel(playerGunData.exp);
        this.lblChestItemLevel0.text = level.toString();
        let expPerWidth = 100;
        if (level !== GameController.instance.gunExpTable.length+1) {
            // 没满级
            let expBase = level===1 ? 0 : GameController.instance.gunExpTable[level-2];
            let expNext = GameController.instance.gunExpTable[level-1];
            expPerWidth = (playerGunData.exp - expBase) * 100 / (expNext - expBase);
        }
        this.progChestItemExp0.percentWidth = expPerWidth;
        let tw = egret.Tween.get(this.grpChestItemLevel0);
        tw.call(():void=>{
            this.imgChestIcon0.source = "RedHeroShip_png";
        }, this);
        tw.set({alpha: 1}, 500);
        tw.wait(100);
        tw.call(():void=>{
            playerGunData.exp++;
            let level2 = GameController.instance.expToGunLevel(playerGunData.exp);
            let expPerWidth = 100;
            if (level2 !== GameController.instance.gunExpTable.length+1) {
                // 没满级
                let expBase = level2===1 ? 0 : GameController.instance.gunExpTable[level2-2];
                let expNext = GameController.instance.gunExpTable[level2-1];
                expPerWidth = (playerGunData.exp - expBase) * 100 / (expNext - expBase);
            }
            let tw2 = egret.Tween.get(this.progChestItemExp0);
            tw2.to({percentWidth: expPerWidth}, 100, egret.Ease.getPowOut(2));
            if (level2 !== level) {
                tw2.call(():void=>{
                    this.lblChestItemLevel0.text = level2.toString();
                }, this);
            }
        }, this);
    }
}

type EquipsListItem = {key: string, icon: string, level: string, selected: number, filter?: egret.Filter[]};