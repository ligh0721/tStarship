class PartUI extends eui.Component {
	private imgBuff: eui.Image;
	part: Part;

	public constructor(part: Part) {
		super();
		this.part = part;
	}

	// override
    protected createChildren(): void {
        super.createChildren();

		this.width = 50;
		this.height = 50;

		this.imgBuff = new eui.Image();
		this.addChild(this.imgBuff);
		this.imgBuff.width = this.width;
		this.imgBuff.height = this.height;
		this.imgBuff.source = this.part.model;

		this.addEventListener(eui.UIEvent.REMOVED, this.onRemoved, this);
	}

	protected onRemoved(evt: eui.UIEvent): void {
		this.part = null;
	}
}