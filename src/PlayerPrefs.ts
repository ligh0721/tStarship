type PlayPrefsData = {
	highscore: {
		score: number,
		stage: number,
		shipId: string,
	},
	maxStage: number,
	coins: number,
	ships: {
		id: string,
		exp: number,
		use: number,
		enemy: number,
	}[],
};

class PlayerPrefs {
	data: PlayPrefsData = null;
	private static KeyData: string = "PlayPrefsData";
	private static $inst: PlayerPrefs;

	public constructor() {
	}

	public static get instance(): PlayerPrefs {
		return PlayerPrefs.$inst!==undefined ? PlayerPrefs.$inst : PlayerPrefs.$inst=new PlayerPrefs();
	}

	public reset(): PlayPrefsData {
		this.data = GlobalPlayerInitData;
		egret.localStorage.clear();
		this.save();
		return this.data;
	}

	public load(): PlayPrefsData {
		let data = egret.localStorage.getItem(PlayerPrefs.KeyData);
		if (data == null) {
			this.data = null;
			return null;
		}
		data = this.decode(data);
		this.data = JSON.parse(data);
		console.log("load player prefs", this.data);
		return this.data;
	}

	public save(): void {
		if (this.data == null) {
			return;
		}
		let data = JSON.stringify(this.data);
		data = this.encode(data);
		egret.localStorage.setItem(PlayerPrefs.KeyData, data);
	}

	public encode(data: string): string {
		return data;
	}
	
	public decode(data: string): string {
		return data;
	}

	public addNewShip(id: string): void {
		console.assert(this.data != null);
		console.assert(ShipManager.instance.getShipDataItem(id) != null);
		for (let i in this.data.ships) {
			let ship = this.data.ships[i];
			if (ship.id == id) {
				console.assert(false, "ship("+id+") is already exists");
				break;
			}
		}
		this.data.ships.push({
			id: id,
			exp: 0,
			use: 0,
			enemy: 0,
		});
	}
}