// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "fe86eGbCW9OqrGN6TdAp5I8", "GameConfig");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonEnum"), r = require("./ExUtils"), i = require("./GameConstant"), a = require("./Http"), s = new (function() {
function e() {
this._platform = n.ePlatformType.unknown;
this._mode = n.eGameMode.unknown;
this._packageVer = null;
this._appDunOnOff = !1;
this._shareDownLoadUrl = "";
this._sharePicAsset = null;
this._shareQrAsset = null;
this._dataDomainArr = [];
}
Object.defineProperty(e.prototype, "appDunOnOff", {
set: function(e) {
this._appDunOnOff = e;
},
enumerable: !0,
configurable: !0
});
e.prototype.appDunUrl = function(e) {
return e;
};
Object.defineProperty(e.prototype, "platform", {
get: function() {
if (this._platform === n.ePlatformType.unknown) {
this._platform = n.ePlatformType.web;
cc.sys.isNative && (cc.sys.OS_ANDROID == cc.sys.os ? this._platform = n.ePlatformType.android : cc.sys.OS_IOS == cc.sys.os ? this._platform = n.ePlatformType.iOS : cc.sys.OS_WINDOWS && (this._platform = n.ePlatformType.win32));
}
return this._platform;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "mode", {
get: function() {
this._mode === n.eGameMode.unknown && (r.default.isDebug() ? this._mode = n.eGameMode.debug : this._mode = n.eGameMode.release);
return this._mode;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "appName", {
get: function() {
return i.default.appName;
},
enumerable: !0,
configurable: !0
});
e.prototype.area = function() {
if ("hgmj" === this.appName) return n.eArea.HG;
if ("qjqp" === this.appName) return n.eArea.QJ;
if ("dymj" === this.appName) return n.eArea.HS;
0;
};
Object.defineProperty(e.prototype, "assertVer", {
get: function() {
if (!i.default.assertVer) {
if ("hgmj" === this.appName) return 270;
if ("qjqp" === this.appName) return 198;
if ("dymj" === this.appName) return 257;
}
return i.default.assertVer;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "packageVer", {
get: function() {
this._packageVer || (this._packageVer = r.default.packageVersion());
return this._packageVer;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "checkVesionAddr", {
get: function() {
return i.default.check_version_addr[this.mode];
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "accountServerAddr", {
get: function() {
return i.default.account_server_addr[this.mode];
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "socketServerAddr", {
get: function() {
return i.default.socket_server_addr[this.mode];
},
enumerable: !0,
configurable: !0
});
e.prototype.gameBaseUrl = function() {
return i.default.game_base_url[this.mode];
};
e.prototype.gameAgentUrl = function() {
return i.default.agent_base_url[this.mode];
};
e.prototype.gameShareDownUrl = function() {
return i.default.download_url[this.mode];
};
e.prototype.gameInitShareUrl = function() {
var e = this;
this._dataDomainArr = [];
var t = s.gameBaseUrl() + "/v1/forwardconfig?key=ym";
a.default.get(t, null, function(t, o) {
if (t) {
cc.error("http login data err:", t);
e._shareDownLoadUrl = s.gameShareDownUrl();
} else try {
var r = JSON.parse(o);
if ("0" === r.err_code) {
var i = JSON.parse(r.data), a = function(t) {
var o = i[t];
Object.keys(o).forEach(function(t) {
"type" != t && ("hg" === o.type && e.area() == n.eArea.HG ? e._dataDomainArr.push(o[t]) : "qj" === o.type && e.area() == n.eArea.QJ ? e._dataDomainArr.push(o[t]) : "hs" === o.type && e.area() == n.eArea.HS && e._dataDomainArr.push(o[t]));
});
};
for (var l in i) a(l);
}
} catch (t) {
cc.error("http login data error:", t);
e._shareDownLoadUrl = s.gameShareDownUrl();
}
});
};
e.prototype._getRandomIndex = function() {
var e = this._dataDomainArr, t = Math.round(Math.random() * (e.length - 1)), o = !1;
return function() {
if (t < e.length - 1 && !o) return t++;
if (t <= 0) {
o = !1;
return t++;
}
if (t >= e.length - 1 || o) {
o = !0;
return t--;
}
}();
};
e.prototype.downloadBaseUrl = function() {
var e = i.default.download_url;
if (this._dataDomainArr.length > 0) {
var t = 0;
this._dataDomainArr.length > 1 && (t = this._getRandomIndex());
this._shareDownLoadUrl = this._dataDomainArr[t] || e[this.mode];
} else this._shareDownLoadUrl = e[this.mode];
var o = s.gameBaseUrl() + "/v1/donamerecord?urlName=" + this._shareDownLoadUrl;
a.default.get(o, null, function(e, t) {});
return this._shareDownLoadUrl;
};
e.prototype.sharePicAssets = function() {
return this._sharePicAsset;
};
e.prototype.shareQrAssets = function() {
return this._shareQrAsset;
};
e.prototype.downloadUrl = function(e) {
var t = this.downloadBaseUrl() + "/download";
return a.default.formatUrl(t, e);
};
e.prototype.recordShareUrl = function(e) {
return this.downloadBaseUrl() + "/download/record?id=" + e;
};
e.prototype.uploadPicUrl = function() {
return this.gameBaseUrl() + "/resource/file/upload";
};
e.prototype.payConfigUrl = function() {
return this.gameBaseUrl() + "/v1/config";
};
e.prototype.agentPlatformUrl = function(e) {
return s.gameAgentUrl() + "/agent/login?game_token=" + e;
};
return e;
}())();
o.default = s;
cc._RF.pop();
