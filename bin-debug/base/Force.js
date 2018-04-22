var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ForceEffective;
(function (ForceEffective) {
    ForceEffective[ForceEffective["kSelf"] = 1] = "kSelf";
    ForceEffective[ForceEffective["kOwn"] = 2] = "kOwn";
    ForceEffective[ForceEffective["kAlly"] = 4] = "kAlly";
    ForceEffective[ForceEffective["kEnemy"] = 8] = "kEnemy";
})(ForceEffective || (ForceEffective = {}));
var Force = (function () {
    function Force() {
        this.forceFlag = 0;
        this.allyMaskFlag = 0;
    }
    Object.defineProperty(Force.prototype, "force", {
        get: function () {
            return this.forceFlag != 0 ? Math.log(this.forceFlag) / Math.LN2 : -1;
        },
        set: function (value) {
            this.forceFlag = 1 << value;
        },
        enumerable: true,
        configurable: true
    });
    // it ONLY means that force is my ally
    Force.prototype.isMyAlly = function (force) {
        return (this.forceFlag == force.forceFlag) || ((this.allyMaskFlag & force.forceFlag) != 0);
    };
    // it ONLY means that force is my enemy
    Force.prototype.isMyEnemy = function (force) {
        return !this.isMyAlly(force);
    };
    // the result of 'this.canEffect(force)' is not always same as 'force.canEffect(this)'
    // it ONLY means that 'this' can effect 'force'
    Force.prototype.canEffect = function (force, effectiveTypeFlags) {
        return ((this == force) && (effectiveTypeFlags & ForceEffective.kSelf) != 0) ||
            ((this != force) && (this.isMyAlly(force) && (effectiveTypeFlags & ForceEffective.kAlly) != 0)) ||
            (this.isMyEnemy(force) && (effectiveTypeFlags & ForceEffective.kEnemy) != 0);
    };
    return Force;
}());
__reflect(Force.prototype, "Force");
//# sourceMappingURL=Force.js.map