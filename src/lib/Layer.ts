class Layer {
	readonly root: Main;
	readonly stage: egret.Stage;
	readonly layer: egret.Sprite;
	public constructor(root: Main) {
		this.root = root;
		this.stage = root.stage;
		this.layer = this.onCreate();
		this.onInit();
	}

	public static createAt<LAYER extends Layer>(t: new(r: Main) => LAYER, root: Main): LAYER {
		let layer = new t(root);
		return layer;
	}

	public addChild(child: egret.DisplayObject): egret.DisplayObject {
		return this.layer.addChild(child);
	}

	protected onCreate(): egret.Sprite {
		let layer = tutils.createLayer(this.root, 0x000000, 1.0);
		return layer;
	}

	protected onInit() {
	}
}