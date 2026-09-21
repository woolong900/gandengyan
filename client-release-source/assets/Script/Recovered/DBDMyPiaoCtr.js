// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a02a78NsqBHV6mLQOooHKnE", "DBDMyPiaoCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./DBDEnum"), l = require("./DBDEventKeys"), c = require("./EventUtils"), u = require("./SoundUtils"), d = require("./GameMsgDBD"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._values = [];
t.opearteNode1 = null;
t.opearteNode2 = null;
t.jiaoValueNode = null;
t.bujiaoNode = null;
t.piaoBtns = [];
t.piaoDesc = [];
t.jdz_label = null;
t.bj_label = null;
return t;
}
t.prototype.start = function() {
for (var e = this, t = 0, o = this.piaoBtns.length; t < o; t++) this.piaoBtns[t].active = !1;
a.default.eventUtils.on(l.default.data_status_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
a.default.eventUtils.on(l.default.data_round_data_update, function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, c.eOffType.OnDestroy);
a.default.eventUtils.on(l.default.ui_jiaodizhu_change, function(t, o) {
if (o.pos === i.default.myAbsolutePos()) {
e.opearteNode1.active = !1;
e.opearteNode2.active = !1;
}
}, this, c.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateOpearteNodeInfo = function(e) {
var t = 164 * e > 820 ? 820 : 164 * e;
this.jiaoValueNode.width = t;
this.bujiaoNode.x = -1 * (t / 2 + 25);
};
t.prototype._updateBidScoreShow = function(e) {
var t = e || [];
this._values = t;
this._updateOpearteNodeInfo(t.length);
for (var o = 0, n = t.length; o < n; o++) {
this.piaoDesc[o].string = t[o].toString();
this.piaoBtns[o].active = !0;
}
};
t.prototype._updateUI = function() {
this.opearteNode1.active = !1;
this.opearteNode2.active = !1;
for (var e = 0, t = this.piaoBtns.length; e < t; e++) this.piaoBtns[e].active = !1;
if (i.default.gameInfoDBD.status === s.eDBDGameStatus.JiaoDiZhu) {
var o = i.default.myAbsolutePos(), n = i.default.gameInfoDBD.siteInfos.get(o), r = n.roundType, a = n.jiaoDizhuType(), l = n.getCurBidScore(), c = !0;
if (r > 0) {
if (i.default.config.isChecked(6)) {
c = !0;
this._updateBidScoreShow(l);
} else c = !1;
c || this._updateBtnShow(a);
this.opearteNode1.active = c;
this.opearteNode2.active = !c;
} else {
this.opearteNode1.active = !1;
this.opearteNode2.active = !1;
}
} else {
this.opearteNode1.active = !1;
this.opearteNode2.active = !1;
}
};
t.prototype._updateBtnShow = function(e) {
if (1 === e) {
this.jdz_label.string = "叫地主";
this.bj_label.string = "不叫";
}
if (2 === e) {
this.jdz_label.string = "抢地主";
this.bj_label.string = "不抢";
}
};
t.prototype.onClickNotJiao = function(e) {
u.default.clickBtn();
d.default.getInstance().jiaodizhu(0);
};
t.prototype.onClickJiao = function(e, t) {
u.default.clickBtn();
var o = this._values[t];
999 === t ? d.default.getInstance().jiaodizhu(0) : i.default.config.isChecked(6) ? d.default.getInstance().jiaodizhu(o) : d.default.getInstance().jiaodizhu(1);
};
r([ h(cc.Node) ], t.prototype, "opearteNode1", void 0);
r([ h(cc.Node) ], t.prototype, "opearteNode2", void 0);
r([ h(cc.Node) ], t.prototype, "jiaoValueNode", void 0);
r([ h(cc.Node) ], t.prototype, "bujiaoNode", void 0);
r([ h(cc.Node) ], t.prototype, "piaoBtns", void 0);
r([ h(cc.Label) ], t.prototype, "piaoDesc", void 0);
r([ h(cc.Label) ], t.prototype, "jdz_label", void 0);
r([ h(cc.Label) ], t.prototype, "bj_label", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
