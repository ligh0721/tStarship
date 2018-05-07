class ExplosionGun extends Gun {
	// override
	protected onFire(): void {
		tutils.playSound("ExplosionGunShoot_mp3");
	}
}
