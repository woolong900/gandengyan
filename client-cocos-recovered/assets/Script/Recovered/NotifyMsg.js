// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "23099JyrT5L3YPkw5YD2F0X", "NotifyMsg");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = e("./gContext"), i = e("./UserData"), a = e("./GameConn"), s = e("./Constants"), l = e("./ClubControl"), c = e("./RoomInfoData"), u = e("./RoomConfig"), d = e("./AnalysisMsg"), p = ((n = {})[401] = function() {
i.default.cleanLoginData();
a.default.close();
cc.director.getScene().name === s.default.LoginSceneName ? r.default.uiHelper.showTip("登录时效已过期,请重新登录～") : r.default.msgBox.showOnlyOk("登录时效已过期,请返回登录界面重新登录~", function() {
cc.game.restart();
});
}, n[1e3] = function() {
i.default.cleanLoginData();
a.default.close();
r.default.msgBox.showOnlyOk("你的账号在异地登录了，请返回登录界面重新登录～", function() {
cc.game.restart();
});
}, n[1001] = function(e) {
i.default.updateCardNum(e.card);
}, n[1002] = function(e) {}, n[1003] = function(e) {
cc.log("invite data is:", e);
l.default.pushInvteData(e);
}, n[1005] = function(e) {}, n[999] = function(e) {
cc.log("ad 999 is:", e);
try {
c.default && c.default.gameInfo && (c.default.gameInfo.clickCard = !1);
var t = JSON.parse(e.json), o = t.msghead, n = t.msgdata, r = null;
n && n.length > 0 && (r = JSON.parse(n));
if ("roominfo" === o) {
var i = u.default[r.type].category;
d.default.getInstance(i).parseRoom(r);
} else {
i = c.default.config.category();
d.default.getInstance(i).parse(o, r);
}
} catch (e) {
cc.error("ad 999 error, error is:", e);
}
}, n[1007] = function(e) {
cc.log("ad 1007 is:");
for (var t = e.noticeInfo, o = 0; o < t.length; o++) {
var n = t[o];
1 === n.id ? i.default.hallMarquee = n.content : 2 === n.id || (3 === n.id ? i.default.serviceWechat = n.content : 4 === n.id && (i.default.serviceQQ = n.content));
}
}, n);
o.default = p;
cc._RF.pop();
