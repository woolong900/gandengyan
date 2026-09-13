// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "550f0lIOzFJJbtEskYgN55o", "PDKMyPiaoCtr");
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
var i = e("./RoomInfoData"), a = e("./gContext"), s = e("./PDKEnum"), l = e("./PDKEventKeys"), c = e("./EventUtils"), u = e("./SoundUtils"), d = e("./GameMsgPDK"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._values = [];
t.rootNode = null;
t.piaoBtns = [];
t.piaoDesc = [];
return t;
}
t.prototype.start = function() {
for (var e = this, t = i.default.isWatcher(), o = 0, n = this.piaoBtns.length; o < n; o++) {
this.piaoBtns[o].active = !1;
this.piaoBtns[o].getComponent(cc.Button).interactable = !t;
}
var r = a.default.gameLogic(i.default.config.index).piaoValues(i.default.config);
if (r.length > 0) {
this._values = r;
this.piaoBtns[0].active = !0;
for (o = 0, n = r.length; o < n; o++) {
this.piaoBtns[o + 1].active = !0;
this.piaoDesc[o].string = "飘 " + r[o];
}
}
a.default.eventUtils.on(l.default.data_status_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
a.default.eventUtils.on(l.default.data_piao_score_change, function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, c.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.rootNode.active = !1;
if (i.default.gameInfoPDK.status === s.ePDKGameStatus.Piaoing) {
var e = i.default.myAbsolutePos();
i.default.gameInfoPDK.siteInfos.get(e).bCanPiao() && (this.rootNode.active = !0);
}
};
t.prototype.onClickNotPiao = function(e) {
u.default.clickBtn();
d.default.getInstance().piao(0);
};
t.prototype.onClickPiao = function(e, t) {
u.default.clickBtn();
var o = this._values[t];
d.default.getInstance().piao(o);
};
r([ h(cc.Node) ], t.prototype, "rootNode", void 0);
r([ h(cc.Node) ], t.prototype, "piaoBtns", void 0);
r([ h(cc.Label) ], t.prototype, "piaoDesc", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
