class BackgroundController {
	gameObject: egret.DisplayObjectContainer;
	readonly width: number;
	readonly height: number;
	readonly bgname: string;
	speed: number = 20;
	cacheHeight: number = 100;
	private childHeight: number;
	private children: egret.DisplayObject[] = [];
	private timer: tutils.Timer = new tutils.Timer();

	public constructor(width: number, height: number, bgname: string) {
		this.width = width;
		this.height = height;
		this.bgname = bgname;
		this.timer.setOnTimerListener(this.onTimer, this);
	}

	public create(): BackgroundController {
		this.gameObject = new egret.DisplayObjectContainer();
		let minY = 0;
		let maxY = 0;
		let bd: egret.DisplayObject;
		while (maxY <= this.height+this.cacheHeight) {
			bd = tutils.createBitmapByName(this.bgname);
			if (this.childHeight===undefined) {
				this.childHeight = bd.height;
			}
			this.gameObject.addChild(bd);
			this.children.push(bd);
			bd.x = 0;
			bd.y = maxY;
			maxY = bd.y + this.childHeight;
		}

		while (minY >= -this.cacheHeight) {
			bd = tutils.createBitmapByName(this.bgname);
			if (this.childHeight===undefined) {
				this.childHeight = bd.height;
			}
			this.gameObject.addChild(bd);
			this.children.push(bd);
			bd.x = 0;
			bd.y = minY - this.childHeight;
			minY = bd.y;
		}
		console.log(this.children.length);

		return this;
	}

	public start(speed: number): void {
		this.speed = speed;
		this.timer.start(1000/60, true, 0);
	}

	public stop(): void {
		this.timer.stop();
	}

	public onTimer(dt: number): void {
		let delta = this.speed * dt / tutils.SpeedFactor;
		let outOf: egret.DisplayObject[] = [];
		let minY: number;
		let maxY: number;
		for (let i in this.children) {
			let child = this.children[i];
			child.y += delta;
			if (maxY===undefined || child.y+this.childHeight>maxY) {
				maxY = child.y+this.childHeight;
			}
			if (minY===undefined || child.y<minY) {
				minY = child.y;
			}
			if (this.speed>0 && child.y>this.height+this.cacheHeight) {
				outOf.push(child);
			} else if (this.speed<0 && child.y+this.childHeight+this.cacheHeight<0) {
				outOf.push(child);
			}
		}
		for (let i in outOf) {
			let child = outOf[i];
			if (this.speed > 0) {
				child.y = minY - this.childHeight;
				minY = child.y;
			} else if (this.speed < 0) {
				child.y = maxY;
				maxY = child.y + this.childHeight;
			}
		}
	}
}