// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "fe8bewCHnJJ0IPCkqmVuEos", "PlaybackDataD7");
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
var r, i = require("./PlaybackDataBase"), a = require("./pb"), s = require("./D7Enum"), l = require("./RoomInfoData"), c = require("./gContext"), u = require("./Constants"), d = require("./AnalysisMsg"), p = require("./CommonEnum"), f = require("./D7SingleEndData");
(function(e) {
e[e.JiaoOk = 1] = "JiaoOk";
e[e.JiaoPass = 2] = "JiaoPass";
e[e.FanOk = 3] = "FanOk";
e[e.FanPass = 4] = "FanPass";
e[e.GetRemain = 5] = "GetRemain";
e[e.PutRemain = 6] = "PutRemain";
e[e.GiveUp = 7] = "GiveUp";
e[e.ShowFirend = 8] = "ShowFirend";
e[e.GetScore = 9] = "GetScore";
e[e.KouDiYes = 10] = "KouDiYes";
e[e.KouDiNo = 11] = "KouDiNo";
e[e.PutCard = 12] = "PutCard";
})(r || (r = {}));
var h = new (function(e) {
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
curOpUid: 0,
status: s.eD7GameStatus.Free,
zhuangUid: 0,
friendUid: 0,
friendCard: 0,
mainCard: 0,
putRemainCards: [],
giveUpUid: 0,
siteInfos: p,
getRemainInfo: {
uid: 0
}
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
this._data.gameInfo.status = s.eD7GameStatus.Free;
l.default.setPaybackData(this._data);
l.default.belongClub = t;
c.default.uiHelper.loadScene(u.default.D7SceneName);
};
t.prototype.begin = function() {
this._data.gameInfo.status = s.eD7GameStatus.Calling;
for (var e = 0, t = this._data.players.length; e < t; e++) {
var o = this._data.players[e];
o.ready = !1;
d.default.getInstance(p.eGameCategort.D7).parse("game_base", {
uid: o.uid,
card: []
});
}
l.default.setPaybackData(this._data);
this._steps = this._dealSteps(this._dataSteps);
};
t.prototype.step = function(e) {
for (var t = this._steps[e], o = 0, n = t.length; o < n; o++) {
var i = t[o], a = i.action, c = i.uid, u = i.cards || [], d = i.koudiType || 0, p = null, h = null;
switch (a) {
case r.JiaoOk:
this._sendStep("game_operator", {
uid: c,
ot: 1
});
p = "game_owner";
h = {
uid: c,
card: u[0],
over: !1
};
break;

case r.JiaoPass:
this._sendStep("game_operator", {
uid: c,
ot: 1
});
p = "game_pass";
h = {
uid: c,
over: !1
};
break;

case r.FanOk:
this._sendStep("game_operator", {
uid: c,
ot: 2
});
p = "game_owner";
h = {
uid: c,
card: u[0],
over: !0
};
break;

case r.FanPass:
this._sendStep("game_operator", {
uid: c,
ot: 2
});
p = "game_pass";
h = {
uid: c,
over: !0
};
break;

case r.GetRemain:
p = "game_operator";
h = {
uid: c,
ot: 3,
base_card: u,
friend_card: 0
};
break;

case r.PutRemain:
p = "game_base";
h = {
uid: c,
card: u
};
break;

case r.GiveUp:
this._sendStep("game_operator", {
uid: c,
ot: 0
});
p = "game_surrender";
h = {
uid: c
};
break;

case r.ShowFirend:
p = "game_friend";
h = {
uid: c
};
break;

case r.GetScore:
p = "game_score";
h = {
uid: c,
card: u
};
break;

case r.KouDiYes:
p = "game_fetch_base";
h = {
player: !0,
card: u,
koudiType: d
};
break;

case r.KouDiNo:
p = "game_fetch_base";
h = {
player: !1,
card: u
};
break;

case r.PutCard:
this._sendStep("game_operator", {
uid: c,
ot: 0
});
p = "game_steps";
h = {
uid: c,
card: u
};
}
if (p && h) {
this._sendStep(p, h);
if ("game_fetch_base" === p) {
f.default.getInstance().endType = 2;
l.default.gameInfoD7.updateStatus(s.eD7GameStatus.SingleEnd);
}
}
}
};
t.prototype._sendStep = function(e, t) {
d.default.getInstance(p.eGameCategort.D7).parse(e, t);
};
t.prototype._siteInfos = function(e) {
for (var t = [], o = 0, n = e.length; o < n; o++) {
var r = e[o];
t.push({
pos: r.pos,
handCards: r.handCards,
scoreCards: []
});
}
return t;
};
t.prototype._dealSteps = function(e) {
for (var t = function(e) {
var t = e.uid, o = e.index, n = e.cards, i = [], a = 0, s = 0, l = 0;
if (1001 === o) {
0 === (c = n[0]) && (a = r.JiaoOk);
1 === c && (a = r.JiaoOk);
2 === c && (a = r.FanOk);
i.push(n[1]);
} else if (1002 === o) {
var c;
0 === (c = n[0]) && (a = r.JiaoPass);
1 === c && (a = r.FanPass);
} else if (1003 === o) {
a = r.GetRemain;
i = n;
} else if (1004 === o) {
a = r.PutRemain;
i = n;
} else if (1005 === o) a = r.GiveUp; else if (1006 === o) a = r.ShowFirend; else if (1007 === o) {
a = r.GetScore;
i = n;
} else if (1008 === o) if (15 == n.length) {
a = 1 === n[0] ? r.KouDiYes : r.KouDiNo;
l = n.pop();
f.default.getInstance().setLastPaiNUM(l);
s = n.pop();
i = n.slice(1);
} else {
a = 1 === n[0] ? r.KouDiYes : r.KouDiNo;
i = n.slice(1);
} else if (1009 === o) {
a = r.PutCard;
i = n;
}
return {
uid: t,
action: a,
cards: i,
koudiType: s
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
return t;
}(i.default))();
o.default = h;
cc._RF.pop();
