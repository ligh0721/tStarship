class GunBuff extends Buff {
	private readonly fireCooldownA: number;
	private readonly bulletPowerA: number;
	private readonly bulletSpeedA: number;
	private readonly guns: Gun[] = [];

	public constructor(duration: number, fireCooldownA?: number, bulletPowerA?: number, bulletSpeedA?: number) {
		super(duration);
		this.fireCooldownA = fireCooldownA===undefined ? 0 : fireCooldownA;
		this.bulletPowerA = bulletPowerA===undefined ? 0 : bulletPowerA;
		this.bulletSpeedA = bulletSpeedA===undefined ? 0 : bulletSpeedA;
	}

	// override
	public onAddBuff(): void {
		for (let id in this.ship.guns) {
			let gun = this.ship.guns[id];
			gun.fireCooldown.addFactor({a: this.fireCooldownA});
			gun.bulletPower.addFactor({a: this.bulletPowerA});
			gun.bulletSpeed.addFactor({a: this.bulletSpeedA});
			this.guns.push(gun);
		}
	}

	// override
	public onRemoveBuff(): void {
		while (this.guns.length > 0) {
			let gun = this.guns.pop();
			gun.fireCooldown.subFactor({a: this.fireCooldownA});
			gun.bulletPower.subFactor({a: this.bulletPowerA});
			gun.bulletSpeed.subFactor({a: this.bulletSpeedA});
		}
	}
}