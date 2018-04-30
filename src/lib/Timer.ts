module tutils {
	export class Timer {
		public interval: number;
		public times: number = 1;
		private onTimerListener: (dt: number)=>void = null;
		private onTimerThisObject: any;
		private accurate: boolean = false;
		private $running: boolean = false;
		private $tick: number;
		private $left: number;
		private $timer: egret.EventDispatcher = null;

		public onTimer(evt: egret.TimerEvent) {
			let now = egret.getTimer();
			if (this.accurate && now - this.$tick < this.interval) {
				return;
			}
			let tick = this.$tick;
			this.$tick = now;
			if (this.times > 0) {
				this.$left--;
			}
			if (this.onTimerListener != null) {
				this.onTimerListener.call(this.onTimerThisObject, egret.getTimer()-tick);
			}
			if (this.times > 0 && this.$left == 0) {
				this.stop();
				return;
			}

			if (!this.accurate) {
				let interval = Math.max(this.interval*2-egret.getTimer()+tick, 0);
				let tw = egret.Tween.get(this);
				tw.wait(interval);
				//console.log('@@'+egret.getTimer()+', '+this.interval+', '+interval);
				tw.call(this.onTimer, this, null);
			}
		}

		public setOnTimerListener(listener: (dt: number)=>void, thisObject?: any) {
			this.onTimerListener = listener;
			this.onTimerThisObject = thisObject;
		}

		public hasOnTimerListener(): boolean {
			return this.onTimerListener != null;
		}

		public start(interval: number, instantly?: boolean, times?: number, accurate?: boolean): number {
			this.$tick = egret.getTimer();
			this.$running = true;
			egret.Tween.removeTweens(this);
			this.interval = interval;
			this.times = times==undefined ? 1 : times;
			this.$left = this.times;
			this.accurate = accurate==true ? true : false;

			if (!this.accurate) {
				let tw = egret.Tween.get(this);
				if (instantly != true) {
					let interval = Math.max(this.interval - egret.getTimer() + this.$tick, 0);
					tw.wait(interval);
				}
				tw.call(this.onTimer, this, null);
			} else {
				if (this.$timer == null) {
					this.$timer = new egret.DisplayObject();
				}
				this.$timer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onTimer, this);
			}
			
			return this.$tick;
		}

		public stop(): void {
			let tw = egret.Tween.removeTweens(this);
			if (this.accurate) {
				this.$timer.removeEventListener(egret.TimerEvent.ENTER_FRAME, this.onTimer, this);
			}
			this.$running = false;
		}

		public get running(): boolean {
			return this.$running;
		}
	}
}