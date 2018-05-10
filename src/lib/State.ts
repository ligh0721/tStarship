module tutils {
	export interface State {
		onEnter(...args: any[]): void;
		onTimer(dt: number);
	}

	export class State implements State {
		protected onEnterListener: ()=>void = null;
		protected onTimerListener: (dt: number)=>void = null;
		protected thisObject: any = null;
		public args: any[];

		public setListener(onEnter: (...args: any[])=>void, onTimer: (dt: number)=>void, thisObject: any) {
			this.onEnterListener = onEnter;
			this.onTimerListener = onTimer;
			this.thisObject = thisObject;
		}

		public onEnter(...args: any[]): void {
			this.args = args;
			if (this.onEnterListener != null) {
				this.onEnterListener.call(this.thisObject, ...args);
			}
		}

		public onTimer(dt: number) {
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

		public start(timerRate: number, startState: State, ...args: any[]): void {
			if (!this.timer.hasOnTimerListener()) {
				this.timer.setOnTimerListener(this.onTimer, this);
			}
			this.timer.start(1000/timerRate, true);
			this.change(startState, ...args);
		}

		public stop(): void {
			this.timer.stop();
			this.$curState = null;
		}

		public change(state: State, ...args: any[]): void {
			this.$curState = state;
			state.onEnter(...args);
		}

		private onTimer(dt: number): void {
			this.$curState.onTimer(dt);
		}
	}
}