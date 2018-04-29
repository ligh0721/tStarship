class Ship extends HpUnit {
	readonly width: number;
	readonly height: number;
	
	force: Force = new Force();
	guns: Gun[] = [];
	speed: number = 100;

	public constructor(width: number, height: number) {
		super();
		this.width = width;
		this.height = height;
	}

	public set(prop: any) {
		super.set(prop);
		if (prop.hasOwnProperty('force')) {
			this.force.force = prop['force'];
		}
		if (prop.hasOwnProperty('speed')) {
			this.speed = prop.speed;
		}
	}

	public addGun(gun: Gun): Gun {
		this.guns.push(gun);
		gun.ship = this;
		return gun
	}

	public move(x: number, y: number) {
		let xx = x-this.gameObject.x;
		let yy = y-this.gameObject.y;
		let dis = Math.sqrt(xx*xx+yy*yy);
        let dur = dis * tutils.SpeedFactor / this.speed;
        egret.Tween.removeTweens(this.gameObject);
        let tw = egret.Tween.get(this.gameObject);
        tw.to({x: x, y: y}, dur);
	}

	protected onCreate(): egret.DisplayObject {
		let gameObject = new egret.Shape();
		gameObject.graphics.lineStyle(10, 0xffffff);
        gameObject.graphics.moveTo(this.width * 0.5, 0);
        gameObject.graphics.lineTo(0, this.height);
        gameObject.graphics.lineTo(this.width, this.height);
        gameObject.graphics.lineTo(this.width * 0.5, 0);
        gameObject.anchorOffsetX = this.width * 0.5;
        gameObject.anchorOffsetY = this.height * 0.5;
		return gameObject;
	}

	protected onCleanup(): void {
		for (let i in this.guns) {
			let gun = this.guns[i];
			gun.cleanup();
		}
		super.onCleanup();
	}

	protected onDying(src: HpUnit) {
		console.assert(src instanceof Ship);
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.gameObject);
		this.world.onShipDying(this, <Ship>src);
		let tw = egret.Tween.get(this.gameObject);
		//tw.to({alpha: 0}, 500);
		tw.call(()=>{
			this.status = UnitStatus.Dead;
		}, this);
	}
}