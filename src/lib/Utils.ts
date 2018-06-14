// TypeScript file
module tutils {
	export const SpeedFactor = 100;
	export const DegPerRad = 180/Math.PI;
	export const LongDistance = 1500;
	export const Player1Force = 1;
	export const Player2Force = 2;
	export const AllyForce = 10;
	export const EnemyForce = 11;
	export const LargeNumber = 1000000;
	export const ShipTimerInterval = 100;
	export const EPSILON = 2.2204460492503130808472633361816E-16;
	let bgMusic: egret.SoundChannel;
	let bgMusicPosition: number = null;
	let bgMusicName: string = null;

    export function createLayer(parent: egret.DisplayObjectContainer, color: number=0x000000, alpha=0.0): egret.Sprite {
		let layer = new egret.Sprite();
		layer.graphics.beginFill(color, alpha);
		layer.graphics.drawRect(0, 0, parent.stage.stageWidth, parent.stage.stageHeight);
		layer.graphics.endFill();
		parent.addChild(layer);
		return layer;
	}

    var curId: number = 1000;
    export function nextId(): string {
        curId++;
		return curId.toString();
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

	export function createBitmapByName(name: string) {
        let gameObject = new egret.Bitmap();
		if (name) {
			let texture: egret.Texture = RES.getRes(name);
        	gameObject.texture = texture;
		}
        return gameObject;
    }

	export function playSound(name: string): egret.SoundChannel {
		let sound: egret.Sound = RES.getRes(name);
		return sound.play(0, 1);
	}

	export function playBgMusic(name: string): void {
		if (bgMusic) {
			bgMusic.stop();
			bgMusic = null;
		}
		let sound: egret.Sound = RES.getRes(name);
		bgMusic = sound.play(0, 0);
		bgMusicName = name;
	}

	export function stopBgMusic(): void {
		if (bgMusic) {
			bgMusic.stop();
			bgMusic = null;
			bgMusicName = null;
			bgMusicPosition = null;
		}
	}

	export function pauseBgMusic(): void {
		if (bgMusic) {
			bgMusicPosition = bgMusic.position;
			bgMusic.stop();
			bgMusic = null;
		}
	}

	export function resumeBgMusic(): void {
		if (!bgMusic && bgMusicPosition) {
			let sound: egret.Sound = RES.getRes(bgMusicName);
			bgMusic = sound.play(bgMusicPosition, 0);
			// bgMusic.position = bgMusicPosition;
			bgMusicPosition = null;
		}
	}

	export function greyFilter(): egret.Filter {
		const colorMatrix = [
			0.3, 0.6, 0.0, 0.0, 0.0,
			0.3, 0.6, 0.0, 0.0, 0.0,
			0.3, 0.6, 0.0, 0.0, 0.0,
			0.0, 0.0 ,0.0, 1.0, 0.0
		];
		let filter = new egret.ColorMatrixFilter(colorMatrix);
		return filter;
	}
}