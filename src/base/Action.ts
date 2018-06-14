class ActionManager {
    private targetMap: {[targetHashCode: number]: egret.IHashObject} = {};
    private targets: {[targetHashCode: number]: TargetActionData} = {};
    private delayLock: boolean = false;
    private delayToRemove: number[] = [];
    private delayToAdd: {[targetHashCode: number]: TargetActionData} = {};
    private timer: tutils.Timer = new tutils.Timer();

    public addAction(target: egret.IHashObject, action: Action, pause: boolean=false): void {
        action.start(target);
        let hashCode = target.hashCode;
        let data = this.targets[hashCode];
        if (data===undefined || data.$removed) {
            // not found target or target salvaged. invalid
            if (this.delayLock) {
                data = this.delayToAdd[hashCode];
                if (data === undefined) {
                    data = new TargetActionData(pause);
                    this.delayToAdd[hashCode] = data;
                    this.targetMap[hashCode] = target;
                }
            } else {
                // not exists and not locked
                data = new TargetActionData(pause);
                this.targets[hashCode] = data;
                this.targetMap[hashCode] = target;
            }
        } else {
            /*
            // exists and not salvaged. valid
            if (_delayLock) {
                if (!_delayToAdd.TryGetValue (target, out data)) {
                    data = new TargetActionData (pause);
                    _delayToAdd.Add (target, data);
                    this.targetMap[hashCode] = target;
                }
            } else {
                // valid and not locked
            }
            */
        }
        data.addAction(action);
    }

    public removeAction(target: egret.IHashObject, action: Action): void {
        let hashCode = target.hashCode;
        let data = this.targets[hashCode];
        if (data===undefined || data.$removed) {
            // invalid
            data = this.delayToAdd[hashCode];
            if (data !== undefined) {
                if (data.removeAction(action)) {
                    delete this.delayToAdd[hashCode];
                    delete this.targetMap[hashCode];
                }
            }
        } else {
            // valid
            if (data.removeAction(action)) {
                if (this.delayLock) {
                    data.$removed = true;
                    this.delayToRemove.push(hashCode);
                } else {
                    delete this.targets[hashCode];
                    delete this.targetMap[hashCode];
                }
            }
        }
    }

    private removeActionAtIndex(target: egret.IHashObject, data: TargetActionData, index: number): void {
        let hashCode = target.hashCode;
        if (data == null || data.$removed) {
            // invalid
            //return;
// if (false) {  // #if false  // 这里不能从待添加队里搜寻，index指向的为原data位置
//             data = this.delayToAdd[hashCode];
//             if (data !== undefined) {
//                 if (data.removeActionAtIndex(index)) {
//                     delete this.delayToAdd[hashCode];
//                    delete this.targetMap[hashCode];
//                 }
//             }
// }  // #endif
        } else {
            // valid
            if (data.removeActionAtIndex(index)) {
                if (this.delayLock) {
                    data.$removed = true;
                    this.delayToRemove.push(hashCode);
                } else {
                    delete this.targets[hashCode];
                    delete this.targetMap[hashCode];
                }
            }
        }
    }

    public removeAllActions(target: egret.IHashObject): void {
        let hashCode = target.hashCode;
        let data = this.targets[hashCode];
        if (data===undefined || data.$removed) {
            // invalid
            data = this.delayToAdd[hashCode];
            if (data !== undefined) {
                delete this.delayToAdd[hashCode];
                delete this.targetMap[hashCode];
            }
        } else {
            // valid
            if (this.delayLock) {
                data.$removed = true;
                this.delayToRemove.push(hashCode);
            } else {
                delete this.targets[hashCode];
                delete this.targetMap[hashCode];
            }
        }
    }

    public getActionByTag(target: egret.IHashObject, tag: number): Action {
        let hashCode = target.hashCode;
        let data = this.targets[hashCode];
        if (data===undefined || data.$removed) {
            // invalid
            data = this.delayToAdd[hashCode];
            if (data !== undefined) {
                return data.getActionByTag(tag);
            }
        } else {
            return data.getActionByTag(tag);
        }
        return null;
    }

    public removeActionByTag(target: egret.IHashObject, tag: number): void {
        let hashCode = target.hashCode;
        let data = this.targets[hashCode];
        if (data===undefined || data.$removed) {
            // invalid
            data = this.delayToAdd[hashCode];
            if (data !== undefined) {
                if (data.removeActionByTag(tag)) {
                    delete this.delayToAdd[hashCode];
                    delete this.targetMap[hashCode];
                }
            }
        } else {
            // valid
            if (data.removeActionByTag(tag)) {
                if (this.delayLock) {
                    data.$removed = true;
                    this.delayToRemove.push(hashCode);
                } else {
                    delete this.targets[hashCode];
                    delete this.targetMap[hashCode];
                }
            }
        }
    }

    public everyValidAction(func: (target: egret.IHashObject, data: TargetActionData, index: number, action: Action)=>void): void {
        this.delayLock = true;
        //Debug.Log("Lock");
        //for (KeyValuePair<Node, TargetActionData> kv in _targets) {
        for (let targetHashCode in this.targets) {
            let data = this.targets[targetHashCode];
            if (!data.$removed) {
				let target = this.targetMap[targetHashCode];
                if (data.everyValidAction((index: number, action: Action):void=>{
                        func(target, data, index, action);
                    })) {
                    data.$removed = true;
                    this.delayToRemove.push(parseInt(targetHashCode));
                }
            }
        }

        // delay to remove
        for (let i in this.delayToRemove) {
            let targetHashCode = this.delayToRemove[i];
            delete this.targets[targetHashCode];
            delete this.targetMap[targetHashCode];
        }
        this.delayToRemove.length = 0;

        this.delayLock = false;
        //Debug.LogFormat("Unlock, {0}", _targets.Count);

        // delay to add
        for (let targetHashCode in this.delayToAdd) {
// #if false
//             //Debug.Assert(!_targets.ContainsKey(toAdd.Key));
//             if (!toAdd.Value.everyValidAction (delegate(int index, Action action) {
//                 func (toAdd.Key, toAdd.Value, index, action);
//             })) {
//                 _targets.Add (toAdd.Key, toAdd.Value);
//             }
// #else
            let toAdd = this.delayToAdd[targetHashCode];
            let data = this.targets[targetHashCode];
            if (data !== undefined) {
                toAdd.everyValidAction((index: number, action: Action):void=>{
                    data.addAction(action);
                });
            } else {
                this.targets[targetHashCode] = toAdd;
            }
// #endif
        }
        this.delayToAdd = {};
    }

    private step(dt: number): void {
        this.everyValidAction((target: egret.IHashObject, data: TargetActionData, index: number, action: Action):void=>{
            if (!data.paused) {
                action.step(dt);
                if (action.isDone()) {
                    action.stop();
                    this.removeActionAtIndex(target, data, index);
                }
            }
        });
        //System.GC.Collect ();
        //Debug.LogFormat("targets: {0}.", _targets.Count);
    }

    public start(rate: number=60): void {
        if (this.timer.running) {
            this.timer.stop();
        }
        this.timer.setOnTimerListener(this.step, this);
        this.timer.start(1000/rate, true, 0);
    }

    public stop(): void {
        this.timer.stop();
    }
}

class TargetActionData {
    private actions: Action[] = [];
    $removed: boolean = false;
    paused: boolean = false;

    private delayLock: boolean = false;
    private delayToRemoveLength: number = 0;
    private delayToAdd: Action[] = [];

    public constructor(paused: boolean) {
        this.paused = paused;
    }

    public addAction(action: Action): void {
        console.assert(action.$removed===false);
        if (this.delayLock) {
            this.delayToAdd.push(action);
        } else {
            this.actions.push(action);
        }
    }

    public removeAction(action: Action): boolean {
        let index = this.actions.indexOf(action);
        if (index < 0) {
            return false;
        }
        return this.removeActionAtIndex(index);
    }

    public removeActionAtIndex(index: number): boolean {
        let action = this.actions[index];
        if (action.$removed) {
            return false;
        }
        if (this.delayLock) {
            action.$removed = true;
            this.delayToRemoveLength++;
        } else {
            this.actions.splice(index, 1);
        }
        return this.actions.length === 0;
    }

    public removeActionByTag(tag: number): boolean {
        if (tag === Action.INVALID_TAG) {
            return false;
        }
        let index: string = null;
        for (let i in this.actions) {
            if (this.actions[i].tag === tag) {
                index = i;
                break;
            }
        }
        if (index === null) {
            return false;
        }
        return this.removeActionAtIndex(parseInt(index));
    }

    public getActionByTag(tag: number): Action {
        if (tag === Action.INVALID_TAG) {
            return null;
        }
        for (let i in this.actions) {
            let action = this.actions[i];
            if (action.tag === tag) {
                return action;
            }
        }
        return null;
    }

    public everyValidAction(func: (index: number, action: Action)=>void): boolean {
        this.delayLock = true;
        for (let i=0, len=this.actions.length; i<len; i++) {
            let action = this.actions[i];
            if (!action.$removed) {
                func(i, action);
            }
        }

        // delay to remove
        for (let i=0, len=this.actions.length; this.delayToRemoveLength>0 && i<len;) {
            let action = this.actions[i];
            if (action.$removed) {
                this.actions.splice(i, 1);
                this.delayToRemoveLength--;
            } else {
                i++;
            }
        }
        this.delayToRemoveLength = 0;

        // delay to add
        for (let i in this.delayToAdd) {
            this.actions.push(this.delayToAdd[i]);
        }
        this.delayToAdd.length = 0;

        this.delayLock = false;

        return this.actions.length === 0;
    }
}

class Action {
    static INVALID_TAG: number = -1;
    protected originalTarget: egret.IHashObject = null;
    protected target: egret.IHashObject = null;
    tag: number = Action.INVALID_TAG;
    // readonly hashCode: string;
    // private static hashCodeGen: number = 1000;
    $removed: boolean = false;

    public constructor() {
        // this.hashCode = Action.nextHashCode();
    }

    // private static nextHashCode(): string {
    //     Action.hashCodeGen += 1;
    //     return Action.hashCodeGen.toString();
    // }

    public start<T extends egret.IHashObject>(target: T): void {
        this.target = target;
        this.originalTarget = target;
    }

    public stop(): void {
        this.target = null;
    }

    public step(dt: number): void {
        console.warn("[Action step]. override me.");
    }

    public update(factor: number): void {
        console.warn("[Action update]. override me.");
    }

    public isDone(): boolean {
        return true;
    }
}

class FiniteTimeAction extends Action {
    duration: number = 0;
}

class ActionInstant extends FiniteTimeAction {
    public step(dt: number): void {
        this.update(1.0);
    }

    public update(factor: number): void {
    }

    public isDone(): boolean {
        return true;
    }
}

class ActionInterval extends FiniteTimeAction {
    protected elapsed: number = 0;
    protected firstTick: boolean = true;

    public constructor(duration: number) {
        super();
        this.duration = duration===0 ? Number.MIN_VALUE : duration;
        this.elapsed = 0;
        this.firstTick = true;
    }

    public start<T extends egret.IHashObject>(target: T): void {
        super.start(target);
        this.elapsed = 0;
        this.firstTick = true;
    }

    public step(dt: number): void {
        if (this.firstTick) {
            this.firstTick = false;
            // this.elapsed = 0;
            this.elapsed = dt;
        } else {
            this.elapsed += dt;
        }

        let factor = Math.max(0, Math.min(1, this.elapsed/Math.max(this.duration, Number.MIN_VALUE)));
        this.update(factor);
    }

    public isDone(): boolean {
        return this.elapsed >= this.duration;
    }
}

class ExtraAction extends FiniteTimeAction {
	public update(factor: number): void {
	}

	public step(dt: number): void {
	}
}

class DelayTime extends ActionInterval {
    public constructor(duration) {
        super(duration);
    }

    public update(factor: number): void {
    }
}

class CallFunc extends ActionInstant {
	protected func: Function;
	protected thisObj: any;
	protected args: any[];

	public constructor(func: Function, thisObj: any, ...args: any[]) {
		super();
		this.func = func;
		this.thisObj = thisObj;
		this.args = args;
	}

	public update(factor: number): void {
		if (this.func) {
			this.func.call(this.thisObj, ...this.args);
		}
	}
}

class Sequence extends ActionInterval {
	protected actions: FiniteTimeAction[] = [];
	protected split: number;
	protected last: number;

	public constructor(...actions: FiniteTimeAction[]) {
		super(0);
		let count = actions.length;
		if (count === 0) {
			console.assert(false, "actions can't be empty");
			this.actions[0] = new ExtraAction();
			this.actions[1] = new ExtraAction();
		} else {
			this.actions[0] = actions[0];
			if (count === 1) {
				this.actions[1] = new ExtraAction();
			} else {
				// else size > 1
				for (let i=1; i<count-1; i++) {
					this.actions[0] = new Sequence(this.actions[0], actions[i]);
				}
				this.actions[1] = actions[count-1];
			}
		}
		this.duration = this.actions[0].duration + this.actions[1].duration;
	}

	public get actionOne(): FiniteTimeAction {
		return this.actions[0];
	}

	public get actionTwo(): FiniteTimeAction {
		return this.actions[1];
	}

	public start<T extends egret.IHashObject>(target: T): void {
		super.start(target);
		this.split = this.actions[0].duration / this.duration;
		this.last = -1;
	}

	public stop(): void {
		if (this.last !== -1) {
			this.actions[this.last].stop();
		}
		super.stop();
	}

	public update(factor: number): void {
		let found = 0;
		let new_t = 0;

		if (factor < this.split) {
			// action[0]
			found = 0;
			if (this.split !== 0) {
				new_t = factor / this.split;
			} else {
				new_t = 1;
			}
		} else {
			// action[1]
			found = 1;
			if (this.split === 1) {
				new_t = 1;
			} else {
				new_t = (factor - this.split) / (1 - this.split);
			}
		}

		if (found === 1) {
			if (this.last === -1) {
				// action[0] was skipped, execute it.
				this.actions[0].start(this.target);
				this.actions[0].update(1.0);
				this.actions[0].stop();
			} else if (this.last === 0) {
				// switching to action 1. stop action 0.
				this.actions[0].update(1.0);
				this.actions[0].stop();
			}
		} else if (found===0 && this.last===1) {
			// Reverse mode ?
			// FIXME: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
			// since it will require a hack to know if an action is on reverse mode or not.
			// "step" should be overridden, and the "reverseMode" value propagated to inner Sequences.
			this.actions[1].update(0);
			this.actions[1].stop();
		}
		// Last action found and it is done.
		if (found===this.last && this.actions[found].isDone()) {
			return;
		}

		// Last action found and it is done
		if (found !== this.last) {
			this.actions[found].start(this.target);
		}

		this.actions[found].update(new_t);
		this.last = found;
	}
}