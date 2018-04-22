var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(width, height) {
        var _this = _super.call(this) || this;
        _this.force = new Force();
        _this.speed = 100;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Ship.prototype.set = function (prop) {
        _super.prototype.set.call(this, prop);
        if (prop.hasOwnProperty('force')) {
            this.force.force = prop['force'];
        }
        if (prop.hasOwnProperty('speed')) {
            this.speed = prop.speed;
        }
    };
    Ship.prototype.addGun = function (gun) {
        this.gun = gun;
        gun.ship = this;
    };
    Ship.prototype.move = function (x, y) {
        var xx = x - this.gameObject.x;
        var yy = y - this.gameObject.y;
        var dis = Math.sqrt(xx * xx + yy * yy);
        var dur = dis * 100 / this.speed;
        egret.Tween.removeTweens(this.gameObject);
        var tw = egret.Tween.get(this.gameObject);
        tw.to({ x: x, y: y }, dur);
    };
    Ship.prototype.onCreate = function () {
        var gameObject = new egret.Shape();
        gameObject.graphics.lineStyle(10, 0xffffff);
        gameObject.graphics.moveTo(this.width * 0.5, 0);
        gameObject.graphics.lineTo(0, this.height);
        gameObject.graphics.lineTo(this.width, this.height);
        gameObject.graphics.lineTo(this.width * 0.5, 0);
        gameObject.anchorOffsetX = this.width * 0.5;
        gameObject.anchorOffsetY = this.height * 0.5;
        gameObject.graphics.endFill();
        return gameObject;
    };
    return Ship;
}(GameObject));
__reflect(Ship.prototype, "Ship");
//# sourceMappingURL=Ship.js.map