// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "60287crD2FCga105YX+EYrS", "WSKPosPassCtr");
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
var i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./gContext"), c = require("./WSKEnum"), u = require("./WSKEventKeys"), d = require("./WSKPosCtr"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.putPassNode = null;
t.baoPassNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on(u.default.data_round_change, function(t, o) {
o.pos === e.posCtr.deskPos() && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
l.default.eventUtils.on(u.default.data_status_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateBtnLabenInfo();
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.putPassNode.active = !1;
this.baoPassNode.active = !1;
var e = a.default.gameInfoWSK.status;
if (e === c.eWSKGameStatus.Calling || e === c.eWSKGameStatus.Gameing) {
var t = this.posCtr.deskPos(), o = a.default.gameInfoWSK.siteInfos.get(t);
if (o && o.roundType === c.eWSKRoundType.Pass) {
e === c.eWSKGameStatus.Calling && this._doAction(this.baoPassNode);
e === c.eWSKGameStatus.Gameing && this._doAction(this.putPassNode);
}
}
};
t.prototype._updateBtnLabenInfo = function() {
var e = "不包";
a.default.config.index === i.eGameIds.XSWSK && (e = "不吼");
this.baoPassNode.getComponent(cc.Label).string = e;
};
t.prototype._doAction = function(e) {
e.active = !0;
var t = cc.callFunc(function() {
e.setScale(0, 0);
}), o = cc.scaleTo(.2, 1).easing(cc.easeSineIn()).easing(cc.easeBackOut()), n = cc.sequence(t, o);
e.stopAllActions();
e.runAction(n);
};
r([ h(d.default) ], t.prototype, "posCtr", void 0);
r([ h(cc.Node) ], t.prototype, "putPassNode", void 0);
r([ h(cc.Node) ], t.prototype, "baoPassNode", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
