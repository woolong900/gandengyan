// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1f162mUbrFFpZdIjB69d6bo", "PlaybackDataGD");
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
}();
Object.defineProperty(o, "__esModule", {
value: !0
});
var r, i = require("./GDEnum"), a = require("./GDEventKeys"), s = require("./CommonEnum"), l = require("./Constants"), c = require("./gContext"), u = require("./AnalysisMsg"), d = require("./pb"), p = require("./PlaybackDataBase"), f = require("./RoomInfoData"), h = require("./UserData");
(function(e) {
e[e.Pass = 0] = "Pass";
e[e.Put = 1] = "Put";
e[e.Double = 2] = "Double";
e[e.JiaoDiZhu = 3] = "JiaoDiZhu";
e[e.ChunTian = 4] = "ChunTian";
e[e.jipai = 5] = "jipai";
e[e.gongpai = 6] = "gongpai";
e[e.change = 7] = "change";
})(r || (r = {}));
var m = new (function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.setData = function(t, o) {
e.prototype.setData.call(this, t, o);
for (var n = t.roomInfo, r = this.roomConfig(n), a = t.gameInfo, s = 0, l = t.players.length; s < l; s++) {
var c = s, u = t.players[s].gender;
t.players[s].gender = u === d.pb.eGender.MAN ? d.pb.eGender.MAN : d.pb.eGender.WOMAN;
t.players[s].pos = c;
t.players[s].onLine = !0;
t.players[s].ready = !0;
a.sites[s].pos = c;
}
var p = this._siteInfos(a.sites), f = {
curStep: a.count,
status: i.eGDGameStatus.Free,
siteInfos: p
};
this._data = {
roomId: t.roomInfo.roomId,
owner: t.roomInfo.house,
scoreRatio: t.roomInfo.scoreRatio || 1,
config: {
index: r.index,
ipLimit: r.ipLimit,
ids: r.ids,
other: r.other
},
players: t.players,
gameInfo: f
};
this._dataSteps = t.steps;
cc.log("PlaybackDataDDZ.setData: ", t);
};
t.prototype.init = function(t, o) {
e.prototype.initData.call(this, o);
this._data.gameInfo.status = i.eGDGameStatus.Free;
f.default.setPaybackData(this._data);
f.default.belongClub = t;
c.default.uiHelper.loadScene(l.default.GDSceneName);
};
t.prototype.begin = function() {
f.default.config.isChecked(6) && 0;
f.default.gameInfoGD.updateBetNum(1);
f.default.gameInfoGD.updateBoomNum(0);
f.default.gameInfoGD.gongpaiplayerNum = 0;
f.default.gameInfoGD.GongPaiStaus = 0;
f.default.gameInfoGD.gongPaiArray = [];
f.default.gameInfoGD.GongPaiputShow = 0;
this._data.gameInfo.status = i.eGDGameStatus.Gameing;
for (var e = 0, t = this._data.players.length; e < t; e++) {
this._data.players[e].ready = !1;
}
f.default.setPaybackData(this._data);
this._steps = this._dealSteps(this._dataSteps);
};
t.prototype.step = function(e) {
for (var t = this._steps[e], o = 0, n = t.length; o < n; o++) {
var i = t[o], s = i.action, l = i.uid, u = i.cards || [];
switch (s) {
case r.Pass:
this._sendStep("game_pass", {
uid: l
});
break;

case r.Put:
this._sendStep("game_step", {
uid: l,
card: u
});
break;

case r.Double:
var d = u[0];
this._sendStep("game_redouble", {
uid: l,
cul_op: d
});
break;

case r.change:
var p = [], m = f.default.players.getByUid(l);
if (c.default.gameLogic(f.default.config.index).isErRen(f.default.config)) {
var g = ((w = m.pos) + 1) % 2, y = f.default.players.getByPos(g);
p.push(m.uid, y.uid);
} else {
g = ((w = m.pos) + 1) % 4;
var _ = (w + 2) % 4, v = (w + 3) % 4, C = (y = f.default.players.getByPos(g), f.default.players.getByPos(_)), b = f.default.players.getByPos(v);
p.push(m.uid, y.uid, C.uid, b.uid);
}
for (var D = 0; D < p.length; D++) {
var S = p[D];
if (S == h.default.uid) {
var w = f.default.players.getByUid(S).pos;
26 == (P = (O = f.default.gameInfoGD.siteInfos.get(w)).handCards).length && P.push(u[D]);
O.udpateHandCards(P);
} else {
var O, P;
w = f.default.players.getByUid(S).pos;
26 == (P = (O = f.default.gameInfoGD.siteInfos.get(w)).handCards).length && P.push(u[D]);
O.udpateHandCards(P);
}
}
f.default.gameInfoGD.GongPaiStaus = 0;
f.default.gameInfoGD.gongPaiArray = [];
f.default.gameInfoGD.GongPaiputShow = 0;
c.default.eventUtils.emit(a.default.playback_data_remain);
break;

case r.gongpai:
var I = u;
this._sendStep("game_supplycard", {
uid: l,
card: I
});
break;

case r.jipai:
f.default.gameInfoGD.updateFriendCard(u[0], !1);
var R = u[1];
f.default.gameInfoGD.bottomCard = R;
f.default.gameInfoGD.m_iLaiziValue = R / 10;
if (c.default.gameLogic(f.default.config.index).isErRen(f.default.config)) {
if (k = f.default.players.getByUid(h.default.uid)) if (h.default.uid == l) {
f.default.gameInfoGD.selfLevel = u[2];
f.default.gameInfoGD.otherLevel = u[3];
} else {
f.default.gameInfoGD.otherLevel = u[2];
f.default.gameInfoGD.selfLevel = u[3];
} else {
if ((U = f.default.players.getByPos(0)).uid == l) {
f.default.gameInfoGD.selfLevel = u[2];
f.default.gameInfoGD.otherLevel = u[3];
} else {
f.default.gameInfoGD.otherLevel = u[2];
f.default.gameInfoGD.selfLevel = u[3];
}
}
} else {
var k;
if (k = f.default.players.getByUid(h.default.uid)) {
var j = k.pos > 1 ? k.pos - 2 : k.pos + 2, L = f.default.players.getByPos(j);
if (k.uid == l || L.uid == l) {
f.default.gameInfoGD.selfLevel = u[2];
f.default.gameInfoGD.otherLevel = u[3];
} else {
f.default.gameInfoGD.otherLevel = u[2];
f.default.gameInfoGD.selfLevel = u[3];
}
} else {
var U = f.default.players.getByPos(0);
L = f.default.players.getByPos(2);
if (U.uid == l || L.uid == l) {
f.default.gameInfoGD.selfLevel = u[2];
f.default.gameInfoGD.otherLevel = u[3];
} else {
f.default.gameInfoGD.otherLevel = u[2];
f.default.gameInfoGD.selfLevel = u[3];
}
}
}
c.default.eventUtils.emit(a.default.data_step_change);
c.default.eventUtils.emit(a.default.playback_data_jipai);
c.default.eventUtils.emit(a.default.data_hand_card_reset);
break;

case r.JiaoDiZhu:
var T = u[0], N = 0;
1 == T && (N = l);
this._sendStep("game_biddealer", {
uid: l,
grade_type: T,
landlord_uid: N
});
break;

case r.ChunTian:
var M = u[0];
0 != M && f.default.gameInfoGD.setBetNum();
c.default.eventUtils.emit(a.default.playback_data_chuntian, {
chuntianType: M
});
break;

case 999:
f.default.gameInfoGD.m_bLaiziRule = !f.default.config.isChecked(4);
var E = u;
this._sendStep("game_bottomcard", {
uid: l,
bot_card: E
});
}
}
};
t.prototype._sendStep = function(e, t) {
u.default.getInstance(s.eGameCategort.GD).parse(e, t);
};
t.prototype._dealSteps = function(e) {
for (var t = function(e) {
var t = e.uid, o = e.index, n = e.cards, i = [], a = 0;
if (1 === o) a = r.Pass; else if (101 === o) {
a = r.Put;
i = n;
} else if (1013 === o) {
a = r.jipai;
i = n;
} else if (1010 === o) {
a = r.JiaoDiZhu;
i = n;
} else if (1003 === o) {
a = 999;
i = n;
} else if (2017 === o) {
a = r.Double;
i = n;
} else if (1012 === o) {
a = r.ChunTian;
i = n;
} else if (1014 === o) {
f.default.gameInfoGD.gongpaiplayerNum++;
a = r.gongpai;
i = n;
} else if (1015 === o) {
a = r.change;
i = n;
}
return {
uid: t,
action: a,
cards: i
};
}, o = [], n = 0, i = e.length; n < i; n++) {
for (var a = [], s = e[n], l = 0; l < s.operates.length; l++) {
var c = t(s.operates[l]);
a.push(c);
}
o.push(a);
}
return o;
};
t.prototype._siteInfos = function(e) {
for (var t = [], o = 0, n = e.length; o < n; o++) {
var r = e[o];
t.push({
pos: r.pos,
handCards: r.handCards
});
}
return t;
};
return t;
}(p.default))();
o.default = m;
cc._RF.pop();
