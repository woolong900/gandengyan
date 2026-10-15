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
if (!t || !t.isValid) return;
var o = t instanceof cc.Sprite ? t : t.getComponent(cc.Sprite);
if (!o) return void cc.error("set image node must have cc.Sprite component.");
var n = (o.__qjqpImgRequestId || 0) + 1;
o.__qjqpImgRequestId = n;
this.loadImg(e, function(e) {
o && o.isValid && o.__qjqpImgRequestId === n && (o.spriteFrame = e);
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
