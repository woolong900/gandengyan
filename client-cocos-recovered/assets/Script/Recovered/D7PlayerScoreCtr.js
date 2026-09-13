// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a6be1hoREpGU5jzJwFLL39z", "D7PlayerScoreCtr");
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
var i = e("./D7PlayerCtr"), a = e("./RoomInfoData"), s = e("./D7Enum"), l = e("./D7CardUtils"), c = e("./gContext"), u = e("./D7EventKeys"), d = e("./EventUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerCtr = null;
t.totalScore = null;
t.singleRoot = null;
t.singleScore = null;
return t;
}
t.prototype.start = function() {
var e = this;
c.default.eventUtils.on([ u.default.data_status_change, u.default.data_step_change ], function() {
e._updateSingle(!1);
e._updateToatal();
}, this, d.eOffType.OnDestroy);
c.default.eventUtils.on([ u.default.data_score_card_add, u.default.data_score_card_reset ], function(t, o) {
var n = e.playerCtr.getPlayer();
n && o.pos === n.pos && e._updateSingle(!0);
}, this, d.eOffType.OnDestroy);
this._updateSingle(!1);
this._updateToatal();
};
t.prototype._updateToatal = function() {
var e = this.playerCtr.getPlayer();
e && (this.totalScore.string = e.scoreDesc());
};
t.prototype._updateSingle = function(e) {
var t = this, o = this.playerCtr.getPlayer();
this.singleRoot.active = !1;
if (o) if (a.default.gameInfoD7.status === s.eD7GameStatus.Free) this.singleRoot.active = !1; else {
this.singleRoot.active = !0;
var n = a.default.gameInfoD7.siteInfos.get(o.pos).scoreCards, r = l.default.scoreCount(n);
if (this.singleScore.string === "" + r) return;
this.singleScore.string = "" + r;
if (e) {
var i = cc.callFunc(function() {
t.singleScore.node.setScale(0, 0);
}), c = cc.scaleTo(.2, 1).easing(cc.easeSineIn()).easing(cc.easeBackOut()), u = cc.sequence(i, c);
this.singleScore.node.runAction(u);
}
}
};
r([ h(i.default) ], t.prototype, "playerCtr", void 0);
r([ h(cc.Label) ], t.prototype, "totalScore", void 0);
r([ h(cc.Node) ], t.prototype, "singleRoot", void 0);
r([ h(cc.Label) ], t.prototype, "singleScore", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
