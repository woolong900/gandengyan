// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4096fO+KCpE7ZMZ9l0MV6UK", "DBDSingleEndLayer");
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
var i = require("./SoundUtils"), a = require("./GameMsgDBD"), s = require("./gContext"), l = require("./TextureRender"), c = require("./WindowConfig"), u = require("./ShareLayer"), d = require("./RoomInfoData"), p = require("./DBDSingleEndData"), f = require("./StringUtils"), h = require("./UserData"), m = require("./DBDSingleEndCell"), y = require("./DBDEventKeys"), g = require("./DBDEnum"), _ = require("./EventUtils"), v = cc._decorator, C = v.ccclass, b = v.property, D = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.winNode = null;
t.loseNode = null;
t.drawNode = null;
t.btnNext = null;
t.btnEnd = null;
t.btnExit = null;
t.btnShare = null;
t.roomId = null;
t.gameCount = null;
t.baseScore = null;
t.timeLabel = null;
t.cellRoot = null;
t.cellPre = null;
t.totalEndPre = null;
t.titleLabel1 = null;
t.titleLabel2 = null;
t.titleLabel3 = null;
return t;
}
t.prototype.start = function() {
var e = this, t = p.default.getInstance(), o = d.default.config.gameCount();
this.roomId.string = "房号：" + d.default.roomId;
this.gameCount.string = "局数：" + d.default.gameInfoDBD.curStep + "/" + o;
this.baseScore.string = "" + this.allRuleDesc(d.default.config, "/");
this.timeLabel.string = f.default.dateFormat(1e3 * t.time, "yyyy-MM-dd hh:mm ");
this._updateTitleLabelShow();
if (d.default.gameInfoDBD.curStep === d.default.config.gameCount()) {
this.btnEnd.active = !0;
this.btnNext.active = !1;
this.btnExit.active = !1;
} else {
this.btnEnd.active = !1;
this.btnNext.active = !0;
}
this.winNode.active = !1;
this.loseNode.active = !1;
this.drawNode.active = !1;
for (var n = !1, r = 0; r < 4; r++) {
var i = cc.instantiate(this.cellPre);
this.cellRoot.addChild(i);
var a = i.getComponent(m.default), l = t.playerUid(r);
if (l === d.default.gameInfoDBD.bankerUid) {
var c = d.default.players.getByUid(l);
d.default.gameInfoDBD.siteInfos.get(c.pos).handCards.length <= 0 && (n = !0);
}
a.setData(r);
}
var u = d.default.gameInfoDBD.isDraw;
if (u) {
this.winNode.active = !u;
this.loseNode.active = !u;
this.drawNode.active = u;
} else if (h.default.uid === d.default.gameInfoDBD.bankerUid) {
this.winNode.active = n;
this.loseNode.active = !n;
} else {
this.winNode.active = !n;
this.loseNode.active = n;
}
d.default.isWatcher() && (this.btnNext.getComponent(cc.Button).interactable = !1);
s.default.eventUtils.on(y.default.data_status_change, function() {
g.eDBDGameStatus.SingleEnd !== d.default.gameInfoDBD.status && e.node.destroy();
}, this, _.eOffType.OnDestroy);
};
t.prototype._updateTitleLabelShow = function() {
if (d.default.config.isChecked(6)) {
this.titleLabel1.string = "池底分";
this.titleLabel2.string = "结算分";
this.titleLabel3.string = "总分";
} else {
this.titleLabel1.string = "余牌";
this.titleLabel2.string = "炸弹";
this.titleLabel3.string = "总分";
}
};
t.prototype.allRuleDesc = function(e, t, o) {
return e.listDescDetails([ 4, 5, 6, 7, 9, 13, 17, 16 ], t);
};
t.prototype.onClickNext = function() {
i.default.clickBtn();
a.default.getInstance().ready(!1);
this.node.destroy();
};
t.prototype.onClickEnd = function() {
i.default.clickBtn();
this.node.destroy();
s.default.uiHelper.gameShow(this.totalEndPre);
};
t.prototype.onClickShare = function() {
i.default.clickBtn();
var e = l.default.screenCapture("single_end_capture.jpg", null, cc.winSize.width, cc.winSize.height);
s.default.uiHelper.show(c.eWindowID.ShareLayer, u.eShareUIType.ShareCaptureImage, e);
};
t.prototype.onClickExit = function() {
i.default.clickBtn();
s.default.msgBox.customExitRoom();
};
r([ b(cc.Node) ], t.prototype, "winNode", void 0);
r([ b(cc.Node) ], t.prototype, "loseNode", void 0);
r([ b(cc.Node) ], t.prototype, "drawNode", void 0);
r([ b(cc.Node) ], t.prototype, "btnNext", void 0);
r([ b(cc.Node) ], t.prototype, "btnEnd", void 0);
r([ b(cc.Node) ], t.prototype, "btnExit", void 0);
r([ b(cc.Node) ], t.prototype, "btnShare", void 0);
r([ b(cc.Label) ], t.prototype, "roomId", void 0);
r([ b(cc.Label) ], t.prototype, "gameCount", void 0);
r([ b(cc.Label) ], t.prototype, "baseScore", void 0);
r([ b(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ b(cc.Node) ], t.prototype, "cellRoot", void 0);
r([ b(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ b(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
r([ b(cc.Label) ], t.prototype, "titleLabel1", void 0);
r([ b(cc.Label) ], t.prototype, "titleLabel2", void 0);
r([ b(cc.Label) ], t.prototype, "titleLabel3", void 0);
return t = r([ C ], t);
}(cc.Component);
o.default = D;
cc._RF.pop();
