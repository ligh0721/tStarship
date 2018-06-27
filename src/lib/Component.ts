module tutils {
	export class EventManager {
		private eventsMap: {[hashCode: number]: {target: egret.EventDispatcher, type: string, listener: Function}[]} = {};
		private owner: any;

		public constructor(owner: any) {
			this.owner = owner;
		}

		public regEvent(obj: egret.EventDispatcher, type: string, listener: Function, useCapture?: boolean, priority?: number): any {
			let ret = obj.addEventListener(type, listener, this.owner, useCapture, priority);
			let list = this.eventsMap[obj.hashCode];
			if (list === undefined) {
				list = [];
				this.eventsMap[obj.hashCode] = list;
			}
			for (let i in list) {
				let item = list[i];
				if (item.type===type && item.listener===listener) {
					return ret;
				}
			}
			list.push({target: obj, type: type, listener: listener});
			return ret;
		}

		public unregEvent(obj: egret.EventDispatcher, type: string, listener: Function, useCapture?: boolean): void {
			obj.removeEventListener(type, listener, this.owner, useCapture);
			let list = this.eventsMap[obj.hashCode];
			if (list === undefined) {
				return;
			}
			for (let i in list) {
				let item = list[i];
				if (item.type===type && item.listener===listener) {
					list.splice(parseInt(i), 1);
					break;
				}
			}
			if (list.length === 0) {
				delete this.eventsMap[obj.hashCode];
			}
		}

		public unregEvents(obj: egret.EventDispatcher, useCapture?: boolean): void {
			let list = this.eventsMap[obj.hashCode];
			if (list === undefined) {
				return;
			}
			for (let i in list) {
				let item = list[i];
				item.target.removeEventListener(item.type, item.listener, this.owner, useCapture);
			}
			delete this.eventsMap[obj.hashCode];
		}

		public unregAllEvents(useCapture?: boolean): void {
			for (let hashCode in this.eventsMap) {
				let list = this.eventsMap[hashCode];
				for (let i in list) {
					let item = list[i];
					item.target.removeEventListener(item.type, item.listener, this.owner, useCapture);
				}
				delete this.eventsMap[hashCode];
			}
		}

		public cleanup(useCapture?: boolean): void {
			this.unregAllEvents(useCapture);
			this.owner = null;
		}
	}

	export class Component extends eui.Component {
		protected evtMgr: EventManager;

		public constructor() {
			super();
			this.evtMgr = new EventManager(this);
		}

		protected createChildren(): void {
			super.createChildren();
			this.addEventListener(eui.UIEvent.REMOVED, this.$onRemoved, this);
			this.onInit();
		}

		private $onRemoved(evt: eui.UIEvent): void {
			this.removeEventListener(eui.UIEvent.REMOVED, this.$onRemoved, this);
			this.removeAllChildren();
			this.evtMgr.cleanup();
			this.onRemoved();
		}

		// override
		public removeChild(child: egret.DisplayObject): egret.DisplayObject {
			this.evtMgr.unregEvents(child);
			return super.removeChild(child);
		}

		protected removeAllChildren(): void {
			if (this.numChildren <= 0) {
				return;
			}
			for (let i=this.numChildren-1; i>=0; i--) {
				this.removeChildAt(i);
			}
			this.evtMgr.unregAllEvents();
		}

		// override
		protected onInit(): void {
		}

		// override
		protected onRemoved(): void {
		}
	}
}