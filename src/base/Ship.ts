class Ship extends HpUnit {
	width: number;
	height: number;
	readonly model: string;
	readonly modelScale: number;
	readonly key: string = null;
	
	force: Force;
	mainGun: Gun = null;
	readonly guns: { [id: string]: Gun } = {};
	readonly speed: Value;
	hero: boolean = false;  // can use supply

	public static readonly TimerInterval = 100;
	private readonly timer: tutils.ITimer;
	// private readonly buffTimerAct: tuitls.
	readonly buffs: { [id: string]: Buff } = {};
	buffsNum: number = 0;

	readonly onDamagedTriggers: { [id: string]: Buff } = {};
	readonly onDestroyTargetTriggers: { [id: string]: Buff } = {};

	ai: tutils.StateManager;

	hitTestFlags: ShipHitTestFlags = 0;  // Bullet only
	canHit: boolean = true;

	// from unit
	private onAddBuffListener: (ship: Ship, buff: Buff)=>void = null;
	private onAddBuffThisObject: any = null;

	// from unit
	private onRemoveBuffListener: (ship: Ship, buff: Buff)=>void = null;
	private onRemoveBuffThisObject: any = null;

	// from unit
	private onUpdateBuffListener: (ship: Ship, buff: Buff)=>void = null;
	private onUpdateBuffThisObject: any = null;

	public constructor(model: string, modelScale?: number, key?: string) {
		super();
		this.model = model;
		this.modelScale = modelScale===undefined ? 1.0 : modelScale;
		this.key = key;
		this.force===undefined ? this.force=new Force() : this.force.constructor();
		this.speed===undefined ? this.speed=new Value(100) : this.speed.constructor(100);
		this.timer===undefined ? this.timer=new tutils.TimerByAction(GameController.instance.actionManager) : this.timer.constructor(GameController.instance.actionManager);
		this.ai===undefined ? this.ai=new tutils.StateManager() : this.ai.constructor();
	}

	// override
	protected onCreate(): egret.DisplayObject {
		let gameObject = tutils.createBitmapByName(this.model);
		gameObject.width *= this.modelScale;
		gameObject.height *= this.modelScale;
        this.width = gameObject.width;
		this.height = gameObject.height;
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
		return gameObject;
	}

	// override
	protected onCleanup(): void {
		for (let i in this.guns) {
			let gun = this.guns[i];
			gun.cleanup();
		}
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			buff.cleanup();
		}
		if (this.timer.running) {
			this.timer.stop();
		}
		this.ai.stop();
		super.onCleanup();
	}

	// override
	protected onDying(src: HpUnit): void {
		if (src instanceof Ship) {
			src.$triggerOnDestroyTarget(this);
		}
		
		// egret.Tween.removeTweens(this);
		// egret.Tween.removeTweens(this.gameObject);
		this.stopAllActions();
		
		this.ai.stop();
		let world = this.world;
		world.onShipDying(this, src as Ship);
		let g: egret.Graphics = null;
		let from = 20;
		let to = (this.width + this.height) / 2;
		let effect = this.pools.newObject(ExplosionEffect, 20, to, "Explosion_png", this.gameObject);
		//let effect = new ExplosionEffect(20, to, "Explosion_png", this.gameObject);
		world.addEffect(effect);
		let tw = egret.Tween.get(effect);
		tw.to({value: effect.maximum}, 400, egret.Ease.getPowOut(3));
		tw.call(()=>{
			world.removeEffect(effect);
			this.pools.delObject(effect);
			this.status = UnitStatus.Dead;
		}, this);
		this.gameObject.visible = false;
	}

	// override
	public onHitEnemyShipTest(ship: Ship): boolean {
		return this.hitTest(ship);
	}

	protected addTrigger(buff: Buff): void {
		if (buff.triggerFlags & ShipTrigger.OnDamaged) {
			this.onDamagedTriggers[buff.id] = buff;
		}
		if (buff.triggerFlags & ShipTrigger.OnDestroyTarget) {
			this.onDestroyTargetTriggers[buff.id] = buff;
		}
	}

	protected removeTrigger(buff: Buff): void {
		if (buff.triggerFlags & ShipTrigger.OnDamaged) {
			delete this.onDamagedTriggers[buff.id];
		}
		if (buff.triggerFlags & ShipTrigger.OnDestroyTarget) {
			delete this.onDestroyTargetTriggers[buff.id];
		}
	}

	public $triggerOnDamaged(value: number, src: Ship): number {
		for (let id in this.onDamagedTriggers) {
			let buff = this.onDamagedTriggers[id];
			value = buff.onDamaged(value, src);
		}
		return value;
	}

	public $triggerOnDestroyTarget(target: Ship): void {
		for (let id in this.onDestroyTargetTriggers) {
			let buff = this.onDestroyTargetTriggers[id];
			buff.onDestroyTarget(target);
		}
	}

	public damaged(value: number, src: HpUnit): void {
		if (src instanceof Ship) {
			value = this.$triggerOnDamaged(value, src);
		}
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
		let gun = this.guns[id];
		if (gun === undefined) {
			console.log('gun('+id+') not found');
			return;
		}
		
		gun.cleanup();
		//gun.ship = null;
		delete this.guns[id];
		if (this.mainGun == gun) {
			this.mainGun = null;
		}
	}

	// override
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

	public addBuff(buff: Buff): Buff {
		if (buff.key) {
			// 如果buff存在名称，则处理覆盖逻辑
			for (let buffId in this.buffs) {
				let b = this.buffs[buffId];
				if (b.key == buff.key) {
					if (b.left < buff.duration) {
						b.left = Math.min(b.duration, buff.duration);
					}
					this.onUpdateBuff(b);
					return;
				}
			}
		}
		
		buff.id = this.world.nextId();
		buff.ship = this;
		buff.onAddBuff();
		this.buffs[buff.id] = buff;
		this.buffsNum++;
		this.addTrigger(buff);
		if (this.buffsNum > 0) {
			if (!this.timer.hasOnTimerListener()) {
				this.timer.setOnTimerListener(this.onTimer, this);
			}
			if (!this.timer.running) {
				this.timer.start(Ship.TimerInterval, false, 0);
			}
		}
		this.onAddBuff(buff);
		return buff;
	}

	public removeBuff(id: string): void {
		let buff = this.buffs[id];
		if (buff === undefined) {
			console.log('buff('+id+') not found');
			return;
		}
		
		buff.onRemoveBuff();
		buff.ship = null;
		delete this.buffs[id];
		this.buffsNum--;
		this.removeTrigger(buff);
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

	public onUpdateBuff(buff: Buff) {
		if (this.onUpdateBuffListener != null) {
			this.onUpdateBuffListener.call(this.onUpdateBuffThisObject, this, buff);
		}
	}

	public setOnUpdateBuffListener(listener: (ship: Ship, buff: Buff)=>void, thisObject?: any) {
		this.onUpdateBuffListener = listener;
		this.onUpdateBuffThisObject = thisObject;
	}
}

enum ShipTrigger {
	OnInterval = 1 << 0,
	OnDamaged = 1 << 1,
	OnDestroyTarget = 1 << 2,
}
type ShipTriggerFlags = number;

enum ShipHitTestType {
	Ship = 1 << 0,
	Supply = 1 << 1
}
type ShipHitTestFlags = number;