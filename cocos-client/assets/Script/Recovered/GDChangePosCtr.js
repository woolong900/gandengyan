// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "64044L8ZGRF+ryKuYQ47t4w", "GDChangePosCtr");
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
var i, a = require("./RoomInfoData"), s = require("./StringUtils"), l = require("./Image"), c = require("./GDRoomUtils"), u = require("./GDPosPlayerInfoCtr"), d = cc._decorator, p = d.ccclass, f = d.property, h = [ -274, -114, 114, 274 ];
(function(e) {
e[e.Null = 0] = "Null";
e[e.My = 1] = "My";
e[e.Other = 2] = "Other";
})(i || (i = {}));
var m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rootNode = null;
t.bg0 = null;
t.bg1 = null;
t.players = [];
t.tablePlayers = [];
t.playInfoCtrs = [];
t.changeArmature = [];
return t;
}
t.prototype._updatePlayer = function(e, t) {
var o = a.default.players.getByPos(e), n = this.players[t];
n.getChildByName("headImg").getComponent(l.default).url = o.headImg;
n.getChildByName("name").getComponent(cc.Label).string = s.default.clip(o.name);
};
t.prototype._initUI = function() {
this.rootNode.active = !0;
this.bg0.active = !0;
this.bg0.opacity = 255;
this.bg0.stopAllActions();
this.bg1.active = !0;
this.bg1.opacity = 255;
this.bg1.stopAllActions();
for (var e = 0, t = this.players.length; e < t; e++) {
this.players[e].active = !0;
this.players[e].opacity = 255;
this.players[e].stopAllActions();
}
};
t.prototype.stopUpdate = function() {
for (var e = 0, t = this.playInfoCtrs.length; e < t; e++) {
this.playInfoCtrs[e].readyNode.active = !1;
this.playInfoCtrs[e].enabled = !1;
}
};
t.prototype.beginUpdate = function() {
for (var e = 0, t = this.playInfoCtrs.length; e < t; e++) this.playInfoCtrs[e].enabled = !0;
};
t.prototype.play = function(e, t) {
var o = this;
return new Promise(function(n) {
o._initUI();
for (var r = a.default.myAbsolutePos(), s = [ r, (r + 2) % 4, (r + 1) % 4, (r + 3) % 4 ], l = [ h[0], h[1], h[2], h[3] ], u = [ h[0], h[1], h[2], h[3] ], d = [], p = 0, f = s.length; p < f; p++) {
var m = s[p];
m !== e && m !== t || d.push(p);
}
if (d.length > 0) {
var g = d[0], y = d[1];
l[g] = u[y];
l[y] = u[g];
}
var _ = o._getChangeType(e, t, r), v = cc.callFunc(function() {
for (var e = 0; e < 4; e++) {
o._updatePlayer(s[e], e);
var t = o.players[e];
t.y = 0;
t.x = l[e];
o._doMove(.3, t, l[e], u[e]);
}
}), C = cc.delayTime(.8), b = cc.callFunc(function() {
o.bg0.runAction(cc.fadeOut(.2));
o.bg1.runAction(cc.fadeOut(.2));
for (var e = function(e) {
return i.Null !== _ && (i.My === _ || (i.Other === _ ? -1 !== d.indexOf(e) : void 0));
}, t = function(t) {
if (e(t)) {
var n = s[t], r = c.default.getInstance().deskPos2ViewPos(n), i = o.tablePlayers[r].convertToWorldSpaceAR(cc.v2(0, 0)), a = o.node.convertToNodeSpaceAR(i), l = cc.delayTime(.1), u = cc.moveTo(.3, cc.v2(a.x, a.y)), d = cc.fadeTo(.3, 128), p = cc.spawn(u, d), f = cc.callFunc(function() {
var e = o.changeArmature[r];
e.node.active = !0;
e.playAnimation("Sprite", 1);
e.once(dragonBones.EventObject.COMPLETE, function() {
e.node.active = !1;
}, o);
});
o.players[t].runAction(cc.sequence(l, p, f));
} else o.players[t].runAction(cc.fadeOut(.2));
}, n = 0; n < 4; n++) t(n);
}), D = cc.delayTime(.5), S = cc.callFunc(function() {
o.rootNode.active = !1;
n();
});
o.node.runAction(cc.sequence(v, C, b, D, S));
});
};
t.prototype._doMove = function(e, t, o, n) {
if (o === n) return null;
var r = 1;
o > n && (r = -1);
var i = cc.bezierTo(e, [ cc.v2(o, 0), cc.v2(o + n / 2, 300 * r), cc.v2(n, 0) ]);
t.runAction(i);
};
t.prototype._getChangeType = function(e, t, o) {
return e >= 0 && t >= 0 ? e === o || t === o ? i.My : i.Other : i.Null;
};
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
r([ f(cc.Node) ], t.prototype, "bg0", void 0);
r([ f(cc.Node) ], t.prototype, "bg1", void 0);
r([ f(cc.Node) ], t.prototype, "players", void 0);
r([ f(cc.Node) ], t.prototype, "tablePlayers", void 0);
r([ f(u.default) ], t.prototype, "playInfoCtrs", void 0);
r([ f(dragonBones.ArmatureDisplay) ], t.prototype, "changeArmature", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
