class Score {
	bmpText: egret.BitmapText;
	digits: number = 1;
	private $score: number = null;
	private $_score: number = null;

	public constructor(layer: egret.DisplayObjectContainer, x: number=0, y: number=0) {
		this.bmpText = this.onCreate();
		layer.addChild(this.bmpText);
		this.bmpText.x = x;
		this.bmpText.y = y;
	}

	protected onCreate(): egret.BitmapText {
		let bmpText = new egret.BitmapText();
		bmpText.font = RES.getRes("font_fnt");
		return bmpText;
	}

	protected update(value: number) {
		let txt = value.toString();
		let len = txt.length;
		for (let i=0; i<this.digits; i++) {
			txt = "0" + txt;
		}
		this.bmpText.text = txt;
	}

	public get score(): number {
		return this.$score;
	}

	public set score(value: number) {
		value = Math.floor(value);
		if (this.$score != value) {
			this.$score = value;
			this.update(value);
		}
		egret.Tween.removeTweens(this);
		this.$_score = value;
	}

	public get _score(): number {
		return this.$_score;
	}

	public set _score(value: number) {
		value = Math.floor(value);
		if (this.$_score != value) {
			this.$_score = value;
			this.update(value);
		}
	}

	public setScore(value: number, dur: number): void {
		if (dur == 0) {
			this.score = value;
			return;
		}
		this.$score = Math.floor(value);
		egret.Tween.removeTweens(this)
		let tw = egret.Tween.get(this);
		tw.to({_score: this.$score}, dur);
	}
}