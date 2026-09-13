// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e663aK0Dn9B97U2Noh50I31", "TotalEndShareCell");
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
var i = e("./Image"), a = e("./RoomInfoData"), s = e("./StringUtils"), l = e("./GameConfig"), c = e("./CommonEnum"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.idLabel = null;
t.nameLabel = null;
t.headImage = null;
t.winerNode = null;
t.loserNode = null;
t.scoreLabel = null;
return t;
}
t.prototype.setData = function(e) {
var t = a.default.getTotalEndData().players[e], o = t.uid(), n = a.default.players.getByUid(o);
this.idLabel.string = "ID：" + n.uid;
this.nameLabel.string = s.default.clip(n.name);
this.headImage.url = n.headImg;
var r = t.score();
this.scoreLabel.string = s.default.strScore(r);
this.scoreLabel.node.color = r >= 0 ? new cc.Color(223, 51, 28) : new cc.Color(32, 150, 16);
this.winerNode.active = t.isWiner();
this.loserNode.active = !1;
l.default.area() === c.eArea.QJ && (this.loserNode.active = t.isLoser());
};
r([ p(cc.Label) ], t.prototype, "idLabel", void 0);
r([ p(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ p(i.default) ], t.prototype, "headImage", void 0);
r([ p(cc.Node) ], t.prototype, "winerNode", void 0);
r([ p(cc.Node) ], t.prototype, "loserNode", void 0);
r([ p(cc.Label) ], t.prototype, "scoreLabel", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
