// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4e7bb4tAqtEmaL6GO+Krh7Z", "FullUpdate");
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
var i = e("./GameConfig"), a = e("./ExUtils"), s = e("./CommonEnum"), l = e("./Bridge"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._p = 0;
t.pNode = null;
t.pLabel = null;
return t;
}
t.prototype.download = function(e, t) {
var o = this, n = "com.yuanlai." + i.default.appName, r = a.default.getExternalStoragePath() + "/" + n + "/install", c = t;
a.default.httpDownload(e, r, c, function(n, i) {
if (n === s.eExCallBackMsg.success) {
l.default.utils.unregister("httpDownload");
a.default.installApk(r + "/" + c);
cc.game.end();
} else if (n === s.eExCallBackMsg.progress) {
var u = JSON.parse(i);
o._p = u.downloaded / u.total || 0;
o._uiDirty = !0;
} else if (n === s.eExCallBackMsg.fail) {
l.default.utils.unregister("httpDownload");
o.download(e, t);
} else cc.error("下载回调错误：" + n);
});
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateProgressUI();
}
};
t.prototype._updateProgressUI = function() {
var e = this._p;
if (this.node && this.node.isValid) {
this.pNode.width = 947 * e;
this.pLabel.string = (100 * e).toFixed(1) + "%";
}
};
r([ d(cc.Node) ], t.prototype, "pNode", void 0);
r([ d(cc.Label) ], t.prototype, "pLabel", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
