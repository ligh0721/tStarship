class ExplosionEffect extends Effect {
	trace: egret.DisplayObject;
	model: string;

	public constructor(minimum: number, maximum: number, model: string, trace?: egret.DisplayObject) {
		super(minimum, maximum);
		this.trace = trace;
		this.model = model;
		if (this.gameObject === undefined) {
			this.gameObject = tutils.createBitmapByName(model);
		}
		this.gameObject.width = maximum * 2;
		this.gameObject.height = maximum * 2;
		this.gameObject.anchorOffsetX = this.gameObject.width * 0.5;
		this.gameObject.anchorOffsetY = this.gameObject.height * 0.5;
		this.onStep(this);
		this.setOnChanged(this.onStep, this);
	}

	private onStep(effect: Effect): void {
		this.gameObject.scaleX = effect.value / effect.maximum * 1.2;
		this.gameObject.scaleY = this.gameObject.scaleX * 0.8;
		this.gameObject.alpha = Math.min(1, 1.0 - (effect.value - effect.minimum) / (effect.maximum - effect.minimum));
		if (this.trace) {
			this.gameObject.x = this.trace.x;
			this.gameObject.y = this.trace.y;
		}
	}
}