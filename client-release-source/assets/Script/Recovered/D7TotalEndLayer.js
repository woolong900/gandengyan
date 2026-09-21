// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0a30c6xWixEF50BscT2cYLP", "D7TotalEndLayer");
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
var i = require("./SoundUtils"), a = require("./RoomInfoData"), s = require("./gContext"), l = require("./StringUtils"), c = require("./D7TotalEndCell"), u = require("./D7GameControl"), d = require("./TextureRender"), p = require("./WindowConfig"), f = require("./ShareLayer"), h = require("./BaseComponent"), m = require("./CommonEnum"), y = require("./PDKGameControl"), g = require("./GameConfig"), _ = require("./ExUtils"), v = require("./WSKGameControl"), C = require("./DBDGameControl"), b = require("./DDZGameControl"), D = cc._decorator, S = D.ccclass, w = D.property, O = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.roomInfo = null;
t.time = null;
t.cellRoot1 = null;
t.cellRoot2 = null;
t.cellPre = null;
t.totalEndSharePre = null;
t.gameCategort = m.eGameCategort.D7;
t.btnGameEnd = null;
t.btnShare = null;
t.btnCopyRecord = null;
return t;
}
t.prototype.start = function() {
var e = a.default.config.gameCount(), t = a.default.config.gameName(), o = s.default.gameLogic().scoreRuleDesc(a.default.config), n = "房号：<color=#bb6b0d>" + a.default.roomId + "   /   </c>", r = "玩法：<color=#bb6b0d>" + t + "   /   </c>", i = "局数：<color=#bb6b0d>" + a.default.curStep() + "/" + e + "</c>", u = "算分：<color=#bb6b0d>" + o + "   /   </c>", d = "";
if (this.gameCategort === m.eGameCategort.DBD && a.default.config.isChecked(6)) {
a.default.gameInfoDBD.betNum;
d = "       底分池剩余积分：<color=#bb6b0d>0</c>";
}
this.gameCategort === m.eGameCategort.DDZ && (u = "");
this.roomInfo.string = n + r + u + i + d;
var p = a.default.getTotalEndData();
this.time.string = l.default.dateFormat(1e3 * p.time, "yyyy-MM-dd hh:mm");
for (var f = p.players.length, h = this._rootNodeByGame(f), y = 0; y < f; y++) {
var g = cc.instantiate(this.cellPre);
h.addChild(g);
g.getComponent(c.default).setData(y);
}
};
t.prototype._rootNodeByGame = function(e) {
return this.gameCategort === m.eGameCategort.D7 && e > 4 ? this.cellRoot2 : this.gameCategort === m.eGameCategort.PDK && 2 === e ? this.cellRoot2 : this.cellRoot1;
};
t.prototype._captureRoot = function() {
return this.gameCategort === m.eGameCategort.D7 ? u.default.getInstance().captureRoot : this.gameCategort === m.eGameCategort.PDK ? y.default.getInstance().captureRoot : this.gameCategort === m.eGameCategort.WSK ? v.default.getInstance().captureRoot : this.gameCategort === m.eGameCategort.DBD ? C.default.getInstance().captureRoot : this.gameCategort === m.eGameCategort.DDZ ? b.default.getInstance().captureRoot : null;
};
t.prototype.onClickGameOver = function() {
i.default.clickBtn();
a.default.leaveRoom();
};
t.prototype.onClickShare = function() {
var e = this;
i.default.clickBtn();
var t = this._captureRoot();
if (t) {
t.destroyAllChildren();
var o = cc.instantiate(this.totalEndSharePre);
t.addChild(o);
this.scheduleOnce(function() {
if (e && e.node && e.node.isValid) {
var n = d.default.screenCapture("total_end_capture.jpg", t, o.width, o.height);
s.default.uiHelper.show(p.eWindowID.ShareLayer, f.eShareUIType.ShareCaptureImage, n);
}
}, .1);
} else cc.error("分享截屏的root节点无效~");
};
t.prototype.onShareUrl = function() {
var e = a.default.config.gameName() + " 房间号:" + a.default.roomId, t = a.default.getTotalEndData(), o = l.default.dateFormat(1e3 * t.time, "yyyy-MM-dd hh:mm:ss"), n = a.default.config.peopleCount() + "人  " + a.default.config.gameCount() + "局\n" + o;
t.players.forEach(function(e) {
var t = l.default.clip(a.default.players.getByUid(e.uid()).name);
n += "\n【" + t + "】 " + e.score();
});
var r = "查看详情: " + g.default.recordShareUrl(a.default.roomCode);
cc.log(e + "\n" + n + "\n" + r);
_.default.copyText(e + "\n" + n + "\n" + r);
s.default.uiHelper.showTip("复制成功！");
};
r([ w(cc.RichText) ], t.prototype, "roomInfo", void 0);
r([ w(cc.Label) ], t.prototype, "time", void 0);
r([ w(cc.Node) ], t.prototype, "cellRoot1", void 0);
r([ w(cc.Node) ], t.prototype, "cellRoot2", void 0);
r([ w(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ w(cc.Prefab) ], t.prototype, "totalEndSharePre", void 0);
r([ w({
type: cc.Enum(m.eGameCategort),
displayName: "游戏类别",
serializable: !0,
tooltip: "添加游戏列表需要根据游戏类别，修改代码"
}) ], t.prototype, "gameCategort", void 0);
r([ w(cc.Node) ], t.prototype, "btnGameEnd", void 0);
r([ w(cc.Node) ], t.prototype, "btnShare", void 0);
r([ w(cc.Node) ], t.prototype, "btnCopyRecord", void 0);
return t = r([ S ], t);
}(h.default);
o.default = O;
cc._RF.pop();
