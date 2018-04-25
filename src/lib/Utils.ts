// TypeScript file
module tutils {
    export function createLayer(parent: egret.DisplayObjectContainer, color: number=0x000000, alpha=0.0): egret.DisplayObjectContainer {
		let layer = new egret.Sprite();
		layer.graphics.beginFill(color, alpha);
		layer.graphics.drawRect(0, 0, parent.stage.stageWidth, parent.stage.stageHeight);
		console.log(parent.stage.stageWidth, parent.stage.stageHeight);
		layer.graphics.endFill();
		parent.addChild(layer);
		return layer;
	}

    var curId: number = 1000;
    export function nextId(): number {
        curId++;
        return curId;
    }
    
	export function createGun<GUN extends Gun>(t: new() => GUN): GUN {
		return new t();
	}
}