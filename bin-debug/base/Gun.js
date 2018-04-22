var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Gun = (function () {
    function Gun() {
        this.interval = 200;
    }
    Gun.prototype.fire = function () {
        var _this = this;
        var bulletSpeed = 80;
        var n = 1;
        var _loop_1 = function (i) {
            var bullet = this_1.onCreateBullet();
            this_1.ship.world.addBullet(bullet);
            bullet.x = this_1.ship.x + (i - (n - 1) / 2) * 50;
            bullet.y = this_1.ship.y - this_1.ship.height * 0.5;
            var tw = egret.Tween.get(bullet.gameObject);
            var x = bullet.x;
            tw.to({ y: -this_1.ship.world.height * 0.2 }, (this_1.ship.y) / bulletSpeed * 100);
            tw.call(function () {
                _this.ship.world.removeBullet(bullet.id);
            });
            // let tw2 = egret.Tween.get(bullet.gameObject, {loop: true});
            // let a = 50;
            // tw2.to({x: x-a}, 100, egret.Ease.sineOut);
            // tw2.to({x: x}, 100, egret.Ease.sineIn);
            // tw2.to({x: x+a}, 100, egret.Ease.sineOut);
            // tw2.to({x: x}, 100, egret.Ease.sineIn);
        };
        var this_1 = this;
        for (var i = 0; i < n; i++) {
            _loop_1(i);
        }
    };
    Gun.prototype.autofire = function () {
        var tw = egret.Tween.get(this);
        tw.call(this.fire, this);
        tw.wait(this.interval);
        tw.call(this.autofire, this);
    };
    Gun.prototype.onCreateBullet = function () {
        var bullet = new Bullet(this);
        bullet.create();
        return bullet;
    };
    return Gun;
}());
__reflect(Gun.prototype, "Gun");
//# sourceMappingURL=Gun.js.map