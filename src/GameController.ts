class GameController {
	private static $inst: GameController;

	battleShips: string[] = [];

	public constructor() {
	}

	public static get instance(): GameController {
		return GameController.$inst!==undefined ? GameController.$inst : GameController.$inst=new GameController();
	}
}