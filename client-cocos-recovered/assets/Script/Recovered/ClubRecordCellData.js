// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1b782cdK01HVoxIPXQI2HIM", "ClubRecordCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./Constants"), r = function() {
function e(e, t) {
this.avatarUrl = "";
this.nickname = "";
this.uid = "";
this.winner = 0;
this.session = 0;
this.weight = 0;
this.remark = "";
this._score = 0;
this._scoreRatio = 1;
this.avatarUrl = e.avatarUrl || n.default.defHeadUrl;
this.nickname = e.nickname;
this.uid = e.code;
this.winner = e.winner;
this.session = e.number;
this._score = e.score;
this._scoreRatio = e.scoreRatio || 1;
this.remark = e.remark;
this.weight = t;
}
Object.defineProperty(e.prototype, "score", {
get: function() {
return this._score / this._scoreRatio;
},
enumerable: !0,
configurable: !0
});
return e;
}();
o.default = r;
cc._RF.pop();
