// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "41d61Yyk6VKmYl8Nc5nEkV2", "SingleEndPlayerData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./RoomInfoData");
(function(e) {
e[e.NULL = 0] = "NULL";
e[e.FengDing = 1] = "FengDing";
e[e.JingDing = 2] = "JingDing";
e[e.YangGuangDing = 3] = "YangGuangDing";
e[e.ZhuDuZi = 4] = "ZhuDuZi";
e[e.QiangGangHu = 5] = "QiangGangHu";
e[e.BeiQiangGang = 6] = "BeiQiangGang";
})(o.eHuSpecial || (o.eHuSpecial = {}));
var r = function() {
function e(e) {
this.uid = 0;
this._score = 0;
this.huType = 0;
this.specialFlag = 0;
this.mul = 0;
this.uid = e.uid;
this._score = e.score;
this.huType = e.huType;
this.specialFlag = e.specialFlag;
this.mul = e.mul;
}
Object.defineProperty(e.prototype, "score", {
get: function() {
return this._score / n.default.scoreRatio;
},
enumerable: !0,
configurable: !0
});
e.prototype.isDPUser = function() {
return n.default.players.getByUid(this.uid).pos === n.default.gameInfo.cardPointer;
};
e.prototype.isBQGUser = function() {
return n.default.players.getByUid(this.uid).pos === n.default.gameInfo.playerPointer;
};
return e;
}();
o.default = r;
cc._RF.pop();
