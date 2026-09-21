// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "77708RYJWJBnY5R9Cmq0g4+", "D7MyOperateBarCtr");
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
var i = require("./RoomInfoData"), a = require("./D7Enum"), s = require("./UserData"), l = require("./D7CardUtils"), c = require("./D7GameInfoData"), u = require("./gContext"), d = require("./EventUtils"), p = require("./D7EventKeys"), f = require("./SoundUtils"), h = require("./GameMsgD7"), m = require("./CommonUtils"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btnHei = null;
t.btnHong = null;
t.btnMei = null;
t.btnFang = null;
t.btnXiaoWang = null;
t.btnDaWang = null;
t.btnXiaoHua = null;
t.btnDaHua = null;
t.btnPass = null;
return t;
}
t.prototype.start = function() {
var e = this;
u.default.eventUtils.on([ p.default.data_zhuang_change, p.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, d.eOffType.OnDestroy);
u.default.eventUtils.on([ p.default.data_fan_turn, p.default.data_fan_guo, p.default.data_fan_ok ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, d.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.btnHei.node.active = !1;
this.btnHong.node.active = !1;
this.btnMei.node.active = !1;
this.btnFang.node.active = !1;
this.btnXiaoWang.node.active = !1;
this.btnDaWang.node.active = !1;
this.btnXiaoHua.node.active = !1;
this.btnDaHua.node.active = !1;
this.btnPass.node.active = !1;
this.btnHei.interactable = !1;
this.btnHong.interactable = !1;
this.btnMei.interactable = !1;
this.btnFang.interactable = !1;
this.btnXiaoWang.interactable = !1;
this.btnDaWang.interactable = !1;
this.btnXiaoHua.interactable = !1;
this.btnDaHua.interactable = !1;
this.btnPass.interactable = !1;
if (i.default.gameInfoD7.status === a.eD7GameStatus.Calling) {
if (i.default.gameInfoD7.getRemainInfo.uid > 0) return;
var e = i.default.gameInfoD7.roundData();
if (e.type === c.eRoundTypeD7.Fan) {
var t = e.lastAction();
if (!t || t.state !== c.eRoundStateD7.Turn) return;
var o = i.default.players.getByUid(s.default.uid).pos;
if (t.pos !== o) return;
this.btnHei.node.active = !0;
this.btnHong.node.active = !0;
this.btnMei.node.active = !0;
this.btnFang.node.active = !0;
this.btnXiaoWang.node.active = !0;
this.btnDaWang.node.active = !0;
this.btnXiaoHua.node.active = !0;
this.btnDaHua.node.active = !0;
this.btnPass.node.active = !0;
this.btnPass.interactable = !0;
var n = t.cards[0];
this.btnFang.interactable = m.default.checkBit(n, 1);
this.btnMei.interactable = m.default.checkBit(n, 2);
this.btnHong.interactable = m.default.checkBit(n, 4);
this.btnHei.interactable = m.default.checkBit(n, 8);
this.btnXiaoWang.interactable = m.default.checkBit(n, 16);
this.btnDaWang.interactable = m.default.checkBit(n, 32);
this.btnXiaoHua.interactable = m.default.checkBit(n, 64);
this.btnDaHua.interactable = m.default.checkBit(n, 128);
}
}
};
t.prototype.onClickHei = function() {
var e = l.default.card(l.eD7CardColor.Hei, l.D7_Fix_Main);
this._click(e);
};
t.prototype.onClickHong = function() {
var e = l.default.card(l.eD7CardColor.Hong, l.D7_Fix_Main);
this._click(e);
};
t.prototype.onClickMei = function() {
var e = l.default.card(l.eD7CardColor.Mei, l.D7_Fix_Main);
this._click(e);
};
t.prototype.onClickFang = function() {
var e = l.default.card(l.eD7CardColor.Fang, l.D7_Fix_Main);
this._click(e);
};
t.prototype.onClickXiaoWang = function() {
this._click(l.D7_XiaoWang);
};
t.prototype.onClickDaWang = function() {
this._click(l.D7_DaWang);
};
t.prototype.onClickXiaoHua = function() {
this._click(l.D7_XiaoHua);
};
t.prototype.onClickDaHua = function() {
this._click(l.D7_DaHua);
};
t.prototype.onClickPass = function() {
f.default.clickBtn();
h.default.getInstance().pass();
};
t.prototype._click = function(e) {
f.default.clickBtn();
h.default.getInstance().callMain(e);
};
r([ _(cc.Button) ], t.prototype, "btnHei", void 0);
r([ _(cc.Button) ], t.prototype, "btnHong", void 0);
r([ _(cc.Button) ], t.prototype, "btnMei", void 0);
r([ _(cc.Button) ], t.prototype, "btnFang", void 0);
r([ _(cc.Button) ], t.prototype, "btnXiaoWang", void 0);
r([ _(cc.Button) ], t.prototype, "btnDaWang", void 0);
r([ _(cc.Button) ], t.prototype, "btnXiaoHua", void 0);
r([ _(cc.Button) ], t.prototype, "btnDaHua", void 0);
r([ _(cc.Button) ], t.prototype, "btnPass", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = v;
cc._RF.pop();
