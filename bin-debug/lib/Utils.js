// TypeScript file
var tutils;
(function (tutils) {
    function createLayer(parent, color, alpha) {
        if (color === void 0) { color = 0x000000; }
        if (alpha === void 0) { alpha = 0.0; }
        var layer = new egret.Sprite();
        layer.graphics.beginFill(color, alpha);
        layer.graphics.drawRect(0, 0, parent.stage.stageWidth, parent.stage.stageHeight);
        console.log(parent.stage.stageWidth, parent.stage.stageHeight);
        layer.graphics.endFill();
        parent.addChild(layer);
        return layer;
    }
    tutils.createLayer = createLayer;
    var curId = 1000;
    function nextId() {
        curId++;
        return curId;
    }
    tutils.nextId = nextId;
})(tutils || (tutils = {}));
//# sourceMappingURL=Utils.js.map