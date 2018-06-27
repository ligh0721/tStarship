module tutils {
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
			if (evt.target !== this) {
				this.evtMgr.unregEvents(evt.target);
				return;
			}
			this.removeEventListener(eui.UIEvent.REMOVED, this.$onRemoved, this);
			this.removeAllChildren();
			this.evtMgr.cleanup();
			this.onRemoved();
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