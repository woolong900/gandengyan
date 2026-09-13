// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c4ed00AHWdJJ4dshsrOwlpI", "WSKPosRankCtr");
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
var i = e("./RoomInfoData"), a = e("./EventUtils"), s = e("./GameSoundWSK"), l = e("./gContext"), c = e("./WSKEventKeys"), u = e("./WSKPosCtr"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.rankNodes = [];
t.rankArmature = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on(c.default.data_rank_change, function(t, o) {
var n = o.pos;
if (n === e.posCtr.deskPos()) {
var r = i.default.gameInfoWSK.siteInfos.get(n).rank;
if (1 !== r && 2 !== r || !o.action) e._uiDirty = !0; else {
e.rankArmature.node.active = !0;
e.rankArmature.node.scale = 1;
e.rankArmature.node.x = 0;
e.rankArmature.node.y = 50;
1 === r && e.rankArmature.playAnimation("touyou", 1);
2 === r && e.rankArmature.playAnimation("eryou", 1);
e.rankArmature.once(dragonBones.EventObject.COMPLETE, function() {
var t = e.rankNodes[0].convertToWorldSpaceAR(cc.v2(0, 0)), o = e.rankArmature.node.parent.convertToNodeSpaceAR(t), n = cc.moveTo(.5, cc.v2(o.x, o.y)).easing(cc.easeOut(2)), r = cc.scaleTo(.5, .43), i = cc.spawn(n, r), a = cc.callFunc(function() {
e.rankArmature.node.active = !1;
e._uiDirty = !0;
});
e.rankArmature.node.runAction(cc.sequence(i, a));
}, e);
s.default.getInstance().rankShow();
}
}
}, this, a.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
for (var e = 0, t = this.rankNodes.length; e < t; e++) this.rankNodes[e].active = !1;
var o = this.posCtr.deskPos(), n = i.default.gameInfoWSK.siteInfos.get(o);
n && n.rank > 0 && (this.rankNodes[n.rank - 1].active = !0);
};
r([ f(u.default) ], t.prototype, "posCtr", void 0);
r([ f(cc.Node) ], t.prototype, "rankNodes", void 0);
r([ f(dragonBones.ArmatureDisplay) ], t.prototype, "rankArmature", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
