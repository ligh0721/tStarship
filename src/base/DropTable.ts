class DropTable<T> {
	private items: {item: T, weight: number}[] = [];
	private totalWeight: number = 0;
	public push(item: T, weight: number): void {
		this.items.push({item: item, weight: weight});
		this.totalWeight += weight;
	}

	public random(): T {
		let rnd = Math.random() * this.totalWeight;
		for (let i in this.items) {
			let item = this.items[i];
			if (rnd < item.weight) {
				return item.item;
			} else {
				rnd -= item.weight;
			}
		}
		return null;
	}
	
	public randomR(): any {
		let item = this.random();
		if (item instanceof DropTable) {
			return item.randomR();
		}
		return item;
	}

	public clear(): void {
		this.items.length = 0;
		this.totalWeight = 0;
	}
}