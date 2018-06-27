module tutils {
	export class Layer {
		readonly root: Main;
		readonly stage: egret.Stage;
		layer: egret.Sprite;
		protected evtMgr: EventManager;
		
		public constructor(root: Main) {
			this.root = root;
			this.stage = root.stage;
			this.evtMgr = new EventManager(this);
		}

		public static createAt<LAYER extends Layer>(t: new(r: Main) => LAYER, root: Main): LAYER {
			let layer = new t(root);
			layer.$create();
			return layer;
		}

		public addChild(child: egret.DisplayObject): egret.DisplayObject {
			return this.layer.addChild(child);
		}

		public removeChild(child: egret.DisplayObject): egret.DisplayObject {
			this.evtMgr.unregEvents(child);
			return this.layer.removeChild(child);
		}

		protected removeAllChildren(): void {
			if (this.layer.numChildren <= 0) {
				return;
			}
			for (let i=this.layer.numChildren-1; i>=0; i--) {
				this.layer.removeChildAt(i);
			}
			this.evtMgr.unregAllEvents();
		}

		private $onRemoved(evt: eui.UIEvent): void {
			if (evt.target !== this.layer) {
				this.evtMgr.unregEvents(evt.target);
				return;
			}
			this.layer.removeEventListener(eui.UIEvent.REMOVED, this.$onRemoved, this);
			this.removeAllChildren();
			this.evtMgr.cleanup();
			this.onRemoved();
		}

		// override
		protected onRemoved(): void {
		}

		public $create(): egret.Sprite {
			this.onCfgStage();
			console.log("stage size: "+this.stage.stageWidth+"x"+this.stage.stageHeight);
			this.layer = this.onCreate();
			this.layer.addEventListener(eui.UIEvent.REMOVED, this.$onRemoved, this);
			this.onInit();
			return this.layer;
		}

		// override
		protected onCfgStage(): void {
			this.stage.frameRate = 60;
		}

		// override
		protected onCreate(): egret.Sprite {
			let layer = tutils.createLayer(this.root, 0x000000, 1.0);
			return layer;
		}

		// override
		protected onInit(): void {
		}

		public cleanup(): void {
			// this.onCleanUp();
			this.root.removeChild(this.layer);
			egret.Tween.removeAllTweens();
			this.layer = null;
		}

		// // override
		// protected onCleanUp(): void {
		// }
	}
}