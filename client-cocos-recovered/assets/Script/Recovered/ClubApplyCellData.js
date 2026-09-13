// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "feb5c7e8dlLK7ReGcDWlSAY", "ClubApplyCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = e("./Constants");
(function(e) {
e[e.JOIN = 0] = "JOIN";
e[e.QUIT = 1] = "QUIT";
})(n = o.APPLY_POLICY || (o.APPLY_POLICY = {}));
var i = function() {
function e(e) {
this.id = 0;
this.nickname = "";
this.uid = "";
this.avatarUrl = "";
this.sex = 0;
this.policy = 0;
this.id = e.id;
this.nickname = e.nickname;
this.uid = e.code;
this.avatarUrl = e.avatarUrl || r.default.defHeadUrl;
this.sex = e.sex;
this.policy = e.policy;
}
e.prototype.policyIsJoin = function() {
return this.policy === n.JOIN;
};
e.prototype.policyIsQuit = function() {
return this.policy === n.QUIT;
};
return e;
}();
o.default = i;
cc._RF.pop();
