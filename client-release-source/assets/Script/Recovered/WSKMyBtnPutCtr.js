// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "cfb45X0lQpOaoGdJKvjEh4l", "WSKMyBtnPutCtr");
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
var i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./GameLogicWSK"), c = require("./SoundUtils"), u = require("./gContext"), d = require("./GameMsgWSK"), p = require("./WSKEnum"), f = require("./WSKEventKeys"), h = require("./WSKMyCardsPointer"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._chooseCards = [];
t._chooseCardsInfo = [];
t.putBtn = null;
t.myCardsPointer = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!a.default.isWatcher()) {
u.default.eventUtils.on([ f.default.data_round_change, f.default.data_status_change ], function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
u.default.eventUtils.on([ f.default.ui_my_card_choose_change ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.putBtn.node.active = !1;
if (a.default.gameInfoWSK.status === p.eWSKGameStatus.Gameing) {
var e = a.default.myAbsolutePos();
if (a.default.gameInfoWSK.siteInfos.get(e).roundType === p.eWSKRoundType.Turn) {
this.putBtn.node.active = !0;
for (var t = [], o = a.default.gameInfoWSK.siteInfos.get(e).handCards, n = 0, r = o.length; n < r; n++) {
this.myCardsPointer.getCard(n).isChoose() && t.push(o[n]);
}
this._chooseCards = [].concat(t);
var i = a.default.gameInfoWSK.siteInfos.getLastPut(e);
if (i) {
var s = i.putVirtualCards, l = i.putType;
this._chooseCardsInfo = u.default.gameLogic().compareToPut(this._chooseCards, s, l);
} else this._chooseCardsInfo = u.default.gameLogic().oneHandInfo(this._chooseCards);
this.putBtn.interactable = this._chooseCardsInfo.length > 0;
}
}
};
t.prototype.onClick = function() {
c.default.clickBtn();
if (this._chooseCardsInfo.length < 1) {
var e = a.default.myAbsolutePos(), t = a.default.gameInfoWSK.siteInfos.getLastPut(e);
return u.default.uiHelper.showTip(t && 0 === u.default.gameLogic().tip(a.default.gameInfoWSK.siteInfos.get(e).handCards, t.putVirtualCards, t.putType).tips.length ? "没有牌大过对方" : "请选择要出的牌");
}
if (this._chooseCardsInfo.length > 1) cc.error("有癞子逻辑可能选中出啥牌，需要实现选择界面"); else {
if (a.default.config.index === i.eGameIds.QJWSKBD && this._chooseCardsInfo[0].type === l.eWSKOneHandType.Single) {
e = a.default.config.peopleCount();
if (a.default.gameInfoWSK.siteInfos.isNextWaring(a.default.myAbsolutePos(), e)) {
var t = this._chooseCards[0], o = u.default.gameLogic().cardValue(t), n = a.default.myAbsolutePos(), r = a.default.gameInfoWSK.siteInfos.get(n), s = u.default.gameLogic().sortDesc(r.handCards);
if (o !== u.default.gameLogic().cardValue(s[0])) return u.default.uiHelper.showTip("下家已报单，必须出最大单张~");
}
}
if (a.default.config.index === i.eGameIds.XSWSK) {
var p = [ 0 ].concat(this._chooseCards);
d.default.getInstance().putCard(p, this._chooseCardsInfo[0].cards);
} else d.default.getInstance().putCard(this._chooseCards, this._chooseCardsInfo[0].cards);
}
};
r([ g(cc.Button) ], t.prototype, "putBtn", void 0);
r([ g(h.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
