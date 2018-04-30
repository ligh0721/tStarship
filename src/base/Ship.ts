class Ship extends HpUnit {
	readonly width: number;
	readonly height: number;
	
	force: Force = new Force();
	readonly guns: { [key: string]: Gun } = {};
	readonly speed: Value = new Value(100);
	hero: boolean = false;  // can use supply

	private readonly timer: tutils.Timer = new tutils.Timer();
	readonly buffs: { [key: string]: Buff } = {};
	buffsNum: number = 0;

	public constructor(width: number, height: number) {
		super();
		this.width = width;
		this.height = height;
	}

	public set(prop: any): void {
		super.set(prop);
		if (prop.hasOwnProperty('force')) {
			this.force.force = prop['force'];
		}
		if (prop.hasOwnProperty('speed')) {
			this.speed.baseValue = prop.speed;
		}
	}

	public move(x: number, y: number): void {
		if (!this.isAlive()) {
			return;
		}
		let xx = x-this.gameObject.x;
		let yy = y-this.gameObject.y;
		let dis = Math.sqrt(xx*xx+yy*yy);
        let dur = dis * tutils.SpeedFactor / this.speed.value;
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

	public addGun(gun: Gun): Gun {
		gun.id = this.world.nextId();
		gun.ship = this;
		this.guns[gun.id] = gun;
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
	}
}