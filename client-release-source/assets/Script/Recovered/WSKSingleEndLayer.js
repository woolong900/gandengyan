// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d87aeeconJNWoeojF1Ji6/O", "WSKSingleEndLayer");
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
var i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./WindowConfig"), c = require("./SoundUtils"), u = require("./gContext"), d = require("./GameMsgWSK"), p = require("./TextureRender"), f = require("./ShareLayer"), h = require("./WSKEnum"), m = require("./WSKEventKeys"), y = require("./WSKSingleEndData"), g = require("./WSKRoomUtils"), _ = cc._decorator, v = _.ccclass, C = _.property, b = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.totalEndPre = null;
return t;
}
t.prototype.onLoad = function() {
for (var e = this, t = 0, o = this.node.childrenCount; t < o; t++) this.node.children[t].active = !1;
if (a.default.config.index === i.eGameIds.QCDG || a.default.config.index === i.eGameIds.XSWSK) {
(n = this.node.getChildByName("qcdg")).active = !0;
(r = n.getChildByName("bgNode")).width = cc.winSize.width;
r.height = cc.winSize.height;
}
if (a.default.config.index === i.eGameIds.QJSHZ || a.default.config.index === i.eGameIds.QJWSKBD) {
var n, r;
(n = this.node.getChildByName("qjshz")).active = !0;
(r = n.getChildByName("bgNode")).width = cc.winSize.width;
r.height = cc.winSize.height;
}
u.default.eventUtils.on(m.default.data_status_change, function() {
h.eWSKGameStatus.SingleEnd !== a.default.gameInfoWSK.status && e.node.destroy();
}, this, s.eOffType.OnDestroy);
};
t.prototype._udpateQCDG = function() {
var e = y.default.getInstance(), t = a.default.gameInfoWSK.curStep === a.default.config.gameCount(), o = this.node.getChildByName("qcdg"), n = o.getChildByName("BtnGameOver"), r = o.getChildByName("BtnGameNext"), s = o.getChildByName("bgNode").getChildByName("btn_exit"), l = o.getChildByName("BtnShare"), c = [];
c.push(o.getChildByName("pos0"));
c.push(o.getChildByName("pos1"));
c.push(o.getChildByName("pos2"));
c.push(o.getChildByName("pos3"));
var u = o.getChildByName("result");
a.default.config.index === i.eGameIds.XSWSK && (u.active = !1);
if (t) {
n.active = !0;
r.active = !1;
s.active = !1;
} else {
n.active = !1;
r.active = !0;
s.active = !0;
}
if (a.default.isWatcher()) {
l.active = !1;
r.active = !1;
}
u.getComponent(cc.Label).string = e.resultStr();
for (var d = 0; d < 4; d++) {
var p = g.default.getInstance().deskPos2ViewPos(d), f = e.score(d), h = e.pickUpScore(d), m = e.bombScore(d);
if (f > 0) {
c[p].getChildByName("win").getComponent(cc.Label).string = "+" + f;
c[p].getChildByName("lose").getComponent(cc.Label).string = "";
} else {
c[p].getChildByName("win").getComponent(cc.Label).string = "";
c[p].getChildByName("lose").getComponent(cc.Label).string = "" + f;
}
c[p].getChildByName("xi").getComponent(cc.Label).string = 0 === m ? "" : "喜分：" + m;
a.default.gameInfoWSK.is1V3() ? c[p].getChildByName("pick").getComponent(cc.Label).string = "" : c[p].getChildByName("pick").getComponent(cc.Label).string = "抓分：" + h;
}
};
t.prototype._udpateQJSHZ = function() {
var e = y.default.getInstance(), t = a.default.gameInfoWSK.curStep === a.default.config.gameCount(), o = this.node.getChildByName("qjshz"), n = o.getChildByName("BtnGameOver"), r = o.getChildByName("BtnGameNext"), i = o.getChildByName("BtnExitBottom"), s = [];
s.push(o.getChildByName("pos0"));
s.push(o.getChildByName("pos1"));
s.push(o.getChildByName("pos2"));
s.push(o.getChildByName("pos3"));
if (t) {
n && (n.active = !0);
r && (r.active = !1);
i && (i.active = !1);
} else {
n && (n.active = !1);
r && (r.active = !0);
i && (i.active = !0);
}
if (a.default.isWatcher()) r && (r.active = !1);
for (var c = a.default.config.peopleCount(), u = 0; u < c; u++) {
var d = g.default.getInstance().deskPos2ViewPos(u), p = e.score(u), f = e.pickUpScore(u);
if (p > 0) {
s[d].getChildByName("win").getComponent(cc.Label).string = "+" + p;
s[d].getChildByName("lose").getComponent(cc.Label).string = "";
} else {
s[d].getChildByName("win").getComponent(cc.Label).string = "";
s[d].getChildByName("lose").getComponent(cc.Label).string = "" + p;
}
var m = s[d].getChildByName("pick").getComponent(cc.Label);
m.overflow = cc.Label.Overflow.SHRINK;
m.string = "抓分：" + f;
}
};
t.prototype.start = function() {
a.default.config.index !== i.eGameIds.QCDG && a.default.config.index !== i.eGameIds.XSWSK || this._udpateQCDG();
a.default.config.index !== i.eGameIds.QJSHZ && a.default.config.index !== i.eGameIds.QJWSKBD || this._udpateQJSHZ();
};
t.prototype.onClickNext = function() {
c.default.clickBtn();
d.default.getInstance().ready(!1);
this.node.destroy();
};
t.prototype.onClickEnd = function() {
c.default.clickBtn();
this.node.destroy();
u.default.uiHelper.gameShow(this.totalEndPre);
};
t.prototype.onClickShare = function() {
c.default.clickBtn();
var e = p.default.screenCapture("single_end_capture.jpg", null, cc.winSize.width, cc.winSize.height);
u.default.uiHelper.show(l.eWindowID.ShareLayer, f.eShareUIType.ShareCaptureImage, e);
};
t.prototype.onClickExit = function() {
c.default.clickBtn();
u.default.msgBox.customExitRoom();
};
r([ C(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
return t = r([ v ], t);
}(cc.Component);
o.default = b;
cc._RF.pop();
