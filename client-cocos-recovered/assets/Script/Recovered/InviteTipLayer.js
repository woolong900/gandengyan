// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "781b2FN8lVE3bSXuyMNOftz", "InviteTipLayer");
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
var i = require("./BaseComponent"), a = require("./SoundUtils"), s = require("./gContext"), l = require("./RoomConfigCellData"), c = require("./ClubMsg"), u = require("./ClubControl"), d = require("./CommonUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._data = null;
t.clubName = null;
t.nameLabel = null;
t.wfLabel = null;
t.checkNode = null;
return t;
}
t.prototype.setData = function(e) {
this._data = e;
this.clubName.string = e.clubInfo.name + "（" + e.clubInfo.code + "）";
this.nameLabel.string = "<color=#5F381C>" + e.inviterInfo.name + " </c><color=#A15920>邀请您进行游戏</color>";
var t = d.default.gameNum2Count(e.roomInfo.gameType, e.roomInfo.num), o = e.roomInfo.param2, n = e.roomInfo.param1, r = s.default.gameLogic(e.roomInfo.gameType).roomParam2Config(t, o, n), i = new l.default(r), a = s.default.gameLogic(i.index).allRuleDesc(i, " / ");
a = (a = a + " / " + t + "局") + " / " + (i.IPStatus() ? "已开启IP及地理限制" : "未开启IP及地理限制");
this.wfLabel.string = a;
};
t.prototype.onClickJoin = function() {
a.default.clickBtn();
s.default.gameMsgBase().joinRoom(this._data.roomInfo.id);
};
t.prototype.onClickReject = function() {
a.default.clickBtn();
s.default.uiHelper.remove(this);
if (this.checkNode.active) {
u.default.remove();
c.default.rejectInvite(this._data.id, !0, function(e, t) {
t || 0 === e.res.error || s.default.uiHelper.showTip(e.res.what);
});
} else u.default.remove(this._data.inviterInfo.code);
};
t.prototype.onClickCheck = function() {
a.default.clickBtn();
this.checkNode.active = !this.checkNode.active;
};
r([ h(cc.Label) ], t.prototype, "clubName", void 0);
r([ h(cc.RichText) ], t.prototype, "nameLabel", void 0);
r([ h(cc.Label) ], t.prototype, "wfLabel", void 0);
r([ h(cc.Node) ], t.prototype, "checkNode", void 0);
return t = r([ f ], t);
}(i.default);
o.default = m;
cc._RF.pop();
