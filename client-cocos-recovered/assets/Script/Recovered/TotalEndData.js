// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a0e7dj2AYVKxa0BgcsNe9TX", "TotalEndData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = require("./RoomInfoData");
(function(e) {
e[e.ZI_MO = 1] = "ZI_MO";
e[e.JIE_PAO = 2] = "JIE_PAO";
e[e.DIAN_PAO = 3] = "DIAN_PAO";
e[e.AN_GANG = 4] = "AN_GANG";
e[e.MING_GANG = 5] = "MING_GANG";
e[e.HONG_ZHONG = 6] = "HONG_ZHONG";
e[e.PIAO_LAI = 7] = "PIAO_LAI";
e[e.ZHONG_MA = 8] = "ZHONG_MA";
e[e.D7_COUNT_WIN = 9] = "D7_COUNT_WIN";
e[e.D7_MAX_LEVEL = 10] = "D7_MAX_LEVEL";
e[e.PDK_SINGLE_WIN_SCORE = 11] = "PDK_SINGLE_WIN_SCORE";
e[e.PDK_COUNT_BOMB = 12] = "PDK_COUNT_BOMB";
e[e.PDK_COUNT_WIN = 13] = "PDK_COUNT_WIN";
e[e.PDK_COUNT_LOSE = 14] = "PDK_COUNT_LOSE";
e[e.WSK_COUNT_WIN = 15] = "WSK_COUNT_WIN";
e[e.WSK_COUNT_LOSE = 16] = "WSK_COUNT_LOSE";
e[e.DBD_LOSE_COUNT = 17] = "DBD_LOSE_COUNT";
e[e.DBD_WINNEW_COUNT = 18] = "DBD_WINNEW_COUNT";
e[e.HZ_COUNT = 19] = "HZ_COUNT";
e[e.DBD_HALL_SCORE = 20] = "DBD_HALL_SCORE";
})(n = o.eTotalEndDetailType || (o.eTotalEndDetailType = {}));
var i = function() {
function e(e) {
this._uid = 0;
this._score = 0;
this.details = [];
this.winer = !1;
this.loser = !1;
this._uid = e.uid;
this._score = e.score;
this.winer = e.winer;
this.loser = e.loser;
for (var t = e.details || [], o = 0, n = t.length; o < n; o++) this.details.push({
type: t[o].type,
count: t[o].count
});
}
e.prototype.uid = function() {
return this._uid;
};
e.prototype.score = function() {
return this._score / r.default.scoreRatio;
};
e.prototype.isFangZhu = function() {
return this._uid === r.default.owner;
};
e.prototype.isWiner = function() {
return this.winer;
};
e.prototype.isLoser = function() {
return this.loser;
};
e.prototype.descKey = function() {
for (var e = "", t = 0, o = this.details.length; t < o; t++) {
e.length > 0 && (e += "\n");
var n = this.details[t].type;
e += this._cellDesc(n);
}
return e;
};
e.prototype.descValue = function() {
for (var e = "", t = 0, o = this.details.length; t < o; t++) {
e.length > 0 && (e += "\n");
this.details[t].type === n.PDK_SINGLE_WIN_SCORE ? e += this.details[t].count / r.default.scoreRatio : e += this.details[t].count;
}
return e;
};
e.prototype._cellDesc = function(e) {
return e === n.ZI_MO ? "自摸次数" : e === n.JIE_PAO ? "接炮次数" : e === n.DIAN_PAO ? "点炮次数" : e === n.AN_GANG ? "暗杠次数" : e === n.MING_GANG ? "明杠次数" : e === n.HONG_ZHONG ? "红中次数" : e === n.PIAO_LAI ? "飘癞有奖次数" : e === n.D7_COUNT_WIN ? "胜利局数" : e === n.D7_MAX_LEVEL ? "最高等级" : e === n.ZHONG_MA ? "中马次数" : e === n.PDK_SINGLE_WIN_SCORE ? "单局最高分" : e === n.PDK_COUNT_BOMB ? "扔出炸弹数" : e === n.PDK_COUNT_WIN ? "胜利局数" : e === n.PDK_COUNT_LOSE ? "失败局数" : e === n.WSK_COUNT_WIN ? "胜利局数" : e === n.WSK_COUNT_LOSE ? "失败局数" : e === n.DBD_LOSE_COUNT ? "失败局数" : e === n.DBD_WINNEW_COUNT ? "胜利局数" : e === n.HZ_COUNT ? "流局次数" : e === n.DBD_HALL_SCORE ? "剩余堂分" : "";
};
return e;
}(), a = function() {
return function(e) {
this.time = 0;
this.isNormalEnd = !1;
this.players = [];
this.time = e.time;
this.isNormalEnd = e.isNormalEnd;
for (var t = 99999999, o = -99999999, n = 0, r = e.players.length; n < r; n++) {
(l = (s = e.players[n]).score) > o && (o = l);
l < t && (t = l);
}
var a = !1;
t !== o && (a = !0);
for (n = 0, r = e.players.length; n < r; n++) {
var s, l = (s = e.players[n]).score;
s.loser = !1;
a && t === l && (s.loser = !0);
this.players.push(new i(s));
}
};
}();
o.default = a;
cc._RF.pop();
