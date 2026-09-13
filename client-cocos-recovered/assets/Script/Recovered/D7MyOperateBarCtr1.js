// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ab9348usIZEZZl1vpVJZXQa", "D7MyOperateBarCtr1");
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
var i = e("./gContext"), a = e("./D7EventKeys"), s = e("./EventUtils"), l = e("./RoomInfoData"), c = e("./D7Enum"), u = e("./D7CardUtils"), d = e("./UserData"), p = e("./D7GameInfoData"), f = e("./CommonUtils"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.rootLayout = null;
t.btnHei = null;
t.btnHong = null;
t.btnMei = null;
t.btnFang = null;
t.btnPass = null;
t.callingFlag = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on([ a.default.data_zhuang_change, a.default.data_status_change, a.default.data_wating_jiao_time_change ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on([ a.default.data_hand_card_add ], function(t, o) {
if (l.default.gameInfoD7.status === c.eD7GameStatus.Sending) {
if (o.pos === l.default.myAbsolutePos()) {
var n = o.cards;
if (n && 1 === n.length) {
var r = n[0];
u.default.value(r) === u.D7_Fix_Main && (e._uiDirty = !0);
}
}
}
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on([ a.default.data_jiao_turn, a.default.data_jiao_guo, a.default.data_jiao_ok ], function(t, o) {
o.pos === l.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.rootLayout.node.active = !1;
this.callingFlag.active = !1;
this.btnHei.node.active = !1;
this.btnHong.node.active = !1;
this.btnMei.node.active = !1;
this.btnFang.node.active = !1;
this.btnPass.node.active = !1;
this.btnHei.interactable = !1;
this.btnHong.interactable = !1;
this.btnMei.interactable = !1;
this.btnFang.interactable = !1;
this.btnPass.interactable = !0;
var e = l.default.gameInfoD7.status;
if (e === c.eD7GameStatus.Sending) this._showQiangJiao(); else if (e === c.eD7GameStatus.Calling) {
if (l.default.gameInfoD7.getRemainInfo.uid > 0) return;
var t = l.default.gameInfoD7.roundData();
if (t.type === p.eRoundTypeD7.Jiao) {
var o = t.lastAction();
if (o && o.state === p.eRoundStateD7.Turn) {
var n = l.default.players.getByUid(d.default.uid).pos;
if (o.pos !== n) return;
this.rootLayout.node.active = !0;
this.rootLayout.spacingX = 25;
this.btnHei.node.active = !0;
this.btnHong.node.active = !0;
this.btnMei.node.active = !0;
this.btnFang.node.active = !0;
this.btnPass.node.active = !0;
this.btnPass.interactable = !0;
var r = o.cards[0];
this.btnFang.interactable = f.default.checkBit(r, 1);
this.btnMei.interactable = f.default.checkBit(r, 2);
this.btnHong.interactable = f.default.checkBit(r, 4);
this.btnHei.interactable = f.default.checkBit(r, 8);
}
} else if (t.type === p.eRoundTypeD7.Fan) ; else {
l.default.gameInfoD7.waitingJiaoEndTime() - d.default.millisecond > 0 && this._showQiangJiao();
}
}
};
t.prototype._showQiangJiao = function() {
if (!(l.default.gameInfoD7.zhuangUid > 0)) {
this.callingFlag.active = !0;
this.rootLayout.node.active = !0;
this.rootLayout.spacingX = 63;
this.btnHei.node.active = !0;
this.btnHong.node.active = !0;
this.btnMei.node.active = !0;
this.btnFang.node.active = !0;
if (l.default.isWatcher()) {
this.btnHei.interactable = !1;
this.btnHong.interactable = !1;
this.btnMei.interactable = !1;
this.btnFang.interactable = !1;
} else for (var e = l.default.players.getByUid(d.default.uid).pos, t = l.default.gameInfoD7.siteInfos.get(e).handCards, o = 0, n = t.length; o < n; o++) {
var r = t[o];
if (u.default.value(r) === u.D7_Fix_Main) {
var i = u.default.color(r);
i === u.eD7CardColor.Hei && (this.btnHei.interactable = !0);
i === u.eD7CardColor.Hong && (this.btnHong.interactable = !0);
i === u.eD7CardColor.Mei && (this.btnMei.interactable = !0);
i === u.eD7CardColor.Fang && (this.btnFang.interactable = !0);
}
}
}
};
r([ y(cc.Layout) ], t.prototype, "rootLayout", void 0);
r([ y(cc.Button) ], t.prototype, "btnHei", void 0);
r([ y(cc.Button) ], t.prototype, "btnHong", void 0);
r([ y(cc.Button) ], t.prototype, "btnMei", void 0);
r([ y(cc.Button) ], t.prototype, "btnFang", void 0);
r([ y(cc.Button) ], t.prototype, "btnPass", void 0);
r([ y(cc.Node) ], t.prototype, "callingFlag", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
