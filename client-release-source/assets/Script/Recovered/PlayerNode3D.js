// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1fb3d7fEShILb/DluVm0VY2", "PlayerNode3D");
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
var i = require("./CommonEnum"), a = require("./PlayerNodeBase"), s = require("./ResultNode3D"), l = require("./OperateTableText3D"), c = require("./GameConfig"), u = require("./AnimateScore"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.detailRoot = null;
t.detailBg = null;
t.resultRoot = null;
t.operateTableTextRoot = null;
t.resultPre = null;
t.operateTableTextPre = null;
t.scoreAnimatePre = null;
return t;
}
t.prototype.start = function() {
e.prototype.start.call(this);
this.addResult();
this.addTableText();
};
t.prototype.showScoreAnimate = function(e) {
var t = cc.instantiate(this.scoreAnimatePre);
this.resultRoot.addChild(t);
t.getComponent(u.default).setData(e);
};
t.prototype.addResult = function() {
var e = cc.instantiate(this.resultPre);
e.getComponent(s.default).init(this._viewPos);
this.resultRoot.addChild(e);
};
t.prototype.addTableText = function() {
var e = cc.instantiate(this.operateTableTextPre);
e.getComponent(l.default).init(this._viewPos);
this.operateTableTextRoot.addChild(e);
};
t.prototype.initDetailBg = function() {
if (this._viewPos === i.eViewPos.Down || this._viewPos === i.eViewPos.Left) {
this.detailRoot.x = 102;
this.nameLabel.node.x = -14;
this.score.node.x = -14;
this.detailBg.scaleX = 1;
} else {
this.detailRoot.x = -102;
this.nameLabel.node.x = 14;
this.score.node.x = 14;
this.detailBg.scaleX = -1;
}
};
t.prototype.initReady = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(260, 0), e[i.eViewPos.Left] = cc.v2(262, 0),
e[i.eViewPos.Up] = cc.v2(-252, 0), e[i.eViewPos.Right] = cc.v2(-288, 0), e);
this._viewPos === i.eViewPos.Down || this._viewPos === i.eViewPos.Left ? this.readyNode.scaleX = -1 : this.readyNode.scaleX = 1;
this.readyNode.position = t[this._viewPos];
};
t.prototype.initDesc = function() {
var e, t, o = ((e = {})[i.eViewPos.Down] = cc.v2(0, 62), e[i.eViewPos.Left] = cc.v2(40, -62),
e[i.eViewPos.Up] = cc.v2(7, -62), e[i.eViewPos.Right] = cc.v2(-17, -62), e), n = ((t = {})[i.eViewPos.Down] = cc.v2(0, .5),
t[i.eViewPos.Left] = cc.v2(0, .5), t[i.eViewPos.Up] = cc.v2(1, .5), t[i.eViewPos.Right] = cc.v2(1, .5),
t);
this.descLabel.node.position = o[this._viewPos];
this.descLabel.node.setAnchorPoint(n[this._viewPos]);
};
t.prototype.initMul = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(22, 60), e[i.eViewPos.Left] = cc.v2(90, -57),
e[i.eViewPos.Up] = cc.v2(-40, -57), e[i.eViewPos.Right] = cc.v2(-90, 50), e);
this.mulLabel.node.position = t[this._viewPos];
};
t.prototype.initChatEmoji = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(217, 0), e[i.eViewPos.Left] = cc.v2(217, 0),
e[i.eViewPos.Up] = cc.v2(-217, 0), e[i.eViewPos.Right] = cc.v2(-217, 0), e);
this.chatEmojiRoot.position = t[this._viewPos];
};
t.prototype.initChatVoice = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(183, 36), e[i.eViewPos.Left] = cc.v2(183, 36),
e[i.eViewPos.Up] = cc.v2(-183, 36), e[i.eViewPos.Right] = cc.v2(-183, 36), e);
this.chatVoiceRoot.position = t[this._viewPos];
};
t.prototype.initChatText = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(66, 30), e[i.eViewPos.Left] = cc.v2(88, 30),
e[i.eViewPos.Up] = cc.v2(-66, -25), e[i.eViewPos.Right] = cc.v2(-66, 30), e);
this.chatTextRoot.position = t[this._viewPos];
};
t.prototype.initOffline = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x - 640 + 625, 40),
e[i.eViewPos.Left] = cc.v2(338, -98), e[i.eViewPos.Up] = cc.v2(-479, -64), e[i.eViewPos.Right] = cc.v2(-306, -30),
e);
this.offLineNode.position = t[this._viewPos];
};
t.prototype.initOperate = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x - 640 + 630, 60),
e[i.eViewPos.Left] = cc.v2(338, -98), e[i.eViewPos.Up] = cc.v2(-505, -64), e[i.eViewPos.Right] = cc.v2(-306, -30),
e);
this.operateAnimateRoot.position = t[this._viewPos];
};
t.prototype.initHighlight = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x - 640 + 625, 60),
e[i.eViewPos.Left] = cc.v2(310, -98), e[i.eViewPos.Up] = cc.v2(-505, -64), e[i.eViewPos.Right] = cc.v2(-300, -30),
e);
this.highlightRoot.position = t[this._viewPos];
};
t.prototype.initResult = function() {
var e, t;
if (c.default.area() !== i.eArea.QJ) {
var o = ((t = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x - 640 + 625, 90),
t[i.eViewPos.Left] = cc.v2(274, -48), t[i.eViewPos.Up] = cc.v2(-500, -47), t[i.eViewPos.Right] = cc.v2(-239, 15),
t);
this.resultRoot.position = o[this._viewPos];
} else {
var n = ((e = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x - 640 + 325, 66),
e[i.eViewPos.Left] = cc.v2(-this.node.parent.x - 326, -48), e[i.eViewPos.Up] = cc.v2(-260, 0),
e[i.eViewPos.Right] = cc.v2(361 - this.node.parent.x, 15), e);
this.resultRoot.position = n[this._viewPos];
}
};
t.prototype.initOperateTableShow = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x - 640 + 640, 60),
e[i.eViewPos.Left] = cc.v2(310, -98), e[i.eViewPos.Up] = cc.v2(-505, -64), e[i.eViewPos.Right] = cc.v2(-300, -30),
e);
this.operateTableTextRoot.position = t[this._viewPos];
};
t.prototype.posText = function() {
var e;
return ((e = {})[i.eViewPos.Down] = i.eViewPos.RightTop, e[i.eViewPos.Left] = i.eViewPos.RightTop,
e[i.eViewPos.Up] = i.eViewPos.LeftTop, e[i.eViewPos.Right] = i.eViewPos.LeftTop,
e)[this._viewPos];
};
t.prototype.posVoice = function() {
var e;
return ((e = {})[i.eViewPos.Down] = i.eViewPos.Right, e[i.eViewPos.Left] = i.eViewPos.Right,
e[i.eViewPos.Up] = i.eViewPos.Left, e[i.eViewPos.Right] = i.eViewPos.Left, e)[this._viewPos];
};
r([ f(cc.Node) ], t.prototype, "detailRoot", void 0);
r([ f(cc.Node) ], t.prototype, "detailBg", void 0);
r([ f(cc.Node) ], t.prototype, "resultRoot", void 0);
r([ f(cc.Node) ], t.prototype, "operateTableTextRoot", void 0);
r([ f(cc.Prefab) ], t.prototype, "resultPre", void 0);
r([ f(cc.Prefab) ], t.prototype, "operateTableTextPre", void 0);
r([ f(cc.Prefab) ], t.prototype, "scoreAnimatePre", void 0);
return t = r([ p ], t);
}(a.default);
o.default = h;
cc._RF.pop();
