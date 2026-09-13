// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ac10aNqb1NMtqvpcct22EVV", "TingTipNodeQJ");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./RoomInfoData"), c = e("./GameControl"), u = e("./GameInfoData"), d = e("./SoundUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.btnNode = null;
t.showRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.btnNode.active = !1;
i.default.eventUtils.on([ a.default.data_game_status_change ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on([ a.default.data_operated_change, a.default.data_get_card, a.default.data_put_card ], function(t, o) {
var n = l.default.myAbsolutePos();
o.pos === n && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
if (l.default.isWatcher()) return;
if (c.default.getInstance().isPlayingBeginAnimation) return;
this._uiDirty = !1;
var e = !1, t = l.default.myAbsolutePos();
if (l.default.gameInfo.status === u.eGameStatus.Gameing) {
l.default.gameInfo.siteInfos.get(t).bCanPutCard() || (e = !0);
}
if (!e) {
this._change(!1);
return;
}
var o = l.default.gameInfo.siteInfos.get(t);
if (i.default.gameLogic().tingCards(o).length <= 0) {
this._change(!1);
return;
}
this._change(!0);
}
};
t.prototype._change = function(e) {
if (this.btnNode.active === e) ; else {
this.btnNode.active = e;
this.showRoot.active = !1;
}
};
t.prototype.click = function() {
d.default.clickBtn();
this.showRoot.active = !this.showRoot.active;
};
r([ h(cc.Node) ], t.prototype, "btnNode", void 0);
r([ h(cc.Node) ], t.prototype, "showRoot", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
