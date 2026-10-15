// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "75abayMm6tJTK4GT/yLO19W", "D7PlayerLayerCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./EventKeys"), l = require("./CommonEnum"), c = require("./EventUtils"), u = require("./UserData"), d = require("./D7RoomUtils"), p = require("./GiftAnimate"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._playerNodes = [];
t.players = [];
t.giftAniamte = null;
t.giftRoot = null;
return t;
}
t.prototype.start = function() {
for (var e = this, t = 0; t <= 5; t++) {
var o = d.default.getInstance().uiPos2ViewPos(t);
o >= 0 ? this._playerNodes[o] = this.players[t] : this.players[t].active = !1;
}
a.default.eventUtils.on(s.default.data_chat_msg, function(t, o) {
var n = o.o;
n.type === l.eChatMsgType.ChatGift && e.showGift(n.fromUid, n.toUid, n.content);
}, this, c.eOffType.OnDestroy);
};
t.prototype.showGift = function(e, t, o) {
if (u.default.isGiftForbid(e)) ; else {
var n = i.default.players.getByUid(e).pos, r = i.default.players.getByUid(t).pos, a = d.default.getInstance().deskPos2ViewPos(n), s = d.default.getInstance().deskPos2ViewPos(r), l = this._playerNodes[a].position, c = this._playerNodes[s].position;
if (0 === a) {
var f = this._playerNodes[a].convertToWorldSpaceAR(cc.v2(0, 0)), h = this.node.convertToNodeSpaceAR(f);
l = cc.v2(h.x, h.y);
}
if (0 === s) {
f = this._playerNodes[s].convertToWorldSpaceAR(cc.v2(0, 0)), h = this.node.convertToNodeSpaceAR(f);
c = cc.v2(h.x, h.y);
}
var m = cc.instantiate(this.giftAniamte);
this.giftRoot.addChild(m);
m.position = l;
m.getComponent(p.default).giftPlay(o);
m.runAction(cc.moveTo(.6, c));
}
};
r([ m(cc.Node) ], t.prototype, "players", void 0);
r([ m(cc.Prefab) ], t.prototype, "giftAniamte", void 0);
r([ m(cc.Node) ], t.prototype, "giftRoot", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
