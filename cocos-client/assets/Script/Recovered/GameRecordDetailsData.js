// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "680f4eHoqlKgo+OyIt9hLuS", "GameRecordDetailsData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e(e) {
this._data = [];
this._scoreBase = 1;
for (var t = function(e) {
for (var t = [], o = 0, n = e.scores.length; o < n; o++) t.push({
uid: e.scores[o].uid,
score: e.scores[o].score
});
return {
id: e.id,
scores: t
};
}, o = 0, n = e.length; o < n; o++) {
var r = e[o];
this._data.push(t(r));
}
}
e.prototype.playbackCode = function(e) {
return this._data[e].id;
};
e.prototype.playbackIndex = function(e) {
for (var t = 0, o = this._data.length; t < o; t++) {
if (this.playbackCode(t) == e) return t;
}
return -1;
};
e.prototype.setScoreBase = function(e) {
this._scoreBase = e;
};
e.prototype.score = function(e, t) {
for (var o = this._data[e].scores, n = 0, r = o.length; n < r; n++) if (o[n].uid === t) return o[n].score / this._scoreBase;
cc.error("uid or index error.");
};
e.prototype.count = function() {
return this._data.length;
};
return e;
}();
o.default = n;
cc._RF.pop();
