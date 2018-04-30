const ShipTimerInterval = 100;

class Ship extends HpUnit {
	readonly width: number;
	readonly height: number;
	
	force: Force = new Force();
	guns: { [key: string]: Gun } = {};
	speed: number = 100;
	hero: boolean = false;  // can use supply

	timer: egret.Timer = new egret.Timer(ShipTimerInterval, 0);;
	buffs: { [key: string]: Buff } = {};
	buffsNum: number = 0;

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

	public move(x: number, y: number) {
		if (!this.isAlive()) {
			return;
		}
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
		if (this.timer.running) {
			this.timer.stop();
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

	public onTimer(evt: egret.TimerEvent) {
		let toDelBuffs: Buff[] = [];
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			buff.left -= ShipTimerInterval;
			if (buff.left <= 0) {
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

	public removeGun(id: string) {
		if (!this.guns.hasOwnProperty(id)) {
			console.log('gun('+id+') not found');
			return;
		}
		let gun = this.guns[id];
		gun.cleanup();
		gun.ship = null;
		delete this.guns[id];
	}

	public addBuff(buff: Buff): Buff {
		buff.id = this.world.nextId();
		buff.owner = this;
		buff.onAddBuff();
		this.buffs[buff.id] = buff;
		this.buffsNum++;
		if (this.buffsNum > 0 && !this.timer.running) {
			this.timer.start();
		}
		return buff;
	}

	public removeBuff(id: string) {
		if (!this.buffs.hasOwnProperty(id)) {
			console.log('buff('+id+') not found');
			return;
		}
		let buff = this.buffs[id];
		buff.onRemoveBuff();
		buff.owner = null;
		delete this.buffs[id];
		this.buffsNum--;
		if (this.buffsNum <= 0 && this.timer.running) {
			this.timer.stop();
		}
	}
}