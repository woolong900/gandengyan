// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "78922wwGlJIaIzNGX/caqEk", "WSKRecordCardCtr");
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
var i = require("./RoomInfoData"), a = require("./EventUtils"), s = require("./GameLogicWSK"), l = require("./CommonUtils"), c = require("./SoundUtils"), u = require("./gContext"), d = require("./WSKEnum"), p = require("./WSKEventKeys"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btnNode = null;
t.detailsNode = null;
t.scoreLabel = null;
t.countDW = null;
t.countXW = null;
t.count2 = null;
t.countA = null;
t.count5_Hei = null;
t.count10_Hei = null;
t.countK_Hei = null;
t.count5_Hong = null;
t.count10_Hong = null;
t.countK_Hong = null;
t.count5_Mei = null;
t.count10_Mei = null;
t.countK_Mei = null;
t.count5_Fang = null;
t.count10_Fang = null;
t.countK_Fang = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!i.default.isWatcher()) {
if (u.default.gameLogic().isRecordCard(i.default.config)) {
this.btnNode.active = !0;
u.default.eventUtils.on([ p.default.data_round_change, p.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
this._updateUI();
}
}
};
t.prototype._upateItemV = function(e, t, o) {
for (var n = 0, r = 0, i = e.length; r < i; r++) {
var a = e[r];
o === u.default.gameLogic().cardValue(a) && n++;
}
t.string = "" + n;
return n;
};
t.prototype._upateItemVC = function(e, t, o, n) {
for (var r = 0, i = 0, a = e.length; i < a; i++) {
var s = e[i], l = u.default.gameLogic().cardValue(s), c = u.default.gameLogic().cardColor(s);
o === l && n === c && r++;
}
t.string = "" + r;
return r;
};
t.prototype._updateUI = function() {
if (this.detailsNode.active) if (i.default.gameInfoWSK.status !== d.eWSKGameStatus.Gameing) {
this.countDW.string = "?";
this.countXW.string = "?";
this.count2.string = "?";
this.countA.string = "?";
this.countK_Hei.string = "?";
this.countK_Hong.string = "?";
this.countK_Mei.string = "?";
this.countK_Fang.string = "?";
this.count10_Hei.string = "?";
this.count10_Hong.string = "?";
this.count10_Mei.string = "?";
this.count10_Fang.string = "?";
this.count5_Hei.string = "?";
this.count5_Hong.string = "?";
this.count5_Mei.string = "?";
this.count5_Fang.string = "?";
this.scoreLabel.string = "?";
} else {
var e = i.default.gameInfoWSK.allPutCards, t = i.default.gameInfoWSK.siteInfos.get(i.default.myAbsolutePos()).handCards, o = u.default.gameLogic().allCards(i.default.config), n = [].concat(t).concat(e), r = l.default.removeArrayList(o, n);
this._upateItemV(r, this.countDW, s.WSK_Card_Value_DW);
this._upateItemV(r, this.countXW, s.WSK_Card_Value_XW);
this._upateItemV(r, this.count2, s.WSK_Card_Value_2);
this._upateItemV(r, this.countA, s.WSK_Card_Value_A);
this._upateItemVC(r, this.countK_Hei, s.WSK_Card_Value_K, s.eWSKCardColor.Hei);
this._upateItemVC(r, this.countK_Hong, s.WSK_Card_Value_K, s.eWSKCardColor.Hong);
this._upateItemVC(r, this.countK_Mei, s.WSK_Card_Value_K, s.eWSKCardColor.Mei);
this._upateItemVC(r, this.countK_Fang, s.WSK_Card_Value_K, s.eWSKCardColor.Fang);
this._upateItemVC(r, this.count10_Hei, s.WSK_Card_Value_10, s.eWSKCardColor.Hei);
this._upateItemVC(r, this.count10_Hong, s.WSK_Card_Value_10, s.eWSKCardColor.Hong);
this._upateItemVC(r, this.count10_Mei, s.WSK_Card_Value_10, s.eWSKCardColor.Mei);
this._upateItemVC(r, this.count10_Fang, s.WSK_Card_Value_10, s.eWSKCardColor.Fang);
this._upateItemVC(r, this.count5_Hei, s.WSK_Card_Value_5, s.eWSKCardColor.Hei);
this._upateItemVC(r, this.count5_Hong, s.WSK_Card_Value_5, s.eWSKCardColor.Hong);
this._upateItemVC(r, this.count5_Mei, s.WSK_Card_Value_5, s.eWSKCardColor.Mei);
this._upateItemVC(r, this.count5_Fang, s.WSK_Card_Value_5, s.eWSKCardColor.Fang);
for (var a = 0, c = 0, p = r.length; c < p; c++) a += u.default.gameLogic().score(r[c]);
this.scoreLabel.string = "" + a;
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.onClick = function() {
c.default.clickBtn();
this.detailsNode.active ? this.detailsNode.active = !1 : this.detailsNode.active = !0;
this._uiDirty = !0;
};
r([ m(cc.Node) ], t.prototype, "btnNode", void 0);
r([ m(cc.Node) ], t.prototype, "detailsNode", void 0);
r([ m(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ m(cc.Label) ], t.prototype, "countDW", void 0);
r([ m(cc.Label) ], t.prototype, "countXW", void 0);
r([ m(cc.Label) ], t.prototype, "count2", void 0);
r([ m(cc.Label) ], t.prototype, "countA", void 0);
r([ m(cc.Label) ], t.prototype, "count5_Hei", void 0);
r([ m(cc.Label) ], t.prototype, "count10_Hei", void 0);
r([ m(cc.Label) ], t.prototype, "countK_Hei", void 0);
r([ m(cc.Label) ], t.prototype, "count5_Hong", void 0);
r([ m(cc.Label) ], t.prototype, "count10_Hong", void 0);
r([ m(cc.Label) ], t.prototype, "countK_Hong", void 0);
r([ m(cc.Label) ], t.prototype, "count5_Mei", void 0);
r([ m(cc.Label) ], t.prototype, "count10_Mei", void 0);
r([ m(cc.Label) ], t.prototype, "countK_Mei", void 0);
r([ m(cc.Label) ], t.prototype, "count5_Fang", void 0);
r([ m(cc.Label) ], t.prototype, "count10_Fang", void 0);
r([ m(cc.Label) ], t.prototype, "countK_Fang", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
