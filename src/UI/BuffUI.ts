class BuffUI extends tutils.Component {
	private imgBuffBg: eui.Image;
	private imgBuff: eui.Image;
	buff: Buff;
	private timer: tutils.Timer = new tutils.Timer();

	public constructor(buff: Buff) {
		super();
		this.buff = buff;
	}

	// override
    protected onInit(): void {
		this.width = 50;
		this.height = 50;

		this.imgBuffBg = new eui.Image();
		this.addChild(this.imgBuffBg);
		this.imgBuffBg.alpha = 0.5;
		this.imgBuffBg.width = this.width;
		this.imgBuffBg.height = this.height;
		this.imgBuffBg.source = this.buff.model;

		this.imgBuff = new eui.Image();
		this.addChild(this.imgBuff);
		this.imgBuff.width = this.width;
		this.imgBuff.height = this.height;
		this.imgBuff.source = this.buff.model;
		this.imgBuff.mask = new egret.Rectangle(0, 0, this.imgBuff.width, this.imgBuff.height);

		this.updateProgress();
		if (this.buff.left > 0) {
			this.timer.setOnTimerListener(this.onTimer, this);
			this.timer.start(1000/20, false, 0);
		}
	}

	// override
	protected onRemoved(): void {
		this.timer.stop();
		this.buff = null;
	}

	protected updateProgress(): void {
		this.imgBuff.mask.height = this.imgBuff.height * (this.buff.left===-1 ? 1.0 : (this.buff.left/this.buff.duration));
		this.imgBuff.mask.y = this.imgBuff.height - this.imgBuff.mask.height;
	}

	private onTimer(dt: number): void {
		this.updateProgress();
	}
}