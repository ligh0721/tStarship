module tutils {
	export class ProgressFill {
		private readonly fill: egret.DisplayObject;
		direction: ProgressFillDirection;
		
		public constructor(fill: egret.DisplayObject, direction?: ProgressFillDirection) {
			this.fill = fill;
			this.fill.mask = new egret.Rectangle(0, -2, fill.width, fill.height);
			//this.fill.mask = new egret.Rectangle(-10, -10, fill.width*2, fill.height*2);
			this.direction = direction==ProgressFillDirection.BottomToTop ? ProgressFillDirection.BottomToTop : ProgressFillDirection.LeftToRight;
		}

		public get percent(): number {
			return this.direction==ProgressFillDirection.LeftToRight ? (this.fill.mask.width/this.fill.width) : (this.fill.mask.height/this.fill.height);
		}

		public set percent(value: number) {
			if (this.direction == ProgressFillDirection.LeftToRight) {
				this.fill.mask.width = this.fill.width * value;
			} else {
				let height = this.fill.height * value;
				this.fill.mask.y = this.fill.height - height - 2;
				this.fill.mask.height = height;
			}
		}
	}

	export enum ProgressFillDirection {
		LeftToRight,
		BottomToTop
	}
}