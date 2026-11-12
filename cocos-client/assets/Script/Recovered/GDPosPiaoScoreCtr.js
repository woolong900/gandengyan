// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "992d5euiqhJKYcITFi21nU/", "GDPosPiaoScoreCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./EventUtils"), l = require("./GDPosCtr"), c = require("./GDEventKeys"), u = require("./GDEnum"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.posCtr = null;
t.shibaiTxt = null;
t.shengliTxt = null;
t.shibai = null;
t.shengli = null;
t.shuangShang = null;
t.shuangXia = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(c.default.data_piao_score_change, function(t, o) {
o.pos === e.posCtr.deskPos() && u.eGDGameStatus.SingleEnd == i.default.gameInfoGD.status && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(c.default.data_piao_score_change_hide, function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(c.default.end_shuangshang, function(t, o) {
if (0 == e.posCtr.uiPos) {
var n = a.default.gameLogic(i.default.config.index).isErRen(i.default.config), r = e.posCtr.deskPos(), s = i.default.gameInfoGD.siteInfos.get(r);
if (n) {
e.shuangShang.active = !1;
e.shuangXia.active = !1;
} else if (i.default.gameInfoGD.endShuangShang) s.endScore >= 0 ? e.shuangShang.active = !0 : e.shuangXia.active = !0; else {
e.shuangShang.active = !1;
e.shuangXia.active = !1;
}
}
}, this, s.eOffType.OnDestroy);
if (u.eGDGameStatus.SingleEnd == i.default.gameInfoGD.status) {
if (0 != this.posCtr.uiPos) return;
var t = a.default.gameLogic(i.default.config.index).isErRen(i.default.config), o = this.posCtr.deskPos(), n = i.default.gameInfoGD.siteInfos.get(o);
if (t) {
this.shuangShang.active = !1;
this.shuangXia.active = !1;
} else if (i.default.gameInfoGD.endShuangShang) n.endScore >= 0 ? this.shuangShang.active = !0 : this.shuangXia.active = !0; else {
this.shuangShang.active = !1;
this.shuangXia.active = !1;
}
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.shibai.active = !1;
this.shengli.active = !1;
if (u.eGDGameStatus.SingleEnd == i.default.gameInfoGD.status) {
var e = this.posCtr.deskPos(), t = i.default.gameInfoGD.siteInfos.get(e);
if (!t) return;
if (t.endScore >= 0) {
this.shengliTxt.string = "+" + t.endScore / 10;
this.shengli.active = !0;
} else {
this.shibaiTxt.string = t.endScore / 10 + "";
this.shibai.active = !0;
}
}
};
r([ f(l.default) ], t.prototype, "posCtr", void 0);
r([ f(cc.Label) ], t.prototype, "shibaiTxt", void 0);
r([ f(cc.Label) ], t.prototype, "shengliTxt", void 0);
r([ f(cc.Node) ], t.prototype, "shibai", void 0);
r([ f(cc.Node) ], t.prototype, "shengli", void 0);
r([ f(cc.Node) ], t.prototype, "shuangShang", void 0);
r([ f(cc.Node) ], t.prototype, "shuangXia", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
