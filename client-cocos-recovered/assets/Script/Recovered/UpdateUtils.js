// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f7ca5VKarVPrZKI686tyEhx", "UpdateUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = require("./GameConfig"), i = require("./Http"), a = require("./ExUtils"), s = require("./UserData"), l = require("./StringUtils"), c = require("./Storage");
(function(e) {
e.NetError = "net_error";
e.DataError = "data_error";
e.FullUpdate = "full_update";
e.AssertUpdate = "assert_update";
})(n = o.eCheckUpdateCode || (o.eCheckUpdateCode = {}));
(function(e) {
e[e.openUrl = 1] = "openUrl";
e[e.downLoad = 2] = "downLoad";
})(o.eFullUpdateAction || (o.eFullUpdateAction = {}));
var f = function() {
var e = cc.sys.localStorage.getItem("__QJQP_ROLLOUT_KEY__");
if (e) return e;
if (cc.sys.isNative) if (cc.sys.os === cc.sys.OS_ANDROID) try {
e = jsb.reflection.callStaticMethod("com/yuanlai/external/Utils", "getGuestDeviceId", "()Ljava/lang/String;");
} catch (t) {} else if (cc.sys.os === cc.sys.OS_IOS) try {
e = jsb.reflection.callStaticMethod("TalkingDataGA", "getDeviceId");
} catch (t) {}
e || (e = "r-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2));
cc.sys.localStorage.setItem("__QJQP_ROLLOUT_KEY__", e);
return e;
};
var u = new (function() {
function e() {}
e.prototype.getStoragePath = function() {
var e = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + r.default.appName + "/__data__/";
cc.log("path:", e);
return e;
};
e.prototype.cleanLocalCache = function() {
if (cc.sys.isNative) {
var e = "__KY_PACKAGE_VERSION__", t = cc.sys.localStorage.getItem(e);
cc.log("local save version is:" + t);
cc.log("package version is:" + t);
var o = r.default.packageVer;
if (t) if (t == o) ; else {
cc.log("local version is not equal to package: remove storage files.");
jsb.fileUtils.removeDirectory(this.getStoragePath());
cc.sys.localStorage.setItem(e, o);
cc.game.restart();
} else {
cc.log("local version is null : remove storage files.");
jsb.fileUtils.removeDirectory(this.getStoragePath());
cc.sys.localStorage.setItem(e, o);
}
}
};
e.prototype.check = function(e) {
var t = this;
if (cc.sys.isNative) {
var o = i.default.formatUrl(r.default.checkVesionAddr, {
os_type: r.default.appName + "_" + r.default.platform + "_" + a.default.chan(),
package_version: "" + r.default.packageVer,
assert_version: "" + r.default.assertVer,
rollout_key: f(),
uid: cc.sys.localStorage.getItem("__QJQP_ROLLOUT_UID__") || "",
device_name: (cc.sys.os || "") + " " + (cc.sys.osVersion || "")
});
o = r.default.appDunUrl(o);
i.default.get(o, null, function(o, r) {
var i = null;
try {
i = JSON.parse(r);
} catch (t) {
e(n.DataError, "数据异常");
return;
}
if (o) e(n.NetError); else if (i && "0" == i.err_code) if (i.data) {
cc.error("check jsonObj.data:", i.data);
var a = i.data;
if ("2" == a.action) {
var l = a.package_action || "1";
e(n.FullUpdate, {
action: parseInt(l),
url: a.package_url,
desc: a.package_desc,
name: a.package_name
});
} else if ("1" == i.data.action) {
var u = a.assert_version || "0";
e(n.AssertUpdate, {
version: parseInt(u),
url: a.assert_url
});
} else if ("3" == i.data.action) {
s.default.isReivew = !0;
e(null);
} else if (c.default.forceUpdatgePackage.getValue()) if (t.haveNewPackage(a.package_versions)) {
l = a.package_action || "1";
e(n.FullUpdate, {
action: parseInt(l),
url: a.package_url,
desc: a.package_desc,
name: a.package_name
});
} else {
c.default.forceUpdatgePackage.clean();
e(null, a);
} else e(null, a);
} else e(n.DataError, "数据异常"); else e(n.DataError, i.err_msg);
});
} else e(null);
};
e.prototype.haveNewPackage = function(e) {
e = e || [];
for (var t = r.default.packageVer, o = 0, n = e.length; o < n; o++) {
if (l.default.compareVersion(t, e[o]) < 0) return !0;
}
return !1;
};
return e;
}())();
o.default = u;
cc._RF.pop();
