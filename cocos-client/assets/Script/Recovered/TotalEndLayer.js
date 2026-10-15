// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "deb94MJZoRAILQh0MppVRPK", "TotalEndLayer");
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
var i = require("./RoomInfoData"), a = require("./StringUtils"), s = require("./TotalEndCell"), l = require("./gContext"), c = require("./BaseComponent"), u = require("./WindowConfig"), d = require("./ShareLayer"), p = require("./TextureRender"), f = require("./GameControl"), h = require("./GameConfig"), m = require("./ExUtils"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.bgMask = null;
t.cellPre = null;
t.cellContainer = null;
t.totalEndSharePre = null;
t.richText = null;
return t;
}
t.prototype.onLoad = function() {
this.bgMask.width = cc.winSize.width;
};
t.prototype.start = function() {
this.setBaseInfo();
this.loadCell();
};
t.prototype.setBaseInfo = function() {
var e = i.default.getTotalEndData(), t = i.default.config.gameCount(), o = i.default.config.playName(), n = l.default.gameLogic().scoreRuleDesc(i.default.config), r = "房号：<color=#bb6b0d>" + i.default.roomId + "     /     </c>", s = "玩法：<color=#bb6b0d>" + o + "     /     </c>", c = "算分：<color=#bb6b0d>" + n + "     /     </c>", u = "局数：<color=#bb6b0d>" + i.default.gameInfo.curStep + "/" + t + "     /     </c>", d = "<size=20>" + a.default.dateFormat(1e3 * e.time, "yyyy-MM-dd hh:mm ") + "</size>";
this.richText.string = r + s + c + u + d;
};
t.prototype.loadCell = function() {
for (var e = i.default.getTotalEndData(), t = 0; t < e.players.length; t++) {
var o = cc.instantiate(this.cellPre);
o.getComponent(s.default).setData(t);
this.cellContainer.addChild(o);
}
};
t.prototype.onBtnBackToHall = function() {
i.default.leaveRoom();
};
t.prototype.onShareRecord = function() {
var e = this, t = f.default.getInstance().captureRoot;
t.destroyAllChildren();
var o = cc.instantiate(this.totalEndSharePre);
t.addChild(o);
this.scheduleOnce(function() {
if (e && e.node && e.node.isValid) {
var n = p.default.screenCapture("total_end_capture.jpg", t, o.width, o.height);
l.default.uiHelper.show(u.eWindowID.ShareLayer, d.eShareUIType.ShareCaptureImage, n);
}
}, .1);
};
t.prototype.onShareUrl = function() {
var e = i.default.config.gameName() + " 房间号:" + i.default.roomId, t = i.default.getTotalEndData(), o = a.default.dateFormat(1e3 * t.time, "yyyy-MM-dd hh:mm:ss"), n = i.default.config.peopleCount() + "人  " + i.default.config.gameCount() + "局\n" + o;
t.players.forEach(function(e) {
var t = a.default.clip(i.default.players.getByUid(e.uid()).name);
n += "\n【" + t + "】 " + e.score();
});
var r = "查看详情: " + h.default.recordShareUrl(i.default.roomCode);
cc.log(e + "\n" + n + "\n" + r);
m.default.copyText(e + "\n" + n + "\n" + r);
l.default.uiHelper.showTip("复制成功！");
};
r([ _(cc.Node) ], t.prototype, "bgMask", void 0);
r([ _(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ _(cc.Node) ], t.prototype, "cellContainer", void 0);
r([ _(cc.Prefab) ], t.prototype, "totalEndSharePre", void 0);
r([ _(cc.RichText) ], t.prototype, "richText", void 0);
return t = r([ g ], t);
}(c.default);
o.default = v;
cc._RF.pop();
