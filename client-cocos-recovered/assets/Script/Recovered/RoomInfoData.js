// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "53209Vqye5A+JReEuMPf/cK", "RoomInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./RoomConfigCellData"), r = require("./GameInfoData"), i = require("./PlayerInfoListData"), a = require("./PlayerInfoCellData"), s = require("./UserData"), l = require("./CommonEnum"), c = require("./gContext"), u = require("./EventKeys"), d = require("./ClubListData"), p = require("./ClubMsg"), f = require("./Constants"), h = require("./Storage"), m = require("./D7Enum"), y = require("./D7GameInfoData"), g = require("./DBDEnum"), _ = require("./DBDGameInfoData"), v = require("./PDKEnum"), C = require("./PDKGameInfoData"), b = require("./DDZEnum"), D = require("./DDZGameInfoData"), S = require("./WSKEnum"), w = require("./WSKGameInfoData"), O = require("./MaJiangMsg"), P = require("./GameMsgMJ"), I = new (function() {
function e() {
this._playback = !1;
this._myWatchPos = 0;
this._countDown = 0;
this._belongClub = 0;
this.roomId = 0;
this.owner = 0;
this.scoreRatio = 1;
this.config = null;
this.players = null;
this.roomCode = "";
this.gameInfo = null;
this._totalEndData = null;
this.gameInfoD7 = null;
this.gameInfoPDK = null;
this.gameInfoWSK = null;
this.gameInfoDBD = null;
this.gameInfoDDZ = null;
}
e.prototype.setPaybackData = function(e) {
this.players = new i.default();
this.roomId = e.roomId;
this.owner = e.owner;
this.scoreRatio = e.scoreRatio;
this.config = new n.default({
index: e.config.index,
ipLimit: e.config.ipLimit,
ids: e.config.ids,
other: e.config.other
});
this.players.clean();
this.updatePlayerData(e.players);
this.roomCode = e.roomCode;
this._playback = !0;
this._initWatchPos();
this._totalEndData = null;
var t = this.config.category();
if (t === l.eGameCategort.MJ) {
this.gameInfo = new r.default();
this.updateGameData(e.gameInfo);
} else if (t === l.eGameCategort.D7) this.updateGameData(e.gameInfo); else if (t === l.eGameCategort.PDK) this.updateGameData(e.gameInfo); else if (t === l.eGameCategort.WSK) {
c.default.gameLogic().init(this.config);
this.updateGameData(e.gameInfo);
} else t === l.eGameCategort.DBD ? this.updateGameData(e.gameInfo) : t === l.eGameCategort.DDZ && this.updateGameData(e.gameInfo);
};
e.prototype._initWatchPos = function() {
var e = s.default.uid, t = I.players.getByUid(e);
if (t) this._myWatchPos = t.pos; else for (var o = 0; o < 10; o++) {
var n = I.players.getByPos(o);
n && (this._myWatchPos = n.pos);
}
};
e.prototype.reset = function() {
this.players = new i.default();
this._totalEndData = null;
this._playback = !1;
this.gameInfo = new r.default();
this.gameInfoD7 = new y.default();
this.gameInfoPDK = new C.default();
this.gameInfoWSK = new w.default();
this.gameInfoDBD = new _.default();
this.gameInfoDDZ = new D.default();
this.config && this.config.category() === l.eGameCategort.MJ && c.default.eventUtils.emit(u.default.data_hand_select_clean);
this.roomId = 0;
};
e.prototype.isPlayback = function() {
return this._playback;
};
e.prototype.isWatcher = function() {
var e = this.players.getByUid(s.default.uid);
return !(!e || !e.isWatcher());
};
e.prototype.updateWatchPos = function(e) {
if (this.isWatcher() && this._myWatchPos !== e) {
this._myWatchPos = e;
c.default.eventUtils.emit(u.default.data_game_watch_pos_change);
}
};
Object.defineProperty(e.prototype, "belongClub", {
get: function() {
return this._belongClub;
},
set: function(e) {
this._belongClub = e;
},
enumerable: !0,
configurable: !0
});
e.prototype._gameData = function() {
var e = this.config && this.config.category();
return e === l.eGameCategort.MJ ? this.gameInfo : e === l.eGameCategort.D7 ? this.gameInfoD7 : e === l.eGameCategort.PDK ? this.gameInfoPDK : e === l.eGameCategort.WSK ? this.gameInfoWSK : e === l.eGameCategort.DBD ? this.gameInfoDBD : e === l.eGameCategort.DDZ ? this.gameInfoDDZ : null;
};
e.prototype.curStep = function() {
var e = this._gameData();
if (e) return e.curStep;
};
e.prototype.isGameFree = function() {
var e = this.config && this.config.category() || 0;
return e === l.eGameCategort.MJ ? this.gameInfo && this.gameInfo.status === r.eGameStatus.Free : e === l.eGameCategort.D7 ? this.gameInfoD7 && this.gameInfoD7.status === m.eD7GameStatus.Free : e === l.eGameCategort.PDK ? this.gameInfoPDK && this.gameInfoPDK.status === v.ePDKGameStatus.Free : e === l.eGameCategort.WSK ? this.gameInfoWSK && this.gameInfoWSK.status === S.eWSKGameStatus.Free : e === l.eGameCategort.DBD ? this.gameInfoDBD && this.gameInfoDBD.status === g.eDBDGameStatus.Free : e !== l.eGameCategort.DDZ || this.gameInfoDDZ && this.gameInfoDDZ.status === b.eDDZGameStatus.Free;
};
e.prototype.gameSceneName = function() {
var e = this.config && this.config.category() || 0;
return e === l.eGameCategort.MJ ? f.default.GameSceneName : e === l.eGameCategort.D7 ? f.default.D7SceneName : e === l.eGameCategort.PDK ? f.default.PDKSceneName : e === l.eGameCategort.WSK ? f.default.WSKSceneName : e === l.eGameCategort.DBD ? f.default.DBDSceneName : e === l.eGameCategort.DDZ ? f.default.DDZSceneName : void 0;
};
e.prototype.isInRoom = function() {
return 0 !== this.roomId;
};
e.prototype.leaveRoom = function(e) {
void 0 === e && (e = !0);
var t = this._belongClub;
d.default.get(t) ? p.default.getClubData(t, function(e, t) {
t || (0 === e.error ? c.default.uiHelper.loadScene(f.default.ClubSceneName) : c.default.uiHelper.loadScene(f.default.HallSceneName));
}) : c.default.uiHelper.loadScene(f.default.HallSceneName);
e && this.reset();
};
e.prototype.updateGameData = function(e) {
var t = this.config.category();
if (t === l.eGameCategort.MJ) {
this.gameInfo || (this.gameInfo = new r.default());
this.gameInfo.setData(e);
} else if (t === l.eGameCategort.D7) {
this.gameInfoD7 || (this.gameInfoD7 = new y.default());
this.gameInfoD7.update(e);
} else if (t === l.eGameCategort.PDK) {
this.gameInfoPDK || (this.gameInfoPDK = new C.default());
this.gameInfoPDK.update(e);
} else if (t === l.eGameCategort.WSK) {
this.gameInfoWSK || (this.gameInfoWSK = new w.default());
this.gameInfoWSK.update(e);
var o = this.myAbsolutePos(), n = h.default.wskHandCardsSortType.getValue();
this.gameInfoWSK.siteInfos.get(o).sortCards(n);
} else if (t === l.eGameCategort.DBD) {
this.gameInfoDBD || (this.gameInfoDBD = new _.default());
this.gameInfoDBD.update(e);
} else if (t === l.eGameCategort.DDZ) {
this.gameInfoDDZ || (this.gameInfoDDZ = new D.default());
this.gameInfoDDZ.update(e);
}
};
e.prototype.updatePlayerData = function(e) {
var t = [];
e && (t = e instanceof Array ? e : [ e ]);
for (var o = 0, n = t.length; o < n; o++) {
var r = t[o], i = new a.default(r);
this.players.update(i);
}
};
e.prototype.destroyRoom = function(e) {
c.default.eventUtils.emit(u.default.data_room_destroyed, {
reason: e
});
this.reset();
};
e.prototype.myPlayerData = function() {
var e = s.default.uid;
return this.players.getByUid(e);
};
e.prototype.myAbsolutePos = function() {
if (this._playback) return this._myWatchPos;
if (this.isWatcher()) return this._myWatchPos;
var e = s.default.uid, t = this.players.getByUid(e);
return t ? t.pos : -1;
};
e.prototype.setTotalEndData = function(e) {
this._totalEndData = e;
};
e.prototype.getTotalEndData = function() {
return this._totalEndData;
};
e.prototype.isFangZhu = function() {
return s.default.uid === I.owner;
};
e.prototype.setCountDown = function(e) {
this._countDown = e;
};
e.prototype.getCountDown = function() {
var e = this._countDown - s.default.second;
return e < 0 ? 0 : e;
};
e.prototype.DoOtherInfo = function(e) {
if (this.config.category() === l.eGameCategort.DDZ) {
var t = e.landlord || 0;
if (t > 0) {
this.gameInfoDDZ.m_iLandlordUid = e.landlord || 0;
var o = I.players.getByUid(t), n = o.pbData();
if (!0 !== o.deal) {
n.deal = !0;
I.updatePlayerData(n);
}
}
this.gameInfoDDZ.m_bTriplePair = Math.floor(e.param1 / 10) % 10 == 1;
this.gameInfoDDZ.m_doubleMax = Math.floor(e.param1 / 100) % 10 == 1;
var r = Math.floor(e.param2 / 1e3) % 10;
this.gameInfoDDZ.m_bLaiziRule = 1 == r || 3 == r;
}
};
e.prototype.gameMjPutCard = function(e, t) {
if (!I.gameInfo.clickCard) {
I.gameInfo.clickCard = !0;
setTimeout(function() {
O.default.putCard(s.default.uid, e);
I.gameInfo.setPutCardVirtual({
uid: s.default.uid,
card: e
});
t();
P.GameMsgMJ.getInstance().pubCard(e, function(e, t) {
I.gameInfo.clickCard = !1;
t || e.error;
});
}, 100);
}
};
return e;
}())();
o.default = I;
cc._RF.pop();
