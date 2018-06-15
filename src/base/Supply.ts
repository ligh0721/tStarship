class Supply extends Unit {
	readonly model: string;
	text: string = "";
	color: number = 0xffffff;
	status: UnitStatus = UnitStatus.Alive;
	speed: number = 20;
	pickDist: number = 150;
	pickSpeed: number = 150;

	public constructor(model?: string) {
		super();
		this.model = model;
	}

	// override
	protected onCreate(): egret.DisplayObject {
		let gameObject: egret.Bitmap;
		if (!this.gameObject) {
			gameObject = tutils.createBitmapByName(this.model);
		} else {
			gameObject = this.gameObject as egret.Bitmap;
			gameObject.texture = RES.getRes(this.model);
		}
		gameObject.width = 70;
		gameObject.height = 70;
		gameObject.anchorOffsetX = gameObject.width * 0.5;
    	gameObject.anchorOffsetY = gameObject.height * 0.5;
		return gameObject;
	}
	// protected onCreate(): egret.DisplayObject {
	// 	if (this.gameObject != null) {
	// 		return this.gameObject;
	// 	}

	// 	let gameObject = this.gameObject!=null ? <egret.Sprite>this.gameObject : new egret.Sprite();
	// 	let txt = new egret.TextField();
	// 	gameObject.addChild(txt);
	// 	txt.x = 8;
	// 	txt.y = 8;
	// 	txt.textColor = this.color;
	// 	txt.text = this.text;
	// 	let width = txt.textWidth + txt.x * 2;
	// 	let height = txt.textHeight + txt.y * 2;
	// 	gameObject.graphics.clear();
	// 	gameObject.graphics.lineStyle(5, this.color);
	// 	gameObject.graphics.drawRect(0, 0, width, height);
    //     gameObject.anchorOffsetX = width * 0.5;
    //     gameObject.anchorOffsetY = height * 0.5;
	// 	return gameObject;
	// }

	public get alive(): boolean {
		return this.status == UnitStatus.Alive;
	}

	// override
	public onHitShip(ship: Ship): void {
	}

	public drop(x: number, y: number, ease?: Function) {
		this.x = x;
		this.y = y;
		this.moveStraight(180, this.speed, true, ease);
		if (this.pickDist > 0) {
			this.moveToShip(null);
		}
	}

	public moveToShip(target: Ship) {
		let targetId = target==null ? 0 : target.id;
		let angleRaw = target==null ? 0 : Math.atan2(target.gameObject.y-this.gameObject.y, target.gameObject.x-this.gameObject.x);
		let thisId = this.id;
		let timer = new tutils.Timer();
		timer.setOnTimerListener((dt: number)=> {
			if (!this.alive || this.id != thisId || (target != null && (!target.alive || target.id != targetId))) {
				timer.stop();
				return;
			}
			if (target == null) {
				target = this.world.findNearestSupplyShip(this.gameObject.x, this.gameObject.y, this.pickDist);
				if (target == null) {
					return;
				} else {
					timer.interval = 0;
					targetId = target.id;
					egret.Tween.removeTweens(this.gameObject);
					this.stopAllActions();
				}
			}
			
			angleRaw = Math.atan2(target.gameObject.y-this.gameObject.y, target.gameObject.x-this.gameObject.x);
			let to = tutils.getDirectionPoint(this.gameObject.x, this.gameObject.y, angleRaw, dt*this.pickSpeed/tutils.SpeedFactor)
			this.gameObject.x = to.x;
			this.gameObject.y = to.y;
		}, this);
		timer.start(1000/100, true, 0);
	}
}
