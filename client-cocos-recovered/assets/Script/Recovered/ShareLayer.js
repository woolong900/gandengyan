// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "60632jGov9KjYzdK9oJJ2Dl", "ShareLayer");
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
var i, a = e("./BaseComponent"), s = e("./ExUtils"), l = e("./gContext"), c = e("./CommonEnum"), u = e("./RoomInfoData"), d = e("./GameConfig"), p = e("./CenterMsg"), f = e("./EventKeys"), h = e("./RoomUtils"), m = cc._decorator, y = m.ccclass, g = m.property;
(function(e) {
e[e.ShareHall = 0] = "ShareHall";
e[e.ShareGameInvite = 1] = "ShareGameInvite";
e[e.ShareCaptureImage = 2] = "ShareCaptureImage";
e[e.ShareTotalEndUrl = 3] = "ShareTotalEndUrl";
})(i = o.eShareUIType || (o.eShareUIType = {}));
var _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._captureImgPath = null;
t._shareUIType = i.ShareHall;
t.iconAsset = null;
t.downloadImgAsset = null;
t.bgNode = null;
t.xlNode = null;
t.wxFriendNode = null;
t.wxCircleNode = null;
t.ddNode = null;
t.mwNode = null;
return t;
}
t.prototype.start = function() {
d.default.gameInitShareUrl();
var e = cc.moveTo(.2, cc.v2(0, this.bgNode.height / 2 - 360)).easing(cc.easeBackIn());
this.bgNode.runAction(e);
};
t.prototype.setData = function(e, t) {
this._shareUIType = e;
this._captureImgPath = t;
this.xlNode.active = !1;
this.wxFriendNode.active = !0;
this.wxCircleNode.active = this._shareUIType === i.ShareHall;
this.ddNode.active = !1;
this.mwNode.active = !1;
};
t.prototype.share = function(e, t) {
if (this._shareUIType === i.ShareHall) {
var o = function(o) {
e === c.eAccountType.wechat && t === c.eShareScene.Circle && p.default.shareForCard(function(e, t) {
t || e && e.giveCardNum && l.default.eventUtils.emit(f.default.ui_share_wxcircle_end);
});
};
if (e === c.eAccountType.wechat && t === c.eShareScene.Circle) {
var n = this.downloadImgPath();
if (cc.sys.isNative) {
var r = jsb.fileUtils.getSearchPaths()[0] || "", a = r + n;
r && r.search("__data__") >= 0 && jsb.fileUtils.isFileExist(a) ? s.default.shareImgAbs(e, t, a, o) : s.default.shareImg(e, t, n, o);
} else s.default.shareImg(e, t, n, o);
} else if (e === c.eAccountType.wechat && t === c.eShareScene.Friend || e === c.eAccountType.dingding || e === c.eAccountType.mowang) {
var m = "最好玩的游戏", y = "最正宗的玩法", g = d.default.downloadUrl({});
cc.sys.isNative && s.default.shareWebPage(e, t, y, m, this.iconPath(), g);
}
}
if (this._shareUIType === i.ShareGameInvite) {
m = h.default.getInstance().shareText(), y = h.default.getInstance().shareTitle(),
g = d.default.downloadUrl({
roomId: u.default.roomId
});
e === c.eAccountType.xianLiao ? s.default.shareGame(e, t, y, m, this.iconPath(), "" + u.default.roomId, " ") : s.default.shareWebPage(e, t, y, m, this.iconPath(), g);
}
this._shareUIType === i.ShareCaptureImage && s.default.shareImgAbs(e, t, this._captureImgPath);
if (this._shareUIType === i.ShareTotalEndUrl) {
y = "游戏战绩 房间号：" + u.default.roomId, g = d.default.recordShareUrl(u.default.roomCode);
for (var _ = "本房间玩家及积分查看>> ", v = u.default.players.collection(function(e) {
return !e.isWatcher();
}), C = 0, b = v.length; C < b; C++) {
var D = parseInt(v[C]);
_ += u.default.players.getByUid(D).name;
C < b - 1 && (_ += "、");
}
_ += " 点击查看详情";
s.default.shareWebPage(e, t, y, _, this.iconPath(), g);
}
l.default.uiHelper.remove(this);
};
t.prototype.onClickShareXianLiao = function() {
s.default.isInstallXianLiao() ? this.share(c.eAccountType.xianLiao, c.eShareScene.Friend) : l.default.uiHelper.showTip("您尚未安装闲聊客户端！");
};
t.prototype.onClickShareWxFriend = function() {
this.share(c.eAccountType.wechat, c.eShareScene.Friend);
};
t.prototype.onClickShareWxCircle = function() {
this.share(c.eAccountType.wechat, c.eShareScene.Circle);
};
t.prototype.onClickShareDingTalk = function() {
s.default.isInstallDingDing() ? this.share(c.eAccountType.dingding, c.eShareScene.Friend) : l.default.uiHelper.showTip("您尚未安装钉钉客户端！");
};
t.prototype.onClickShareMoWang = function() {
s.default.isInstallMoWang() ? this.share(c.eAccountType.mowang, c.eShareScene.Friend) : l.default.uiHelper.showTip("您尚未安装默往客户端！");
};
t.prototype.onClickShareDeXun = function() {
s.default.isInstallDeXun() ? this.share(c.eAccountType.deXun, c.eShareScene.Friend) : l.default.uiHelper.showTip("您尚未安装德讯客户端！");
};
t.prototype.iconPath = function() {
var e = this.iconAsset.nativeUrl;
cc.loader.md5Pipe && "" != e && (e = cc.loader.md5Pipe.transformURL(e));
cc.log("icon path is:", e);
return e;
};
t.prototype.downloadImgPath = function() {
var e = this.downloadImgAsset.nativeUrl;
cc.loader.md5Pipe && (e = cc.loader.md5Pipe.transformURL(e));
cc.log("download path is:", e);
return e;
};
r([ g({
type: cc.Asset
}) ], t.prototype, "iconAsset", void 0);
r([ g({
type: cc.Asset
}) ], t.prototype, "downloadImgAsset", void 0);
r([ g(cc.Node) ], t.prototype, "bgNode", void 0);
r([ g(cc.Node) ], t.prototype, "xlNode", void 0);
r([ g(cc.Node) ], t.prototype, "wxFriendNode", void 0);
r([ g(cc.Node) ], t.prototype, "wxCircleNode", void 0);
r([ g(cc.Node) ], t.prototype, "ddNode", void 0);
r([ g(cc.Node) ], t.prototype, "mwNode", void 0);
return t = r([ y ], t);
}(a.default);
o.default = _;
cc._RF.pop();
