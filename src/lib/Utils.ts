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

	export function getDirectionPoint(x0: number, y0: number, a: number, dis: number): {x: number, y: number} {
		return {x: x0+Math.cos(-a)*dis, y: y0+Math.sin(a)*dis};
	}

	export function getForwardPoint(x0: number, y0: number, x1: number, y1: number, dis: number): {x: number, y: number} {
		let a = Math.atan2(y1-y0, x1-x0)
		return getDirectionPoint(x0, y0, a, dis);
	}

	export function getDistance(x0: number, y0: number, x1: number, y1: number) {
		let dtx = x0 - x1;
		let dty = y0 - y1;
		return Math.sqrt(dtx*dtx+dty*dty);
	}

	export const SpeedFactor = 100;
	export const AnglePerRadian = 180/Math.PI;
	export const LongDistance = 5000;
}