// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f14f3emfLZHqIg4Kvj9aMEK", "D7SingleEndCell");
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
var i = require("./Image"), a = require("./D7SingleEndData"), s = require("./RoomInfoData"), l = require("./StringUtils"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.headImg = null;
t.nameLabel = null;
t.idLabel = null;
t.flagZhuang = null;
t.flagXian = null;
t.flagWhat = null;
t.stageLabel = null;
t.countFan = null;
t.countKou = null;
t.countZhua = null;
t.counGroup = null;
t.winScore = null;
t.loseScore = null;
return t;
}
t.prototype.setData = function(e) {
var t = a.default.getInstance(), o = t.playerUid(e), n = s.default.players.getByUid(o);
this.headImg.url = n.headImg;
this.nameLabel.string = l.default.clip(n.name, 4);
this.idLabel.string = "" + o;
if (t.isLiuJu()) {
this.flagWhat.active = !0;
this.flagXian.active = !1;
this.flagZhuang.active = !1;
} else {
this.flagWhat.active = !1;
var r = s.default.gameInfoD7.isZhuang(o);
this.flagZhuang.active = r;
this.flagXian.active = !r;
}
this.stageLabel.string = "" + t.playerLevel(e);
this.countFan.string = "" + t.playerFan(e);
this.countKou.string = "" + t.playerKou(e);
this.countZhua.string = "" + t.playerZhua(e);
this.counGroup.string = "" + t.playerGroup(e);
var i = t.playerScore(e);
if (i >= 0) {
this.winScore.string = "" + i;
this.loseScore.string = "";
} else {
this.winScore.string = "";
this.loseScore.string = "" + i;
}
};
r([ d(i.default) ], t.prototype, "headImg", void 0);
r([ d(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ d(cc.Label) ], t.prototype, "idLabel", void 0);
r([ d(cc.Node) ], t.prototype, "flagZhuang", void 0);
r([ d(cc.Node) ], t.prototype, "flagXian", void 0);
r([ d(cc.Node) ], t.prototype, "flagWhat", void 0);
r([ d(cc.Label) ], t.prototype, "stageLabel", void 0);
r([ d(cc.Label) ], t.prototype, "countFan", void 0);
r([ d(cc.Label) ], t.prototype, "countKou", void 0);
r([ d(cc.Label) ], t.prototype, "countZhua", void 0);
r([ d(cc.Label) ], t.prototype, "counGroup", void 0);
r([ d(cc.Label) ], t.prototype, "winScore", void 0);
r([ d(cc.Label) ], t.prototype, "loseScore", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
