// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d491aoofU1M4pKfo+GHP5q6", "DBDMyGameInfoCtr");
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
var i = e("./RoomInfoData"), a = e("./DBDEnum"), s = e("./gContext"), l = e("./DBDEventKeys"), c = e("./EventUtils"), u = e("./Loader"), d = e("./DBDCardUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._isShowRemainCards = !0;
t.dis_cardNode = null;
t.gameScoreLabel = null;
t.gameBombLabel = null;
t.titleLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.dis_cardNode.active = !0;
s.default.eventUtils.on(l.default.data_get_remain, function(t, o) {
e._setBottomCard();
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_score_update, function(t, o) {
e._updateScoreShow();
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_status_change, function() {
if (i.default.gameInfoDBD.status === a.eDBDGameStatus.JiaoDiZhu) {
e._isShowRemainCards = !0;
e._removeBottomCards();
}
}, this, c.eOffType.OnDestroy);
this._updateTitleString();
this._updateUI();
this._updateScoreShow();
i.default.gameInfoDBD.status !== a.eDBDGameStatus.Gameing && i.default.gameInfoDBD.status !== a.eDBDGameStatus.SingleEnd || this._setBottomCard();
};
t.prototype.update = function() {};
t.prototype._updateTitleString = function() {
var e = "本局叫分：";
i.default.config.isChecked(6) && (e = "池底池分：");
this.titleLabel.string = e;
};
t.prototype._updateScoreShow = function() {
var e = i.default.gameInfoDBD.boomNum, t = i.default.gameInfoDBD.betNum;
this.gameScoreLabel.string = t.toString();
this.gameBombLabel.string = e > 0 ? e.toString() : "- - -";
};
t.prototype._removeBottomCards = function() {
for (var e = 0; e < 5; e++) {
this.dis_cardNode.getChildByName("card_" + e).getComponent(cc.Sprite).spriteFrame = null;
}
};
t.prototype._setBottomCard = function() {
this._removeBottomCards();
var e = i.default.gameInfoDBD.bottomCard;
i.default.config.isChecked(8) && e.length > 0 && !i.default.isPlayback() && (e = [ 0, 0, 0, 0, 0 ]);
for (var t = 0; t < e.length; t++) {
var o = this.dis_cardNode.getChildByName("card_" + t), n = d.default.imgPath(e[t]);
u.default.setImg(n, o);
}
};
t.prototype.onBtnShowRemainCards = function() {
if (i.default.config.isChecked(8)) {
this._removeBottomCards();
var e = i.default.gameInfoDBD.bottomCard;
!this._isShowRemainCards && e.length > 0 && (e = [ 0, 0, 0, 0, 0 ]);
for (var t = 0; t < e.length; t++) {
var o = this.dis_cardNode.getChildByName("card_" + t), n = d.default.imgPath(e[t]);
u.default.setImg(n, o);
}
this._isShowRemainCards = !this._isShowRemainCards;
}
};
t.prototype._updateUI = function() {};
r([ h(cc.Node) ], t.prototype, "dis_cardNode", void 0);
r([ h(cc.Label) ], t.prototype, "gameScoreLabel", void 0);
r([ h(cc.Label) ], t.prototype, "gameBombLabel", void 0);
r([ h(cc.Label) ], t.prototype, "titleLabel", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
