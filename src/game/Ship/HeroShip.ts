class HeroShip extends Ship {
    hitRadius: number = 5;
    private hitRect: egret.Rectangle;
    power: number = 0;
    maxPower: number = 100;
    heroHpBar: ShapeProgress = null;
    heroPowerBar: ShapeProgress = null;
    skill: Skill = null;

    public constructor(width: number, height: number) {
		super(width, height);
        this.hero = true;
        this.hitRect===undefined ? this.hitRect=new egret.Rectangle() : this.hitRect.constructor();
	}

    public damaged(value: number, src: HpUnit): void {
		super.damaged(value, src);
        if (this.heroHpBar) {
            this.heroHpBar.percent = this.hp / this.maxHp;
        }
	}

    public addPower(value: number): void {
        this.power += value;
        if (this.power > this.maxPower) {
            this.power = this.maxPower;
        }
        if (this.heroPowerBar) {
            this.heroPowerBar.percent = this.power / this.maxPower;
        }
    }

    public clearPower(): void {
        this.power = 0;
        if (this.heroPowerBar) {
            this.heroPowerBar.percent = this.power / this.maxPower;
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

    protected onCreate(): egret.DisplayObject {
        let gameObject = tutils.createBitmapByName("Hero_png");
        this.width = gameObject.width;
		this.height = gameObject.height;
		gameObject.anchorOffsetX = gameObject.width * 0.5;
		gameObject.anchorOffsetY = gameObject.height * 0.5;
        // gameObject.scaleX *= 2;
        // gameObject.scaleY *= 2;
        return gameObject;
    }

    public hitTest(other: Unit): boolean {
        this.hitRect.x = this.gameObject.x - this.hitRadius;
        this.hitRect.y = this.gameObject.y - this.hitRadius;
		return this.hitRect.intersects(other.getBounds());
	}
}
