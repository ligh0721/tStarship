module tutils {
	export class Layer {
		readonly root: Main;
		readonly stage: egret.Stage;
		layer: egret.Sprite;
		
		public constructor(root: Main) {
			this.root = root;
			this.stage = root.stage;
			// this.layer = this.onCreate();
			// layer.onInit();  // bad code
		}

		public static createAt<LAYER extends Layer>(t: new(r: Main) => LAYER, root: Main): LAYER {
			let layer = new t(root);
			layer.create();
			return layer;
		}

		public addChild(child: egret.DisplayObject): egret.DisplayObject {
			return this.layer.addChild(child);
		}

		public create(): egret.Sprite {
			this.onCfgStage();
			console.log("stage size: "+this.stage.stageWidth+"x"+this.stage.stageHeight);
			this.layer = this.onCreate();
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
	}
}