module tutils {
	export interface State {
		onEnter(...args: any[]): void;
		onTimer(dt: number);
	}

	export class State implements State {
		protected onEnterListener: ()=>void = null;
		protected onTimerListener: (dt: number, state: State)=>void = null;
		protected thisObject: any = null;
		public args: any[];

		public setListener(onEnter: (...args: any[])=>void, onTimer: (dt: number, state: State)=>void, thisObject: any) {
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
				this.onTimerListener.call(this.thisObject, dt, this);
			}
		}
	}

	export class StateManager {
		private $curState: State = null;
		private timer: tutils.Timer = new tutils.Timer();

		public start(timerRate: number, startState: State, ...args: any[]): void {
			if (!this.timer.hasOnTimerListener()) {
				this.timer.setOnTimerListener(this.onTimer, this);
			}
			this.timer.start(1000/timerRate, true);
			this.change(startState, ...args);
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