// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b36701qaiZBSYf3r6U9Neli", "GameRecordCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./RoomConfig"), r = e("./RoomConfigCellData"), i = e("./gContext"), a = function() {
function e(e) {
this._details = null;
this._scoreRatio = 1;
this.id = "";
this.gameId = 0;
this.roomId = 3;
this.gameCount = 4;
this.totalCount = 5;
this.time = 6;
this.config = null;
this.players = [];
this.id = e.id;
this.gameId = e.gameId;
this.roomId = e.roomId;
this.gameCount = e.gameCount;
this.totalCount = e.totalCount;
this.time = e.time;
this._scoreRatio = e.scoreRatio || 1;
var t = i.default.gameLogic(this.gameId).roomParam2Config(this.totalCount, e.param2, e.param1);
this.config = new r.default({
index: this.gameId,
ipLimit: t.ipLimit,
ids: t.ids,
other: t.other
});
this.players = [];
for (var o = 0, n = e.players.length; o < n; o++) {
var a = e.players[o];
this.players.push({
uid: a.uid,
name: a.name,
score: a.score / this._scoreRatio,
avatarUrl: a.avatarUrl,
winner: a.winner
});
}
}
e.prototype.gameName = function() {
return n.default[this.gameId].name;
};
e.prototype.setDetailsData = function(e) {
this._details = e;
this._details.setScoreBase(this._scoreRatio);
};
e.prototype.getDetailsData = function() {
return this._details;
};
e.prototype.playerSortByScore = function() {
return this.players.sort(function(e, t) {
return t.score - e.score;
});
};
return e;
}();
o.default = a;
cc._RF.pop();
