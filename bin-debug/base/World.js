var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var World = (function () {
    function World(gameObject, width, height) {
        this.gameObject = gameObject;
        this.width = width;
        this.height = height;
        this.ships = {};
        this.bullets = {};
    }
    World.prototype.addShip = function (ship) {
        this.gameObject.addChild(ship.gameObject);
        ship.world = this;
        ship.id = this.nextId();
        this.ships[ship.id] = ship;
        return ship;
    };
    World.prototype.addBullet = function (bullet) {
        this.gameObject.addChild(bullet.gameObject);
        bullet.world = this;
        bullet.id = this.nextId();
        this.bullets[bullet.id] = bullet;
        return bullet;
    };
    World.prototype.removeBullet = function (id) {
        if (!this.bullets.hasOwnProperty(id.toString())) {
            console.log('bullets not found');
            return;
        }
        var bullet = this.bullets[id];
        this.gameObject.removeChild(bullet.gameObject);
        bullet.world = null;
        delete this.bullets[id];
    };
    World.prototype.step = function (dt) {
        for (var bulletId in this.bullets) {
        }
    };
    World.prototype.nextId = function () {
        return tutils.nextId();
    };
    return World;
}());
__reflect(World.prototype, "World");
//# sourceMappingURL=World.js.map