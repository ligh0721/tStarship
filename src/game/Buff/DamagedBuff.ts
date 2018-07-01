class ShieldBuff extends Buff {
	maxShield: number;
	shield: number;
	gameObject: egret.Bitmap = null;
	heroHUD: IHeroHUD = null;

	
	public constructor(duration: number, maxShield: number) {
		super(duration, ShipTrigger.OnDamaged);
		this.maxShield = maxShield;
		this.shield = maxShield;
	}

	// override
	public onAddBuff(): void {
		this.shield = this.maxShield;
		if (this.ship.gameObject instanceof egret.DisplayObjectContainer) {
			let parent = this.ship.gameObject as egret.DisplayObjectContainer;
			this.gameObject = tutils.createBitmapByName("Shield_png");
			let d = Math.sqrt(this.ship.width*this.ship.width+this.ship.height+this.ship.height)*1.5;
			this.gameObject.width = d;
			this.gameObject.height = d;
			this.gameObject.anchorOffsetX = d * 0.5;
			this.gameObject.anchorOffsetY = d * 0.5;
			this.ship.gameObject.addChild(this.gameObject);
			this.gameObject.x = this.ship.width * 0.5;
			this.gameObject.y = this.ship.height * 0.5;
			this.gameObject.scaleX = 0;
			this.gameObject.scaleY = 0;
			this.gameObject.alpha = 0;
			let act = new tutils.To(1000, {scaleX: 1, scaleY: 1, alpha: 1}, egret.Ease.backIn);
			GameController.instance.runAction(this.gameObject, act);
		}
		if (this.ship instanceof HeroShip) {
			this.heroHUD = this.ship.heroHUD;
			this.heroHUD.updateShieldBar(this.shield, this.maxShield);
		}
	}

	// override
	public onRemoveBuff(): void {
		if (this.heroHUD){
			this.heroHUD.updateShieldBar(this.shield, 0);
		}
		if (this.gameObject && this.ship.gameObject instanceof egret.DisplayObjectContainer) {
			let parent = this.ship.gameObject;
			let act = new tutils.Sequence(
				new tutils.To(1000, {scaleX: 0, scaleY: 0, alpha: 0}, egret.Ease.backOut),
				new tutils.CallFunc(():void=>{
					parent.removeChild(this.gameObject);
					this.gameObject = null;
				}, this)
			);
			GameController.instance.stopAllActions(this.gameObject);
			GameController.instance.runAction(this.gameObject, act);
		}
	}

	// override
	public onDamaged(value: number, src: HpUnit, unit: HpUnit): number {
		let dt = value - this.shield;
		if (dt > 0) {
			value = dt;
			this.shield = 0;
		} else {
			this.shield = -dt;
			value = 0;
		}
		if (this.heroHUD) {
			this.heroHUD.updateShieldBar(this.shield, this.maxShield);
		}
		if (this.shield<=0) {
			this.ship.removeBuff(this.id);
		}
		return value;
	}
}

class ElecBuff extends Buff {
	power: number;

	public constructor(duration:number, power: number) {
		super(duration, ShipTrigger.OnDamaged);
		this.power = power;
	}

	// override
	public onDamaged(value: number, src: Ship, unit: HpUnit): number {
		let power = this.power * (Math.random() * 0.3 + 0.85);
		value += power;
		let x = (Math.random() * 0.6 - 0.3) * this.ship.width;
		let y = (Math.random() * 0.6 - 0.3) * this.ship.height;
		GameController.instance.hud.addBattleTip(this.ship.x+x, this.ship.y+y, "-"+power.toFixed(0), 360, "FranklinGothicHeavyItalicBlue_fnt", 0.6);
		// TODO: effect
		return value;
	}
}

class FactorDamageBuff extends Buff {
	factor: number;

	public constructor(duration:number, factor: number) {
		super(duration, ShipTrigger.OnDamaged);
		this.factor = factor;
	}

	// override
	public onDamaged(value: number, src: Ship, unit: HpUnit): number {
		value *= this.factor;
		return value;
	}
}

class CoinsDropBuff extends Buff {
	rate: number;
	dropTable: DropTable<any>;

	public constructor(duration:number, rate: number, dropTable: DropTable<any>) {
		super(duration, ShipTrigger.OnDamaged);
		this.rate = rate;
		this.dropTable = dropTable;
	}

	// override
	public onDamaged(value: number, src: Ship, unit: HpUnit): number {
		if (Math.random() < this.rate) {
			let dropTable = this.dropTable || this.ship.dropTable;
			if (dropTable) {
				let dropKey = this.ship.dropTable.randomR();
				GameController.instance.spawnSupply(this.ship.world, dropKey, this.ship.x, this.ship.y, true);
			}
		}
		return value;
	}
}