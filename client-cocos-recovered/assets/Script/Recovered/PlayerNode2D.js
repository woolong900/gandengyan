// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "99320KW86VPe6wKYUb5K6HK", "PlayerNode2D");
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
var i = e("./CommonEnum"), a = e("./PlayerNodeBase"), s = e("./UserData"), l = cc._decorator, c = l.ccclass, u = (l.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.initReady = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(141, -8), e[i.eViewPos.Left] = cc.v2(141, -8),
e[i.eViewPos.Up] = cc.v2(-105, -19), e[i.eViewPos.Right] = cc.v2(-140, -18), e);
i.eViewPos.Down === this._viewPos || i.eViewPos.Left === this._viewPos ? this.readyNode.scaleX = -1 : this.readyNode.scaleX = 1;
this.readyNode.position = t[this._viewPos];
};
t.prototype.initDesc = function() {
var e, t, o = ((e = {})[i.eViewPos.Down] = cc.v2(0, 60), e[i.eViewPos.Left] = cc.v2(0, 60),
e[i.eViewPos.Up] = cc.v2(0, -60), e[i.eViewPos.Right] = cc.v2(0, -60), e), n = ((t = {})[i.eViewPos.Down] = cc.v2(0, .5),
t[i.eViewPos.Left] = cc.v2(0, .5), t[i.eViewPos.Up] = cc.v2(1, .5), t[i.eViewPos.Right] = cc.v2(1, .5),
t);
this.descLabel.node.position = o[this._viewPos];
this.descLabel.node.setAnchorPoint(n[this._viewPos]);
};
t.prototype.initMul = function() {
var e = cc.v2(0, -78);
if (s.default.gameView === i.eGameView.View2D) {
e = cc.v2(0, 65);
this._viewPos !== i.eViewPos.Up && this._viewPos !== i.eViewPos.Left || (e = cc.v2(65, 0));
}
this.mulLabel.node.position = e;
};
t.prototype.initChatEmoji = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(105, 28), e[i.eViewPos.Left] = cc.v2(105, 28),
e[i.eViewPos.Up] = cc.v2(-105, 13), e[i.eViewPos.Right] = cc.v2(-105, 13), e);
this.chatEmojiRoot.position = t[this._viewPos];
};
t.prototype.initChatVoice = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(84, 28), e[i.eViewPos.Left] = cc.v2(84, 28),
e[i.eViewPos.Up] = cc.v2(-84, 13), e[i.eViewPos.Right] = cc.v2(-84, 13), e);
this.chatVoiceRoot.position = t[this._viewPos];
};
t.prototype.initChatText = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(20, 10), e[i.eViewPos.Left] = cc.v2(20, 10),
e[i.eViewPos.Up] = cc.v2(-20, -30), e[i.eViewPos.Right] = cc.v2(-20, 10), e);
this.chatTextRoot.position = t[this._viewPos];
};
t.prototype.initOffline = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x, -20), e[i.eViewPos.Left] = cc.v2(220, -80),
e[i.eViewPos.Up] = cc.v2(-this.node.parent.x, -67), e[i.eViewPos.Right] = cc.v2(-165, -80),
e);
this.offLineNode.position = t[this._viewPos];
};
t.prototype.initOperate = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x, 20), e[i.eViewPos.Left] = cc.v2(284, -81),
e[i.eViewPos.Up] = cc.v2(-this.node.parent.x, -75), e[i.eViewPos.Right] = cc.v2(-284, -81),
e);
this.operateAnimateRoot.position = t[this._viewPos];
};
t.prototype.initHighlight = function() {
var e, t = ((e = {})[i.eViewPos.Down] = cc.v2(-this.node.parent.x, 15), e[i.eViewPos.Left] = cc.v2(400, 20 - this.node.parent.y),
e[i.eViewPos.Up] = cc.v2(-this.node.parent.x, -80), e[i.eViewPos.Right] = cc.v2(-400, 20 - this.node.parent.y),
e);
this.highlightRoot.position = t[this._viewPos];
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
return t = r([ c ], t);
}(a.default));
o.default = u;
cc._RF.pop();
