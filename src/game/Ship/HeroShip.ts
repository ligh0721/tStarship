class HeroShip extends Ship {
    hitRadius: number = 5;
    private hitRect: egret.Rectangle;
    power: number = 0;
    maxPower: number = 1000;
    heroHUD: IHeroHUD = null;
    skill: Skill = null;

    public constructor(model: string, scale?: number) {
		super(model, scale);
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
        this.hitRect.width = this.hitRadius * 2;
        this.hitRect.height = this.hitRadius * 2;
        return super.onCreate();
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
        this.hitRect.x = this.gameObject.x - this.hitRadius;
        this.hitRect.y = this.gameObject.y - this.hitRadius;
		return this.hitRect.intersects(other.getBounds());
	}
}
