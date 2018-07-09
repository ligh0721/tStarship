class SoundWaveBullet extends Bullet {
    width: number = 100;
    height: number = 40;
    
	public constructor(gun: Gun) {
		super(gun, "SoundWaveBullet_png");
	}

	protected onCreate(): egret.DisplayObject {
		if (this.gameObject !== undefined) {
			this.gameObject.width = this.width;
			this.gameObject.height = this.height;
			this.gameObject.anchorOffsetX = this.width * 0.5;
			this.gameObject.anchorOffsetY = this.height * 0.5;
			return this.gameObject;
		}
		let gameObject = this.createModel();
		gameObject.width = this.width;
		gameObject.height = this.height;
		gameObject.anchorOffsetX = this.width * 0.5;
		gameObject.anchorOffsetY = this.height * 0.5;
		return gameObject;
	}
}

class EnergyWaveBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "ShakeWaveBullet_png", 1.2);
	}

	// override
	public moveStraight(angle: number, speed: number, fixedRotation: boolean=false, ease?: Function, stackable: boolean=false) {
		if (fixedRotation !== true) {
			this.rotation = angle;
		}
		let toPos = Unit.getDirectionPoint(this.gameObject.x, this.gameObject.y, angle, tutils.LongDistance);
		let dur = tutils.LongDistance*tutils.SpeedFactor/speed;
		let act = new tutils.Speed(stackable===true ? new tutils.MoveTo2(dur, toPos.x, toPos.y, ease) : new tutils.MoveTo(dur, toPos.x, toPos.y, ease), 1);
		act.tag = 0;
		this.runAction(act);
	}

	// override
	public damaged(value: number, src: HpUnit, unit: HpUnit): void {
		super.damaged(value, src, unit);
		tutils.playSound("Explosion1_mp3");
		let act0 = GameController.instance.getActionByTag(this, 0) as tutils.Speed;
		if (!act0) {
			return;
		}
		act0.speed = 0.1;
		let act = new tutils.Sequence(
			new tutils.DelayTime(100),
			new tutils.CallFunc(():void=>{
				act0.speed = 1;
			}, this)
		);
		this.runAction(act);
	}
}

class EnergyWave2Bullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "ShakeWaveBullet2_png", 1.2);
	}
}

class RedEllipseBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "RedBullet1_png");
	}
}

class RedWaveBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "RedBullet2_png");
	}
}

class RedStarBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "RedBullet3_png");
	}
}

class RedDiamondBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "RedBullet4_png");
	}
}

class RedBallBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "RedBullet5_png");
	}
}

class BlueEllipseBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "BlueBullet1_png");
	}
}

class BlueWaveBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "BlueBullet2_png");
	}
}

class BlueStarBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "BlueBullet3_png");
	}
}

class BlueDiamondBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "BlueBullet4_png", 1.5);
	}
}

class BlueBallBullet extends Bullet {
	public constructor(gun: Gun) {
		super(gun, "BlueBullet5_png");
	}
}