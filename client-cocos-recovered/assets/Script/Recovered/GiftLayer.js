// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1fb89TJS9FEgItwPbZ9VUhe", "GiftLayer");
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
var i = require("./BaseComponent"), a = require("./RoomInfoData"), s = require("./StringUtils"), l = require("./UserData"), c = require("./Image"), u = require("./CommonEnum"), d = require("./gContext"), p = require("./Loader"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uid = -1;
t.nameLabel = null;
t.idLabel = null;
t.ipLabel = null;
t.addrLabel = null;
t.genderList = [];
t.forbidCheckNode = null;
t.forbidUncheckNode = null;
t.headImage = null;
t.botWrapNode = null;
return t;
}
t.prototype.onLoad = function() {
var e = this.botWrapNode.childrenCount, t = this.botWrapNode.children, o = [ "stx", "dzd", "dz", "smg", "pj" ], n = !1;
d.default.gameLogic().hideHuDongBiaoqing(a.default.config) ? o = [ "stx_gray", "dzd_gray", "dz_gray", "smg_gray", "pj_gray" ] : n = !0;
for (var r = 0; r < e; r++) {
var i = "Hall/Res/Texture/Game/gifts/" + o[r], s = t[r];
p.default.setImg(i, s);
s.getComponent(cc.Button).interactable = n;
}
};
t.prototype.setData = function(e) {
this._uid = e;
var t = a.default.players.getByUid(e);
this.nameLabel.string = s.default.clip(t.name);
this.idLabel.string = "ID：" + t.uid;
this.ipLabel.string = "IP：" + t.ip;
this.addrLabel.string = s.default.clip(t.location.address, 16);
for (var o = 0; o < this.genderList.length; o++) {
this.genderList[o].active = !1;
}
this.genderList[t.gender].active = !0;
if (l.default.isGiftForbid(t.uid)) {
this.forbidCheckNode.active = !0;
this.forbidUncheckNode.active = !1;
} else {
this.forbidCheckNode.active = !1;
this.forbidUncheckNode.active = !0;
}
this.headImage.url = t.headImg;
};
t.prototype.onClickForbid = function() {
if (l.default.isGiftForbid(this._uid)) {
l.default.removeGiftForbid(this._uid);
this.forbidCheckNode.active = !1;
this.forbidUncheckNode.active = !0;
} else {
l.default.addGiftForbid(this._uid);
this.forbidCheckNode.active = !0;
this.forbidUncheckNode.active = !1;
}
};
t.prototype.onClickSendGift = function(e, t) {
var o = this;
d.default.gameLogic().hideHuDongBiaoqing(a.default.config) || d.default.gameMsgBase().sendChatMsg(u.eChatMsgType.ChatGift, t, function() {
d.default.uiHelper.remove(o);
}, this._uid);
};
r([ m(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ m(cc.Label) ], t.prototype, "idLabel", void 0);
r([ m(cc.Label) ], t.prototype, "ipLabel", void 0);
r([ m(cc.Label) ], t.prototype, "addrLabel", void 0);
r([ m(cc.Node) ], t.prototype, "genderList", void 0);
r([ m(cc.Node) ], t.prototype, "forbidCheckNode", void 0);
r([ m(cc.Node) ], t.prototype, "forbidUncheckNode", void 0);
r([ m(c.default) ], t.prototype, "headImage", void 0);
r([ m(cc.Node) ], t.prototype, "botWrapNode", void 0);
return t = r([ h ], t);
}(i.default);
o.default = y;
cc._RF.pop();
