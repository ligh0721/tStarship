class HeroShipsPanel extends eui.Component {
    fitHeightScroller: eui.Group;
    shipDetail: eui.Group;
    lstShips: eui.List;
    btnGo: eui.Button;
    lblName: eui.Label;
    lblGunDesc: eui.Label;

    private curShipId: string;

	constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onUIComplete, this);
        this.skinName = "resource/custom_skins/HeroShipsPanelSkin.exml";
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
            let item: HeroShipsPanelListItem = {id: shipId, icon: shipData.model, level: "Lv.1", selected: null};

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
        
        let shipData = GameController.instance.getShipDataById(shipId);
        this.lblName.text = shipData.name;
        this.lblGunDesc.text = shipData.gunName;
    }

    private onTapBtnGo(event:egret.TouchEvent): void {
        GameController.instance.setBattleShips([this.curShipId]);
        GameController.instance.replaceRootLayerNextFrame(BattleLayer);
    }
}

type HeroShipsPanelListItem = {id: string, icon: string, level: string, selected: boolean};