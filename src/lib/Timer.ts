module tutils {
	export class Timer {
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

		public onTimer(ts: number): boolean {
			if (!this.$running) {
				return false;
			}
			let start = ts;
			if (this.$interval > Timer.MinInterval && start < this.$wantTick) {
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

			if (this.times > 0 && this.$left == 0) {
				this.stop();
				return false;
			}

			do {
				this.$wantTick += this.$interval;
			} while (this.autoSkip && start > this.$wantTick);

			return false;
		}

		public setOnTimerListener(listener: (dt: number)=>void, thisObject?: any) {
			this.onTimerListener = listener;
			this.onTimerThisObject = thisObject;
		}

		public hasOnTimerListener(): boolean {
			return this.onTimerListener != null;
		}

		// instantly=false, times=0, autoSkip=true
		public start(interval: number, instantly?: boolean, times?: number, autoSkip?: boolean): number {
			let start = egret.getTimer();
			if (this.$running) {
				this.stop();
			}
			this.$tick = start;
			this.$wantTick = start;
			egret.startTick(this.onTimer, this);
			this.$running = true;
			this.interval = interval;
			this.times = times===undefined ? 0 : times;
			this.autoSkip = autoSkip!=false;
			this.$left = this.times;

			if (instantly != true) {
				this.$wantTick += this.$interval;
			}
			return this.$tick;
		}

		public stop(): void {
			egret.stopTick(this.onTimer, this);
			this.$running = false;
		}

		public get running(): boolean {
			return this.$running;
		}
	}
}