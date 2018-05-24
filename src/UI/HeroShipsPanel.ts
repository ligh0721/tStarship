class HeroShipsPanel extends eui.Component {
    fitHeightScroller: eui.Group;
    shipDetail: eui.ViewStack;
    lstShips: eui.List;
    btnGo: eui.Button;
    lblName: eui.Label;
    lblGunDesc: eui.Label;

    lblHpV: eui.Label;
    lblPowerV: eui.Label;
    lblFireRateV: eui.Label;
    lblExpV: eui.Label;

    progHp: eui.Rect;
    progPower: eui.Rect;
    progFireRate: eui.Rect;
    progExp: eui.Rect;

    private curShipId: string;

	constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onUIComplete, this);
        this.skinName = "resource/custom_skins/HeroShipsPanelSkin.exml";
    }

    protected createChildren(): void {
        super.createChildren();
    }

    private onUIComplete(): void {
        this.initList();
	}

    private initList(): void {
        let items: HeroShipsPanelListItem[] = [];
        let lockedItems: HeroShipsPanelListItem[] = [];
        for (let i in GameController.instance.allShips) {
            let shipId = GameController.instance.allShips[i];
            let shipData = GameController.instance.getShipDataById(shipId);
            let item: HeroShipsPanelListItem = {id: shipId, icon: shipData.model, level: "Locked", selected: null};

            let playerShipData = GameController.instance.playerData.ships[shipId];
            if (playerShipData !== undefined) {
                // player ships
                let exp = playerShipData.exp;
                item.level = "Lv." + GameController.instance.expToLevel(exp);
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

        this.lstShips.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTapListItem, this);
        this.setListItemSelected(0);

        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapBtnGo, this);
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
        this.lstShips.dispatchEventWith(eui.ItemTapEvent.ITEM_TAP); //, false, true);
    }

    private updateDetail(shipId: string): void {
        if (this.curShipId === shipId) {
            return;
        }
        this.curShipId = shipId;

        let playerShipData = GameController.instance.playerData.ships[shipId];
        if (playerShipData === undefined) {
            this.shipDetail.selectedIndex = 1;
            // this.lblName.text = "未知";
            // this.lblGunDesc.text = "未知";
            // this.lblHpV.text = "--";
            // this.lblPowerV.text = "--";
            // this.lblFireRateV.text = "--";
            // this.lblExpV.text = "--";
            // this.progHp.percentWidth = 0;
            // this.progPower.percentWidth = 0;
            // this.progFireRate.percentWidth = 0;
            // this.progExp.percentWidth = 0;
            // this.btnGo.visible = false;
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
        if (level === GameController.instance.expTable.length) {
            this.lblExpV.text = "MAX";
            this.progExp.percentWidth = 100;
        } else {
            let expBase = level===1 ? 0 : GameController.instance.expTable[level-2];
            let expNext = GameController.instance.expTable[level-1];
            this.progExp.percentWidth = (playerShipData.exp - expBase) * 100 / (expNext - expBase);
            this.lblExpV.text = this.progExp.percentWidth.toFixed(0) + "%";
        }
        this.progHp.percentWidth = Math.min(100, shipData.maxHp * 100 / GlobalMaxHp);
        this.progPower.percentWidth = Math.min(100, shipData.bulletPower * shipData.bulletNum * 100 / GlobalMaxPower);
        this.progFireRate.percentWidth = Math.min(100, 100000 / shipData.fireCD / GlobalMaxFireRate);
    }

    private onTapBtnGo(event:egret.TouchEvent): void {
        GameController.instance.setBattleShips([this.curShipId]);
        GameController.instance.replaceRootLayerNextFrame(BattleLayer);
    }
}

type HeroShipsPanelListItem = {id: string, icon: string, level: string, selected: boolean};