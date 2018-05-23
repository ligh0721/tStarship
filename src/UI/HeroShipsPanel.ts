class HeroShipsPanel extends eui.Component {
    fitHeightScroller: eui.Group;
    shipDetail: eui.Group;
    lstShips: eui.List;
    btnGo: eui.Button;
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
        for (let i in ShipManager.instance.allShips) {
            let shipId = ShipManager.instance.allShips[i];
            let shipData = ShipManager.instance.getShipDataItem(shipId);
            let item: HeroShipsPanelListItem = {id: shipId, icon: shipData.model, level: "Lv.1", selected: null};

            let playerShipData = PlayerPrefs.instance.data.ships[shipId];
            if (playerShipData !== undefined) {
                // player ships
                let exp = playerShipData.exp;
                item.level = "Lv." + ShipManager.instance.expToLevel(exp);
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
        console.log(shipId);
    }

    private onTapBtnGo(event:egret.TouchEvent): void {
        let timer = new tutils.Timer();
        timer.setOnTimerListener((dt: number): void=>{
            
        }, this);
    }
}

type HeroShipsPanelListItem = {id: string, icon: string, level: string, selected: boolean};