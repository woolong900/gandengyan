// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c5df5PixqBBWYNRkF1f7A/Q", "PDKMyBtnPutCtr");
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
var i = require("./gContext"), a = require("./PDKEventKeys"), s = require("./RoomInfoData"), l = require("./EventUtils"), c = require("./PDKEnum"), u = require("./PDKMyCardsPointer"), d = require("./PDKCardUtils"), p = require("./SoundUtils"), f = require("./GameMsgPDK"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._chooseCardsDESC = [];
t.putBtn = null;
t.myCardsPointer = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!s.default.isWatcher()) {
this._updateUI();
i.default.eventUtils.on([ a.default.data_round_data_update ], function(t, o) {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
i.default.eventUtils.on([ a.default.ui_my_card_choose_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
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
var e = s.default.myAbsolutePos(), t = s.default.gameInfoPDK.siteInfos.get(e);
if (t.roundType === c.eRoundTypePDK.Turn) {
var o = t.turnType;
if (o !== c.ePDKTurnType.Last) {
if (o === c.ePDKTurnType.NoBigger) {
if (i.default.gameLogic(s.default.config.index).isAutoPass(s.default.config)) return;
}
this.putBtn.node.active = !0;
for (var n = [], r = s.default.gameInfoPDK.siteInfos.get(e).handCards, a = 0, l = r.length; a < l; a++) {
this.myCardsPointer.getCard(a).isChoose() && n.push(r[a]);
}
this._chooseCardsDESC = [].concat(n);
var u = s.default.gameInfoPDK.siteInfos.getLastPut(e);
if (u) {
var p = u.getPutCards(), f = u.putCardType;
d.default.compareToPut(this._chooseCardsDESC, p, f) > 0 ? this.putBtn.interactable = !0 : this.putBtn.interactable = !1;
} else this.putBtn.interactable = d.default.isValid(this._chooseCardsDESC, r.length);
}
}
};
t.prototype.onClick = function() {
var e = this;
p.default.clickBtn();
var t = s.default.myAbsolutePos(), o = s.default.gameInfoPDK.siteInfos.get(t);
if (o.turnType === c.ePDKTurnType.Hei3 && i.default.gameLogic(s.default.config.index).isHei3MustPut(s.default.config) && !d.default.checkHei3(this._chooseCardsDESC)) return i.default.uiHelper.showTip("黑桃3必须先出~");
if (1 === this._chooseCardsDESC.length) {
var n = s.default.config.peopleCount();
if (s.default.gameInfoPDK.siteInfos.getNext(t, n).isWarning()) {
var r = this._chooseCardsDESC[0];
if (d.default.value(r) !== d.default.value(o.handCards[0])) return i.default.uiHelper.showTip("下家已报单，必须出最大~");
}
}
if (5 !== this._chooseCardsDESC.length || 4 !== d.default.maxCount(this._chooseCardsDESC)) {
if (!this._checkPutWithRuleBombSplit()) return i.default.uiHelper.showTip("出牌不合规，炸弹不能拆~");
f.default.getInstance().putCard(this._chooseCardsDESC);
} else i.default.msgBox.show("玩法不支持4带1，此牌会当3带2，确定这样出？", function() {
f.default.getInstance().putCard(e._chooseCardsDESC);
});
};
t.prototype._checkPutWithRuleBombSplit = function() {
for (var e = [], t = s.default.myAbsolutePos(), o = s.default.gameInfoPDK.siteInfos.get(t).handCards, n = 0, r = o.length; n < r; n++) {
this.myCardsPointer.getCard(n).isChoose() && e.push(n);
}
return d.default.checkPutWithRuleBombSplit(e, o);
};
r([ y(cc.Button) ], t.prototype, "putBtn", void 0);
r([ y(u.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
