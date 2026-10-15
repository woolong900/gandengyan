// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f6188BoTgVMr4TAr4CjyjKJ", "PlayerLayer");
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
var i = require("./CommonEnum"), a = require("./Loader"), s = require("./PlayerNodeBase"), l = require("./gContext"), c = require("./EventKeys"), u = require("./UserData"), d = require("./RoomInfoData"), p = require("./EventUtils"), f = require("./GiftAnimate"), h = require("./RoomUtils"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.view = i.eGameView.View2D;
t.roots = [];
t.giftAniamte = null;
return t;
}
t.prototype.onLoad = function() {
for (var e = this, t = function(t) {
var n = null;
n = o.view === i.eGameView.View2D ? "Hall/Res/Prefab/Game/D2/PlayerNode2D" : "Hall/Res/Prefab/Game/D3/PlayerNode3D";
a.default.loadPre(n, function(o) {
if (e.node && e.node.isValid) {
var n = cc.instantiate(o);
n.getComponent(s.default).setData(t);
e.roots[t].addChild(n);
}
});
}, o = this, n = i.eViewPos.Down; n <= i.eViewPos.Right; n++) t(n);
};
t.prototype.onEnable = function() {
var e = this;
l.default.eventUtils.on(c.default.data_chat_msg, function(t, o) {
var n = o.o;
n.type === i.eChatMsgType.ChatGift && e.showGift(n.fromUid, n.toUid, n.content);
}, this, p.eOffType.OnDisable);
};
t.prototype.showGift = function(e, t, o) {
if (u.default.isGiftForbid(e)) ; else {
var n = d.default.players.getByUid(e).pos, r = d.default.players.getByUid(t).pos, i = h.default.getInstance().deskPos2ViewPos(n), a = h.default.getInstance().deskPos2ViewPos(r), s = this.roots[i].position, l = this.roots[a].position, c = cc.instantiate(this.giftAniamte);
this.node.addChild(c);
c.position = s;
c.getComponent(f.default).giftPlay(o);
c.runAction(cc.moveTo(.6, l));
}
};
r([ g({
type: cc.Enum(i.eGameView),
displayName: "游戏视角",
serializable: !0
}) ], t.prototype, "view", void 0);
r([ g(cc.Node) ], t.prototype, "roots", void 0);
r([ g(cc.Prefab) ], t.prototype, "giftAniamte", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
