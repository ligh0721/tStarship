class ShipAIChainState implements tutils.IState {
	protected mgr: tutils.StateManager;
	protected ship: Ship;
	protected nextState: tutils.IState;
	protected nextArgs: any[];

	public constructor(mgr: tutils.StateManager, ship: Ship) {
		this.mgr = mgr;
		this.ship = ship;
	}

	public setNext<STATE extends tutils.IState>(nextState: STATE, ...nextArgs: any[]): STATE {
		this.nextState = nextState;
		this.nextArgs = nextArgs;
		return nextState;
	}

	public next(): void {
		if (this.nextState) {
			this.mgr.change(this.nextState, ...this.nextArgs);
		}
	}
	
	public onEnter(): void {
	}

	public onExit(): void {
	}
}