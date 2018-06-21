class HeroShipsPanel extends eui.Component {
    private shipDetail: eui.ViewStack;
    private lstShips: eui.List;
    private btnStart: eui.Button;
    private lblName: eui.Label;
    private lblGunDesc: eui.Label;
    // private lblName2: eui.Label;
    // private lblGunDesc2: eui.Label;

    private lblHpV: eui.BitmapLabel;
    private lblPowerV: eui.BitmapLabel;
    private lblFireRateV: eui.BitmapLabel;
    private lblExpV: eui.BitmapLabel;
    private lblExp: eui.BitmapLabel;
    private imgIcon: eui.Image;

    private progHp: eui.Rect;
    private progPower: eui.Rect;
    private progFireRate: eui.Rect;
    private progExp: eui.Rect;

    private lblCoins: eui.BitmapLabel;
    private btnUnlock: eui.Button;
    private btnBack: eui.Button;

    private curShipId: string = null;

    // override
    protected createChildren(): void {
        super.createChildren();

        this.skinName = "resource/custom_skins/HeroShipsPanelSkinV2.exml";
        this.progHp.percentWidth = 0;
        this.progPower.percentWidth = 0;
        this.progFireRate.percentWidth = 0;
        this.progExp.percentWidth = 0;

        let playerData = GameController.instance.playerData;
        this.lblCoins.text = this.formatCoins(playerData.coins);

        this.updateList();
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height = egret.MainContext.instance.stage.stageHeight;
        this.lstShips.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTapListItem, this);
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnStart, this);
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBack, this);
        this.btnUnlock.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnUnlock, this);

        this.btnUnlock.icon = "coin2_png";
    }

    private formatCoins(coins: number): string {
        return coins.toString();
    }

    public updateList(): void {
        let unlockedSelectedIndex = -1;
        let firstUnlockedIndex = -1;
        let items: HeroShipsPanelListItem[] = [];
        let lockedItems: HeroShipsPanelListItem[] = [];
        for (let i in GameController.instance.allShips) {
            let shipId = GameController.instance.allShips[i];
            let shipData = GameController.instance.getShipDataByKey(shipId);
            let item: HeroShipsPanelListItem = {id: shipId, icon: shipData.model, level: "Locked", selected: 0};

            let playerShipData = GameController.instance.getPlayerShipDataByKey(shipId);
            if (playerShipData) {
                // player ships
                let exp = playerShipData.exp;
                item.level = GameController.instance.expToLevel(exp).toString();
                if (firstUnlockedIndex < 0) {
                    firstUnlockedIndex = items.length;
                }
                if (shipId == this.curShipId) {
                    unlockedSelectedIndex = items.length;
                }
                items.push(item);
            } else {
                // locked ships
                item.filter = [tutils.greyFilter()];
                lockedItems.push(item);
            }
        }

        for (let i in lockedItems) {
            let item = lockedItems[i];
            items.push(item);
        }

        this.lstShips.dataProvider = new eui.ArrayCollection(items);
        if (this.lstShips.selectedIndex < 0) {
            this.setListItemSelected(0);
        } else {
            // let playerShipData = GameController.instance.getPlayerShipDataById(this.curShipId);
            this.curShipId = null;
            if (unlockedSelectedIndex >= 0) {
                this.setListItemSelected(unlockedSelectedIndex);
            } else if (firstUnlockedIndex < 0) {
                this.setListItemSelected(this.lstShips.selectedIndex);
            } else {
                this.setListItemSelected(firstUnlockedIndex);
            }
        }
    }

    private onTapListItem(e: eui.PropertyEvent): void {
        for (let i=0; i<this.lstShips.dataProvider.length; i++) {
            let item: HeroShipsPanelListItem = this.lstShips.dataProvider.getItemAt(i);
            item.selected = this.lstShips.selectedIndex===i ? 1 : 0;
        }
        this.updateDetail(this.lstShips.selectedItem.id);
    }

    private setListItemSelected(index: number): void {
        this.lstShips.selectedIndex = index;
        this.onTapListItem(null);
    }

    private updateDetail(shipId: string): void {
        if (this.curShipId===shipId) {
            return;
        }
        this.curShipId = shipId;
        let shipData = GameController.instance.getShipDataByKey(shipId);
        let playerShipData = GameController.instance.getPlayerShipDataByKey(shipId);
        if (!playerShipData) {
            this.shipDetail.selectedIndex = 1;
            this.lblName.text = shipData.name;
            this.lblGunDesc.text = shipData.gunName;
            this.lblHpV.text = "--";
            this.lblPowerV.text = "--";
            this.lblFireRateV.text = "--";
            this.lblExpV.text = "--";
            this.progHp.percentWidth = 0;
            this.progPower.percentWidth = 0;
            this.progFireRate.percentWidth = 0;
            this.progExp.percentWidth = 0;
            this.btnStart.visible = false;

            // this.lblName2.text = shipData.name;
            // this.lblGunDesc2.text = shipData.gunName;
            let playerData = GameController.instance.playerData;
            this.btnUnlock.label = shipData.coins.toString();
            this.btnUnlock.enabled = playerData.coins>=shipData.coins;
            return;
        }
        
        this.shipDetail.selectedIndex = 0;
        this.btnStart.visible = true;
        this.lblName.text = shipData.name;
        this.lblGunDesc.text = shipData.gunName;
        this.lblHpV.text = shipData.maxHp.toString();
        this.lblPowerV.text = shipData.bulletPower.toString() + (shipData.bulletNum===1 ? "" : " x " + shipData.bulletNum.toString());
        this.lblFireRateV.text = (1000 / Math.max(1000/60, shipData.fireCD)).toFixed(1) + "/s";
        let level = GameController.instance.expToLevel(playerShipData.exp);
        let expText = "MAX";
        let expPerWidth = 100;
        if (level !== GameController.instance.expTable.length) {
            // 没满级
            let expBase = level===1 ? 0 : GameController.instance.expTable[level-2];
            let expNext = GameController.instance.expTable[level-1];
            expPerWidth = (playerShipData.exp - expBase) * 100 / (expNext - expBase);
            expText = expPerWidth.toFixed(0) + "%";
        }
        this.lblExpV.text = expText;
        this.lblExp.text = "Exp(Lv." + level + ")";
        this.imgIcon.source = shipData.model;

        egret.Tween.removeTweens(this.progHp);
        egret.Tween.removeTweens(this.progPower);
        egret.Tween.removeTweens(this.progFireRate);
        egret.Tween.removeTweens(this.progExp);
        
        let tw = egret.Tween.get(this.progHp)
        tw.to({percentWidth: Math.min(100, shipData.maxHp * 100 / GlobalMaxHp)}, 100, egret.Ease.getPowOut(2));
        
        tw = egret.Tween.get(this.progPower)
        tw.to({percentWidth: Math.min(100, shipData.bulletPower * shipData.bulletNum * 100 / GlobalMaxPower)}, 100, egret.Ease.getPowOut(2));
        
        tw = egret.Tween.get(this.progFireRate)
        tw.to({percentWidth: Math.min(100, 100000 / shipData.fireCD / GlobalMaxFireRate)}, 100, egret.Ease.getPowOut(2));
        
        tw = egret.Tween.get(this.progExp)
        tw.to({percentWidth: expPerWidth}, 100, egret.Ease.getPowOut(2));
        // this.progHp.percentWidth = Math.min(100, shipData.maxHp * 100 / GlobalMaxHp);
        // this.progPower.percentWidth = Math.min(100, shipData.bulletPower * shipData.bulletNum * 100 / GlobalMaxPower);
        // this.progFireRate.percentWidth = Math.min(100, 100000 / shipData.fireCD / GlobalMaxFireRate);
        // this.progExp.percentWidth = expPerWidth;
    }

    private onBtnStart(event: egret.TouchEvent): void {
        GameController.instance.setBattleShips([this.curShipId]);
        GameController.instance.replaceRootLayerNextFrame(BattleLayer);
    }

    private onBtnUnlock(event: egret.TouchEvent): void {
        let shipData = GameController.instance.getShipDataByKey(this.curShipId);
        let coins = shipData.coins;
        let playerData = GameController.instance.playerData;
        let dt = playerData.coins - coins;
        if (dt >= 0) {
            playerData.coins = dt;
            this.lblCoins.text = this.formatCoins(playerData.coins);
            GameController.instance.addNewHeroShip(this.curShipId);
            this.updateList();
            GameController.instance.showNewShipPanel(this.parent, {shipId: this.curShipId});
            GameController.instance.savePlayerData();
        } else {
            // 钱不够
        }
    }

    private onBtnBack(event: egret.TouchEvent): void {
        egret.localStorage.clear();
    }
}

type HeroShipsPanelListItem = {id: string, icon: string, level: string, selected: number, filter?: egret.Filter[]};