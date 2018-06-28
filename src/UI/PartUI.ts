class PartUI extends tutils.Component {
	private imgBuff: eui.Image;
	part: Part;

	public constructor(part: Part) {
		super();
		this.part = part;
	}

	// override
    protected onInit(): void {
		this.width = 50;
		this.height = 50;

		this.imgBuff = new eui.Image();
		this.addChild(this.imgBuff);
		this.imgBuff.width = this.width;
		this.imgBuff.height = this.height;
		this.imgBuff.source = this.part.model;
	}

	// override
	protected onRemoved(): void {
		this.part = null;
	}
}