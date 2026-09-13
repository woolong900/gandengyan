// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "fff45csq41LfpqyIPbeWnHt", "DDZGiftAnimateCtr");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./CommonEnum"), l = e("./EventUtils"), c = e("./UserData"), u = e("./RoomInfoData"), d = e("./DDZRoomUtils"), p = e("./GiftAnimate"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.players = [];
t.giftAniamte = null;
t.giftRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.data_chat_msg, function(t, o) {
var n = o.o;
n.type === s.eChatMsgType.ChatGift && e.showGift(n.fromUid, n.toUid, n.content);
}, this, l.eOffType.OnDestroy);
};
t.prototype.showGift = function(e, t, o) {
if (c.default.isGiftForbid(e)) ; else {
var n = u.default.players.getByUid(e).pos, r = u.default.players.getByUid(t).pos, i = d.default.getInstance().deskPos2ViewPos(n), a = d.default.getInstance().deskPos2ViewPos(r), s = this._getPosition(i), l = this._getPosition(a), f = cc.instantiate(this.giftAniamte);
this.giftRoot.addChild(f);
f.position = s;
f.getComponent(p.default).giftPlay(o);
f.runAction(cc.moveTo(.6, l));
}
};
t.prototype._getPosition = function(e) {
var t = this.players[e].convertToWorldSpaceAR(cc.v2(0, 0)), o = this.node.convertToNodeSpaceAR(t);
return cc.v2(o.x, o.y);
};
r([ m(cc.Node) ], t.prototype, "players", void 0);
r([ m(cc.Prefab) ], t.prototype, "giftAniamte", void 0);
r([ m(cc.Node) ], t.prototype, "giftRoot", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
