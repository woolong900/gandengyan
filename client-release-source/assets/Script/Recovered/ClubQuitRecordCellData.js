// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "fe0eaNnOO9IS5VID+V0vyOH", "ClubQuitRecordCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = require("./Constants");
(function(e) {
e[e.SELF = 0] = "SELF";
e[e.ADMIN = 1] = "ADMIN";
})(n = o.eClubQuitSource || (o.eClubQuitSource = {}));
var i = function() {
function e(e) {
this.avatarUrl = "";
this.nickname = "";
this.uid = "";
this.source = 0;
this.time = 0;
this.avatarUrl = e.avatarUrl || r.default.defHeadUrl;
this.nickname = e.nickname;
this.uid = e.code;
this.source = e.source;
this.source = e.source;
this.time = e.ts;
}
e.prototype.sourceStr = function() {
return this.source === n.SELF ? "自己退出" : this.source === n.ADMIN ? "管理员踢出" : void 0;
};
return e;
}();
o.default = i;
cc._RF.pop();
