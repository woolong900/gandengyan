// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a579bl1BRVAQIuSKUmj1JAd", "PlaybackDataDDZ");
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
var r, i = require("./PlaybackDataBase"), a = require("./pb"), s = require("./RoomInfoData"), l = require("./gContext"), c = require("./Constants"), u = require("./AnalysisMsg"), d = require("./CommonEnum"), p = require("./DDZEnum"), f = require("./DDZEventKeys");
(function(e) {
e[e.Pass = 0] = "Pass";
e[e.Put = 1] = "Put";
e[e.Double = 2] = "Double";
e[e.JiaoDiZhu = 3] = "JiaoDiZhu";
e[e.ChunTian = 4] = "ChunTian";
})(r || (r = {}));
var h = new (function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.setData = function(t, o) {
e.prototype.setData.call(this, t, o);
for (var n = t.roomInfo, r = this.roomConfig(n), i = t.gameInfo, s = 0, l = t.players.length; s < l; s++) {
var c = s, u = t.players[s].gender;
t.players[s].gender = u === a.pb.eGender.MAN ? a.pb.eGender.MAN : a.pb.eGender.WOMAN;
t.players[s].pos = c;
t.players[s].onLine = !0;
t.players[s].ready = !0;
i.sites[s].pos = c;
}
var d = this._siteInfos(i.sites), f = {
curStep: i.count,
status: p.eDDZGameStatus.Free,
siteInfos: d
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
this._data.gameInfo.status = p.eDDZGameStatus.Free;
s.default.setPaybackData(this._data);
s.default.belongClub = t;
l.default.uiHelper.loadScene(c.default.DDZSceneName);
};
t.prototype.begin = function() {
s.default.config.isChecked(6) && 0;
s.default.gameInfoDDZ.updateBetNum(1);
s.default.gameInfoDDZ.updateBoomNum(0);
this._data.gameInfo.status = p.eDDZGameStatus.Gameing;
for (var e = 0, t = this._data.players.length; e < t; e++) {
this._data.players[e].ready = !1;
}
s.default.setPaybackData(this._data);
this._steps = this._dealSteps(this._dataSteps);
};
t.prototype.step = function(e) {
for (var t = this._steps[e], o = 0, n = t.length; o < n; o++) {
var i = t[o], a = i.action, c = i.uid, u = i.cards || [];
switch (a) {
case r.Pass:
this._sendStep("game_pass", {
uid: c
});
break;

case r.Put:
this._sendStep("game_step", {
uid: c,
card: u
});
break;

case r.Double:
var d = u[0];
this._sendStep("game_redouble", {
uid: c,
cul_op: d
});
break;

case r.JiaoDiZhu:
var p = u[0], h = 0;
1 == p && (h = c);
this._sendStep("game_biddealer", {
uid: c,
grade_type: p,
landlord_uid: h
});
break;

case r.ChunTian:
var m = u[0];
0 != m && s.default.gameInfoDDZ.setBetNum();
l.default.eventUtils.emit(f.default.playback_data_chuntian, {
chuntianType: m
});
break;

case 999:
s.default.gameInfoDDZ.m_bLaiziRule = !s.default.config.isChecked(4);
var y = u;
this._sendStep("game_bottomcard", {
uid: c,
bot_card: y
});
}
}
};
t.prototype._sendStep = function(e, t) {
u.default.getInstance(d.eGameCategort.DDZ).parse(e, t);
};
t.prototype._dealSteps = function(e) {
for (var t = function(e) {
var t = e.uid, o = e.index, n = e.cards, i = [], a = 0;
if (1 === o) a = r.Pass; else if (101 === o) {
a = r.Put;
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
}(i.default))();
o.default = h;
cc._RF.pop();
