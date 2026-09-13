// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "18016/kDftKLaBF94J6/84T", "ExUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = require("./Bridge"), i = require("./GameConfig"), a = require("./CommonEnum"), s = require("./LocationData"), l = require("./GameConstant"), c = require("./Storage"), u = require("./UserData"), d = require("./StringUtils");
(function(e) {
e.shareText = "shareText";
e.shareImage = "shareImage";
e.shareImageAbs = "shareImageAbs";
e.shareWebpage = "shareWebpage";
e.shareGame = "shareGame";
})(n || (n = {}));
var p = new (function() {
function e() {
this._locationData = null;
}
e.prototype.isDebug = function() {
var e = i.default.platform;
return a.ePlatformType.android !== e && a.ePlatformType.iOS !== e || "false" !== r.default.utils.invoke("isDebug", null, null);
};
e.prototype.metaData = function(e) {
return this._caller("metaData", e);
};
e.prototype.sdkInfo = function(e) {
var t = i.default.platform;
if (a.ePlatformType.android === t || a.ePlatformType.iOS === t) {
return r.default.utils.invoke("sdkInfo", e, null);
}
return null;
};
e.prototype.chan = function() {
var e = i.default.platform;
return a.ePlatformType.android === e || a.ePlatformType.iOS === e ? this.metaData("chan") : "yuanlai";
};
e.prototype.packageVersion = function() {
var e = this._caller("packageVersion", null);
return "unsupport" === e ? l.default.packageVer : e;
};
e.prototype.openWebpage = function(e) {
var t = i.default.platform;
a.ePlatformType.android === t || a.ePlatformType.iOS === t ? r.default.utils.invoke("openWebpage", e, void 0) : window.open(e, "_blank");
};
e.prototype.isInstallWX = function() {
return "true" === this._caller("isInstallWX", null);
};
e.prototype.isInstallXianLiao = function() {
return "true" === this._caller("isInstallXianLiao", null);
};
e.prototype.isInstallDingDing = function() {
return "true" === this._caller("isInstallDingDing", null);
};
e.prototype.isInstallMoWang = function() {
return "true" === this._caller("isInstallMoWang", null);
};
e.prototype.isInstallDeXun = function() {
return "true" === this._caller("isInstallDeXun", null);
};
e.prototype.getLocation = function(e) {
var t = function(e) {
var t = e.longitude, o = e.latitude, n = e.country, r = e.province, i = e.city, a = e.citycode, l = e.district, c = e.adcode, u = e.address;
return new s.default({
latitude: o,
longitude: t,
country: n,
province: r,
city: i,
citycode: a,
district: l,
adcode: c,
address: u
});
}, o = i.default.platform;
if (a.ePlatformType.android === o || a.ePlatformType.iOS === o) {
if ((u = r.default.utils.invoke("getLocation", null, null)) && u.length > 0) try {
var n = t(JSON.parse(u));
c.default.lastLocation.setValue(u);
return n;
} catch (e) {
cc.error(e);
}
if (e) return null;
var l = c.default.lastLocation.getValue();
if (l && l.length > 0) {
return n = t(l);
}
return null;
}
if (e) return null;
var u, d = "" + 180 * (Math.random() - .5), p = "" + 180 * (Math.random() - .5);
return u = new s.default({
latitude: d,
longitude: p,
city: "北京市",
address: "北京市"
});
};
e.prototype.copyText = function(e) {
var t = i.default.platform;
a.ePlatformType.android === t || a.ePlatformType.iOS === t ? r.default.utils.invoke("copyText", e, null) : cc.warn("not support.");
};
e.prototype.cleanCopyText = function() {
this.copyText(" ");
};
e.prototype.pasteText = function(e) {
var t = i.default.platform;
a.ePlatformType.android === t || a.ePlatformType.iOS === t ? r.default.utils.invoke("pasteText", null, e) : e(a.eExCallBackMsg.fail);
};
e.prototype.inviteData = function() {
var e = i.default.platform;
if (a.ePlatformType.android === e || a.ePlatformType.iOS === e) {
return r.default.utils.invoke("inviteData", null, null);
}
return "";
};
e.prototype.cleanInviteData = function() {
var e = i.default.platform;
if (a.ePlatformType.android === e || a.ePlatformType.iOS === e) {
return r.default.utils.invoke("cleanInviteData", null, null);
}
return "";
};
e.prototype.localPhoto = function(e) {
var t = i.default.platform;
a.ePlatformType.android === t || a.ePlatformType.iOS === t ? r.default.utils.invoke("localPhoto", null, e) : e(a.eExCallBackMsg.fail);
};
e.prototype.uploadFile = function(e, t, o) {
var n = i.default.platform;
a.ePlatformType.android === n || a.ePlatformType.iOS === n ? r.default.utils.invoke("uploadFile", {
url: e,
authorization: "",
key: "file",
path: t
}, o) : o(a.eExCallBackMsg.fail);
};
e.prototype.httpDownload = function(e, t, o, n) {
var s = i.default.platform;
a.ePlatformType.android === s ? r.default.utils.invoke("httpDownload", {
url: e,
dir: t,
fileName: o
}, n, !1) : n(a.eExCallBackMsg.fail);
};
e.prototype.downLoadFile = function(e, t, o, n) {
var r = i.default.platform;
if (a.ePlatformType.android === r || a.ePlatformType.iOS === r) {
var s = "com.yuanlai." + i.default.appName, l = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + s + "/" + t + "/";
if (jsb.fileUtils.createDirectory(l)) {
var c = l + o, u = new jsb.Downloader();
u.createDownloadFileTask(e, c);
u.setOnTaskError(function() {
n(a.eExCallBackMsg.cancel);
});
u.setOnFileTaskSuccess(function(e) {
n(a.eExCallBackMsg.success, e);
});
} else {
cc.error("Failed to create storage path, downloader won't work correctly");
n(a.eExCallBackMsg.cancel);
}
} else n(a.eExCallBackMsg.fail);
};
e.prototype.getExternalStoragePath = function() {
var e = i.default.platform;
if (a.ePlatformType.android === e) {
return r.default.utils.invoke("getExternalStoragePath", null, null);
}
return "/";
};
e.prototype.installApk = function(e) {
var t = i.default.platform;
a.ePlatformType.android === t && r.default.utils.invoke("installApk", e, null);
};
e.prototype.batteryRate = function() {
var e = i.default.platform;
if (a.ePlatformType.android === e || a.ePlatformType.iOS === e) {
var t = r.default.utils.invoke("batteryRate", null, null), o = parseInt(t) / 100;
cc.log("batteryRate is:", o);
return o;
}
return 1;
};
e.prototype.checkPermissionLocation = function() {
var e = i.default.platform;
if (a.ePlatformType.android === e || a.ePlatformType.iOS === e) {
return "true" === r.default.utils.invoke("checkPermissionLocation", null, null);
}
return !0;
};
e.prototype.openSettings = function() {
var e = i.default.platform;
a.ePlatformType.android !== e && a.ePlatformType.iOS !== e || r.default.utils.invoke("openSettings", null, null);
};
e.prototype.checkLocationEnabled = function() {
var e = i.default.platform;
if (a.ePlatformType.android === e) {
return "true" === r.default.utils.invoke("checkLocationEnabled", null, null);
}
return !0;
};
e.prototype.openSettingLocation = function() {
var e = i.default.platform;
a.ePlatformType.android === e && r.default.utils.invoke("openSettingLocation", null, null);
};
e.prototype.removeLaunchImg = function() {
var e = i.default.platform;
a.ePlatformType.android !== e && a.ePlatformType.iOS !== e || r.default.utils.invoke("removeLaunchImg", null, null);
};
e.prototype.isSupportRealTimeVoice = function() {
if ("hgmj" !== i.default.appName) return !0;
if (i.default.platform === a.ePlatformType.android) {
var e = this.packageVersion();
return d.default.compareVersion(e, "1.1.1") > 0;
}
return !0;
};
e.prototype.shareText = function(e, t, o, r) {
this._share(e, n.shareText, t, null, o, null, null, r);
};
e.prototype.shareImg = function(e, t, o, r) {
this._share(e, n.shareImage, t, o, null, null, null, r);
};
e.prototype.shareImgAbs = function(e, t, o, r) {
this._share(e, n.shareImageAbs, t, o, null, null, null, r);
};
e.prototype.shareWebPage = function(e, t, o, r, i, a, s) {
this._share(e, n.shareWebpage, t, i, r, a, o, s);
};
e.prototype.shareGame = function(e, t, o, s, l, c, u, d) {
var p = i.default.platform;
if (a.ePlatformType.android === p || a.ePlatformType.iOS === p) {
var f = {
shareType: e,
method: n.shareGame,
scene: t,
text: s || "",
title: o || "",
imgPath: l,
roomId: c || "",
roomToken: u || ""
};
cc.log("share game data is:", f);
r.default.utils.invoke("share", f, d);
} else d && d(a.eExCallBackMsg.fail);
};
e.prototype.openWXMiniProgram = function(e, t, o, n) {
var s = i.default.platform;
if (a.ePlatformType.android === s || a.ePlatformType.iOS === s) {
var l = i.default.gameBaseUrl(), c = "https://";
-1 !== l.indexOf(c) && (l = l.substr(c.length));
c = "http://";
-1 !== l.indexOf(c) && (l = l.substr(c.length));
var d = {
path: o + "?id=" + e + "&url=" + encodeURIComponent(l) + "&uid=" + u.default.uid + "&money=" + t,
userName: n
};
r.default.utils.invoke("openWXMiniProgram", d, null);
}
};
e.prototype._caller = function(e, t) {
var o = i.default.platform, n = "unsupport";
a.ePlatformType.android !== o && a.ePlatformType.iOS !== o || (n = r.default.utils.invoke(e, t, void 0));
return n;
};
e.prototype._share = function(e, t, o, n, s, l, c, u) {
var d = i.default.platform;
if (a.ePlatformType.android === d || a.ePlatformType.iOS === d) {
var p = {
shareType: e,
method: t,
scene: o,
imgPath: n || "",
text: s || "",
url: l || "",
title: c || ""
};
cc.log("share data is:", p);
r.default.utils.invoke("share", p, u);
} else u && u(a.eExCallBackMsg.fail);
};
return e;
}())();
o.default = p;
cc._RF.pop();
