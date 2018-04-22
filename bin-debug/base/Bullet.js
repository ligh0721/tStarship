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
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(from) {
        var _this = _super.call(this) || this;
        _this.from = from;
        return _this;
    }
    Bullet.prototype.onCreate = function () {
        var bullet = new egret.Shape();
        bullet.graphics.beginFill(0xffffff, 1.0);
        bullet.graphics.drawCircle(0, 0, 5);
        bullet.graphics.endFill();
        return bullet;
    };
    return Bullet;
}(GameObject));
__reflect(Bullet.prototype, "Bullet");
//# sourceMappingURL=Bullet.js.map