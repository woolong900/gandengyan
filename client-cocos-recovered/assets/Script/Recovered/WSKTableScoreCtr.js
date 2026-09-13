// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "53110JpDzZFpowqTufuSyyK", "WSKTableScoreCtr");
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
var i = e("./CommonEnum"), a = e("./RoomInfoData"), s = e("./EventUtils"), l = e("./gContext"), c = e("./WSKEnum"), u = e("./WSKEventKeys"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.scoreRoot = null;
t.scoreLabel = null;
t.tableRule = null;
t.qcdg = null;
t.xswsk = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on([ u.default.data_table_score_change, u.default.data_table_score_add ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this.qcdg && (this.qcdg.active = a.default.config.index === i.eGameIds.QCDG);
this.xswsk && (this.xswsk.active = a.default.config.index === i.eGameIds.XSWSK);
this._updateUI();
this.tableRule && (this.tableRule.string = l.default.gameLogic().tableRuleDesc(a.default.config));
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = this;
this.scoreRoot.active = !1;
if (a.default.gameInfoWSK.status === c.eWSKGameStatus.Gameing && !a.default.gameInfoWSK.is1V3()) {
var t = a.default.gameInfoWSK.tableScore;
if (t > 0) {
this.scoreRoot.active = !0;
if (this.scoreLabel.string === "" + t) return;
this.scoreLabel.string = "" + t;
var o = cc.callFunc(function() {
e.scoreLabel.node.setScale(0, 0);
}), n = cc.scaleTo(.2, 1).easing(cc.easeSineIn()).easing(cc.easeBackOut()), r = cc.sequence(o, n);
this.scoreLabel.node.runAction(r);
}
}
};
r([ f(cc.Node) ], t.prototype, "scoreRoot", void 0);
r([ f(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ f(cc.Label) ], t.prototype, "tableRule", void 0);
r([ f(cc.Node) ], t.prototype, "qcdg", void 0);
r([ f(cc.Node) ], t.prototype, "xswsk", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
