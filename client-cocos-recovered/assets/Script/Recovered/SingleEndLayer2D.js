// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3b1eetR/2BKyLBfEUMnVbm+", "SingleEndLayer2D");
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
var i = e("./RoomInfoData"), a = e("./gContext"), s = e("./StringUtils"), l = e("./SingleEndCell2D"), c = e("./GameMsgMJ"), u = e("./SoundUtils"), d = e("./GameInfoData"), p = e("./WindowConfig"), f = e("./ShareLayer"), h = e("./TextureRender"), m = e("./CommonEnum"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.bgTableMask = null;
t.richText = null;
t.btnNext = null;
t.btnGameEnd = null;
t.btnEixt = null;
t.cellPre = null;
t.dismissPre = null;
t.totalEndPre = null;
t.cellContainer = null;
return t;
}
t.prototype.onLoad = function() {
this.bgTableMask.width = cc.winSize.width;
this.updateUI();
};
t.prototype.updateUI = function() {
this.setBaseInfo();
this.loadCell();
if (i.default.gameInfo.status === d.eGameStatus.TotalEnd) {
this.btnGameEnd.active = !0;
this.btnNext.active = !1;
this.btnEixt.active = !1;
} else {
this.btnGameEnd.active = !1;
this.btnNext.active = !0;
this.btnEixt.active = !0;
}
};
t.prototype.setBaseInfo = function() {
var e = i.default.gameInfo.singleEndInfo, t = i.default.config.gameCount(), o = i.default.config.gameName(), n = a.default.gameLogic().scoreRuleDesc(i.default.config), r = a.default.gameLogic().fengDingDesc(i.default.config);
if (i.default.config.index === m.eGameIds.DYHH) {
var l = "房号：<color=#bb6b0d>" + i.default.roomId + "   </c>", c = "玩法：<color=#bb6b0d>" + o + "   </c>", u = "底分：<color=#bb6b0d>" + n + "   </c>", d = "局数：<color=#bb6b0d>" + i.default.gameInfo.curStep + "/" + t + "   </c>", p = "<size=18>" + s.default.dateFormat(1e3 * e.time, "yyyy-MM-dd hh:mm ") + "</size>", f = "封顶：<color=#bb6b0d>" + r + "   </c>";
this.richText.string = l + c + u + f + d + p;
} else {
l = "房号：<color=#bb6b0d>" + i.default.roomId + "   /   </c>", c = "玩法：<color=#bb6b0d>" + o + "   /   </c>",
u = "算分：<color=#bb6b0d>" + n + "   /   </c>";
i.default.config.index === m.eGameIds.QCHH && (u = "底分：<color=#bb6b0d>" + n + "   /   </c>");
d = "局数：<color=#bb6b0d>" + i.default.gameInfo.curStep + "/" + t + "   /   </c>",
p = "<size=18>" + s.default.dateFormat(1e3 * e.time, "yyyy-MM-dd hh:mm ") + "</size>";
this.richText.string = l + c + u + d + p;
}
};
t.prototype.loadCell = function() {
for (var e = i.default.gameInfo.singleEndInfo, t = e.players.length, o = 0; o < 4; o++) {
var n = this.cellContainer.getChildByName("cell" + o);
if (o < t) {
n.active = !0;
n.getComponent(l.default).setData(o);
} else n.active = !1;
}
for (o = 0; o < e.players.length; o++) ;
};
t.prototype.onQuitRoom = function() {
u.default.clickBtn();
a.default.msgBox.customExitRoom();
};
t.prototype.onShare = function() {
u.default.clickBtn();
var e = h.default.screenCapture("single_end_capture.jpg", this.node, cc.winSize.width, cc.winSize.height);
a.default.uiHelper.show(p.eWindowID.ShareLayer, f.eShareUIType.ShareCaptureImage, e);
};
t.prototype.onNext = function() {
c.GameMsgMJ.getInstance().ready(!1);
this.node.removeFromParent();
this.node.destroy();
};
t.prototype.onEnd = function() {
u.default.clickBtn();
a.default.uiHelper.show(p.eWindowID.TotalEndLayer);
this.node.removeFromParent();
this.node.destroy();
};
r([ _(cc.Node) ], t.prototype, "bgTableMask", void 0);
r([ _(cc.RichText) ], t.prototype, "richText", void 0);
r([ _(cc.Node) ], t.prototype, "btnNext", void 0);
r([ _(cc.Node) ], t.prototype, "btnGameEnd", void 0);
r([ _(cc.Node) ], t.prototype, "btnEixt", void 0);
r([ _(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ _(cc.Prefab) ], t.prototype, "dismissPre", void 0);
r([ _(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
r([ _(cc.Node) ], t.prototype, "cellContainer", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = v;
cc._RF.pop();
