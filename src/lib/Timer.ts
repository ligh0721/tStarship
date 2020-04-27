module tutils {
	export interface ITimer {
		interval: number;
		running: boolean;
		setOnTimerListener(listener: (dt: number)=>void, thisObject?: any): void;
		hasOnTimerListener(): boolean;
		start(interval: number, instantly?: boolean, times?: number, autoSkip?: boolean): void;
		stop(): void;
	}

	export class Timer implements ITimer {
		private $interval: number;
		public times: number = 1;
		public autoSkip: boolean = true;
		private onTimerListener: (dt: number)=>void = null;
		private onTimerThisObject: any = null;
		private $running: boolean = false;
		private $tick: number;  // last tick
		private $left: number;
		private $wantTick: number;
		private static MinInterval: number = 1000/60;

		public constructor() {
		}

		public get interval(): number {
			return this.$interval;
		}

		public set interval(value: number) {
			if (value < Timer.MinInterval) {
				value = Timer.MinInterval;
			}
			this.$interval = value;
		}

		private onTimer(ts: number): boolean {
			if (!this.$running) {
				return false;
			}
			let start = ts;
			if (this.$interval>Timer.MinInterval && start<this.$wantTick) {
				return false;
			}
			let last = this.$tick;
			this.$tick = start;
			if (this.times > 0) {
				this.$left--;
			}
			if (this.onTimerListener != null) {
				this.onTimerListener.call(this.onTimerThisObject, start-last);
				if (!this.$running) {
					return false;
				}
			}

			if (this.times>0 && this.$left===0) {
				this.stop();
				return false;
			}

			do {
				this.$wantTick += this.$interval;
			} while (this.autoSkip && start>=this.$wantTick);

			return false;
		}

		public setOnTimerListener(listener: (dt: number)=>void, thisObject?: any): void {
			this.onTimerListener = listener;
			this.onTimerThisObject = thisObject;
		}

		public hasOnTimerListener(): boolean {
			return this.onTimerListener != null;
		}

		// instantly=false, times=0, autoSkip=true
		public start(interval: number, instantly: boolean=false, times: number=0, autoSkip: boolean=true): void {
			let start = egret.getTimer();
			if (this.$running) {
				this.stop();
			}
			this.$tick = start;
			this.$wantTick = start;
			egret.startTick(this.onTimer, this);
			this.$running = true;
			this.interval = interval;
			this.times = times;
			this.autoSkip = autoSkip;
			this.$left = this.times;

			if (!instantly) {
				this.$wantTick += this.$interval;
			}
			return;
		}

		public stop(): void {
			egret.stopTick(this.onTimer, this);
			this.$running = false;
		}

		public get running(): boolean {
			return this.$running;
		}
	}

	export class TimerAction extends Action {
		private $interval: number;
		public instantly: boolean;
		public times: number = 1;
		public autoSkip: boolean = true;
		private onTimerListener: (dt: number)=>void = null;
		private onTimerThisObject: any = null;
		private $running: boolean = false;
		private $tick: number;  // last tick
		private $last: number;
		private $left: number;
		private $wantTick: number;
		private static MinInterval: number = 1000/60;

		public constructor(interval: number=TimerAction.MinInterval, instantly: boolean=false, times: number=0, autoSkip: boolean=true) {
			super();
			this.interval = interval;
			this.instantly = instantly;
			this.times = times;
			this.autoSkip = autoSkip;
		}

		public get interval(): number {
			return this.$interval;
		}

		public set interval(value: number) {
			if (value < TimerAction.MinInterval) {
				value = TimerAction.MinInterval;
			}
			this.$interval = value;
		}

		public setProps(interval: number, instantly: boolean=false, times: number=0, autoSkip: boolean=true): void {
			this.interval = interval;
			this.instantly = instantly;
			this.times = times;
			this.autoSkip = autoSkip;
		}

		public setOnTimerListener(listener: (dt: number)=>void, thisObject?: any): void {
			this.onTimerListener = listener;
			this.onTimerThisObject = thisObject;
		}

		public hasOnTimerListener(): boolean {
			return this.onTimerListener != null;
		}

		public start(target: egret.IHashObject): void {
            super.start(target);
			this.$running = true;
			this.$left = this.times;
			this.$tick = 0;
			this.$last = 0;
			if (this.instantly) {
				this.$wantTick = 0;
			} else {
				this.$wantTick = this.$interval;
			}
        }

        public stop(): void {
            super.stop();
			this.$running = false;
        }

        public step(dt: number): void {
			if (!this.$running || dt===0) {
				return;
			}
			this.$tick += dt;
			if (this.$interval>TimerAction.MinInterval && this.$tick<this.$wantTick) {
				return;
			}
			let readDt = this.$tick - this.$last;
			this.$last = this.$tick;
			if (this.times > 0) {
				this.$left--;
			}
			if (this.onTimerListener != null) {
				this.onTimerListener.call(this.onTimerThisObject, readDt);
				if (!this.$running) {
					return;
				}
			}

			if (this.times>0 && this.$left===0) {
				this.stop();
				return;
			}

			do {
				this.$wantTick += this.$interval;
			} while (this.autoSkip && this.$tick>=this.$wantTick);
        }

		public update(factor: number): void {
		}

        public isDone(): boolean {
            return !this.$running;
        }
	}

	export class TimerByAction implements ITimer {
		private static MinInterval: number = 1000/60;
		private hashObj: egret.HashObject = new egret.HashObject();
		private act: TimerAction = new TimerAction();
		private actMgr: ActionManager;

		public constructor(actMgr: ActionManager) {
			this.actMgr = actMgr;
		}

		public get interval(): number {
			return this.act.interval;
		}

		public set interval(value: number) {
			this.act.interval = value;
		}

		public get running(): boolean {
			return !this.act.isDone();
		}

		public setOnTimerListener(listener: (dt: number)=>void, thisObject?: any): void {
			this.act.setOnTimerListener(listener, thisObject);
		}

		public hasOnTimerListener(): boolean {
			return this.act.hasOnTimerListener();
		}

		public start(interval: number, instantly: boolean=false, times: number=0, autoSkip: boolean=true): void {
			this.act.setProps(interval, instantly, times, autoSkip);
			this.actMgr.addAction(this.hashObj, this.act);
		}

		public stop(): void {
			this.actMgr.removeAllActions(this.hashObj);
			this.act.stop();
		}
	}
}