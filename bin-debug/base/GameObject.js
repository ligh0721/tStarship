var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameObject = (function () {
    function GameObject() {
    }
    GameObject.prototype.create = function () {
        this.gameObject = this.onCreate();
        return this;
    };
    GameObject.prototype.set = function (prop) {
        if (prop.hasOwnProperty('x')) {
            this.gameObject.x = prop['x'];
        }
        if (prop.hasOwnProperty('y')) {
            this.gameObject.y = prop['y'];
        }
    };
    Object.defineProperty(GameObject.prototype, "x", {
        get: function () {
            return this.gameObject.x;
        },
        set: function (value) {
            this.gameObject.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "y", {
        get: function () {
            return this.gameObject.y;
        },
        set: function (value) {
            this.gameObject.y = value;
        },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.onCreate = function () {
        return this.gameObject;
    };
    return GameObject;
}());
__reflect(GameObject.prototype, "GameObject");
//# sourceMappingURL=GameObject.js.map