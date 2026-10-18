// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "73f07jYmPNHw6UcsE1WtLyd", "HotUpdate");
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
var i = require("./UpdateUtils"), a = require("./SoundUtils"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e, t, o) {
try {
var n = JSON.parse(e);
n.packageUrl = o + t + "/";
n.remoteManifestUrl = n.packageUrl + "project.manifest";
n.remoteVersionUrl = n.packageUrl + "version.manifest";
return JSON.stringify(n);
} catch (e) {
return null;
}
}, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._storagePath = null;
t._am = null;
t._updating = !1;
t._url = null;
t._version = null;
t.pNode = null;
t.pLabel = null;
t.manifestAsset = null;
t._curP = 0;
t._lastProgressAt = 0;
t._lastDownloadedBytes = 0;
t._retryCount = 0;
t._maxRetryCount = 3;
t._retryCleaned = !1;
t._retryMode = "failed";
t._retryPending = !1;
t._retryHandler = null;
t._watchdogHandler = null;
t._fatalShown = !1;
t._recoveryLoadedVersion = null;
return t;
}
t.prototype.onLoad = function() {
if (cc.sys.isNative) {
this._storagePath = i.default.getStoragePath();
cc.log("Storage path for remote asset : " + this._storagePath);
this._retryHandler = this._retryUpdate.bind(this);
this._watchdogHandler = this._checkStall.bind(this);
this._am = new jsb.AssetsManager("", this._storagePath, function(e, t) {
cc.log("JS Custom Version Compare: version A is " + e + ", version B is " + t);
return e === t ? 0 : -1;
});
this._am.setVerifyCallback(function(e, t) {
t.compressed;
return !0;
});
cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(3);
}
};
t.prototype.updateCb = function(e) {
var t = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this._scheduleRetry("更新清单不可用", "restart");
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
var n = e.getPercent() || 0;
this._updateProgressUI(n, e);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this._scheduleRetry("更新清单下载失败", "restart");
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this._version && cc.sys.localStorage.setItem("__QJQP_ASSERT_VERSION__", "" + this._version);
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this._version && cc.sys.localStorage.setItem("__QJQP_ASSERT_VERSION__", "" + this._version);
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this._scheduleRetry("部分文件下载失败", "failed");
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
case jsb.EventAssetsManager.ERROR_DECOMPRESS:
this._setStatus("部分文件校验失败，正在处理");
}
if (t) {
this._stopWatchdog();
this._clearRecoveryState();
this.reStartGame();
}
};
t.prototype._recoveryKey = function() {
return "__QJQP_HOT_UPDATE_RECOVERY__";
};
t.prototype._loadRecoveryState = function(e) {
if (this._recoveryLoadedVersion === e) return;
this._recoveryLoadedVersion = e;
this._retryCount = 0;
this._retryCleaned = !1;
try {
var t = JSON.parse(cc.sys.localStorage.getItem(this._recoveryKey()) || "null");
if (t && Number(t.version) === Number(e) && Date.now() - Number(t.lastAt || 0) < 6e5) {
this._retryCount = Math.max(0, Math.min(this._maxRetryCount, Number(t.count) || 0));
this._retryCleaned = !!t.cleaned;
}
} catch (e) {}
};
t.prototype._saveRecoveryState = function() {
try {
cc.sys.localStorage.setItem(this._recoveryKey(), JSON.stringify({
version: this._version,
count: this._retryCount,
cleaned: this._retryCleaned,
lastAt: Date.now()
}));
} catch (e) {}
};
t.prototype._clearRecoveryState = function() {
try {
cc.sys.localStorage.removeItem(this._recoveryKey());
} catch (e) {}
this._retryCount = 0;
this._retryCleaned = !1;
};
t.prototype._setStatus = function(e) {
if (this.pLabel && this.pLabel.node && this.pLabel.node.isValid) this.pLabel.string = e;
};
t.prototype._formatBytes = function(e) {
var t = Math.max(0, Number(e) || 0);
return t >= 1048576 ? (t / 1048576).toFixed(1) + " MB" : (t / 1024).toFixed(0) + " KB";
};
t.prototype._eventNumber = function(e, t) {
try {
var o = e && e[t];
if ("function" === typeof o) {
var n = Number(o.call(e));
if (isFinite(n) && n >= 0) return n;
}
} catch (e) {}
return 0;
};
t.prototype._startWatchdog = function() {
if (!this._watchdogHandler) return;
this.unschedule(this._watchdogHandler);
this._lastProgressAt = Date.now();
this.schedule(this._watchdogHandler, 5);
};
t.prototype._stopWatchdog = function() {
this._watchdogHandler && this.unschedule(this._watchdogHandler);
};
t.prototype._checkStall = function() {
this._updating && this._lastProgressAt > 0 && Date.now() - this._lastProgressAt >= 3e4 && this._scheduleRetry("下载长时间无进度", "restart");
};
t.prototype._clearTemporaryFiles = function() {
if (!cc.sys.isNative || !this._storagePath || !jsb.fileUtils) return;
for (var e = [ this._storagePath + "_temp/", this._storagePath.replace(/\/+$/, "") + "_temp/" ], t = {}, o = 0; o < e.length; o++) {
var n = e[o];
if (!t[n]) {
t[n] = !0;
try {
jsb.fileUtils.removeDirectory(n);
cc.log("Removed hot update temporary path: " + n);
} catch (e) {
cc.warn("Remove hot update temporary path failed: " + e);
}
}
}
};
t.prototype._scheduleRetry = function(e, t) {
if (!this._version || !this._url || this._retryPending) return;
this._retryPending = !0;
this._stopWatchdog();
this.unschedule(this._retryHandler);
this._updating = !1;
this._retryMode = t;
if ("restart" === t && this._am) this._am.setEventCallback(null);
if (this._retryCount < this._maxRetryCount) {
this._retryCount++;
this._saveRecoveryState();
this._setStatus(e + "，正在重试（" + this._retryCount + "/" + this._maxRetryCount + "）");
this.scheduleOnce(this._retryHandler, 2 * this._retryCount);
} else if (!this._retryCleaned) {
this._retryCleaned = !0;
this._saveRecoveryState();
this._setStatus("正在清理异常下载并重新获取更新");
this._clearTemporaryFiles();
this._retryMode = "restart";
this.scheduleOnce(this._retryHandler, 1);
} else this._showManualRetry(e);
};
t.prototype._retryUpdate = function() {
this._retryPending = !1;
if ("restart" === this._retryMode) return void cc.game.restart();
if (!this._am) return void this._showManualRetry("更新组件不可用");
this._setStatus("正在重试下载（" + this._retryCount + "/" + this._maxRetryCount + "）");
this._am.setEventCallback(this.updateCb.bind(this));
this._updating = !0;
this._startWatchdog();
this._am.downloadFailedAssets();
};
t.prototype._showManualRetry = function(e) {
var t = this;
this._stopWatchdog();
this._setStatus("更新暂停，请切换网络后点击确定重试");
if (this._fatalShown) return;
this._fatalShown = !0;
var o = function() {
t._fatalShown = !1;
t._retryPending = !1;
t._retryCount = 0;
t._retryCleaned = !1;
t._clearTemporaryFiles();
t._saveRecoveryState();
cc.game.restart();
};
var n = null;
try {
n = require("./gContext").default;
} catch (e) {}
n && n.msgBox && n.msgBox.showOnlyOk ? n.msgBox.showOnlyOk("更新未完成：" + e + "。请切换到稳定网络，确认后重新下载。", o) : this.scheduleOnce(o, 3);
};
t.prototype.reStartGame = function() {
if (this._am) {
var e = jsb.fileUtils.getSearchPaths(), t = this._am.getLocalManifest().getSearchPaths();
console.log("reStartGame new path is:", JSON.stringify(t));
Array.prototype.unshift.apply(e, t);
cc.sys.localStorage.setItem("__KY_Hot_Update_Search_Paths__", JSON.stringify(e));
jsb.fileUtils.setSearchPaths(e);
a.default.stopAll();
cc.game.restart();
}
};
t.prototype.checkUpdate = function(e) {
var t = this;
if (this._updating) e("updating"); else {
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var o = this.manifestAsset.nativeUrl;
cc.loader.md5Pipe && (o = cc.loader.md5Pipe.transformURL(o));
this._am.loadLocalManifest(o);
}
if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
this._am.setEventCallback(function(o) {
var n = o.getEventCode();
if (n === jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST || n === jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST || n === jsb.EventAssetsManager.ERROR_PARSE_MANIFEST || n === jsb.EventAssetsManager.ALREADY_UP_TO_DATE || n === jsb.EventAssetsManager.NEW_VERSION_FOUND) {
t._am.setEventCallback(null);
t._updating = !1;
}
switch (o.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
e("no_local_manifest");
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
e("net_error");
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
e(null);
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
e("new_version_found");
break;

default:
return;
}
});
this._am.checkUpdate();
this._updating = !0;
} else e("data_error");
}
};
t.prototype.hotUpdate = function(e, t) {
var o = this;
if (e && t) ; else {
cc.error("hot update version or url is error.");
cc.error("version:", e);
cc.error("url:", t);
}
this._version = e;
this._url = t;
this._loadRecoveryState(e);
this._retryPending = !1;
this._curP = 0;
this._lastDownloadedBytes = 0;
this._setStatus("0.0%  正在准备下载");
var n = function(e) {
if (o._am && !o._updating) {
o._am.setEventCallback(o.updateCb.bind(o));
if (o._am.getState() === jsb.AssetsManager.State.UNINITED) {
var t = new jsb.Manifest(e, o._storagePath);
o._am.loadLocalManifest(t, o._storagePath);
}
o._updating = !0;
o._startWatchdog();
o._am.update();
}
}, r = jsb.fileUtils.getStringFromFile(this._storagePath + "/project.manifest"), i = u(r, this._version, this._url);
if (i) {
jsb.fileUtils.writeStringToFile(i, this._storagePath + "/project.manifest");
n(i);
} else cc.loader.load(cc.url.raw("resources/project.manifest"), function(o, r) {
if (o) cc.error("project.manifest is not exit."); else {
i = u(r, e, t);
n(i);
}
});
};
t.prototype.onDestroy = function() {
this._stopWatchdog();
this._retryHandler && this.unschedule(this._retryHandler);
cc.sys.isNative && this._am && this._am.setEventCallback(null);
};
t.prototype._updateProgressUI = function(e, t) {
if (!this.node || !this.node.isValid) return;
var o = Math.max(0, Math.min(1, Number(e) || 0)), n = this._eventNumber(t, "getDownloadedBytes"), r = this._eventNumber(t, "getTotalBytes"), i = this._eventNumber(t, "getDownloadedFiles"), a = this._eventNumber(t, "getTotalFiles"), s = o > this._curP || n > this._lastDownloadedBytes;
if (s) this._lastProgressAt = Date.now();
this._curP = Math.max(this._curP, o);
this._lastDownloadedBytes = Math.max(this._lastDownloadedBytes, n);
if (this.pNode && this.pNode.isValid) this.pNode.width = 947 * this._curP;
var l = (100 * this._curP).toFixed(1) + "%";
if (r > 0) l += "  " + this._formatBytes(n) + "/" + this._formatBytes(r); else if (a > 0) l += "  " + i + "/" + a + " 个文件";
if (this._retryCount > 0) l += "  重试 " + this._retryCount + "/" + this._maxRetryCount;
this._setStatus(l);
};
r([ c(cc.Node) ], t.prototype, "pNode", void 0);
r([ c(cc.Label) ], t.prototype, "pLabel", void 0);
r([ c({
type: cc.Asset
}) ], t.prototype, "manifestAsset", void 0);
return t = r([ l ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
