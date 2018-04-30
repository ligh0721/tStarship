class AddGunBuff extends Buff {
	readonly guns: Gun[] = [];

	// override
	public onAddBuff() {
		//console.log('onAddBuff '+egret.getTimer());
		for (let i in this.guns) {
			let gun = this.guns[i];
			this.ship.addGun(gun).autoFire = true;
			this.guns[0].fireCooldown.sub({a: 0.50});
		}
	}

	// override
	public onRemoveBuff() {
		//console.log('onRemoveBuff '+egret.getTimer());
		for (let i in this.guns) {
			let gun = this.guns[i];
			this.ship.removeGun(gun.id);
			this.guns[0].fireCooldown.add({a: 0.50});
		}
	}
}