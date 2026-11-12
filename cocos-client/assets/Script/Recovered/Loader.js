// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "80f85zsECxDWqMUu07MMJOi", "Loader");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
// These native atlas frames have no standalone resource-path entries in the
// recovered web bundle. Resolve the original UUIDs instead of substituting art.
var gdFrames = {
"Games/GdPoker/jipai_laizi": "669564c4-5601-480e-82e3-19447e687e32",
"Games/GdPoker/peipaibiao": "49f4d819-6b37-4a8e-97d9-48a5be5a44dc",
"Games/GdPoker/jinLog": "ca299d84-8f6a-4dac-adaf-ff281340bdae",
"Games/GdPoker/huanLog": "f5f2513b-3f44-4572-9226-797fb6d01655"
};
e.loadImg = function(e, t) {
if (gdFrames[e] && cc.assetManager && cc.assetManager.loadAny) {
cc.assetManager.loadAny({uuid: gdFrames[e], bundle: "resources"}, function(error, frame) {
error ? cc.error("Load Img Fail:", e, error) : t(frame);
});
return;
}
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
