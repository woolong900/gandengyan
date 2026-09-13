// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "74044A14ZFKF7xlVrb+OGGC", "ClubIsolateGroupData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./Constants"), r = function() {
function e(e) {
this.id = 0;
this.isolateMembers = {};
this._memberCount = 0;
this.id = e.id;
for (var t = 0, o = e.isolates.length; t < o; t++) {
var r = e.isolates[t];
this._memberCount++;
this.isolateMembers[r.userId] = {
user_id: r.userId,
nickname: r.nickname,
avatarUrl: r.avatarUrl || n.default.defHeadUrl,
code: r.code
};
}
}
e.prototype.memberCount = function() {
return this._memberCount;
};
return e;
}();
o.default = r;
cc._RF.pop();
