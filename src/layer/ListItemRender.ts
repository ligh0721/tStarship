class ListItemRender extends eui.ItemRenderer {
    private label: eui.Label;
    private ship: egret.DisplayObject;

	public constructor() {
        super();

        this.touchChildren = true;


        let ship = new egret.Shape();
        this.ship = ship;
        ship.graphics.lineStyle(5, 0xffffff);
        ship.graphics.drawRect(0, 0, 20, 20);

        let group = new eui.Group();
        group.addChild(ship);
        // group.verticalCenter = 0;
        this.addChild(group);


        this.label = new eui.Label();
        this.label.left = 100;
        this.label.verticalCenter = 0;
        this.addChild(this.label);
	}

    protected dataChanged():void{
        this.label.text = this.data.name;
    }
}
