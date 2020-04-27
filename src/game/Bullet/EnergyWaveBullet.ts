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
