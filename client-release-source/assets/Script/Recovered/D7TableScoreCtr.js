// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b4a4e8ByCNEoqC6S5Mi/p2j", "D7TableScoreCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./D7EventKeys"), l = require("./EventUtils"), c = require("./D7Enum"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.scoreRoot = null;
t.scoreLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on([ s.default.data_round_put_score_change, s.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
this._updateUI();
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
if (i.default.gameInfoD7.status === c.eD7GameStatus.Gameing) {
var t = i.default.gameInfoD7.roundData().roundScore();
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
r([ p(cc.Node) ], t.prototype, "scoreRoot", void 0);
r([ p(cc.Label) ], t.prototype, "scoreLabel", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
