// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dc39dgXX5BCPrCydTJjMyID", "GDMyGameInfoCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./EventUtils"), l = require("./GDEnum"), c = require("./GDEventKeys"), u = require("./GDRoomUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
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
a.default.eventUtils.on(c.default.ui_dzlog_update, function(t, o) {
e.dzAnimPlay();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(c.default.playback_data_remain, function() {
e._removeBottomCards();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(c.default.data_status_change, function() {
if (i.default.gameInfoGD.status === l.eGDGameStatus.JiaoDiZhu) {
e._isShowRemainCards = !0;
e._removeBottomCards();
}
}, this, s.eOffType.OnDestroy);
this._updateUI();
this._updateScoreShow();
i.default.gameInfoGD.status !== l.eGDGameStatus.Gameing && i.default.gameInfoGD.status !== l.eGDGameStatus.SingleEnd || this._setBottomCard(!0);
};
t.prototype.update = function() {};
t.prototype._updateTitleString = function() {
var e = "本局叫分：";
i.default.config.isChecked(6) && (e = "池底池分：");
this.titleLabel.string = e;
};
t.prototype._updateScoreShow = function() {};
t.prototype._removeBottomCards = function() {};
t.prototype._setBottomCard = function(e) {
void 0 === e && (e = !1);
this._removeBottomCards();
var t = i.default.gameInfoGD.bottomCard;
this.dis_cardNode.width = 270;
this.laizi_show(t, !1);
};
t.prototype.laizi_show = function(e, t) {
console.log("级牌数字", e);
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
t.prototype.addLaiziToBotCard = function() {};
t.prototype.dzAnimPlay = function() {
for (var e = this, t = this, o = -1, n = 0; n < 3; n++) {
this.dzSign[n].active = !1;
i.default.players.getByPos(n).deal && (o = n);
}
if (!(o < 0)) {
this.viewPos = u.default.getInstance().deskPos2ViewPos(o);
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
i.default.gameInfoGD.b_isPlayDZ_Anim = !1;
}).start();
}, this);
this.dz_ani.node.active = !0;
this.dz_ani.playAnimation("newAnimation", 1);
}
};
t.prototype.onBtnShowRemainCards = function() {};
t.prototype._updateUI = function() {};
r([ f(cc.Node) ], t.prototype, "dis_cardNode", void 0);
r([ f(cc.Label) ], t.prototype, "gameScoreLabel", void 0);
r([ f(cc.Label) ], t.prototype, "gameBombLabel", void 0);
r([ f(cc.Label) ], t.prototype, "titleLabel", void 0);
r([ f(cc.Node) ], t.prototype, "laizi_cardNode", void 0);
r([ f(cc.Node) ], t.prototype, "laizi_cardNode_di", void 0);
r([ f(dragonBones.ArmatureDisplay) ], t.prototype, "laizi_cardNode_ani", void 0);
r([ f(cc.Node) ], t.prototype, "bottomCardLaizi", void 0);
r([ f(cc.Node) ], t.prototype, "bottomCardLaizi_parent", void 0);
r([ f(dragonBones.ArmatureDisplay) ], t.prototype, "dz_ani", void 0);
r([ f(cc.Node) ], t.prototype, "dzSign", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
