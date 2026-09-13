// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3cad4aOWtJMra2JDfOqjyhO", "DDZMyGameInfoCtr");
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
var i = e("./RoomInfoData"), a = e("./DDZEnum"), s = e("./gContext"), l = e("./DDZEventKeys"), c = e("./EventUtils"), u = e("./Loader"), d = e("./DDZCardUtils"), p = e("./DDZRoomUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._isShowRemainCards = !0;
t.viewPos = -1;
t._maxFlip = 3;
t._curFlip = 0;
t.dis_cardNode = null;
t.gameScoreLabel = null;
t.gameBombLabel = null;
t.titleLabel = null;
t.laizi_cardNode = null;
t.laizi_cardNode_di = null;
t.laizi_cardNode_ani = null;
t.bottomCardLaizi = null;
t.bottomCardLaizi_parent = null;
t.dz_ani = null;
t.dzSign = [];
return t;
}
t.prototype.start = function() {
var e = this;
this.dis_cardNode.active = !1;
s.default.eventUtils.on(l.default.data_get_remain, function(t, o) {
e._setBottomCard();
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.ui_dzlog_update, function(t, o) {
e.dzAnimPlay();
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_score_update, function(t, o) {
e._updateScoreShow();
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.playback_data_remain, function() {
e._removeBottomCards();
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_status_change, function() {
if (i.default.gameInfoDDZ.status === a.eDDZGameStatus.JiaoDiZhu) {
e._isShowRemainCards = !0;
e._removeBottomCards();
}
}, this, c.eOffType.OnDestroy);
this._updateUI();
this._updateScoreShow();
i.default.gameInfoDDZ.status !== a.eDDZGameStatus.Gameing && i.default.gameInfoDDZ.status !== a.eDDZGameStatus.SingleEnd || this._setBottomCard(!0);
};
t.prototype.update = function() {};
t.prototype._updateTitleString = function() {
var e = "本局叫分：";
i.default.config.isChecked(6) && (e = "池底池分：");
this.titleLabel.string = e;
};
t.prototype._updateScoreShow = function() {
var e = i.default.gameInfoDDZ.boomNum, t = i.default.gameInfoDDZ.betNum;
this.gameScoreLabel.string = t.toString();
this.gameBombLabel.string = e > 0 ? e.toString() : "0";
};
t.prototype._removeBottomCards = function() {
this.dis_cardNode.active = !1;
this.bottomCardLaizi_parent.active = !1;
this.bottomCardLaizi.getComponent(cc.Sprite).spriteFrame = null;
for (var e = 0; e < 4; e++) {
this.dis_cardNode.getChildByName("card_" + e).getComponent(cc.Sprite).spriteFrame = null;
}
};
t.prototype._setBottomCard = function(e) {
void 0 === e && (e = !1);
this._removeBottomCards();
var t = i.default.gameInfoDDZ.bottomCard, o = 10 * i.default.gameInfoDDZ.m_iLaiziValue;
4 == t.length ? this.dis_cardNode.width = 0 != o ? 300 : 237 : this.dis_cardNode.width = 0 != o ? 270 : 203;
0 != t[0] && (this.dis_cardNode.active = !0);
for (var n = function(e) {
var o = r.dis_cardNode.getChildByName("card_" + e);
o.active = !1;
var n = d.default.imgPath(t[e], !0);
u.default.setImg(n, o);
var i = r.dis_cardNode.getChildByName("card_" + e + "_di");
i.active = !0;
var a = d.default.imgPath(0);
u.default.setImg(a, i);
i.stopAllActions();
o.stopAllActions();
cc.tween(i).set({
scaleX: 1
}).to(.3, {
scaleX: 0
}).call(function() {
i.active = !1;
o.active = !0;
cc.tween(o).set({
scaleX: 0
}).to(.3, {
scaleX: 1
}).start();
}).start();
}, r = this, a = 0; a < t.length; a++) n(a);
if (e) {
if (0 != o) {
this.bottomCardLaizi_parent.active = !0;
this.addLaiziToBotCard();
}
} else if (0 != o) {
this.bottomCardLaizi_parent.active = !0;
this.laizi_cardNode.parent.active = !0;
var s = d.default.imgPath(o);
u.default.setImg(s, this.laizi_cardNode);
this.laizi_show(o, !1);
}
};
t.prototype.laizi_show = function(e, t) {
var o = this;
if (this._curFlip >= this._maxFlip) {
this._curFlip = 0;
this.showFlipOver();
} else {
var n = t ? this.laizi_cardNode : this.laizi_cardNode_di, r = t ? this.laizi_cardNode_di : this.laizi_cardNode;
n.active = !0;
r.active = !1;
cc.tween(n).set({
scaleX: 1
}).to(.15, {
scaleX: 0
}, {
easing: cc.easing.quadOut
}).call(function() {
n.active = !1;
r.active = !0;
cc.tween(r).set({
scaleX: 0
}).to(.15, {
scaleX: 1
}, {
easing: cc.easing.quadOut
}).call(function() {
o._curFlip++;
o.laizi_show(e, !t);
}).start();
}).start();
}
};
t.prototype.showFlipOver = function() {
var e = this, t = this.laizi_cardNode.getPosition(), o = this.bottomCardLaizi.convertToWorldSpaceAR(cc.v2(0, 0)), n = this.laizi_cardNode.convertToNodeSpaceAR(o);
this.laizi_cardNode_ani.on(dragonBones.EventObject.COMPLETE, function() {
cc.tween(e.laizi_cardNode).to(.3, {
scale: .2,
position: n
}, {
easing: cc.easing.cubicIn
}).call(function() {
e.laizi_cardNode.parent.active = !1;
e.laizi_cardNode.setPosition(t);
e.laizi_cardNode.scale = 1;
e.addLaiziToBotCard();
e.laizi_cardNode_ani.off(dragonBones.EventObject.COMPLETE, null, e);
}).start();
}, this);
this.laizi_cardNode_ani.playAnimation("newAnimation", 1);
};
t.prototype.addLaiziToBotCard = function() {
var e = 10 * i.default.gameInfoDDZ.m_iLaiziValue, t = i.default.gameInfoDDZ.bottomCard, o = d.default.imgPath(e, !0);
u.default.setImg(o, this.bottomCardLaizi);
4 == t.length ? this.bottomCardLaizi_parent.setPosition(82, -11) : this.bottomCardLaizi_parent.setPosition(70, -11);
};
t.prototype.dzAnimPlay = function() {
for (var e = this, t = this, o = -1, n = 0; n < 3; n++) {
this.dzSign[n].active = !1;
i.default.players.getByPos(n).deal && (o = n);
}
if (!(o < 0)) {
this.viewPos = p.default.getInstance().deskPos2ViewPos(o);
var r = this.dz_ani.node.getPosition(), a = this.dzSign[this.viewPos].convertToWorldSpaceAR(cc.v2(0, 0)), s = this.dz_ani.node.parent.convertToNodeSpaceAR(a);
this.dz_ani.on(dragonBones.EventObject.COMPLETE, function() {
cc.tween(e.dz_ani.node).to(.4, {
position: s
}, {
easing: cc.easing.cubicIn
}).call(function() {
e.dzSign[t.viewPos].active = !0;
e.dz_ani.node.active = !1;
e.dz_ani.node.setPosition(r);
e.laizi_cardNode_ani.off(dragonBones.EventObject.COMPLETE, null, e);
i.default.gameInfoDDZ.b_isPlayDZ_Anim = !1;
}).start();
}, this);
this.dz_ani.node.active = !0;
this.dz_ani.playAnimation("newAnimation", 1);
}
};
t.prototype.onBtnShowRemainCards = function() {
if (i.default.config.isChecked(8)) {
this._removeBottomCards();
var e = i.default.gameInfoDDZ.bottomCard;
!this._isShowRemainCards && e.length > 0 && (e = [ 0, 0, 0, 0 ]);
for (var t = 0; t < e.length; t++) {
var o = this.dis_cardNode.getChildByName("card_" + t), n = d.default.imgPath(e[t]);
u.default.setImg(n, o);
}
this._isShowRemainCards = !this._isShowRemainCards;
}
};
t.prototype._updateUI = function() {};
r([ m(cc.Node) ], t.prototype, "dis_cardNode", void 0);
r([ m(cc.Label) ], t.prototype, "gameScoreLabel", void 0);
r([ m(cc.Label) ], t.prototype, "gameBombLabel", void 0);
r([ m(cc.Label) ], t.prototype, "titleLabel", void 0);
r([ m(cc.Node) ], t.prototype, "laizi_cardNode", void 0);
r([ m(cc.Node) ], t.prototype, "laizi_cardNode_di", void 0);
r([ m(dragonBones.ArmatureDisplay) ], t.prototype, "laizi_cardNode_ani", void 0);
r([ m(cc.Node) ], t.prototype, "bottomCardLaizi", void 0);
r([ m(cc.Node) ], t.prototype, "bottomCardLaizi_parent", void 0);
r([ m(dragonBones.ArmatureDisplay) ], t.prototype, "dz_ani", void 0);
r([ m(cc.Node) ], t.prototype, "dzSign", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
