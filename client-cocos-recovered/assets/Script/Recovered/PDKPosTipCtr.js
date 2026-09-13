// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5e9e3F1221I36Kffti5L9Zr", "PDKPosTipCtr");
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
var i = e("./gContext"), a = e("./PDKEventKeys"), s = e("./EventUtils"), l = e("./PDKPosCtr"), c = e("./RoomInfoData"), u = e("./PDKEnum"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.guoTip = null;
t.turn3Tip = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.data_round_data_update, function(t, o) {
var n = o.pos;
if (e.posCtr.deskPos() === n) {
var r = c.default.gameInfoPDK.siteInfos.get(n), i = r.roundType;
i === u.eRoundTypePDK.Turn && r.turnType === u.ePDKTurnType.Hei3 && e._showAnimate(e.turn3Tip);
i === u.eRoundTypePDK.Pass && e._showAnimate(e.guoTip);
}
}, this, s.eOffType.OnDestroy);
};
t.prototype._showAnimate = function(e) {
e.active = !0;
var t = cc.delayTime(2), o = cc.callFunc(function() {
e.active = !1;
}), n = cc.sequence(t, o);
e.runAction(n);
};
r([ f(l.default) ], t.prototype, "posCtr", void 0);
r([ f(cc.Node) ], t.prototype, "guoTip", void 0);
r([ f(cc.Node) ], t.prototype, "turn3Tip", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
