// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "08137kYdYxJq7JyaJCv/2vi", "TextureRender");
var n = this && this.__extends || function() {
var e = function(t, o) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) t.hasOwnProperty(o) && (e[o] = t[o]);
})(t, o);
};
return function(t, o) {
e(t, o);
function n() {
this.constructor = t;
}
t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype, new n());
};
}(), r = this && this.__decorate || function(e, t, o, n) {
var r, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, o, a) : r(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, a = i.ccclass, s = (i.property, function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.screenCapture = function(e, t, o, n) {
if (!cc.sys.isNative) return null;
var r = new cc.Node();
t = t || cc.director.getScene().getChildByName("Canvas");
r.parent = t;
o = o || t.getContentSize().width;
n = n || t.getContentSize().height;
var i = r.addComponent(cc.Camera), a = new cc.RenderTexture();
a.initWithSize(o, n);
i.targetTexture = a;
t.scaleY = -1;
i.render(t);
t.scaleY = 1;
var s = a.readPixels(), l = jsb.fileUtils.getWritablePath() + e;
jsb.fileUtils.isFileExist(l) && jsb.fileUtils.removeFile(l);
if (jsb.saveImageData(s, o, n, l)) {
cc.log("save image data success, file: " + l);
return l;
}
cc.error("save image data failed!");
r.removeFromParent();
r.destroy();
return null;
};
return t = r([ a ], t);
}(cc.Component));
o.default = s;
cc._RF.pop();
