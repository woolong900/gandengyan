// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4541dNX6j5GULrgfdDpqgGo", "D7SingleEndLayer");
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
var i = e("./RoomInfoData"), a = e("./SoundUtils"), s = e("./gContext"), l = e("./WindowConfig"), c = e("./TextureRender"), u = e("./ShareLayer"), d = e("./BaseComponent"), p = e("./D7SingleEndData"), f = e("./StringUtils"), h = e("./D7SingleEndCell"), m = e("./GameMsgD7"), y = e("./UserData"), g = e("./D7EventKeys"), _ = e("./D7Enum"), v = e("./EventUtils"), C = cc._decorator, b = C.ccclass, D = C.property, S = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.winNode = null;
t.loseNode = null;
t.drawNode = null;
t.btnNext = null;
t.btnEnd = null;
t.btnGoOn = null;
t.btnShare = null;
t.btnShowTable = null;
t.roomId = null;
t.gameCount = null;
t.timeLabel = null;
t.btnExit = null;
t.cellRoot = null;
t.cellPre = null;
t.totalEndPre = null;
return t;
}
t.prototype.start = function() {
var e = this, t = i.default.myAbsolutePos(), o = p.default.getInstance(), n = i.default.config.gameCount();
this.roomId.string = "房号：" + i.default.roomId;
this.gameCount.string = "局数：" + i.default.gameInfoD7.curStep + "/" + n;
this.timeLabel.string = f.default.dateFormat(1e3 * o.time, "yyyy-MM-dd hh:mm ");
if (i.default.gameInfoD7.curStep === i.default.config.gameCount()) {
this.btnEnd.active = !0;
this.btnGoOn.active = !1;
this.btnNext.active = !1;
this.btnExit.active = !1;
} else if (i.default.players.getByPos(t).isReady()) {
this.btnEnd.active = !1;
this.btnGoOn.active = !0;
this.btnNext.active = !1;
} else {
this.btnEnd.active = !1;
this.btnGoOn.active = !1;
this.btnNext.active = !0;
}
this.winNode.active = !1;
this.loseNode.active = !1;
this.drawNode.active = !1;
for (var r = 0, a = o.playerCount(); r < a; r++) {
var l = cc.instantiate(this.cellPre);
this.cellRoot.addChild(l);
var c = l.getComponent(h.default);
o.playerUid(r) === y.default.uid && o.playerScore(r);
c.setData(r);
}
if (p.default.getInstance().isLiuJu()) this.drawNode.active = !0; else {
var u = i.default.myAbsolutePos();
p.default.getInstance().playerScore(u) > 0 ? this.winNode.active = !0 : this.loseNode.active = !0;
}
if (i.default.isWatcher()) {
this.btnNext.color = new cc.Color(136, 136, 136);
this.btnGoOn.color = new cc.Color(136, 136, 136);
this.btnShowTable.color = new cc.Color(136, 136, 136);
this.btnNext.getComponent(cc.Button).interactable = !1;
this.btnShowTable.getComponent(cc.Button).interactable = !1;
this.btnGoOn.getComponent(cc.Button).interactable = !1;
}
s.default.eventUtils.on(g.default.data_status_change, function() {
_.eD7GameStatus.SingleEnd !== i.default.gameInfoD7.status && e.node.destroy();
}, this, v.eOffType.OnDestroy);
};
t.prototype.onClickNext = function() {
m.default.getInstance().ready(!1);
this.node.destroy();
};
t.prototype.onClickEnd = function() {
a.default.clickBtn();
this.node.destroy();
s.default.uiHelper.gameShow(this.totalEndPre);
};
t.prototype.onClickGoOn = function() {
a.default.clickBtn();
this.node.destroy();
};
t.prototype.onClickShowTable = function() {
a.default.clickBtn();
this.node.destroy();
};
t.prototype.onClickShare = function() {
a.default.clickBtn();
var e = c.default.screenCapture("single_end_capture.jpg", null, cc.winSize.width, cc.winSize.height);
s.default.uiHelper.show(l.eWindowID.ShareLayer, u.eShareUIType.ShareCaptureImage, e);
};
t.prototype.onClickExit = function() {
a.default.clickBtn();
s.default.msgBox.customExitRoom();
};
r([ D(cc.Node) ], t.prototype, "winNode", void 0);
r([ D(cc.Node) ], t.prototype, "loseNode", void 0);
r([ D(cc.Node) ], t.prototype, "drawNode", void 0);
r([ D(cc.Node) ], t.prototype, "btnNext", void 0);
r([ D(cc.Node) ], t.prototype, "btnEnd", void 0);
r([ D(cc.Node) ], t.prototype, "btnGoOn", void 0);
r([ D(cc.Node) ], t.prototype, "btnShare", void 0);
r([ D(cc.Node) ], t.prototype, "btnShowTable", void 0);
r([ D(cc.Label) ], t.prototype, "roomId", void 0);
r([ D(cc.Label) ], t.prototype, "gameCount", void 0);
r([ D(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ D(cc.Node) ], t.prototype, "btnExit", void 0);
r([ D(cc.Node) ], t.prototype, "cellRoot", void 0);
r([ D(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ D(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
return t = r([ b ], t);
}(d.default);
o.default = S;
cc._RF.pop();
