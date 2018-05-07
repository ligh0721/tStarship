module tutils {
	export class OldTimer {
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

		public get interval(): number {
			return this.$interval;
		}

		public set interval(value: number) {
			if (value < OldTimer.MinInterval) {
				value = OldTimer.MinInterval;
			}
			this.$interval = value;
		}

		public onTimer(evt: egret.TimerEvent) {
			if (!this.$running) {
				return;
			}
			let start = egret.getTimer();
			let last = this.$tick;
			this.$tick = start;
			if (this.times > 0) {
				this.$left--;
			}
			if (this.onTimerListener != null) {
				this.onTimerListener.call(this.onTimerThisObject, start-last);
				if (!this.$running) {
					return;
				}
			}
			if (this.times > 0 && this.$left == 0) {
				this.stop();
				return;
			}

			let interval: number;
			do {
				interval = Math.max(this.$interval-egret.getTimer()+this.$wantTick, 0)
				//console.log('@@'+start+', '+interval+', '+this.$wantTick+', '+this.interval);
				this.$wantTick += this.$interval;
			} while (this.autoSkip && interval==0);
			let tw = egret.Tween.get(this);
			tw.wait(interval);
			tw.call(this.onTimer, this, null);
		}

		public setOnTimerListener(listener: (dt: number)=>void, thisObject?: any) {
			this.onTimerListener = listener;
			this.onTimerThisObject = thisObject;
		}

		public hasOnTimerListener(): boolean {
			return this.onTimerListener != null;
		}

		public start(interval: number, instantly?: boolean, times?: number, autoSkip?: boolean): number {
			let start = egret.getTimer();
			if (this.$running) {
				this.stop();
			}
			this.$tick = start;
			this.$wantTick = start;
			this.$running = true;
			egret.Tween.removeTweens(this);
			this.interval = interval;
			this.times = times==undefined ? 1 : times;
			this.autoSkip = autoSkip!=false;
			this.$left = this.times;

			let tw = egret.Tween.get(this);
			if (instantly != true) {
				let interval = Math.max(this.$interval-egret.getTimer()+start, 0);
				tw.wait(interval);
				this.$wantTick += this.$interval;
			}
			tw.call(this.onTimer, this, null);
			return this.$tick;
		}

		public stop(): void {
			let tw = egret.Tween.removeTweens(this);
			this.$running = false;
		}

		public get running(): boolean {
			return this.$running;
		}
	}
}