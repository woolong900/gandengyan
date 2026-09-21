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
return t;
}
t.prototype.onLoad = function() {
if (cc.sys.isNative) {
this._storagePath = i.default.getStoragePath();
cc.log("Storage path for remote asset : " + this._storagePath);
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
var t = !1, o = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
o = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
var n = e.getPercent() || 0;
this._updateProgressUI(n);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
o = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
case jsb.EventAssetsManager.UPDATE_FINISHED:
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this._am.downloadFailedAssets();
this._updating = !1;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
case jsb.EventAssetsManager.ERROR_DECOMPRESS:
}
if (o) {
this._updating = !1;
this.hotUpdate(this._version, this._url);
}
t && this.reStartGame();
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
var n = function(e) {
if (o._am && !o._updating) {
o._am.setEventCallback(o.updateCb.bind(o));
if (o._am.getState() === jsb.AssetsManager.State.UNINITED) {
var t = new jsb.Manifest(e, o._storagePath);
o._am.loadLocalManifest(t, o._storagePath);
}
o._am.update();
o._updating = !0;
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
cc.sys.isNative && this._am.setEventCallback(null);
};
t.prototype._updateProgressUI = function(e) {
if (this.node && this.node.isValid && e > this._curP) {
this._curP = e;
this.pNode.width = 947 * e;
this.pLabel.string = (100 * e).toFixed(1) + "%";
}
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
