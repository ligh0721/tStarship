class BuffProgress extends ShapeProgress {
	readonly buff: Buff;
	static readonly Width: number = 50;
	static readonly Height: number = 50;

	public constructor(layer: egret.DisplayObjectContainer, buff: Buff, color: number) {
		super(layer, tutils.ProgressFillDirection.BottomToTop, BuffProgress.Width, BuffProgress.Height, color, color);
		this.buff = buff;
	}
}
