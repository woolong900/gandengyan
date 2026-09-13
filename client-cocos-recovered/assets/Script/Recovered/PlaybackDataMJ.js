// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ac79db9yAdPe5RHOIUcC/w8", "PlaybackDataMJ");
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
var r, i = e("./CommonEnum"), a = e("./GameInfoData"), s = e("./OperateConfig"), l = e("./RoomInfoData"), c = e("./gContext"), u = e("./MaJiangMsg"), d = e("./pb"), p = e("./Constants"), f = e("./AnalysisMsgMJ"), h = e("./PlaybackDataBase"), m = e("./GameSoundMJ");
(function(e) {
e[e.GetCard = 1] = "GetCard";
e[e.PutCard = 2] = "PutCard";
e[e.Operate = 3] = "Operate";
e[e.CanOperate = 4] = "CanOperate";
})(r || (r = {}));
var y = new (function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.setData = function(t, o) {
e.prototype.setData.call(this, t, o);
for (var n = t.roomInfo, r = this.roomConfig(n), s = t.gameInfo, l = s.sites, c = this._findPointer(t, s.zhuang), u = 0, p = t.players.length; u < p; u++) {
var h = f.default.index2Pos(u, p), m = t.players[u].gender;
t.players[u].gender = m === d.pb.eGender.MAN ? d.pb.eGender.MAN : d.pb.eGender.WOMAN;
t.players[u].pos = h;
t.players[u].onLine = !0;
t.players[u].ready = !0;
s.zhuang === t.players[u].uid ? t.players[u].deal = !0 : t.players[u].deal = !1;
s.sites[u].pos = h;
}
var y = 0, g = 0, _ = 0, v = !1;
if (r.index == i.eGameIds.MCHZ && t.gameInfo.extend) {
var C = parseInt(t.gameInfo.extend[0]), b = t.gameInfo.extend.slice(1, t.gameInfo.extend.length), D = this.getNewArray(b, C);
_ = parseInt(D[D.length - 1]);
y = parseInt(D[0][C - 1]);
g = parseInt(D[0][C - 2]);
v = parseInt(D[1]) == s.lz;
}
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
gameInfo: {
count: s.count,
pz: s.pz,
lz: s.lz,
cardPointer: i.eDeskPos.Stand,
playerPointer: c,
status: a.eGameStatus.Free,
beginPaiDunPos: {
pos: 0,
index: 0
},
pzPos: s.pzPos || {
pos: 0,
index: 0
},
owner: s.zhuang,
dice1: y,
dice2: g,
siteInfos: this._siteInfos(l),
cun: _,
specialRuleFlag: v
}
};
this._dataSteps = t.steps;
};
t.prototype.init = function(t, o) {
e.prototype.initData.call(this, o);
this._data.gameInfo.status = a.eGameStatus.Free;
l.default.setPaybackData(this._data);
l.default.belongClub = t;
c.default.uiHelper.loadScene(p.default.GameSceneName);
};
t.prototype.begin = function() {
this._data.gameInfo.status = a.eGameStatus.Gameing;
u.default.gameBegin(this._data.gameInfo);
for (var e = 0, t = this._data.players.length; e < t; e++) {
this._data.players[e].ready = !1;
}
l.default.setPaybackData(this._data);
this._steps = this._dealSteps(this._dataSteps);
};
t.prototype.step = function(e) {
for (var t = this._steps[e], o = i.eDeskPos.East; o <= i.eDeskPos.North; o++) {
var n = l.default.gameInfo.siteInfos.get(o);
n && n.updateOperateOptions(null);
}
for (var a = function(e, o) {
var n = t[e], a = n.action, c = n.uid, d = n.cards;
a === r.GetCard && u.default.getCard(c, d[0]);
a === r.PutCard && u.default.putCard(c, d[0]);
a === r.CanOperate && u.default.canOperate(c, n.canOperates);
if (a === r.Operate) if (l.default.config.index == i.eGameIds.QJHZ) {
if (102 == n.operate.index && l.default.config.index == i.eGameIds.QJHZ) u.default.adOperate(c, {
index: s.eOperateCategory.XXF,
subType: 102
}); else if (n.operate.index == s.eOperateCategory.PiZi) {
var p = n.operate.cards || [], f = [], h = [];
if (p.length >= 2 && p.length % 2 == 0) {
h = p.slice(0, p.length / 2);
f = p.slice(p.length / 2, p.length);
}
if (h.length > 0) {
var y = n.uid, g = l.default.players.getByUid(y);
g && m.default.getInstance().playOperate("qj_lzg2", g.gender);
for (var _ = function(e) {
setTimeout(function() {
u.default.adOperate(y, {
index: n.operate.index,
cards: [ h[e] ],
subType: n.operate.subType,
draw_card: [ f[e] ]
});
}, .01);
}, v = 0; v < h.length; v++) _(v);
}
} else u.default.adOperate(c, n.operate);
} else if (l.default.config.index == i.eGameIds.DYHH) {
if (14 === n.operate.index) {
for (var C = n.operate.cards || [], b = Math.floor(C.length / 3), D = 0, S = [], w = 0; w < b; w++) {
S[w] = S[w] || [];
for (var O = 0; O < 3; O++) {
var P = C[D];
if (!P) break;
S[w].push(P);
D++;
}
}
for (var I = 0; I < S.length; I++) {
var R = S[I];
u.default.adOperate(c, {
index: s.eOperateCategory.LiangDao,
cards: R,
subType: 1
});
}
} else u.default.adOperate(c, n.operate);
cc.error("cell.operate.index:", n.operate.index);
} else u.default.adOperate(c, n.operate);
}, c = (o = 0, t.length); o < c; o++) a(o);
};
t.prototype._siteInfos = function(e) {
for (var t = [], o = 0, n = e.length; o < n; o++) {
var r = e[o];
t.push({
pos: r.pos,
operateList: [],
outCards: [],
handCards: r.handCards,
paiDunCards: [],
surplusCards: []
});
}
return t;
};
t.prototype._findPointer = function(e, t) {
for (var o = e.players, n = 0, r = o.length; n < r; n++) {
var a = o[n];
if (t === a.uid) return a.pos;
}
return i.eDeskPos.Stand;
};
t.prototype._dealSteps = function(e) {
for (var t = function(e) {
var t = e.uid, o = e.index, n = e.cards, i = null, a = null, l = [], c = 0;
if (200 === o) {
c = r.CanOperate;
i = [];
for (var u = 0, d = n.length; u < d; u++) {
var p = {
index: n[u]
};
i.push(p);
}
} else if (100 === o) {
c = r.GetCard;
l = n;
} else if (101 === o) {
c = r.PutCard;
l = n;
} else if (102 == o) {
c = r.Operate;
a = {
index: o,
horse: [],
cards: [],
subType: 102
};
} else {
c = r.Operate;
var f = 0, h = [], m = [];
if (o === s.eOperateCategory.Hu || o === s.eOperateCategory.Gang) {
h = [ n[0] ];
f = n[1];
m = n.slice(2);
} else h = n;
a = {
index: o,
horse: m,
cards: h,
subType: f
};
}
return {
uid: t,
action: c,
cards: l,
operate: a,
canOperates: i
};
}, o = [], n = 0, i = e.length; n < i; n++) {
for (var a = [], l = e[n], u = 0; u < l.operates.length; u++) {
var d = t(l.operates[u]);
if (d.action === r.Operate && (d.operate.index === s.eOperateCategory.PiZi || d.operate.index === s.eOperateCategory.LaiZi)) {
var p = d.operate.cards[0];
if (c.default.gameLogic().isGangCard(p)) {
var f = {
uid: d.uid,
action: r.PutCard,
cards: [ p ]
};
a.push(f);
}
}
a.push(d);
}
o.push(a);
}
return o;
};
t.prototype.getNewArray = function(e, t) {
for (var o = 0, n = []; o < e.length; ) n.push(e.slice(o, o += t));
return n;
};
return t;
}(h.default))();
o.default = y;
cc._RF.pop();
