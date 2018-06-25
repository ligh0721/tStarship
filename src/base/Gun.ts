class Gun extends egret.HashObject {
	id: string;
	ship: Ship;
	readonly fireCooldown: Value;
	readonly bulletPower: Value;
	bulletNum: number = 1;
	bulletPowerLossPer: number = 1.0;  // 子弹能量下降系数
	readonly bulletPowerLossInterval: Value;  // 子弹能量下降时间间隔
	readonly bulletSpeed: Value;
	bulletType: new(gun: Gun)=>Bullet = Bullet;
	bulletColor: number = 0xffffff;
	private $bulletLeft: number = -1;  // 可发射的剩余子弹数，-1为无限

	private $autoFire: boolean = false;
	private autoFireTimer: tutils.ITimer;

	// private seqAct: tutils.Sequence;

	level: number = 1;

	public constructor() {
		super();
		this.fireCooldown===undefined ? this.fireCooldown=new Value(500, 0, 10000) : this.fireCooldown.constructor(500, 50, 1000);
		this.bulletPower===undefined ? this.bulletPower=new Value(1, 1, tutils.LargeNumber) : this.bulletPower.constructor(1, 1, tutils.LargeNumber);
		this.bulletPowerLossInterval===undefined ? this.bulletPowerLossInterval=new Value(500, 100) : this.bulletPowerLossInterval.constructor(500, 100);
		this.bulletSpeed===undefined ? this.bulletSpeed=new Value(50, 0, 200) : this.bulletSpeed.constructor(50, 0, 200);
		this.autoFireTimer===undefined ? this.autoFireTimer=new tutils.TimerByAction(GameController.instance.actionManager) : this.autoFireTimer.constructor(GameController.instance.actionManager);
	}

	public setBulletType<BulletType extends Bullet>(bulletType: new(gun: Gun)=>BulletType) {
		this.bulletType = bulletType;
	}

	public static createGun<GunType extends Gun, BulletType extends Bullet>(gunType: new()=>GunType, bulletType?: new(gun: Gun)=>BulletType): GunType {
		let gun = new gunType();
		if (bulletType != undefined) {
			gun.setBulletType(bulletType);
		}
		return gun;
	}

	public createBulletWithType<BulletType extends Bullet>(bulletType: new(gun: Gun)=>BulletType): BulletType {
		//let bullet = new bulletType(this);
		let bullet = this.ship.pools.newObject(bulletType, this);
		//bullet.reset();
		//bullet.setGun(this);
		return bullet;
	}

	public createBullet(): Bullet {
		//let bullet = new this.bulletType(this);
		let bullet = this.ship.pools.newObject(this.bulletType, this);
		return bullet;
	}

	public addBulletToWorld(bullet: Bullet): Bullet {
		return this.ship.world.addBullet(bullet);
	}

	protected fireBulletStraight(bullet: Bullet, angle?: number, fixedRotation?: boolean, ease?: Function) {
		bullet.moveStraight(angle===undefined?this.ship.rotation:angle, this.bulletSpeed.value, fixedRotation, ease)
	}

	public fire(): void {
		if (this.ship == null || !this.ship.alive) {
			return;
		}
		this.playFireSound();
		let firePos = this.getFirePosition();
		let bullet = this.createBullet();
		this.addBulletToWorld(bullet)
		bullet.x = firePos.x;
		bullet.y = firePos.y;
		this.fireBulletStraight(bullet);
	}

	public get autoFire(): boolean {
		return this.$autoFire;
	}

	public set autoFire(value: boolean) {
		if (this.ship == null || !this.ship.alive) {
			this.autoFireTimer.stop();
			return;
		}
		if (this.autoFireTimer.running) {
			this.autoFireTimer.stop();
		}
		if (this.$autoFire == value) {
			return;
		}
		this.$autoFire = value;
		if (value) {
			if (!this.autoFireTimer.hasOnTimerListener()) {
				this.autoFireTimer.setOnTimerListener((dt: number): void => {
					if (this.ship == null || !this.ship.alive) {
						this.autoFireTimer.stop();
						return;
					}
					if (this.$bulletLeft != 0) {
						this.fire();
						if (this.$bulletLeft > 0) {
							this.$bulletLeft--;
							if (this.$bulletLeft == 0) {
								this.autoFireTimer.stop();
							}
						}
					}
					if (this.autoFireTimer.interval != this.fireCooldown.value) {
						this.autoFireTimer.interval = this.fireCooldown.value
					}
				}, this);
			}
			if (this.$bulletLeft != 0) {
				this.autoFireTimer.start(this.fireCooldown.value, true, 0);
			}
		}
	}

	// public set autoFire(value: boolean) {
	// 	if (this.$autoFire == value) {
	// 		return;
	// 	}
	// 	this.$autoFire = value;
	// 	if (value) {
	// 		this.startFireAction();
	// 	} else {
	// 		GameController.instance.actionManager.removeAllActions(this);
	// 	}
	// }

	// private startFireAction(): void {
	// 	this.seqAct = new tutils.Sequence(
	// 		new tutils.CallFunc(():void=>{
	// 			if (this.ship == null || !this.ship.alive) {
	// 				GameController.instance.actionManager.removeAllActions(this);
	// 				return;
	// 			}
	// 			if (this.$bulletLeft != 0) {
	// 				this.fire();
	// 				if (this.$bulletLeft > 0) {
	// 					this.$bulletLeft--;
	// 					if (this.$bulletLeft == 0) {
	// 						// this.autoFireTimer.stop();
	// 						GameController.instance.actionManager.removeAllActions(this);
	// 					}
	// 				}
	// 			}
	// 			if (this.seqAct.two.duration !== this.fireCooldown.value) {
	// 				this.seqAct.two.duration = this.fireCooldown.value;
	// 				this.seqAct.recalcDuration();
	// 			}
	// 		}, this),
	// 		new tutils.DelayTime(this.fireCooldown.value)
	// 	);
	// 	let act = new tutils.RepeatForever(this.seqAct);
	// 	GameController.instance.actionManager.addAction(this, act);
	// }

	public get bulletLeft(): number {
		return this.$bulletLeft;
	}

	public set bulletLeft(value: number) {
		this.$bulletLeft = value;
		if (value != 0 && this.$autoFire && !this.autoFireTimer.running) {
			this.autoFireTimer.start(this.fireCooldown.value, true, 0);
		}
	}

	// public set bulletLeft(value: number) {
	// 	if (value!=0 && this.$autoFire && this.$bulletLeft==0) {
	// 		this.startFireAction();
	// 	}
	// 	this.$bulletLeft = value;
	// }

	public cleanup(): void {
		this.autoFireTimer.stop();
		// egret.Tween.removeTweens(this);
		this.onCleanup();
		GameController.instance.actionManager.removeAllActions(this);
	}

	// override
	protected playFireSound(): void {
		if (this.ship.hero) {
			tutils.playSound("GunShoot_mp3");
		}
	}

	// override
	protected onCleanup(): void {
	}

	protected getFirePosition(): {x: number, y: number} {
		return Unit.getDirectionPoint(this.ship.x, this.ship.y, this.ship.rotation, this.ship.height*0.5);
	}

	public levelUp(num: number=1, sound: boolean=true): void {
		if (num === 0) {
			return;
		}
		for (let i=0; i<num; i++) {
			this.level++;
			this.onLevelUp();
		}
		if (sound) {
			tutils.playSound("GunPowerup_mp3");
		}
	}

	// override
	protected onLevelUp(): void {
		this.bulletPower.baseValue++;
	}
}
