// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "94615yaCLFPl7M7FxzfYq0q", "WSKRoundDetailsItem");
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
var i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./Loader"), l = require("./StringUtils"), c = require("./gContext"), u = require("./Image"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.countLabel = null;
t.idLabel = null;
t.nameLabel = null;
t.iconImage = null;
t.cardRoot = null;
t.passNode = null;
return t;
}
t.prototype.setData = function(e, t, o, n) {
this.countLabel.string = "第\n" + e + "\n手";
var r = a.default.players.getByUid(o);
this.nameLabel.string = l.default.clip(r.name);
this.idLabel.string = "" + r.uid;
this.iconImage.url = r.headImg;
if (1 === t) {
this.cardRoot.active = !1;
this.passNode.active = !0;
} else {
this.cardRoot.active = !0;
this.passNode.active = !1;
var u = n || [];
a.default.config.index === i.eGameIds.XSWSK && u.includes(0) && u.shift();
for (var d = u.length, p = u.slice(0, d / 2), f = (u.slice(d / 2), 0), h = p.length; f < h; f++) {
var m = p[f], y = c.default.gameLogic().cardImgPath(m), g = this.cardRoot.getChildByName("card_" + f);
g.active = !0;
s.default.setImg(y, g);
}
}
};
r([ f(cc.Label) ], t.prototype, "countLabel", void 0);
r([ f(cc.Label) ], t.prototype, "idLabel", void 0);
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(u.default) ], t.prototype, "iconImage", void 0);
r([ f(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ f(cc.Node) ], t.prototype, "passNode", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
