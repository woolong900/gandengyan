// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5d568Vcit5KiJKMLLlSy+Qf", "DDZPosTipCtr");
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
var i = require("./gContext"), a = require("./DDZEventKeys"), s = require("./EventUtils"), l = require("./DDZPosCtr"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.guoTip = null;
t.scoreTip = null;
return t;
}
t.prototype.start = function() {
var e = this;
// A previous choice may still be visible when this seat gets its next turn.
// Clear it instead of moving the label away from newly visible controls.
i.default.eventUtils.on(a.default.data_round_data_update, function(t, o) {
if (e.posCtr.deskPos() !== o.pos) return;
var room = require("./RoomInfoData").default;
var type = room.gameInfoDDZ.siteInfos.get(o.pos).roundType;
var types = require("./DDZEnum").eRoundTypeDDZ;
if (type === types.JiaoDiZhu || type === types.Turn) {
e.scoreTip.node.stopAllActions();
e.scoreTip.node.active = !1;
}
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.ui_jiaodizhu_change, function(t, o) {
var n = o.pos;
if (e.posCtr.deskPos() === n) {
e._updateScore(o.otType || 0, o.choicePhase);
e._showAnimate(e.scoreTip.node);
}
}, this, s.eOffType.OnDestroy);
};
t.prototype._updateScore = function(e, phase) {
var t = e;
this.scoreTip.string = "";
var o = "";
0 === t && (o = "不叫");
1 === t && (o = "叫地主");
2 === t && (o = "不加倍");
3 === t && (o = "加倍");
if (phase === "rob") o = t === 1 ? "抢地主" : "不抢";
this.scoreTip.string = "" + o;
};
t.prototype._showAnimate = function(e) {
e.stopAllActions();
e.active = !0;
var t = cc.delayTime(2), o = cc.callFunc(function() {
e.active = !1;
}), n = cc.sequence(t, o);
e.runAction(n);
};
r([ d(l.default) ], t.prototype, "posCtr", void 0);
r([ d(cc.Node) ], t.prototype, "guoTip", void 0);
r([ d(cc.Label) ], t.prototype, "scoreTip", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
