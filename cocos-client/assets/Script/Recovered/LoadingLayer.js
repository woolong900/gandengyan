// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d9c39za1dlEm6nt66eZh2f0", "LoadingLayer");
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
var i = require("./UpdateUtils"), a = require("./ExUtils"), s = require("./GameConfig"), l = require("./FullUpdate"), c = require("./gContext"), u = require("./HotUpdate"), d = require("./Loader"), p = require("./MsgBoxCommon"), f = require("./BaseComponent"), h = require("./WindowConfig"), m = require("./LoginLayer"), y = require("./CommonEnum"), g = require("./EventUtils"), _ = require("./UserData"), v = require("./Storage"), C = require("./Http"), b = cc._decorator, D = b.ccclass, S = b.property, w = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._descStr = "检测更新中";
t.desc = null;
t.hotUpdate = null;
t.rootNode = null;
t.loginRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._descStr = "检测更新中";
this._descAnimate();
this.rootNode.active = !1;
this.loginRoot.active = !0;
c.default.uiHelper.showLoading("更新检测中");
c.default.eventUtils.on("on_off_ok", function() {
cc.log("on off ok.");
e.checkFull(3);
}, this, g.eOffType.OnDestroy);
this.initActivityData();
this.schedule(function() {
e.initActivityData();
}, 2, cc.macro.REPEAT_FOREVER, 0);
};
t.prototype.initActivityData = function() {
var e = this;
_.default.showPopActivity = !0;
var t = s.default.gameBaseUrl() + "/v1/config?key=activity_openTimes";
C.default.get(t, null, function(t, o) {
if (t) e.clearActivityForceUpdateImageUrl(); else try {
var n = JSON.parse(o);
if ("0" === n.err_code) if (n.data) {
var r = n.data[0];
if (r.picUrl && r.startTime && r.endTime) v.default.activityForceUpdateImageUrl.getValue() !== r.picUrl ? a.default.downLoadFile(r.picUrl, "activityImg", "download_activity_img.png", function(t, o) {
if (t === y.eExCallBackMsg.success) {
v.default.activityCacheImageUrl.setValue(o.storagePath);
v.default.activityForceUpdateImageUrl.setValue(r.picUrl);
e.startActivity(r);
} else if (t === y.eExCallBackMsg.cancel) _.default.activityData = null; else if (t === y.eExCallBackMsg.fail) {
v.default.activityCacheImageUrl.setValue(r.picUrl);
v.default.activityForceUpdateImageUrl.setValue(r.picUrl);
e.startActivity(r);
}
}) : e.startActivity(r); else {
cc.error("传参数有误！");
_.default.activityData = null;
}
} else e.clearActivityForceUpdateImageUrl();
} catch (t) {
e.clearActivityForceUpdateImageUrl();
}
});
};
t.prototype.startActivity = function(e) {
if (e.picUrl && e.startTime && e.endTime) {
var t = new Date(e.startTime), o = new Date(e.endTime), n = _.default.millisecond >= t.getTime(), r = _.default.millisecond >= o.getTime();
if (n && !r) {
var i = v.default.activityCacheImageUrl.getValue();
i = s.default.appDunUrl(i);
i && "" !== i ? cc.loader.load(i, function(t, o) {
if (!t && o) _.default.activityData = {
startTime: e.startTime || "",
endTime: e.endTime || "",
picUrl: i || "",
btnCloseOffsetX: e.btnCloseOffsetX || 0,
btnCloseOffsetY: e.btnCloseOffsetY || 0,
ImgX: e.ImgX || 0,
ImgY: e.ImgY || 0,
btnCloseImgIndex: e.btnCloseImgIndex || 0
}; else {
cc.error(t);
_.default.activityData = null;
}
}) : _.default.activityData = null;
} else this.clearActivityForceUpdateImageUrl();
} else {
cc.error("传参数有误!!");
_.default.activityData = null;
}
};
t.prototype.clearActivityForceUpdateImageUrl = function() {
_.default.activityData = null;
v.default.activityForceUpdateImageUrl.setValue("");
v.default.activityCacheImageUrl.setValue("");
};
t.prototype._descAnimate = function() {
var e = this, t = cc.delayTime(.3), o = cc.callFunc(function() {
e.desc.string = e._descStr;
}), n = cc.delayTime(.3), r = cc.callFunc(function() {
e.desc.string = e._descStr + ".";
}), i = cc.delayTime(.3), a = cc.callFunc(function() {
e.desc.string = e._descStr + "..";
}), s = cc.delayTime(.3), l = cc.callFunc(function() {
e.desc.string = e._descStr + "...";
}), c = cc.repeatForever(cc.sequence(t, o, n, r, i, a, s, l));
this.node.runAction(c);
};
t.prototype.checkFull = function(e) {
var t = this;
if (e <= 0) c.default.msgBox.showOnlyOk("更新失败：请检查网络是否良好、网络授权是否开启.", function() {
t.checkFull(3);
}); else {
c.default.uiHelper.showLoading("更新检测中");
i.default.check(function(o, n) {
c.default.uiHelper.removeLoading();
if (o) {
cc.log("loadingLayer checkFull code:", o);
if (o === i.eCheckUpdateCode.FullUpdate) {
var r = n.desc || "发现新版本,立即更新体验最新玩法？", a = n.action;
s.default.platform === y.ePlatformType.iOS && (a = i.eFullUpdateAction.openUrl);
t._showFullUpdate(r, a, n.url, n.name);
} else if (o === i.eCheckUpdateCode.DataError) c.default.msgBox.showOnlyOk("更新失败：请检查网络是否良好、网络授权是否开启~", function() {
t.checkFull(3);
}); else if (o === i.eCheckUpdateCode.AssertUpdate) {
t.rootNode.active = !0;
t.loginRoot.active = !1;
t._descStr = "下载更新中";
var l = n.url || "https://gmhiu.com/" + s.default.appName + "/update/";
t.hotUpdate.hotUpdate(n.version, l);
} else t.checkFull(e - 1);
} else t.loginRoot.getComponent(m.default).tryLogin();
});
}
};
t.prototype.fixGame = function() {
this.hotUpdate.reStartGame();
};
t.prototype._showFullUpdate = function(e, t, o, n) {
var r = this, s = function() {
if (t === i.eFullUpdateAction.downLoad) {
r.rootNode.active = !0;
r.loginRoot.active = !1;
r._descStr = "下载更新中";
c.default.uiHelper.remove(h.eWindowID.MsgBoxCommon);
r.node.getComponent(l.default).download(o, n);
} else {
a.default.openWebpage(o);
cc.game.end();
}
}, u = function() {
cc.game.end();
};
d.default.loadPre("Hall/Res/Prefab/MsgBox/MsgBoxCommon", function(t) {
var o = cc.instantiate(t);
o.getComponent(p.default).setContent(e).setConfirmCB(s).setCancelCB(u).setShowClose(!1).setConfirmRemove(!1);
c.default.uiHelper.showWithNode(h.eWindowID.MsgBoxCommon, o);
});
};
r([ S(cc.Label) ], t.prototype, "desc", void 0);
r([ S(u.default) ], t.prototype, "hotUpdate", void 0);
r([ S(cc.Node) ], t.prototype, "rootNode", void 0);
r([ S(cc.Node) ], t.prototype, "loginRoot", void 0);
return t = r([ D ], t);
}(f.default);
o.default = w;
cc._RF.pop();
