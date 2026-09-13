// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "185f0w8nExBMYturuJJtwfB", "AnalysisMsgBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./gContext"), r = e("./RoomInfoData"), i = e("./RoomConfigCellData"), a = e("./PlayerInfoListData"), s = e("./pb"), l = e("./DismissRoomInfoData"), c = e("./TotalEndData"), u = e("./CommonEnum"), d = e("./ChatMsgData"), p = e("./EventKeys"), f = e("./UserData"), h = e("./ApplyBeginGameData"), m = function() {
function e() {
this._curGameCount = 0;
}
e.prototype.parse = function(e, t) {
"roominfo" === e && this._roomInfo(t);
"game_ready" === e && this._ready(t);
"lineperson" === e && this._line(t);
"dissmissroom" === e && this._agreeDismissRoom(t);
"nodissmissroom" === e && this._disagreeDismissRoom(t);
"quick" === e && this._agreeApplyBegin(t);
"noquick" === e && this._disagreeApplyBegin(t);
"exitroom" === e && this._exitRoom(t);
"chatroom" === e && this._chatMsg(t);
"game_bye" === e && this._totalEnd(t);
"trustee" === e && this._autoGame(t);
"game_end" === e && this._gameEndCleanAutoGame();
};
e.prototype._gameEndCleanAutoGame = function() {
r.default.players.getByUid(f.default.uid).isAutoGameing() && n.default.gameMsgBase().autoGame();
};
e.prototype.parseRoom = function(e) {
this.parse("roominfo", e);
};
e.prototype.parseGame = function(e) {};
e.prototype.cleanReady = function() {
for (var e = r.default.players.collection(), t = 0; t < e.length; t++) {
var o = parseInt(e[t]), n = r.default.players.getByUid(o);
if (n && n.isReady()) {
var i = n.pbData();
i.ready = !1;
r.default.updatePlayerData(i);
}
}
};
e.prototype._cleanAutoGame = function() {
for (var e = r.default.players.collection(), t = 0; t < e.length; t++) {
var o = parseInt(e[t]);
r.default.players.getByUid(o).updateAutoGame(!1);
}
};
e.prototype.addScore = function(e, t) {
if (0 !== t) {
var o = r.default.players.getByUid(e);
if (o) {
var n = o.pbData(), i = n.score;
n.score = i + t;
r.default.updatePlayerData(n);
}
}
};
e.prototype.updateScore = function(e, t) {
var o = r.default.players.getByUid(e);
if (o) {
var n = o.pbData();
n.score = t;
r.default.updatePlayerData(n);
}
};
e.prototype._ready = function(e) {
var t = e.uid, o = r.default.players.getByUid(t).pbData(), n = e.site;
o.ready = !0;
if (n && n > 0) {
var i = this.oldPlayerIndex2NewPos(n);
null === i || void 0 === i || (o.pos = i);
}
r.default.updatePlayerData(o);
};
e.prototype._line = function(e) {
var t = e.uid, o = r.default.players.getByUid(t).pbData(), n = e.line;
o.onLine = n;
r.default.updatePlayerData(o);
};
e.prototype._agreeDismissRoom = function(e) {
l.default.update({
destroying: !0,
uid: e.agree[0],
endTime: e.time,
agreeList: e.agree
});
};
e.prototype._disagreeDismissRoom = function(e) {
l.default.update({
destroying: !1,
disagreeList: [ e.uid ]
});
};
e.prototype._agreeApplyBegin = function(e) {
h.default.update({
applying: !0,
uid: e.players[0],
agreeList: e.players
});
};
e.prototype._disagreeApplyBegin = function(e) {
h.default.update({
applying: !1,
disagreeList: [ e.uid ]
});
};
e.prototype._exitRoom = function(e) {
var t = e.reason || 0;
r.default.destroyRoom(t);
};
e.prototype._chatMsg = function(e) {
var t = e.chat, o = JSON.parse(t), r = o.fromUid, i = o.toUid, a = o.type, s = o.content, l = o.duration, c = new d.default({
fromUid: r,
toUid: i,
type: a,
content: s,
duration: l
});
n.default.eventUtils.emit(p.default.data_chat_msg, {
o: c
});
};
e.prototype._totalEnd = function(e) {
for (var t = e.info || [], o = e.time, i = e.normal_end || !1, a = [], s = function(e, t, o, n) {
var r = e[t];
void 0 === r || null === r || n.push({
type: o,
count: r || 0
});
}, l = 0; l < t.length; l++) {
var u = t[l], d = [];
s(u, "ag", c.eTotalEndDetailType.AN_GANG, d);
s(u, "mg", c.eTotalEndDetailType.MING_GANG, d);
s(u, "zm", c.eTotalEndDetailType.ZI_MO, d);
s(u, "dg", c.eTotalEndDetailType.DIAN_PAO, d);
s(u, "jg", c.eTotalEndDetailType.JIE_PAO, d);
s(u, "plyj", c.eTotalEndDetailType.PIAO_LAI, d);
s(u, "in_horse", c.eTotalEndDetailType.ZHONG_MA, d);
s(u, "winner_count", c.eTotalEndDetailType.D7_COUNT_WIN, d);
s(u, "max_level", c.eTotalEndDetailType.D7_MAX_LEVEL, d);
s(u, "pdk_winner_count", c.eTotalEndDetailType.PDK_COUNT_WIN, d);
s(u, "pdk_lose_count", c.eTotalEndDetailType.PDK_COUNT_LOSE, d);
s(u, "pdk_max_score", c.eTotalEndDetailType.PDK_SINGLE_WIN_SCORE, d);
s(u, "pdk_bomb_num", c.eTotalEndDetailType.PDK_COUNT_BOMB, d);
s(u, "wsk_winner_count", c.eTotalEndDetailType.WSK_COUNT_WIN, d);
s(u, "wsk_lose_count", c.eTotalEndDetailType.WSK_COUNT_LOSE, d);
s(u, "dbd_lose_count", c.eTotalEndDetailType.DBD_LOSE_COUNT, d);
s(u, "dbd_winner_count", c.eTotalEndDetailType.DBD_WINNEW_COUNT, d);
s(u, "hz_count", c.eTotalEndDetailType.HZ_COUNT, d);
s(u, "hall_score", c.eTotalEndDetailType.DBD_HALL_SCORE, d);
a.push({
uid: u.uid,
score: u.score,
winer: u.winner || !1,
loser: !1,
details: d
});
}
var f = new c.default({
time: o,
isNormalEnd: i,
players: a
});
r.default.setTotalEndData(f);
n.default.eventUtils.emit(p.default.data_game_total_end);
this._cleanAutoGame();
};
e.prototype._parseAutoGame = function(e, t) {
var o = (t = t || {}).status || !1, i = r.default.players.getByUid(e), a = t.last_ts || 0;
n.default.gameLogic().isAutoGameRoom(r.default.config) ? i.isTurn = a > 0 : i.isTurn = !1;
i.updateAutoGame(o);
};
e.prototype._autoGame = function(e) {
var t = e.uid, o = e.status || !1;
r.default.players.getByUid(t).updateAutoGame(o);
};
e.prototype._roomInfo = function(e) {
cc.log(">>>>>>>>>>>>>>>>_roomInfo obj:", e);
var t = e.type, o = e.maxstep, c = e.person || [], d = n.default.gameLogic(t).roomParam2Config(o, e.param2, e.param1);
this._curGameCount = e.step || 0;
r.default.roomId = e.roomid;
r.default.owner = e.host;
r.default.scoreRatio = e.score_ratio || 1;
r.default.config = new i.default({
index: t,
ipLimit: d.ipLimit,
ids: d.ids,
other: d.other
});
r.default.gameInfo && (r.default.gameInfo.clickCard = !1);
r.default.config.category() == u.eGameCategort.DDZ && r.default.DoOtherInfo(e);
r.default.players || (r.default.players = new a.default());
for (var p = function(e) {
for (var t = 0, o = c.length; t < o; t++) if (c[t].uid == e) return !0;
return !1;
}, m = r.default.players.collection(), y = 0; y < m.length; y++) {
var g = parseInt(m[y]);
p(g) || r.default.players.remove(g);
}
for (var _ = 0, v = (y = 0, c.length); y < v; y++) {
var C = c[y], b = C.uid;
if (!(b <= 0)) {
var D = r.default.players.getByUid(b), S = null;
(S = D ? D.pbData() : new s.pb.PlayerInfo()).uid = C.uid;
S.headImg = C.imgurl;
S.name = C.name;
S.ip = C.ip;
S.location = {
latitude: C.latitude,
longitude: C.longitude,
address: C.address
};
C.view ? S.pos = -9999 : S.pos = this.oldPlayerIndex2NewPos(C.index);
S.score = S.score || 0;
S.gender = 1 === C.sex ? s.pb.eGender.MAN : s.pb.eGender.WOMAN;
S.onLine = C.line;
S.ready = S.ready || !1;
S.isManager = C.force_close || !1;
r.default.updatePlayerData(S);
var w = C.trustee || {};
this._parseAutoGame(C.uid, C.trustee);
var O = w.last_ts || 0;
O > _ && (_ = O);
}
}
var P = r.default.players.getByPos(r.default.myAbsolutePos());
if (!r.default.isWatcher() && P.isTurn) r.default.setCountDown(_); else if (r.default.getCountDown() > 0) ; else {
var I = f.default.second + n.default.gameLogic().autoGameCountDown(r.default.config);
r.default.setCountDown(I);
}
r.default.roomCode = e.room_code;
r.default.belongClub = e.club_id;
var R = e.agree || [];
R.length > 0 && !r.default.isWatcher() ? l.default.update({
destroying: !0,
uid: R[0],
endTime: e.time,
agreeList: R
}) : l.default.update({
destroying: !1
});
var k = e.quick || {};
(k.agree || []).length > 0 && !r.default.isWatcher() ? h.default.update({
applying: !0,
uid: k.agree[0],
agreeList: k.agree
}) : h.default.update({
applying: !1
});
};
e.prototype.oldPlayerIndex2NewPos = function(e) {
var t = r.default.config.peopleCount(), o = r.default.config.category();
if (o === u.eGameCategort.MJ) if (2 === t) {
if (1 === e) return u.eDeskPos.East;
if (2 === e) return u.eDeskPos.West;
} else {
if (1 === e) return u.eDeskPos.East;
if (2 === e) return u.eDeskPos.North;
if (3 === e) return u.eDeskPos.West;
if (4 === e) return u.eDeskPos.South;
}
if (o === u.eGameCategort.D7) return e - 1;
if (o === u.eGameCategort.PDK) return e - 1;
if (o === u.eGameCategort.WSK) return e - 1;
if (o === u.eGameCategort.DBD) return e - 1;
if (o === u.eGameCategort.DDZ) return e - 1;
cc.error("数据错误～");
};
e.prototype.cleanCountDown = function() {
for (var e = r.default.players.collection(), t = 0; t < e.length; t++) {
var o = parseInt(e[t]);
r.default.players.getByUid(o).isTurn = !1;
}
var i = f.default.second + n.default.gameLogic().autoGameCountDown(r.default.config);
r.default.setCountDown(i);
};
e.prototype.recordCountDown = function(e) {
this.cleanCountDown();
r.default.players.getByUid(e).isTurn = !0;
};
return e;
}();
o.default = m;
cc._RF.pop();
