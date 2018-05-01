class BossHpProgress extends ShapeProgress {
	readonly ship: Ship;
	public showing: boolean = true;

	public constructor(layer: egret.DisplayObjectContainer, ship: Ship, color: number) {
		super(layer, ProgressType.LeftToRigh, layer.stage.stageWidth-20, 50, color, color);
		this.ship = ship;
		this.gameObject.x = 10;
		this.gameObject.y = 10;
		this.percent = 0;
	}

	public show() {
		this.showing = true;
		let tw = egret.Tween.get(this);
		tw.to({percent: 1}, 2000);
		tw.call(()=>{
			this.showing = false;
			this.percent = Math.max(this.ship.hp/this.ship.maxHp, 0);
		}, this);
	}
}
