class Unit extends egret.HashObject implements tutils.INode {
	gameObject: egret.DisplayObject;
	id: string;
	world: World;
	pools: tutils.ObjectPools;
	staticBounds: boolean = true;
	private boundsRect: egret.Rectangle;
	protected boundsDirty: boolean = true;
	private waitToRemove: boolean = false;

	public constructor() {
		super();
		this.boundsRect===undefined ? this.boundsRect=new egret.Rectangle() : this.boundsRect.constructor();
	}

	public cleanup() {
		this.onCleanup();
	}

	public get x(): number {
		return this.gameObject.x;
	}

	public set x(value: number) {
		this.gameObject.x = value;
	}

	public get y(): number {
		return this.gameObject.y;
	}

	public set y(value: number) {
		this.gameObject.y = value;
	}

	public get rotation(): number {
		return this.gameObject.rotation;
	}

	public set rotation(value: number) {
		this.gameObject.rotation = value;
		this.boundsDirty = true;
	}

	public get scale(): number {
		return this.gameObject.scaleX;
	}

	public set scale(value: number) {
		this.gameObject.scaleX = this.gameObject.scaleY = value;
	}

	public get alpha(): number {
		return this.gameObject.alpha;
	}

	public set alpha(value: number) {
		this.gameObject.alpha = value;
	}

	public getBounds(): egret.Rectangle {
		if (!this.staticBounds || this.boundsDirty) {
			this.boundsRect = this.gameObject.getBounds();
		}
		this.boundsRect.x = this.gameObject.x - this.gameObject.width * 0.5;
		this.boundsRect.y = this.gameObject.y - this.gameObject.height * 0.5;
		return this.boundsRect;
	}

	// override
	protected onCreate(): egret.DisplayObject {
		return this.gameObject;
	}

	// override
	public onAddToWorld(): void {
		this.gameObject = this.onCreate();
		this.pools = this.world.pools;
	}

	public get inWorld(): boolean {
		return this.world != null;
	}

	// override
	protected onCleanup(): void {
		// egret.Tween.removeTweens(this);
		// egret.Tween.removeTweens(this.gameObject);
		GameController.instance.actMgr.removeAllActions(this);
	}

	// override
	public hitTest(other: Unit): boolean {
		return this.getBounds().intersects(other.getBounds());
	}

	public static getDirectionPoint(x: number, y: number, angle: number, dis: number): {x: number, y: number} {
		return tutils.getDirectionPoint(x, y, (angle-90)/tutils.DegPerRad, dis);
	}

	public static getForwardPoint(x0: number, y0: number, x1: number, y1: number, dis: number): {x: number, y: number} {
		let a = Math.atan2(y1-y0, x1-x0)
		return tutils.getDirectionPoint(x0, y0, a, dis);
	}

	public getDirectionPoint(dis: number, angle?: number): {x: number, y: number} {
		return tutils.getDirectionPoint(this.gameObject.x, this.gameObject.y, ((angle===undefined ? this.rotation : angle)-90)/tutils.DegPerRad, dis);
	}

	public getForwardPoint(x: number, y: number, dis: number): {x: number, y: number} {
		let a = Math.atan2(y-this.gameObject.y, x-this.gameObject.x);
		return tutils.getDirectionPoint(this.gameObject.x, this.gameObject.y, a, dis);
	}

	public getDistance(x: number, y: number) {
		let dtx = this.gameObject.x - x;
		let dty = this.gameObject.y - y;
		return Math.sqrt(dtx*dtx+dty*dty);
	}

	public getAngle(x: number, y: number) {
		let angle = Math.atan2(y-this.gameObject.y, x-this.gameObject.x) * tutils.DegPerRad + 90;
		let dt = angle - this.rotation;
		if (dt > 180) {
			angle -= 360;
		} else if (dt < -180) {
			angle += 360;
		}
		return angle;
	}

	public runAction(action: tutils.Action): void {
		GameController.instance.actMgr.addAction(this, action);
	}

	public stopAllActions(): void {
		GameController.instance.actMgr.removeAllActions(this);
	}

	public moveStraight(angle: number, speed: number, fixedRotation: boolean=false, ease?: Function, stackable: boolean=false) {
		if (fixedRotation !== true) {
			this.rotation = angle;
		}
		let toPos = Unit.getDirectionPoint(this.gameObject.x, this.gameObject.y, angle, tutils.LongDistance);
		let dur = tutils.LongDistance*tutils.SpeedFactor/speed;
		let act = stackable===true ? new tutils.MoveTo2(dur, toPos.x, toPos.y, ease) : new tutils.MoveTo(dur, toPos.x, toPos.y, ease);
		this.runAction(act);
		
		// let tw = egret.Tween.get(this.gameObject);
		// if (this.x === toPos.x) {
		// 	tw.to({y: toPos.y}, tutils.LongDistance*tutils.SpeedFactor/speed, ease);
		// } else {
		// 	tw.to({x: toPos.x, y: toPos.y}, tutils.LongDistance*tutils.SpeedFactor/speed, ease);
		// }
	}

	public moveSine(angle: number, speed: number, wavelen, amplitude, fixedRotation: boolean=false, ease?: Function) {
		if (fixedRotation !== true) {
			this.rotation = angle;
		}
		let toPos = Unit.getDirectionPoint(this.gameObject.x, this.gameObject.y, angle, tutils.LongDistance);
		let dur = tutils.LongDistance*tutils.SpeedFactor/speed;
		let act = new tutils.Sine(dur, this.x, this.y, toPos.x, toPos.y, wavelen, amplitude, fixedRotation, ease);
		this.runAction(act);
	}

	// fixedRotation=false
	public moveTo(x: number, y: number, speed: number, fixedRotation: boolean=false, ease?: Function, stackable: boolean=false, onMoveEnd?: ()=>void, thisObject?: any): void {
		let xx = x-this.gameObject.x;
		let yy = y-this.gameObject.y;
		if (fixedRotation !== true) {
			let angle = Math.atan2(yy, xx);
			this.rotation = angle * tutils.DegPerRad + 90;
		}
		let dis = Math.sqrt(xx*xx+yy*yy);
        let dur = dis * tutils.SpeedFactor / speed;

		this.stopAllActions();
		let act = new tutils.Sequence(
			stackable===true ? new tutils.MoveTo2(dur, x, y, ease) : new tutils.MoveTo(dur, x, y, ease),
			new tutils.CallFunc(onMoveEnd, thisObject)
		);
		this.runAction(act);

        // egret.Tween.removeTweens(this);
        // let tw = egret.Tween.get(this);
        // tw.to({x: x, y: y}, dur, ease);
		// if (onMoveEnd) {
		// 	tw.call(onMoveEnd, thisObject);
		// }
	}

	public adjustAngle(dt: number, angleSpeed: number, x: number, y: number): void {
		let orgAngle = this.rotation;
		let angle = this.getAngle(x, y);
		let dtAngle = dt * angleSpeed;
		if (angle > orgAngle) {
			if (orgAngle+dtAngle > angle) {
				this.rotation = angle;
			} else {
				this.rotation += dtAngle;
			}
		} else if (angle < orgAngle) {
			if (orgAngle-dtAngle < angle) {
				this.rotation = angle;
			} else {
				this.rotation -= dtAngle;
			}
		}
	}
}
