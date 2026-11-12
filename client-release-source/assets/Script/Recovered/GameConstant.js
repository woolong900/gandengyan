// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f0cdcuuu4hBeb4BYoVwtrI0", "GameConstant");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r, i, a, s, l, c = require("./CommonEnum"), u = {
appName: "qjqp",
assertVer: 235,
packageVer: "1.0.6",
serviceWechat: "YLQJ369",
serviceQQ: "17252659",
freeCardPercent: "20%",
limitOfCreateClub: 0,
gameList: [ c.eGameIds.QJHH, c.eGameIds.QJSHZ ],
check_version_addr: (n = {}, n[c.eGameMode.debug] = "https://gandengyan.top/version",
n[c.eGameMode.release] = "https://gandengyan.top/version", n),
account_server_addr: (r = {}, r[c.eGameMode.debug] = "https://gandengyan.top/login",
r[c.eGameMode.release] = "https://gandengyan.top/login", r),
socket_server_addr: (i = {}, i[c.eGameMode.debug] = "wss://gandengyan.top/ws",
i[c.eGameMode.release] = "wss://gandengyan.top/ws", i),
game_base_url: (a = {}, a[c.eGameMode.debug] = "https://gandengyan.top",
a[c.eGameMode.release] = "https://gandengyan.top", a),
download_url: (s = {}, s[c.eGameMode.debug] = "https://gandengyan.top", s[c.eGameMode.release] = "https://gandengyan.top",
s),
agent_base_url: (l = {}, l[c.eGameMode.debug] = "https://gandengyan.top",
l[c.eGameMode.release] = "https://gandengyan.top", l)
};
o.default = u;
cc._RF.pop();
