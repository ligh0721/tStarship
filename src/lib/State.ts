module tutils {
	export interface State {
		onEnter(...args: any[]): void;
		onExit();
	}

	export class State implements State {
		protected onEnterListener: ()=>void = null;
		protected onTimerListener: (dt: number)=>void = null;
		protected thisObject: any = null;
		protected timerInterval: number;
		protected timer: tutils.Timer;
		public args: any[];

		public setListener(onEnter: (...args: any[])=>void, onTimer: (dt: number)=>void, thisObject: any, timerInterval?: number) {
			this.onEnterListener = onEnter;
			this.onTimerListener = onTimer;
			this.thisObject = thisObject;
			this.timerInterval = timerInterval===undefined ? 100 : timerInterval;
			if (this.onTimerListener) {
				this.timer = new tutils.Timer();
				this.timer.setOnTimerListener(this.onTimer, this);
			}
		}

		public onEnter(...args: any[]): void {
			this.args = args;
			if (this.onEnterListener != null) {
				this.onEnterListener.call(this.thisObject, ...args);
			}
			if (this.timer) {
				this.timer.start(this.timerInterval, true, 0);
			}
		}

		public onExit(): void {
			if (this.timer && this.timer.running) {
				this.timer.stop();
			}
		}

		protected onTimer(dt: number) {
			if (this.onTimerListener != null) {
				this.onTimerListener.call(this.thisObject, dt);
			}
		}
	}

	export class StateManager {
		private $curState: State = null;
		private timer: tutils.Timer;

		public constructor() {
			this.timer===undefined ? this.timer=new tutils.Timer() : this.timer.constructor();
		}

		public stop(): void {
			this.timer.stop();
			this.$curState = null;
		}

		public change(state: State, ...args: any[]): void {
			if (this.$curState) {
				this.$curState.onExit();
			}
			this.$curState = state;
			state.onEnter(...args);
		}
	}
}