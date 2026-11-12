// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "82441I6p1lE7r3mTtNSmXM4", "GDSingleEndLayer");
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
var i = require("./SoundUtils"), a = require("./gContext"), s = require("./TextureRender"), l = require("./WindowConfig"), c = require("./ShareLayer"), u = require("./RoomInfoData"), d = require("./StringUtils"), p = require("./UserData"), f = require("./GDSingleEndData"), h = require("./GDSingleEndCell"), m = require("./GDEventKeys"), g = require("./GDEnum"), y = require("./EventUtils"), _ = require("./GameMsgGD"), v = cc._decorator, C = v.ccclass, b = v.property, D = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.winNode = null;
t.loseNode = null;
t.btnNext = null;
t.btnEnd = null;
t.btnExit = null;
t.btnShare = null;
t.roomId = null;
t.gameCount = null;
t.baseScore = null;
t.betnum = null;
t.timeLabel = null;
t.cellRoot = null;
t.cellPre = null;
t.totalEndPre = null;
return t;
}
t.prototype.start = function() {
this.btnExit.active = !1;
require("./PokerActionButtonStyle").applyDdzSettlement(this);
var e = this, t = f.default.getInstance(), o = u.default.config.gameCount();
this.roomId.string = "房号：" + u.default.roomId;
this.gameCount.string = "局数：" + u.default.gameInfoGD.curStep + "/" + o;
this.baseScore.string = "底分：" + u.default.gameInfoGD.m_iBaseScore;
this.betnum.string = "倍数：" + u.default.gameInfoGD.betNum;
this.timeLabel.string = d.default.dateFormat(1e3 * t.time, "yyyy-MM-dd hh:mm ");
if (u.default.gameInfoGD.curStep === u.default.config.gameCount()) {
this.btnEnd.active = !0;
this.btnNext.active = !1;
this.btnExit.active = !1;
} else {
this.btnEnd.active = !1;
this.btnNext.active = !0;
}
this.winNode.active = !1;
this.loseNode.active = !1;
for (var n = 0, r = 0, i = t.playerCount(); r < i; r++) {
var s = cc.instantiate(this.cellPre);
this.cellRoot.addChild(s);
var l = s.getComponent(h.default), c = t.playerUid(r);
if (c === p.default.uid) {
var _ = u.default.players.getByUid(c);
n = u.default.gameInfoGD.siteInfos.get(_.pos).handCards.length;
}
l.setData(r);
}
n > 0 ? this.loseNode.active = !0 : this.winNode.active = !0;
u.default.isWatcher() && (this.btnNext.getComponent(cc.Button).interactable = !1);
a.default.eventUtils.on(m.default.data_status_change, function() {
g.eGDGameStatus.SingleEnd !== u.default.gameInfoGD.status && e.node.destroy();
}, this, y.eOffType.OnDestroy);
};
t.prototype.onClickNext = function() {
i.default.clickBtn();
_.default.getInstance().ready(!1);
this.node.destroy();
};
t.prototype.onClickEnd = function() {
i.default.clickBtn();
this.node.destroy();
a.default.uiHelper.gameShow(this.totalEndPre);
};
t.prototype.onClickShare = function() {
// Preserve the prefab binding; the bottom-left action now exits like DDZ.
this.onClickExit();
};
t.prototype.onClickExit = function() {
i.default.clickBtn();
a.default.msgBox.customExitRoom();
};
r([ b(cc.Node) ], t.prototype, "winNode", void 0);
r([ b(cc.Node) ], t.prototype, "loseNode", void 0);
r([ b(cc.Node) ], t.prototype, "btnNext", void 0);
r([ b(cc.Node) ], t.prototype, "btnEnd", void 0);
r([ b(cc.Node) ], t.prototype, "btnExit", void 0);
r([ b(cc.Node) ], t.prototype, "btnShare", void 0);
r([ b(cc.Label) ], t.prototype, "roomId", void 0);
r([ b(cc.Label) ], t.prototype, "gameCount", void 0);
r([ b(cc.Label) ], t.prototype, "baseScore", void 0);
r([ b(cc.Label) ], t.prototype, "betnum", void 0);
r([ b(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ b(cc.Node) ], t.prototype, "cellRoot", void 0);
r([ b(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ b(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
return t = r([ C ], t);
}(cc.Component);
o.default = D;
cc._RF.pop();
