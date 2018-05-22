class Ship extends HpUnit {
	width: number;
	height: number;
	private model: string;
	private scale: number;
	
	force: Force;
	mainGun: Gun = null;
	readonly guns: { [id: string]: Gun };
	readonly speed: Value;
	hero: boolean = false;  // can use supply

	private readonly timer: tutils.Timer;
	readonly buffs: { [id: string]: Buff };
	buffsNum: number = 0;

	ai: tutils.StateManager;

	// from unit
	private onAddBuffListener: (ship: Ship, buff: Buff)=>void = null;
	private onAddBuffThisObject: any = null;

	// from unit
	private onRemoveBuffListener: (ship: Ship, buff: Buff)=>void = null;
	private onRemoveBuffThisObject: any = null;

	public constructor(model: string, scale?: number) {
		super();
		this.model = model;
		this.scale = scale===undefined ? 1.0 : scale;
		this.force===undefined ? this.force=new Force() : this.force.constructor();
		this.guns===undefined ? this.guns={} : this.guns.constructor();
		this.speed===undefined ? this.speed=new Value(100) : this.speed.constructor(100);
		this.timer===undefined ? this.timer=new tutils.Timer() : this.timer.constructor();
		this.buffs===undefined ? this.buffs={} : this.buffs.constructor();
		this.ai===undefined ? this.ai=new tutils.StateManager() : this.ai.constructor();
	}

	protected onCreate(): egret.DisplayObject {
		let gameObject = tutils.createBitmapByName(this.model);
		gameObject.width *= this.scale;
		gameObject.height *= this.scale;
        this.width = gameObject.width;
		this.height = gameObject.height;
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
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
		this.status = UnitStatus.Dying;
		//console.assert(src instanceof Ship);
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.gameObject);
		this.ai.stop();
		this.world.onShipDying(this, <Ship>src);
		let tw: egret.Tween;
		let g: egret.Graphics = null;
		let from = 20;
		let to = (this.width + this.height) / 2;
		if (this.gameObject instanceof egret.Shape) {
			g = this.gameObject.graphics;
		} else if (this.gameObject instanceof egret.Sprite) {
			g = this.gameObject.graphics;
		} else if (this.gameObject instanceof egret.Bitmap) {
			let effect = this.pools.newObject(ExplosionEffect, 20, to, "Explosion_png", this.gameObject);
			this.gameObject.parent.addChild(effect.gameObject);
			tw = egret.Tween.get(effect);
			tw.to({value: effect.maximum}, 400, egret.Ease.getPowOut(3));
			tw.call(()=>{
				this.gameObject.parent.removeChild(effect.gameObject);
				this.pools.delObject(effect);
			}, this);
			this.gameObject.visible = false;
		}

		if (g != null) {
			g.clear();
			g.lineStyle(5, 0xff2916);
			g.beginFill(0xfef23b, 1);
			g.drawCircle(this.gameObject.anchorOffsetX, this.gameObject.anchorOffsetY, to);
			g.endFill();
			this.gameObject.scaleX = from / to;
			this.gameObject.scaleY = this.gameObject.scaleX;
			let effect = this.pools.newObject(Effect, 20, to);
			effect.setOnChanged((effect: Effect):void=>{
				this.gameObject.scaleX = effect.value / effect.maximum;
				this.gameObject.scaleY = this.gameObject.scaleX;
				this.gameObject.alpha = 1 - (effect.value - effect.minimum) / (effect.maximum - effect.minimum);
			}, this);
			tw = egret.Tween.get(effect);
			tw.to({value: effect.maximum}, 400, egret.Ease.getPowOut(3));
			tw.call(()=>{
				this.pools.delObject(effect);
			}, this);
		} else if (!tw) {
			tw = egret.Tween.get(this.gameObject);
		}
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

	public damaged(value: number, src: HpUnit): void {
		
		super.damaged(value, src);
	}

	// main=false
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