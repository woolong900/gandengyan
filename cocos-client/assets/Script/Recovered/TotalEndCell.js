// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0d3b80Ol2tHT7yoqdg+wK5r", "TotalEndCell");
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
var i = require("./RoomInfoData"), a = require("./Image"), s = require("./StringUtils"), l = require("./UserData"), c = require("./GameConfig"), u = require("./CommonEnum"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = 0;
t.myBg = null;
t.idLabel = null;
t.nameLabel = null;
t.headImage = null;
t.fangZhu = null;
t.keyDesc = null;
t.valueDesc = null;
t.winerNode = null;
t.loserNode = null;
t.scoreLabel = null;
return t;
}
t.prototype.setData = function(e) {
this._index = e;
};
t.prototype.start = function() {
var e = i.default.getTotalEndData().players[this._index], t = e.uid(), o = i.default.players.getByUid(t);
this.idLabel.string = "" + o.uid;
this.nameLabel.string = s.default.clip(o.name);
this.headImage.url = o.headImg;
this.fangZhu.active = e.isFangZhu();
this.keyDesc.string = e.descKey();
this.valueDesc.string = e.descValue();
var n = e.score(), r = s.default.strScore(n);
this.scoreLabel.string = r;
this.scoreLabel.node.color = n >= 0 ? new cc.Color(223, 51, 28) : new cc.Color(32, 150, 16);
this.winerNode.active = e.isWiner();
t === l.default.uid && (this.myBg.active = !0);
this.loserNode.active = !1;
c.default.area() === u.eArea.QJ && (this.loserNode.active = e.isLoser());
};
r([ f(cc.Node) ], t.prototype, "myBg", void 0);
r([ f(cc.Label) ], t.prototype, "idLabel", void 0);
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(a.default) ], t.prototype, "headImage", void 0);
r([ f(cc.Node) ], t.prototype, "fangZhu", void 0);
r([ f(cc.Label) ], t.prototype, "keyDesc", void 0);
r([ f(cc.Label) ], t.prototype, "valueDesc", void 0);
r([ f(cc.Node) ], t.prototype, "winerNode", void 0);
r([ f(cc.Node) ], t.prototype, "loserNode", void 0);
r([ f(cc.Label) ], t.prototype, "scoreLabel", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
