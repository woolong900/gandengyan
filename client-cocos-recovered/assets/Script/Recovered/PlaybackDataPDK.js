// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "eb5b7jlA4FHQJ9FjA8nBFaj", "PlaybackDataPDK");
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
var r, i = require("./PlaybackDataBase"), a = require("./pb"), s = require("./PDKEnum"), l = require("./RoomInfoData"), c = require("./gContext"), u = require("./Constants"), d = require("./AnalysisMsg"), p = require("./CommonEnum");
(function(e) {
e[e.Pass = 0] = "Pass";
e[e.Put = 1] = "Put";
e[e.Piao = 2] = "Piao";
})(r || (r = {}));
var f = new (function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.setData = function(t, o) {
e.prototype.setData.call(this, t, o);
for (var n = t.roomInfo, r = this.roomConfig(n), i = t.gameInfo, l = 0, c = t.players.length; l < c; l++) {
var u = l, d = t.players[l].gender;
t.players[l].gender = d === a.pb.eGender.MAN ? a.pb.eGender.MAN : a.pb.eGender.WOMAN;
t.players[l].pos = u;
t.players[l].onLine = !0;
t.players[l].ready = !0;
i.sites[l].pos = u;
}
var p = this._siteInfos(i.sites), f = {
curStep: i.count,
status: s.ePDKGameStatus.Free,
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
};
t.prototype.init = function(t, o) {
e.prototype.initData.call(this, o);
this._data.gameInfo.status = s.ePDKGameStatus.Free;
l.default.setPaybackData(this._data);
this._doDiscards();
l.default.belongClub = t;
c.default.uiHelper.loadScene(u.default.PDKSceneName);
};
t.prototype.begin = function() {
this._data.gameInfo.status = s.ePDKGameStatus.Gameing;
for (var e = 0, t = this._data.players.length; e < t; e++) {
this._data.players[e].ready = !1;
}
l.default.setPaybackData(this._data);
this._doDiscards();
this._steps = this._dealSteps(this._dataSteps);
};
t.prototype._doDiscards = function() {
var e = function(e, t) {
for (var o = 0, n = e.length; o < n; o++) t[e[o]] = !0;
};
if (2 === l.default.config.peopleCount()) {
var t = [], o = c.default.gameLogic().allCards(l.default.config), n = {};
e(l.default.gameInfoPDK.siteInfos.get(0).handCards, n);
e(l.default.gameInfoPDK.siteInfos.get(1).handCards, n);
for (var r = 0, i = o.length; r < i; r++) {
var a = o[r];
n[a] || t.push(a);
}
l.default.gameInfoPDK.discards = t;
}
};
t.prototype.step = function(e) {
for (var t = this._steps[e], o = 0, n = t.length; o < n; o++) {
var i = t[o], a = i.action, s = i.uid, l = i.cards || [];
switch (a) {
case r.Pass:
this._sendStep("game_pass", {
uid: s
});
break;

case r.Put:
this._sendStep("game_step", {
uid: s,
card: l
});
break;

case r.Piao:
this._sendStep("game_drift", {
uid: s,
drift_score: l[0]
});
}
}
};
t.prototype._sendStep = function(e, t) {
d.default.getInstance(p.eGameCategort.PDK).parse(e, t);
};
t.prototype._dealSteps = function(e) {
for (var t = function(e) {
var t = e.uid, o = e.index, n = e.cards, i = [], a = 0;
if (1 === o) a = r.Pass; else if (101 === o) {
a = r.Put;
i = n;
} else if (2001 === o) {
a = r.Piao;
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
handCards: r.handCards,
piao: -1
});
}
return t;
};
return t;
}(i.default))();
o.default = f;
cc._RF.pop();
