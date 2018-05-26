class Score {
	gameObject: egret.DisplayObjectContainer;
	private bmpTxt: egret.BitmapText;
	digits: number = 1;
	private $score: number = null;
	private $$_score: number = null;

	public constructor(layer: egret.DisplayObjectContainer, x: number=0, y: number=0) {
		this.gameObject = this.onCreate();
		layer.addChild(this.gameObject);
		this.gameObject.x = x;
		this.gameObject.y = y;
	}

	protected onCreate(): egret.DisplayObjectContainer {
		let gameObject = new egret.DisplayObjectContainer();
		let bmp = tutils.createBitmapByName("score_title_png");
		gameObject.addChild(bmp);

		this.bmpTxt = new egret.BitmapText();
		this.bmpTxt.font = RES.getRes("score_fnt");
		gameObject.addChild(this.bmpTxt);
		this.bmpTxt.x = bmp.x + bmp.width + 50;
		return gameObject;
	}

	protected update() {
		let txt = this.$$_score.toString();
		let len = txt.length;
		for (let i=0; i<this.digits-len; i++) {
			txt = "0" + txt;
		}
		this.bmpTxt.text = txt;
	}

	public get score(): number {
		return this.$score;
	}

	public set score(value: number) {
		value = Math.floor(value);
		if (this.$score != value) {
			this.$score = value;
		}
		egret.Tween.removeTweens(this);
		if (this.$$_score != value) {
			this.$$_score = value;
			this.update();
		}
	}

	public get $_score(): number {
		return this.$$_score;
	}

	public set $_score(value: number) {
		value = Math.floor(value);
		if (this.$$_score != value) {
			this.$$_score = value;
			this.update();
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
		console.log(this.$score);
		tw.to({$_score: this.$score}, dur);
	}
}