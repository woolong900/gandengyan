// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "80f85zsECxDWqMUu07MMJOi", "Loader");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.loadImg = function(e, t) {
var o = cc.loader.getRes(e, cc.SpriteFrame);
o ? t(o) : cc.loader.loadRes(e, cc.SpriteFrame, function(o, n) {
o ? cc.error("Load Img Fail:", e) : t(n);
});
};
e.setImg = function(e, t) {
this.loadImg(e, function(e) {
if (t && t.isValid) if (t instanceof cc.Sprite) t.spriteFrame = e; else {
var o = t.getComponent(cc.Sprite);
o ? o.spriteFrame = e : cc.error("set image node must have cc.Sprite component.");
}
});
};
e.loadPre = function(e, t) {
var o = cc.loader.getRes(e, cc.Prefab);
o ? t(o) : cc.loader.loadRes(e, cc.Prefab, function(o, n) {
o ? cc.error("Load Prefab Fail:", e) : t(n);
});
};
return e;
}();
o.default = n;
cc._RF.pop();
