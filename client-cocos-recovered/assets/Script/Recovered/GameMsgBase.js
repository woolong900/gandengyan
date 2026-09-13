// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a57f5rc0HVMvJaAq2BLZigJ", "GameMsgBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./GameConn"), r = require("./ExUtils"), i = require("./RoomInfoData"), a = require("./CommonEnum"), s = require("./gContext"), l = require("./Constants"), c = require("./UserData"), u = require("./RoomConfig"), d = require("./PDKCardUtils"), p = require("./AnalysisMsg"), f = function() {
function e() {
this._lastChatMsgSendTime = 0;
}
e.prototype.gameJson = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
json: JSON.stringify(e)
};
cc.log("send msg is :", r);
n.default.sendMsg(200, r, t, o);
};
e.prototype.createRoom = function(e, t, o) {
var r;
r = s.default.gameLogic(e.index).roomConfig2Param(e, t);
n.default.sendMsg(201, r, function(e, t, n) {
o(e, n || null);
});
};
e.prototype.checkRealTimeSupport = function(e) {
return !(s.default.gameLogic(e.index).isRealTime(e) && !r.default.isSupportRealTimeVoice());
};
e.prototype.joinRoom = function(e, t, o, n) {
var r = this;
void 0 === t && (t = !1);
void 0 === o && (o = !1);
i.default.isInRoom() && e !== i.default.roomId && i.default.isGameFree() ? s.default.gameMsgBase().dismissRoom(!0, function(a) {
if (0 === a.error) {
i.default.reset();
r._joinRoom(e, t, o, n);
}
}) : this._joinRoom(e, t, o, n);
};
e.prototype._joinRoom = function(e, t, o, c) {
void 0 === t && (t = !1);
void 0 === o && (o = !1);
var f = null, h = r.default.getLocation(t);
if (h) f = {
roomId: e,
location: {
longitude: h.longitude,
latitude: h.latitude,
country: h.country,
province: h.province,
city: h.city,
citycode: h.citycode,
district: h.district,
adcode: h.adcode,
address: h.address
}
}; else {
cc.warn("get location error.");
f = {
roomId: e
};
}
var m = this;
n.default.sendMsg(202, f, function(o, n, f) {
if (f) {
s.default.uiHelper.showTip("网络请求失败，请稍后重试～");
c && c(!0);
} else if (o.res.error < 0) {
s.default.uiHelper.showTip("网络请求失败，请稍后重试～");
c && c(!0);
} else if (o.res.error > 0) {
50 === o.res.error ? r.default.checkLocationEnabled() ? r.default.checkPermissionLocation() ? t && r.default.getLocation(!1) ? m.joinRoom(e) : s.default.uiHelper.showTip("防作弊场，获取定位信息失败，请检查网络后重试～") : s.default.msgBox.showNoClose("防作弊场，需要开启定位才能加入", function() {
r.default.openSettings();
}) : s.default.msgBox.showNoClose("防作弊场，需要开启定位才能加入", function() {
r.default.openSettingLocation();
}) : s.default.uiHelper.showTip(o.res.what);
c && c(!0);
} else try {
var h = JSON.parse(o.json).msgdata, y = JSON.parse(h), g = y.room, _ = y.game;
i.default.reset();
var v = u.default[g.type].category, C = p.default.getInstance(v);
C.parseRoom(g);
if (v === a.eGameCategort.MJ) {
C.parseGame(_);
cc.director.getScene().name !== l.default.GameSceneName && s.default.uiHelper.loadScene(l.default.GameSceneName);
}
if (v === a.eGameCategort.D7) {
C.parseGame(_);
cc.director.getScene().name !== l.default.D7SceneName && s.default.uiHelper.loadScene(l.default.D7SceneName);
}
if (v === a.eGameCategort.PDK) {
var b = s.default.gameLogic(i.default.config.index).ruleIsAAABomb(i.default.config), D = s.default.gameLogic(i.default.config.index).ruleSupportFour2(i.default.config), S = s.default.gameLogic(i.default.config.index).ruleSupportFour3(i.default.config), w = s.default.gameLogic(i.default.config.index).ruleSupportFollowLackPut(i.default.config), O = s.default.gameLogic(i.default.config.index).ruleIsCanNotSplitBomb(i.default.config);
d.default.setRule(b, D, S, w, O);
C.parseGame(_);
cc.director.getScene().name !== l.default.PDKSceneName && s.default.uiHelper.loadScene(l.default.PDKSceneName);
}
if (v === a.eGameCategort.WSK) {
s.default.gameLogic().init(i.default.config);
C.parseGame(_);
cc.director.getScene().name !== l.default.WSKSceneName && s.default.uiHelper.loadScene(l.default.WSKSceneName);
}
if (v === a.eGameCategort.DBD) {
C.parseGame(_);
cc.director.getScene().name !== l.default.DBDSceneName && s.default.uiHelper.loadScene(l.default.DBDSceneName);
}
if (v === a.eGameCategort.DDZ) {
C.parseGame(_);
cc.director.getScene().name !== l.default.DDZSceneName && s.default.uiHelper.loadScene(l.default.DDZSceneName);
}
c && c(!1);
} catch (e) {
cc.error(o.json);
s.default.uiHelper.showTip("加入房间数据错误~");
c && c(!0);
}
}, o);
};
e.prototype.sendChatMsg = function(e, t, o, n, r) {
var i = c.default.millisecond;
if (i - this._lastChatMsgSendTime < 1e3) s.default.uiHelper.showTip("发送消息过快~"); else {
this._lastChatMsgSendTime = i;
var a = JSON.stringify({
fromUid: c.default.uid,
toUid: n,
content: t,
type: e,
duration: r,
other: c.default.token
}), l = {
msghead: "chatroom",
msgdata: JSON.stringify({
chat: a
})
};
this.gameJson(l, function(e, t, n) {
n ? o(null, n) : o(e.res, null);
}, !0);
}
};
e.prototype.dismissRoom = function(e, t) {
var o = {
msghead: "",
msgdata: JSON.stringify({})
};
o.msghead = e ? "dissmissroom" : "nodissmissroom";
this.gameJson(o, function(e, o, n) {
cc.log("dismiss room ret data:", e);
n ? t && t(null, n) : t && t(e.res, null);
});
};
e.prototype.quickBegin = function(e, t) {
var o = {
msghead: "",
msgdata: JSON.stringify({})
};
o.msghead = e ? "quick" : "noquick";
this.gameJson(o, function(e, o, n) {
n ? t && t(null, n) : t && t(e.res, null);
});
};
e.prototype.autoGame = function() {
this.gameJson({
msghead: "trustee"
}, function(e, t, o) {});
};
return e;
}();
o.default = f;
cc._RF.pop();
