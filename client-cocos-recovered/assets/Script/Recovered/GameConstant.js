// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f0cdcuuu4hBeb4BYoVwtrI0", "GameConstant");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r, i, a, s, l, c = require("./CommonEnum"), u = {
appName: "qjqp",
assertVer: 258,
packageVer: "1.0.5",
serviceWechat: "YLQJ369",
serviceQQ: "17252659",
freeCardPercent: "20%",
limitOfCreateClub: 0,
gameList: [ c.eGameIds.QJHH ],
check_version_addr: (n = {}, n[c.eGameMode.debug] = "http://192.168.0.7:8899/version",
n[c.eGameMode.release] = "http://192.168.0.7:8899/version", n),
account_server_addr: (r = {}, r[c.eGameMode.debug] = "http://192.168.0.7:8899/login",
r[c.eGameMode.release] = "http://192.168.0.7:8899/login", r),
socket_server_addr: (i = {}, i[c.eGameMode.debug] = "ws://192.168.0.7:8899/ws",
i[c.eGameMode.release] = "ws://192.168.0.7:8899/ws", i),
game_base_url: (a = {}, a[c.eGameMode.debug] = "http://192.168.0.7:8899",
a[c.eGameMode.release] = "http://192.168.0.7:8899", a),
download_url: (s = {}, s[c.eGameMode.debug] = "http://192.168.0.7:8899", s[c.eGameMode.release] = "http://192.168.0.7:8899",
s),
agent_base_url: (l = {}, l[c.eGameMode.debug] = "http://192.168.0.7:8899",
l[c.eGameMode.release] = "http://192.168.0.7:8899", l)
};
o.default = u;
cc._RF.pop();
