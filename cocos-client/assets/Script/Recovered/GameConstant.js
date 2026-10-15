// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f0cdcuuu4hBeb4BYoVwtrI0", "GameConstant");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r, i, a, s, l, c = require("./CommonEnum"), f = function(e) {
if (cc.sys.isNative || "undefined" == typeof window || !window.location) return "https://gmhiu.com" + e;
var t = window.QJQP_WEB_CONFIG || {}, o = t.apiBase || "/__qjqp_api";
return o.replace(/\/$/, "") + e;
}, h = function() {
if (cc.sys.isNative || "undefined" == typeof window || !window.location) return "wss://gmhiu.com/ws";
var e = window.QJQP_WEB_CONFIG || {};
return e.websocketUrl || ("https:" === window.location.protocol ? "wss://" : "ws://") + window.location.host + "/__qjqp_ws";
}, u = {
appName: "qjqp",
assertVer: 235,
packageVer: "1.0.6",
serviceWechat: "YLQJ369",
serviceQQ: "17252659",
freeCardPercent: "20%",
limitOfCreateClub: 0,
gameList: [ c.eGameIds.QJHH, c.eGameIds.QJSHZ ],
check_version_addr: (n = {}, n[c.eGameMode.debug] = f("/version"),
n[c.eGameMode.release] = f("/version"), n),
account_server_addr: (r = {}, r[c.eGameMode.debug] = f("/login"),
r[c.eGameMode.release] = f("/login"), r),
socket_server_addr: (i = {}, i[c.eGameMode.debug] = h(),
i[c.eGameMode.release] = h(), i),
game_base_url: (a = {}, a[c.eGameMode.debug] = f(""),
a[c.eGameMode.release] = f(""), a),
download_url: (s = {}, s[c.eGameMode.debug] = f(""), s[c.eGameMode.release] = f(""),
s),
agent_base_url: (l = {}, l[c.eGameMode.debug] = f(""),
l[c.eGameMode.release] = f(""), l)
};
o.default = u;
cc._RF.pop();
