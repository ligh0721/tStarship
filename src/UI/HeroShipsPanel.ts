class HeroShipsPanel extends eui.Component {
    fitHeightScroller: eui.Group;
    shipDetail: eui.Group;
    lstShips: eui.List;

	constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onUIComplete, this);
        this.skinName = "resource/custom_skins/HeroShipsPanelSkin.exml";
    }

    private onUIComplete(): void {
        this.initList();
	}

    private initList(): void {
        type DataItem = {id: string, icon: string, level: number, selected: string};
        let items: DataItem[] = [];
        let lockedItems: DataItem[] = [];
        for (let i in ShipManager.instance.allShips) {
            let shipId = ShipManager.instance.allShips[i];
            let shipData = ShipManager.instance.getShipDataItem(shipId);
            let item: DataItem = {id: shipId, icon: shipData.model, level: 1, selected: null};

            let playerShipData = PlayerPrefs.instance.data.ships[shipId];
            if (playerShipData !== undefined) {
                // player ships
                let exp = playerShipData.exp;
                item.level = ShipManager.instance.expToLevel(exp);
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
        
        this.lstShips.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTapListItem,this);
    }

    private onTapListItem(e: eui.PropertyEvent): void {
        //获取点击消息
        console.log(this.lstShips.selectedItem,this.lstShips.selectedIndex);
    }
}