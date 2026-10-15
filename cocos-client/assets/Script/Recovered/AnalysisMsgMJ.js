// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5dbf8Oyn2tFIovzklIbOtF3", "AnalysisMsgMJ");
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
var r = require("./CommonEnum"), i = require("./RoomInfoData"), a = require("./GameInfoData"), s = require("./CardUtils"), l = require("./UserData"), c = require("./OperateListData"), u = require("./CommonUtils"), d = require("./SingleEndPlayerData"), p = require("./OperateConfig"), f = require("./MaJiangMsg"), h = require("./AnalysisMsgBase"), m = require("./GameConn"), y = require("./GameControl"), g = require("./Constants"), _ = require("./GameSoundMJ"), v = require("./gContext"), C = !0, b = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.parse = function(t, o) {
"game_begin" === t && this._gameBegin(o);
"game_end" === t && this._gameInfo(o, !0, !1);
"game_info" === t && this._gameInfo(o, !1, !1);
"game_scorechange" === t && this._scoreChange(o);
"game_operator" === t && this._canOperate(o);
"game_draw" === t && this._getCard(o);
"game_step" === t && this._putCard(o);
"game_pass" === t && this._operate(o, p.eOperateCategory.Guo);
"game_chow" === t && this._operate(o, p.eOperateCategory.Chi);
"game_touch" === t && this._operate(o, p.eOperateCategory.Peng);
"game_gang" === t && this._operate(o, p.eOperateCategory.Gang);
"game_lzg" === t && this._operate(o, p.eOperateCategory.LaiZi);
"game_pzg" === t && this._operate(o, p.eOperateCategory.PiZi);
"game_hzg" === t && this._operate(o, p.eOperateCategory.PiZi);
"game_qjhz_hzg" === t && this._operateQJHZ(o, p.eOperateCategory.PiZi);
"game_showcard" === t && this._operate(o, p.eOperateCategory.ShowCard);
"game_showrazz" === t && this._operate(o, p.eOperateCategory.WarnLL);
"game_noticejys" === t && this._operate(o, p.eOperateCategory.WarnJYS);
"game_noticefys" === t && this._operate(o, p.eOperateCategory.WarnFYS);
"game_noticeqqr" === t && this._operate(o, p.eOperateCategory.WarnQQR);
"game_noticeqys" === t && this._operate(o, p.eOperateCategory.WarnQYS);
if ("game_show_zfb_op" === t) {
this._canOperate(o);
1 !== o.show_zfb && this.cleanCountDown();
}
if ("game_show_zfb" === t && C) {
this._operateLiangDao(o, p.eOperateCategory.LiangDao);
this._canOperate(o);
if (0 === o.show_zfb) {
for (var n = i.default.gameInfo.playerPointer, r = i.default.players.collection(), a = 0; a < r.length; a++) {
var s = parseInt(r[a]), c = !1;
n === i.default.players.getByUid(s).pos && (c = !0);
i.default.players.getByUid(s).isTurn = c;
}
var u = l.default.second + v.default.gameLogic().autoGameCountDown(i.default.config);
i.default.setCountDown(u);
C = !1;
}
}
e.prototype.parse.call(this, t, o);
};
t.prototype._operateLiangDao = function(e, t) {
var o = [];
o = "number" == typeof e.card ? [ e.card ] : e.card || [];
for (var n = t, r = e.show_zfb, i = [], a = 0, s = Math.floor(o.length / 3), l = 0; l < s; l++) {
i[l] = i[l] || [];
for (var c = 0; c < 3; c++) {
var u = o[a];
if (!u) break;
i[l].push(u);
a++;
}
}
for (var d = 0; d < i.length; d++) {
var p = i[d];
f.default.adOperate(e.uid, {
index: n,
cards: p,
subType: r
});
}
this.cleanCountDown();
};
t.prototype.parseGame = function(e) {
this.parse("game_info", e);
};
t.index2Pos = function(e, t) {
if (2 === t) {
if (0 === e) return r.eDeskPos.East;
if (1 === e) return r.eDeskPos.West;
} else {
if (0 === e) return r.eDeskPos.East;
if (1 === e) return r.eDeskPos.North;
if (2 === e) return r.eDeskPos.West;
if (3 === e) return r.eDeskPos.South;
}
};
t.prototype._canOperate = function(e) {
var t = this._parseCanOpreate(e), o = new c.default(t), n = i.default.myAbsolutePos();
i.default.gameInfo.siteInfos.get(n).updateOperateOptions(o);
this.recordCountDown(i.default.players.getByPos(n).uid);
};
t.prototype._getCard = function(e) {
if (1 === i.default.gameInfo.status) {
for (var o = e.uid, n = i.default.players.getByUid(o), r = e.card || s.MJ_BACK_ID, a = [], l = 0; l < 4; l++) {
var c = t.index2Pos(l), u = i.default.gameInfo.siteInfos.get(c).paiDunCards.length;
a.push(u);
}
var d = i.default.gameInfo.pz, p = this._parseWallData(i.default.gameInfo.status, e.wall, a, d, e.pz_pos);
i.default.gameInfo.getCard(n.pos, r, p);
r > 0 && i.default.gameInfo.siteInfos.statisAllOuts();
this.recordCountDown(o);
} else {
cc.log(" =========================> data error.");
m.default.reconnect();
}
};
t.prototype._putCard = function(e) {
var t = e.uid, o = e.card || s.MJ_BACK_ID;
f.default.putCard(t, o);
this.cleanCountDown();
};
t.prototype._operate = function(e, t) {
var o = [];
o = "number" == typeof e.card ? [ e.card ] : e.card || [];
var n = t, a = 0, s = e.xxf || 0;
if (t === p.eOperateCategory.Gang) {
i.default.gameInfo.setGangDelay();
var l = e.view;
1 === l && (a = p.eGangType.MingGang);
2 === l && (a = p.eGangType.AnGang);
3 === l && (a = p.eGangType.BuGang);
}
f.default.adOperate(e.uid, {
index: n,
cards: o,
subType: a
});
i.default.config.index == r.eGameIds.QJHZ && s > 0 && setTimeout(function() {
f.default.adOperate(e.uid, {
index: p.eOperateCategory.XXF,
subType: 1
});
}, .01);
this.cleanCountDown();
};
t.prototype._operateQJHZ = function(e, o) {
var n = [];
n = "number" == typeof e.card ? [ e.card ] : e.card || [];
for (var r = o, a = e.draw_card || [], s = e.uid, l = i.default.players.getByUid(s), c = [], u = 0; u < 4; u++) {
var d = t.index2Pos(u), h = i.default.gameInfo.siteInfos.get(d).paiDunCards.length;
c.push(h);
}
var m = i.default.gameInfo.pz, y = this._parseWallData(i.default.gameInfo.status, e.wall, c, m, []);
i.default.gameInfo.hzgUpdateCard(l.pos, y);
if (n.length > 0 && 0 == a.length) for (u = 0; u < n.length; u++) a.push(0);
var g = e.xxf;
if (g > 0) {
var v = function(e) {
setTimeout(function() {
f.default.adOperate(s, {
index: p.eOperateCategory.XXF,
cards: [ n[e] ],
subType: 0,
xxf: g,
draw_card: [ a[e] ]
});
}, .01);
};
for (u = 0; u < n.length; u++) v(u);
} else if (n.length > 0) {
_.default.getInstance().playOperate("qj_lzg2", l.gender);
var C = function(e) {
setTimeout(function() {
f.default.adOperate(s, {
index: r,
cards: [ n[e] ],
subType: 0,
draw_card: [ a[e] ]
});
}, .01);
};
for (u = 0; u < n.length; u++) C(u);
}
};
t.prototype._gameBegin = function(e) {
var t = y.default.getInstance();
t && (t.isPlayingBeginAnimation = !0);
this._gameInfo(e, !1, !0);
t && t.playAnimationBegin();
};
t.prototype.oldPlayerIndex2NewPos = function(e) {
if (2 === i.default.config.peopleCount()) {
if (1 === e) return r.eDeskPos.East;
if (2 === e) return r.eDeskPos.West;
} else {
if (1 === e) return r.eDeskPos.East;
if (2 === e) return r.eDeskPos.North;
if (3 === e) return r.eDeskPos.West;
if (4 === e) return r.eDeskPos.South;
}
cc.error("数据错误～");
};
t.prototype._oldSiteIndex2NewPos = function(e) {
if (1 === e) return r.eDeskPos.East;
if (2 === e) return r.eDeskPos.North;
if (3 === e) return r.eDeskPos.West;
if (4 === e) return r.eDeskPos.South;
cc.error("数据错误～");
};
t.prototype._scoreChange = function(e) {
for (var t = e.players || [], o = 0, n = t.length; o < n; o++) {
var r = t[o], a = r.uid, s = r.score, l = r.total;
i.default.players.getByUid(a).updateScore(l, s);
}
};
t.prototype._gameInfo = function(e, t, o) {
C = !0;
var n = a.eGameStatus.Free;
o && (this._curGameCount = this._curGameCount + 1);
var s = this._curGameCount, u = [], d = [], h = [], m = null, y = !1, g = {};
if ((n = e.begin ? a.eGameStatus.Gameing : 0 === s ? a.eGameStatus.Free : s < i.default.config.gameCount() ? a.eGameStatus.SingleEnd : a.eGameStatus.TotalEnd) === a.eGameStatus.SingleEnd || n === a.eGameStatus.TotalEnd) {
y = !0;
var _ = 2;
(e.hz || !1) && (_ = 1);
e.in_horse && (e.in_horse.length > 0 || e.not_in_horse.length > 0) && (_ = 3);
m = {
time: l.default.second,
endType: _,
players: [],
inHorse: e.in_horse,
notInhorse: e.not_in_horse,
horseSum: 0 == e.in_horse_num ? 0 : e.in_horse_num || e.gun_score
};
}
for (var v = e.info || [], b = e.show_card_stage, D = 0, S = v.length; D < S; D++) {
var w = v[D], O = w.uid;
if (!(O <= 0)) {
if (L = this._parseSiteInfo(w, u, e.lz)) {
h.push(L);
g[L.pos] = L;
w.deal && O;
}
if (b && O == l.default.uid) {
cc.error("jsonSiteInfo:", w);
cc.error("showliangdao .........................");
this._detailOperateLD(w.show_down, p.eOperateCategory.LiangDao, d);
}
if (y) {
var P = {
uid: w.uid,
score: w.score,
huType: w.hu_type,
specialFlag: this._parseSingleEndSpecial(w),
mul: w.bet_score || 0
};
m.players.push(P);
}
}
}
var I = this._parseWallData(n, e.wall, e.wall_size, e.lzp, e.pz_pos), R = this._parseSurplusCard(e.surplus_card, e.cur_step), k = {
pos: r.eDeskPos.East,
index: 0
};
n === a.eGameStatus.Gameing && (k = this._findPaiDunPointer(I));
for (var j = r.eDeskPos.East; j <= r.eDeskPos.North; j++) {
var L;
if (L = g[j]) ; else {
L = {
pos: j,
operateList: [],
outCards: [],
handCards: [],
paiDunCards: [],
surplusCards: []
};
h.push(L);
}
if (n === a.eGameStatus.Free) ; else {
L.paiDunCards = I[j] || [];
L.surplusCards = R[j] || [];
}
}
if (t) for (D = 0, S = u.length; D < S; D++) f.default.adOperate(u[D].uid, u[D].operate);
var U = r.eDeskPos.Stand, N = r.eDeskPos.Stand;
e.bef_step && e.bef_step > 0 && (U = i.default.players.getByUid(e.bef_step).pos);
e.cur_step && e.cur_step > 0 && (N = i.default.players.getByUid(e.cur_step).pos);
i.default.updateGameData({
count: s,
pz: e.lzp,
lz: e.lz,
siteInfos: h,
singleEndInfo: m,
cardPointer: U,
playerPointer: N,
status: n,
beginPaiDunPos: k,
owner: i.default.owner,
dice1: Math.floor((Number(e.dice) || 0) / 10),
dice2: (Number(e.dice) || 0) % 10,
specialRuleFlag: e.treasure_leopard
});
i.default.gameInfo.cun_num = e.deposit_num;
var T = new c.default(d), M = i.default.myAbsolutePos();
i.default.gameInfo.siteInfos.get(M).updateOperateOptions(T);
};
t.prototype._parseSurplusCard = function(e, t) {
var o = {};
if (!(e && e.length > 0 && t > 0)) return o;
for (var n = [], r = i.default.players.getByUid(t).pos, a = g.default.DeskMaskMJ, s = 1; s < a; s++) {
var l = (r + a - s) % a;
i.default.players.getByPos(l) && n.push(l);
}
n.push(r);
for (var c = n.length, u = (s = 0, (e = e || []).length); s < u; s++) {
var d = e[s], p = n[s % c];
o[p] = o[p] || [];
o[p].push(d);
}
return o;
};
t.prototype._parseWallData = function(e, o, n, r, i) {
var l = {};
if (e !== a.eGameStatus.Gameing) {
cc.warn("game status error:", e);
return l;
}
if (!o || !n) {
cc.warn("wall size error");
return l;
}
var c = o.length;
if (4 === c) {
for (var d = 0; d < c; d++) {
var p = t.index2Pos(d), f = o[d], h = n[d], m = u.default.bit2MJList(f, h);
l[p] = m;
}
if (i && 2 === i.length) {
var y = this._oldSiteIndex2NewPos(i[0]), g = i[1] - 1;
l[y][g] === s.MJ_BACK_ID && (l[y][g] = r);
}
return l;
}
cc.warn("牌顿长度错误～");
};
t.prototype._findPaiDunPointer = function(e) {
for (var t = r.eDeskPos.East; t <= r.eDeskPos.North; t++) {
var o = e[t];
if (o) if (o[0] === s.MJ_HIDE_ID) {
var n = g.default.DeskMaskMJ, i = e[(t + n - 1) % n];
if (i[i.length - 1] !== s.MJ_HIDE_ID) return {
pos: t,
index: 0
};
} else for (var a = 0, l = o.length; a < l - 1; a++) if (o[a] !== s.MJ_HIDE_ID && o[a + 1] === s.MJ_HIDE_ID) return {
pos: t,
index: a + 1
};
}
return {
pos: r.eDeskPos.East,
index: 0
};
};
t.prototype._parseCanOpreate = function(e) {
var t = e.chow || [], o = e.gang || [], n = e.touch || 0, r = e.hu || 0, i = e.show_razz || !1, a = e.bright_jys || !1, s = e.bright_qqr || !1, l = e.bright_qys || !1, c = e.bright_fys || !1, u = e.show_card || !1, d = e.show_zfb || 0, f = r > 0, h = 0;
d && (h = d);
var m = [], y = function(e, t) {
var o = {
index: e,
cards: t,
subType: h
};
m.push(o);
};
if (t.length > 0) for (var g = 0; g < t.length; g++) {
var _ = t[g];
y(p.eOperateCategory.Chi, [ _[0], _[1], _[2] ]);
}
if (o.length > 0) for (g = 0; g < o.length; g++) y(p.eOperateCategory.Gang, [ o[g] ]);
n && y(p.eOperateCategory.Peng, [ n ]);
f && y(p.eOperateCategory.Hu, [ r ]);
i && y(p.eOperateCategory.WarnLL, []);
a && y(p.eOperateCategory.WarnJYS, []);
s && y(p.eOperateCategory.WarnQQR, []);
l && y(p.eOperateCategory.WarnQYS, []);
c && y(p.eOperateCategory.WarnFYS, []);
u && y(p.eOperateCategory.ShowCard, []);
d && y(p.eOperateCategory.LiangDao, []);
return m;
};
t.prototype._parseSiteInfo = function(e, t, o) {
var n = e.uid, r = i.default.players.getByUid(n);
if (r) {
var a = !!e.ready, l = e.total || 0, c = e.deal || !1;
if (r.isReady() !== a || l !== r.score || c !== r.deal) {
var u = r.pbData();
u.ready = a;
u.score = l;
u.deal = c;
i.default.updatePlayerData(u);
}
var d = r.pos, f = [], h = [], m = [], y = e.operator_record || {}, g = e.card.show_down_card;
g && g.length > 0 && this._detailOperateCPG(g, p.eOperateCategory.LiangDao, 0, f, y);
this._detailOperateWarn(e.bright_razz, p.eOperateCategory.WarnLL, f);
this._detailOperateWarn(e.bright_qys, p.eOperateCategory.WarnQYS, f);
this._detailOperateWarn(e.bright_jys, p.eOperateCategory.WarnJYS, f);
this._detailOperateWarn(e.bright_fys, p.eOperateCategory.WarnFYS, f);
this._detailOperateWarn(e.bright_qqr, p.eOperateCategory.WarnQQR, f);
this._detailOperateWarn(e.bright_card ? 1 : 0, p.eOperateCategory.ShowCard, f);
this._detailOperateCPG(e.card.chow_card, p.eOperateCategory.Chi, 0, f);
this._detailOperateCPG(e.card.touch_card, p.eOperateCategory.Peng, 0, f, y);
this._detailOperateCPG(e.card.mg_card, p.eOperateCategory.Gang, p.eGangType.MingGang, f, y);
this._detailOperateCPG(e.card.ag_card, p.eOperateCategory.Gang, p.eGangType.AnGang, f, y);
for (var _ = e.card.bg_card || [], v = 0, C = _.length; v < C; v++) {
var b = _[v];
this._detailOperateCPG([ b ], p.eOperateCategory.Peng, 0, f, y);
}
this._detailOperateCPG(e.card.bg_card, p.eOperateCategory.Gang, p.eGangType.BuGang, f, y);
this._detailOperatePLG(e.card.hzg_card, o, p.eOperateCategory.PiZi, p.eOperateCategory.LaiZi, f);
var D = e.razz_times || 0;
for (v = 0; v < D; v++) this._detailOperatePLG([ o ], o, p.eOperateCategory.PiZi, p.eOperateCategory.LaiZi, f);
var S = this._detailOperateHu(e.hu_type, e.card.draw_card, f);
S && t.push({
uid: n,
operate: S
});
var w = e.card.hand_card || [], O = w.length, P = e.num;
for (v = 0; v < O; v++) {
var I = w[v];
I > 0 ? m.push(I) : m.push(s.MJ_BACK_ID);
}
if (O === P) ; else {
var R = e.card.draw_card;
R > 0 ? m.push(R) : m.push(s.MJ_BACK_ID);
}
var k = e.card.dis_card || [];
for (v = 0, C = k.length; v < C; v++) h.push(k[v]);
return {
pos: d,
operateList: f,
outCards: h,
handCards: m,
paiDunCards: [],
surplusCards: []
};
}
cc.error("数据错误:", e);
};
t.prototype._detailOperateLD = function(e, t, o) {
var n = {
index: t,
cards: [],
subType: 0 === e ? 1 : 1 === e ? 2 : e
};
o.push(n);
};
t.prototype._detailOperateWarn = function(e, t, o) {
1 === e && o.push({
index: t,
cards: []
});
};
t.prototype._detailOperateCPG = function(e, t, o, n, r) {
for (var a = 0, s = (e = e || []).length; a < s; a++) {
var l = e[a], c = [];
"number" == typeof l ? c.push(l) : c = u.default.clone(l);
var d = {
index: t,
cards: c,
subType: o
};
if (r) {
var p = r[c[0]], f = i.default.players.getByUid(p);
f && (d.pointTo = f.pos);
}
n.push(d);
}
};
t.prototype._detailOperatePLG = function(e, t, o, n, r) {
for (var i = 0, a = (e = e || []).length; i < a; i++) {
var s = e[i];
t === s ? r.push({
index: n,
cards: [ s ]
}) : r.push({
index: o,
cards: [ s ]
});
}
};
t.prototype._detailOperateHu = function(e, t, o) {
if (e > 0) {
var n = {
index: p.eOperateCategory.Hu,
cards: [ t ],
subType: e
};
o.push(n);
return n;
}
return null;
};
t.prototype._parseSingleEndSpecial = function(e) {
return e.ygd ? d.eHuSpecial.YangGuangDing : e.zdz ? d.eHuSpecial.ZhuDuZi : e.fd ? d.eHuSpecial.FengDing : e.jd ? d.eHuSpecial.JingDing : d.eHuSpecial.NULL;
};
return t;
}(h.default);
o.default = b;
cc._RF.pop();
