// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "58dedVgsZVIGKuUhyrP0Jpm", "WSKRoundDetailsCtr");
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
var i = e("./CommonEnum"), a = e("./RoomInfoData"), s = e("./EventUtils"), l = e("./SoundUtils"), c = e("./gContext"), u = e("./WSKEnum"), d = e("./WSKEventKeys"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rootNode = null;
t.layerPre = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.rootNode.active = !1;
if (!(a.default.isPlayback() || a.default.isWatcher() || a.default.config.index !== i.eGameIds.QJSHZ && a.default.config.index !== i.eGameIds.QJWSKBD && a.default.config.index !== i.eGameIds.QCDG && a.default.config.index !== i.eGameIds.XSWSK)) {
c.default.eventUtils.on(d.default.data_status_change, function() {
e._updateUI();
}, this, s.eOffType.OnDestroy);
this._updateUI();
}
};
t.prototype._updateUI = function() {
a.default.gameInfoWSK.status === u.eWSKGameStatus.Gameing ? this.rootNode.active = !0 : this.rootNode.active = !1;
};
t.prototype.onClick = function() {
l.default.clickBtn();
c.default.uiHelper.gameShow(this.layerPre);
};
r([ h(cc.Node) ], t.prototype, "rootNode", void 0);
r([ h(cc.Prefab) ], t.prototype, "layerPre", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
