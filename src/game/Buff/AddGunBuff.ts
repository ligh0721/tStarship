class AddGunBuff extends Buff {
	readonly guns: Gun[];

	public constructor(duration: number, guns: Gun[]) {
		super(duration);
		this.guns = guns;
	}

	// override
	public onAddBuff(): void {
		for (let i in this.guns) {
			let gun = this.guns[i];
			this.ship.addGun(gun).autoFire = true;
		}
	}

	// override
	public onRemoveBuff(): void {
		for (let i in this.guns) {
			let gun = this.guns[i];
			this.ship.removeGun(gun.id);
		}
	}
}

interface IFromGunBuff extends Buff {
	from: Gun
}

class AddGunAndBuffBuff extends AddGunBuff {
	readonly buffs: IFromGunBuff[];

	public constructor(duration: number, gun: Gun, buffs: IFromGunBuff[]) {
		super(duration, [gun]);
		this.buffs = buffs;
	}

	// override
	public onAddBuff(): void {
		let gun = this.guns[0];
		this.ship.addGun(gun).autoFire = true;
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			buff.from = gun;
			buff.reset();
			this.ship.addBuff(buff);
		}
	}

	// override
	public onRemoveBuff(): void {
		for (let i in this.buffs) {
			let buff = this.buffs[i];
			this.ship.removeBuff(buff.id);
		}
		let gun = this.guns[0];
		this.ship.removeGun(gun.id);
	}
}