class EnemyShip extends Ship {
	private hpBar: ShipHpBar = null;

	group: EnemyGroup = null;

	public constructor(model: string, scale?: number) {
		super(model, scale);
	}

	public damaged(value: number, src: HpUnit): void {
		super.damaged(value, src);
		if (this.alive) {
			if (this.hpBar == null) {
				this.hpBar = this.pools.newObject(ShipHpBar, this).create();
				this.world.gameObject.addChild(this.hpBar.gameObject);
				this.hpBar.gameObject.x = this.gameObject.x;
				this.hpBar.gameObject.y = this.gameObject.y + this.gameObject.height - this.gameObject.anchorOffsetY;
			}
			this.hpBar.update();
		} else {
			if (this.hpBar != null) {
				this.world.gameObject.removeChild(this.hpBar.gameObject);
				this.pools.delObject(this.hpBar);
				this.hpBar = null;
			}
		}
	}

	public get x(): number {
		return this.gameObject.x;
	}

	public set x(value: number) {
		this.gameObject.x = value;
		if (this.hpBar != null) {
			this.hpBar.gameObject.x = this.gameObject.x;
		}
	}

	public get y(): number {
		return this.gameObject.y;
	}

	public set y(value: number) {
		this.gameObject.y = value;
		if (this.hpBar != null) {
			this.hpBar.gameObject.y = this.gameObject.y + this.gameObject.height - this.gameObject.anchorOffsetY;
		}
	}

	// override
	public onAddToWorld(): void {
		super.onAddToWorld();
		this.angle = 180;
	}

	protected onCleanup(): void {
		if (this.hpBar != null) {
			this.world.gameObject.removeChild(this.hpBar.gameObject);
			this.pools.delObject(this.hpBar);
			this.hpBar = null;
		}
		super.onCleanup();
	}

	// override
	protected onDying(src: HpUnit): void {
		if (this.group) {
			this.group.decMember();
		}
		super.onDying(src);
	}

	public setGroup(group: EnemyGroup): void {
		this.group = group;
	}

	public isLastGroupMember(): boolean {
		if (!this.group) {
			return false;
		}
		if (this.alive) {
			return this.group.num === 1
		} else {
			return this.group.num === 0;
		}
	}
}

class EnemyGroup {
	num: number = 0;
	max: number = 0;

	onEmptyListener: ()=>void;
	thisObj: any;

	public incMember(count: number=1): void {
		this.num += count;
		this.max = Math.max(this.max, this.num);
	}

	public decMember(): void {
		this.num--;
		if (this.num===0 && this.onEmptyListener) {
			this.onEmptyListener.call(this.thisObj);
		}
	}

	public setOnEmptyListener(listener: ()=>void, thisObj: any): void {
		this.onEmptyListener = listener;
		this.thisObj = thisObj;
	}
}