// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f80a4Zd46hDBrhhE3lI/RsH", "RoomUtils");
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
}();
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = require("./Singleton"), i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./gContext"), l = require("./GameInfoData"), c = require("./OperateConfig"), u = require("./HuTypeConfig"), d = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.viewPos2DeskPos = function(e, t) {
var o = 0;
e === i.eViewPos.Down ? o = 0 : e === i.eViewPos.Left ? o = 1 : e === i.eViewPos.Right ? o = -1 : e === i.eViewPos.Up ? o = 2 : cc.error("error view pos");
null !== t && void 0 !== t || (t = a.default.myAbsolutePos());
return this._offsetPos(t, o);
};
t.prototype.deskPos2ViewPos = function(e, t) {
i.eDeskPos.South;
var o = e - (void 0 === t || null === t ? a.default.myAbsolutePos() : t);
return (i.eViewPos.Down + 4 + o) % 4;
};
t.prototype.shareTitle = function() {
return a.default.config.gameName() + "【房间号:" + a.default.roomId + "】";
};
t.prototype.shareText = function() {
for (var e = "", t = a.default.config.storageData(), o = t.ids, n = 0, r = o.length; n < r; n++) {
var i = o[n];
if (c = a.default.config.descDetails(i, !1)) {
e = e + (e.length > 0 ? "," : "") + c;
}
}
var s = t.other || {};
for (var l in s) {
var c, u = parseInt(l);
if (c = a.default.config.descDetails(u, !1)) {
e = e + (e.length > 0 ? "," : "") + c;
}
}
var d = a.default.config.peopleCount();
if (d > 0) {
var p = a.default.players.count();
e = e + "，" + p + "缺" + (d - p) + "，快来凑脚。";
} else e += "。";
return e;
};
t.prototype.isErRen = function() {
return 2 === a.default.config.peopleCount();
};
t.prototype.isAnGangShow = function(e) {
return !!a.default.isPlayback() || (a.default.gameInfo.status !== l.eGameStatus.Gameing || (e === i.eViewPos.Down || s.default.gameLogic(a.default.config.index).isAnGangCardShow()));
};
t.prototype.isShowGuo = function(e) {
for (var t = 0; t < e.count(); t++) {
var o = e.get(t), n = o.cards[0];
if (o.category === c.eOperateCategory.Hu && u.default.isHideGuo(a.default.config.index, n)) return !1;
if (o.category === c.eOperateCategory.LiangDao) return !1;
}
return !0;
};
t.prototype._offsetPos = function(e, t) {
var o = (e + t) % 4;
o < 0 && (o += 4);
return o;
};
return t;
}(r.default);
o.default = d;
cc._RF.pop();
