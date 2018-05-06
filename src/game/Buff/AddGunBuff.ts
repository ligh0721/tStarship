class AddGunBuff extends Buff {
	readonly guns: Gun[];

	public constructor(duration: number, guns: Gun[]) {
		super(duration);
		this.guns = guns;
	}

	// override
	public onAddBuff(): void {
		//console.log('AddGunBuff::onAddBuff');
		for (let i in this.guns) {
			let gun = this.guns[i];
			this.ship.addGun(gun).autoFire = true;
		}
	}

	// override
	public onRemoveBuff(): void {
		//console.log('AddGunBuff::onRemoveBuff');
		for (let i in this.guns) {
			let gun = this.guns[i];
			//console.log('removeGun('+gun.id+')');
			this.ship.removeGun(gun.id);
		}
	}
}