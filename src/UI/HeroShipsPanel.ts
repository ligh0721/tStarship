class HeroShipsPanel extends eui.Component {
    private fitHeightScroller: eui.Group;
    private shipDetail: eui.ViewStack;
    private lstShips: eui.List;
    private btnGo: eui.Button;
    private lblName: eui.Label;
    private lblGunDesc: eui.Label;

    private lblHpV: eui.Label;
    private lblPowerV: eui.Label;
    private lblFireRateV: eui.Label;
    private lblExpV: eui.Label;

    private progHp: eui.Rect;
    private progPower: eui.Rect;
    private progFireRate: eui.Rect;
    private progExp: eui.Rect;

    private curShipId: string;

	constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onUIComplete, this);
        this.skinName = "resource/custom_skins/HeroShipsPanelSkin.exml";
    }

    private onUIComplete(): void {
        this.progHp.percentWidth = 0;
        this.progPower.percentWidth = 0;
        this.progFireRate.percentWidth = 0;
        this.progExp.percentWidth = 0;

        this.updateList();
        this.height = egret.MainContext.instance.stage.stageHeight;
        this.fitHeightScroller.height = this.height - this.shipDetail.height - 135;
        this.lstShips.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTapListItem, this);
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnGo, this);
	}

    public updateList(): void {
        let firstUnlockedIndex = -1;
        let items: HeroShipsPanelListItem[] = [];
        let lockedItems: HeroShipsPanelListItem[] = [];
        for (let i in GameController.instance.allShips) {
            let shipId = GameController.instance.allShips[i];
            let shipData = GameController.instance.getShipDataById(shipId);
            let item: HeroShipsPanelListItem = {id: shipId, icon: shipData.model, level: "Locked", selected: null};

            let playerShipData = GameController.instance.getPlayerShipDataById(shipId);
            if (playerShipData) {
                // player ships
                let exp = playerShipData.exp;
                item.level = "Lv." + GameController.instance.expToLevel(exp);
                if (firstUnlockedIndex < 0) {
                    firstUnlockedIndex = items.length;
                }
                items.push(item);
            } else {
                // other ships
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
            this.curShipId = null;
            if (firstUnlockedIndex >= 0) {
                this.setListItemSelected(firstUnlockedIndex);
            } else {
                this.setListItemSelected(this.lstShips.selectedIndex);
            }
        }
    }

    private onTapListItem(e: eui.PropertyEvent): void {
        for (let i=0; i<this.lstShips.dataProvider.length; i++) {
            let item: HeroShipsPanelListItem = this.lstShips.dataProvider.getItemAt(i);
            item.selected = this.lstShips.selectedIndex===i ? true : null;
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

        let playerShipData = GameController.instance.getPlayerShipDataById(shipId);
        if (!playerShipData) {
            this.shipDetail.selectedIndex = 1;
            this.lblName.text = "未知";
            this.lblGunDesc.text = "未知";
            this.lblHpV.text = "--";
            this.lblPowerV.text = "--";
            this.lblFireRateV.text = "--";
            this.lblExpV.text = "--";
            this.progHp.percentWidth = 0;
            this.progPower.percentWidth = 0;
            this.progFireRate.percentWidth = 0;
            this.progExp.percentWidth = 0;
            this.btnGo.visible = false;
            return;
        }
        
        this.shipDetail.selectedIndex = 0;
        let shipData = GameController.instance.getShipDataById(shipId);
        this.btnGo.visible = true;
        this.lblName.text = shipData.name;
        this.lblGunDesc.text = shipData.gunName;
        this.lblHpV.text = shipData.maxHp.toString();
        this.lblPowerV.text = shipData.bulletPower.toString() + (shipData.bulletNum===1 ? "" : " x " + shipData.bulletNum.toString());
        this.lblFireRateV.text = (1000 / Math.max(1000/60, shipData.fireCD)).toFixed(2) + "/s";
        let level = GameController.instance.expToLevel(playerShipData.exp);
        let expText = "MAX";
        let expPerWidth = 100;
        if (level !== GameController.instance.expTable.length) {
            let expBase = level===1 ? 0 : GameController.instance.expTable[level-2];
            let expNext = GameController.instance.expTable[level-1];
            expPerWidth = (playerShipData.exp - expBase) * 100 / (expNext - expBase);
            expText = expPerWidth.toFixed(0) + "%";
        }
        this.lblExpV.text = expText;

        egret.Tween.removeTweens(this.progHp);
        egret.Tween.removeTweens(this.progPower);
        egret.Tween.removeTweens(this.progFireRate);
        egret.Tween.removeTweens(this.progExp);
        
        let tw = egret.Tween.get(this.progHp)
        tw.to({percentWidth: Math.min(100, shipData.maxHp * 100 / GlobalMaxHp)}, 200, egret.Ease.getPowOut(2));
        
        tw = egret.Tween.get(this.progPower)
        tw.to({percentWidth: Math.min(100, shipData.bulletPower * shipData.bulletNum * 100 / GlobalMaxPower)}, 200, egret.Ease.getPowOut(2));
        
        tw = egret.Tween.get(this.progFireRate)
        tw.to({percentWidth: Math.min(100, 100000 / shipData.fireCD / GlobalMaxFireRate)}, 200, egret.Ease.getPowOut(2));
        
        tw = egret.Tween.get(this.progExp)
        tw.to({percentWidth: expPerWidth}, 200, egret.Ease.getPowOut(2));
        // this.progHp.percentWidth = Math.min(100, shipData.maxHp * 100 / GlobalMaxHp);
        // this.progPower.percentWidth = Math.min(100, shipData.bulletPower * shipData.bulletNum * 100 / GlobalMaxPower);
        // this.progFireRate.percentWidth = Math.min(100, 100000 / shipData.fireCD / GlobalMaxFireRate);
        // this.progExp.percentWidth = expPerWidth;
    }

    private onBtnGo(event:egret.TouchEvent): void {
        GameController.instance.setBattleShips([this.curShipId]);
        GameController.instance.replaceRootLayerNextFrame(BattleLayer);
    }
}

type HeroShipsPanelListItem = {id: string, icon: string, level: string, selected: boolean};