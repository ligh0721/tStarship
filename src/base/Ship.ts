class Ship extends HpUnit {
	readonly width: number;
	readonly height: number;
	
	force: Force;
	mainGun: Gun = null;
	readonly guns: { [id: string]: Gun };
	readonly speed: Value;
	hero: boolean = false;  // can use supply

	private readonly timer: tutils.Timer;
	readonly buffs: { [id: string]: Buff };
	buffsNum: number = 0;

	// from unit
	private onAddBuffListener: (ship: Ship, buff: Buff)=>void = null;
	private onAddBuffThisObject: any = null;

	// from unit
	private onRemoveBuffListener: (ship: Ship, buff: Buff)=>void = null;
	private onRemoveBuffThisObject: any = null;

	public constructor(width: number, height: number) {
		super();
		this.width = width;
		this.height = height;
		this.force===undefined ? this.force=new Force() : this.force.constructor();
		this.guns===undefined ? this.guns={} : this.guns.constructor();
		this.speed===undefined ? this.speed=new Value(100) : this.speed.constructor(100);
		this.timer===undefined ? this.timer=new tutils.Timer() : this.timer.constructor();
		this.buffs===undefined ? this.buffs={} : this.buffs.constructor();
	}

	public move(x: number, y: number): void {
		if (!this.isAlive()) {
			return;
		}
		let xx = x-this.gameObject.x;
		let yy = y-this.gameObject.y;
		let dis = Math.sqrt(xx*xx+yy*yy);
        let dur = dis * tutils.SpeedFactor / this.speed.value;
        egret.Tween.removeTweens(this);
        let tw = egret.Tween.get(this);
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
		if (this.timer.running) {
			this.timer.stop();
		}
		super.onCleanup();
	}

	protected onDying(src: HpUnit): void {
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

	public onTimer(dt: number): void {
		//console.log('onTimer: '+egret.getTimer());
		let toDelBuffs: Buff[] = [];
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			if (buff.step(dt) == false) {
				toDelBuffs.push(buff);
			}
		}
		for (let i in toDelBuffs) {
			let buff = toDelBuffs[i];
			this.removeBuff(buff.id);
		}
	}

	public addGun(gun: Gun, main?: boolean): Gun {
		gun.id = this.world.nextId();
		gun.ship = this;
		this.guns[gun.id] = gun;
		if (main == true) {
			this.mainGun = gun;
		}
		if (this.force.force == 1) {
			gun.bulletColor = 0x569cd6;
		}
		return gun;
	}

	public removeGun(id: string): void {
		if (!this.guns.hasOwnProperty(id)) {
			console.log('gun('+id+') not found');
			return;
		}
		let gun = this.guns[id];
		gun.cleanup();
		//gun.ship = null;
		delete this.guns[id];
		if (this.mainGun == gun) {
			this.mainGun = null;
		}
	}

	public addBuff(buff: Buff): Buff {
		buff.id = this.world.nextId();
		buff.ship = this;
		buff.onAddBuff();
		this.buffs[buff.id] = buff;
		this.buffsNum++;
		if (this.buffsNum > 0) {
			if (!this.timer.hasOnTimerListener()) {
				this.timer.setOnTimerListener(this.onTimer, this);
			}
			if (!this.timer.running) {
				this.timer.start(tutils.ShipTimerInterval, false, 0);
			}
		}
		this.onAddBuff(buff);
		return buff;
	}

	public removeBuff(id: string): void {
		if (!this.buffs.hasOwnProperty(id)) {
			console.log('buff('+id+') not found');
			return;
		}
		let buff = this.buffs[id];
		buff.onRemoveBuff();
		buff.ship = null;
		delete this.buffs[id];
		this.buffsNum--;
		if (this.buffsNum <= 0 && this.timer.running) {
			this.timer.stop();
		}
		this.onRemoveBuff(buff);
	}

	public onAddBuff(buff: Buff) {
		if (this.onAddBuffListener != null) {
			this.onAddBuffListener.call(this.onAddBuffThisObject, this, buff);
		}
	}

	public setOnAddBuffListener(listener: (ship: Ship, buff: Buff)=>void, thisObject?: any) {
		this.onAddBuffListener = listener;
		this.onAddBuffThisObject = thisObject;
	}

	public onRemoveBuff(buff: Buff) {
		if (this.onRemoveBuffListener != null) {
			this.onRemoveBuffListener.call(this.onRemoveBuffThisObject, this, buff);
		}
	}

	public setOnRemoveBuffListener(listener: (ship: Ship, buff: Buff)=>void, thisObject?: any) {
		this.onRemoveBuffListener = listener;
		this.onRemoveBuffThisObject = thisObject;
	}
}