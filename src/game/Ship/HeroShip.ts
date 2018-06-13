class HeroShip extends Ship {
    hitRadius: number = 5;
    private hitRect: egret.Rectangle;
    power: number = 0;
    maxPower: number = 1000;
    heroHUD: IHeroHUD = null;
    skill: Skill = null;

    readonly parts: { [id: string]: Part } = {};
	partsNum: number = 0;
	partsMax: number = 4;

    readonly onPowerChangeTriggers: { [id: string]: Buff } = {};
    readonly onPowerEmptyTriggers: { [id: string]: Buff } = {};

	// from unit
	private onAddPartListener: (ship: Ship, part: Part)=>void = null;
	private onAddPartThisObject: any = null;

	// from unit
	private onRemovePartListener: (ship: Ship, part: Part)=>void = null;
	private onRemovePartThisObject: any = null;

    public constructor(model: string, scale?: number, key?: string) {
		super(model, scale, key);
        this.hero = true;
        this.hitRect===undefined ? this.hitRect=new egret.Rectangle() : this.hitRect.constructor();
        this.hitTestFlags = ShipHitTestType.Ship | ShipHitTestType.Supply;
	}

    public damaged(value: number, src: HpUnit): void {
		super.damaged(value, src);
        if (this.heroHUD) {
            this.heroHUD.updateHpBar(this.hp*100/this.maxHp);
        }
	}

    public addPower(value: number): void {
        for (let id in this.onPowerChangeTriggers) {
            let buff = this.onPowerChangeTriggers[id];
            value = buff.onPowerChange(value);
        }
        this.power += value;
        if (this.power > this.maxPower) {
            this.power = this.maxPower;
        }
        if (this.heroHUD) {
            this.heroHUD.updatePowerBar(this.power*100/this.maxPower);
        }
    }

    public clearPower(): void {
        this.power = 0;
        for (let id in this.onPowerEmptyTriggers) {
            let buff = this.onPowerEmptyTriggers[id];
            buff.onPowerEmpty();
        }
        if (this.heroHUD) {
            this.heroHUD.updatePowerBar(this.power*100/this.maxPower);
        }
    }

    public isPowerFull(): boolean {
        return this.power >= this.maxPower;
    }

    public setSkill(skill: Skill): Skill {
        skill.ship = this;
        this.skill = skill;
        return skill;
    }

    public castSkill(): boolean {
        if (this.skill == null) {
            return false;
        }
        this.clearPower();
        this.skill.cast();
        return true;
    }

    public move(x: number, y: number): void {
		if (!this.alive) {
			return;
		}
		this.moveTo(x, y, this.speed.value, true);
	}

    // override
    protected onCreate(): egret.DisplayObject {
        let ship = super.onCreate();
        
        let gameObject = new egret.DisplayObjectContainer();
        gameObject.width = ship.width;
        gameObject.height = ship.height;
        gameObject.anchorOffsetX = ship.anchorOffsetX;
        gameObject.anchorOffsetY = ship.anchorOffsetY;
        gameObject.addChild(ship);
        ship.x = ship.anchorOffsetX;
        ship.y = ship.anchorOffsetY;

        let hitRect = tutils.createBitmapByName("RedPixel_png");
        hitRect.width = this.hitRadius * 2;
        hitRect.height = hitRect.width;
        gameObject.addChild(hitRect);
        hitRect.x = ship.x-this.hitRadius;
        hitRect.y = ship.y-this.hitRadius;

        this.hitRect.width = hitRect.width;
        this.hitRect.height = hitRect.height;
        return gameObject;
    }

    // protected onCreate(): egret.DisplayObject {
	// 	let gameObject = new egret.Shape();
	// 	gameObject.graphics.lineStyle(10, 0x9cdcfe);
    //     gameObject.graphics.moveTo(this.width * 0.5, 0);
    //     gameObject.graphics.lineTo(0, this.height);
    //     gameObject.graphics.lineTo(this.width, this.height);
    //     gameObject.graphics.lineTo(this.width * 0.5, 0);
    //     gameObject.anchorOffsetX = this.width * 0.5;
    //     gameObject.anchorOffsetY = this.height * 0.5;
    //     gameObject.graphics.lineStyle(0);
    //     gameObject.graphics.beginFill(0x9cdcfe);
    //     gameObject.graphics.drawCircle(gameObject.anchorOffsetX, gameObject.anchorOffsetY, this.hitRadius);
    //     gameObject.graphics.endFill();
    //     this.hitRect.width = this.hitRadius * 2;
    //     this.hitRect.height = this.hitRadius * 2;
	// 	return gameObject;
	// }

    // override
    public hitTest(other: Unit): boolean {
        // this.hitRect.x = this.gameObject.x - this.hitRadius;
        // this.hitRect.y = this.gameObject.y - this.hitRadius;
		// return this.hitRect.intersects(other.getBounds());
        return other.getBounds().contains(this.gameObject.x, this.gameObject.y);
	}

    // override
    protected addTrigger(buff: Buff): void {
        super.addTrigger(buff);
		if (buff.triggerFlags & HeroShipTrigger.OnPowerChange) {
			this.onPowerChangeTriggers[buff.id] = buff;
		}
		if (buff.triggerFlags & HeroShipTrigger.OnPowerEmpty) {
			this.onPowerEmptyTriggers[buff.id] = buff;
		}
	}

    // override
	protected removeTrigger(buff: Buff): void {
		super.removeTrigger(buff);
        if (buff.triggerFlags & HeroShipTrigger.OnPowerChange) {
			delete this.onPowerChangeTriggers[buff.id];
		}
		if (buff.triggerFlags & HeroShipTrigger.OnPowerEmpty) {
			delete this.onPowerEmptyTriggers[buff.id];
		}
	}

	public addPart(part: Part): boolean {
		if (part.key) {
			// 如果buff存在名称，则处理覆盖逻辑
			for (let partId in this.parts) {
				let p = this.parts[partId];
				if (p.key == part.key) {
					this.removePart(p.id);
					break;
				}
			}
		}
		if (this.partsNum == this.partsMax) {
			return false;
		}
		
		part.id = this.world.nextId();
		part.ship = this;
		part.onAddPart();
		this.parts[part.id] = part;
		this.partsNum++;
		this.onAddPart(part);
		return true;
	}

	public removePart(id: string): void {
		let part = this.parts[id];
		if (part === undefined) {
			console.log('part('+id+') not found');
			return;
		}
		
		part.onRemovePart();
		part.ship = null;
		delete this.parts[id];
		this.partsNum--;
		this.onRemovePart(part);
	}

	public onAddPart(part: Part) {
		if (this.onAddPartListener != null) {
			this.onAddPartListener.call(this.onAddPartThisObject, this, part);
		}
	}

	public setOnAddPartListener(listener: (ship: Ship, part: Part)=>void, thisObject?: any) {
		this.onAddPartListener = listener;
		this.onAddPartThisObject = thisObject;
	}

	public onRemovePart(part: Part) {
		if (this.onRemovePartListener != null) {
			this.onRemovePartListener.call(this.onRemovePartThisObject, this, part);
		}
	}

	public setOnRemovePartListener(listener: (ship: Ship, part: Part)=>void, thisObject?: any) {
		this.onRemovePartListener = listener;
		this.onRemovePartThisObject = thisObject;
	}
}

enum HeroShipTrigger {
	// ext
	OnPowerChange = 1 << 20,
	OnPowerEmpty = 1 << 21
}