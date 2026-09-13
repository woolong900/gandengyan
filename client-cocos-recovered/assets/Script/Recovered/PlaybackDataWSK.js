// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "89aefi684VN85tBPRoeG5wX", "PlaybackDataWSK");
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
var r, i = e("./WSKEnum"), a = e("./CommonEnum"), s = e("./Constants"), l = e("./gContext"), c = e("./AnalysisMsg"), u = e("./pb"), d = e("./PlaybackDataBase"), p = e("./RoomInfoData");
(function(e) {
e[e.Pass = 0] = "Pass";
e[e.CallBanker = 1] = "CallBanker";
e[e.Put = 2] = "Put";
e[e.PutNewRound = 3] = "PutNewRound";
e[e.GetScore = 4] = "GetScore";
e[e.ShowFirend = 5] = "ShowFirend";
e[e.ShowFirendCard = 6] = "ShowFirendCard";
e[e.NextContinue = 7] = "NextContinue";
e[e.ShowXiCard = 8] = "ShowXiCard";
})(r || (r = {}));
var f = new (function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.setData = function(t, o) {
e.prototype.setData.call(this, t, o);
for (var n = t.roomInfo, r = this.roomConfig(n), a = t.gameInfo, s = 0, l = t.players.length; s < l; s++) {
var c = s, d = t.players[s].gender;
t.players[s].gender = d === u.pb.eGender.MAN ? u.pb.eGender.MAN : u.pb.eGender.WOMAN;
t.players[s].pos = c;
t.players[s].onLine = !0;
t.players[s].ready = !0;
a.sites[s].pos = c;
}
var p = this._siteInfos(a.sites), f = {
curStep: a.count,
status: i.eWSKGameStatus.Free,
zhuangUid: 0,
friendUid: 0,
friendCard: 0,
tableScore: 0,
tableScoreCards: [],
allPutCards: [],
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
this._data.gameInfo.status = i.eWSKGameStatus.Free;
p.default.setPaybackData(this._data);
p.default.belongClub = t;
l.default.uiHelper.loadScene(s.default.WSKSceneName);
};
t.prototype.begin = function() {
this._data.gameInfo.status = i.eWSKGameStatus.Calling;
this._data.config.index !== a.eGameIds.QJSHZ && this._data.config.index !== a.eGameIds.QJWSKBD || (this._data.gameInfo.status = i.eWSKGameStatus.Gameing);
for (var e = 0, t = this._data.players.length; e < t; e++) {
this._data.players[e].ready = !1;
}
p.default.setPaybackData(this._data);
this._steps = this._dealSteps(this._dataSteps);
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

case r.CallBanker:
this._sendStep("game_handcard", {
uid: s
});
break;

case r.Put:
this._sendStep("game_step", {
uid: s,
card: l
});
break;

case r.PutNewRound:
this._sendStep("game_operator", {
uid: s,
ot: 2,
round: !0
});
break;

case r.GetScore:
this._sendStep("game_score", {
uid: s,
score: l[0]
});
break;

case r.ShowFirend:
this._sendStep("game_friend", {
uid: s
});
break;

case r.ShowFirendCard:
this._sendStep("game_friendcard", {
deal_uid: s,
friend_card: l[0]
});
break;

case r.NextContinue:
this._sendStep("game_successor", {
uid: s
});
break;

case r.ShowXiCard:
this._sendStep("game_showxicard", {
uid: s,
card: l
});
}
}
};
t.prototype._sendStep = function(e, t) {
c.default.getInstance(a.eGameCategort.WSK).parse(e, t);
};
t.prototype._dealSteps = function(e) {
for (var t = function(e) {
var t = e.uid, o = e.index, n = e.cards, i = [], a = 0;
if (1 === o) a = r.Pass; else if (101 === o) {
a = r.Put;
i = n;
} else if (1006 === o) a = r.ShowFirend; else if (1007 === o) {
a = r.GetScore;
i = n;
} else if (2011 === o) a = r.CallBanker; else if (2012 === o) {
a = r.ShowFirendCard;
i = n;
} else if (2013 === o) a = r.PutNewRound; else if (2014 === o) a = r.NextContinue; else if (2016 === o) {
a = r.ShowXiCard;
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
rank: 0,
pickScore: 0,
handCards: r.handCards,
xiCards: []
});
}
return t;
};
return t;
}(d.default))();
o.default = f;
cc._RF.pop();
