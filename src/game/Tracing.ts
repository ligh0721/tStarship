class Tracing {
	private static interval: number = 1000;

	public constructor() {
	}

	// public tracingMethord(bullet: Bullet, ship: EnemyShip) {
	// 	let k = (ship. y - bullet.y) / (ship.x - bullet.x);

	// 	let distance = 100 * bullet.gun.bulletSpeed * this.interval;
    //     let x = Math.sqrt(distance * distance / (k * k + 1));
    //     let y = x * k;

	// 	let tw = egret.Tween.get(bullet.gameObject);
    //     tw.to({x: x, y: y}, this.interval);
	// 	tw.call(() => this.tracingMethord(bullet, ship));
	// }

	public static tracingMethord(bullet: EnemyShip, ship: Ship) {
		let shipY = - ship.y + ship.world.height;
		let bulletY = - bullet.y + ship.world.height;
		let k = (shipY - bulletY) / (ship.x - bullet.x);

		let distance = bullet.speed.value / tutils.SpeedFactor * Tracing.interval;
        let x = Math.sqrt(distance * distance / (k * k + 1));
        let y = ship.world.height - x * k;

		console.log("x" +x + "     y" +y  +"    k"+ k+"    k"+ k);

		let tw = egret.Tween.get(bullet.gameObject);
        tw.to({x: x, y: y}, Tracing.interval);
		tw.call(() => Tracing.tracingMethord(bullet, ship));
	}
}