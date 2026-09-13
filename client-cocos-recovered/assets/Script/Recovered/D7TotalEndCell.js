// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "84747oBkm5G26Qe/VOjpEQm", "D7TotalEndCell");
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
var i = e("./Image"), a = e("./RoomInfoData"), s = e("./StringUtils"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.headImg = null;
t.winner = null;
t.nameLabel = null;
t.idLabel = null;
t.descKeys = null;
t.descValues = null;
t.winScore = null;
t.loseScore = null;
return t;
}
t.prototype.setData = function(e) {
var t = a.default.getTotalEndData().players[e], o = t.uid(), n = a.default.players.getByUid(o);
this.headImg.url = n.headImg;
this.winner.active = t.isWiner();
this.nameLabel.string = s.default.clip(n.name, 5);
this.idLabel.string = "ID:" + o;
this.descKeys.string = t.descKey();
this.descValues.string = t.descValue();
var r = t.score();
if (r >= 0) {
this.winScore.string = "" + r;
this.loseScore.string = "";
} else {
this.winScore.string = "";
this.loseScore.string = "" + r;
}
};
r([ u(i.default) ], t.prototype, "headImg", void 0);
r([ u(cc.Node) ], t.prototype, "winner", void 0);
r([ u(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ u(cc.Label) ], t.prototype, "idLabel", void 0);
r([ u(cc.Label) ], t.prototype, "descKeys", void 0);
r([ u(cc.Label) ], t.prototype, "descValues", void 0);
r([ u(cc.Label) ], t.prototype, "winScore", void 0);
r([ u(cc.Label) ], t.prototype, "loseScore", void 0);
return t = r([ c ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
