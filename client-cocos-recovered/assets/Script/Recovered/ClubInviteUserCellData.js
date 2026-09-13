// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "af30ej7RSBCqrG6Bi/Xtggd", "ClubInviteUserCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./Constants"), r = function() {
return function(e) {
this.id = 0;
this.avatarUrl = "";
this.nickname = "";
this.code = "";
this.id = e.userId;
this.avatarUrl = e.avatarUrl || n.default.defHeadUrl;
this.nickname = e.nickname;
this.code = e.code;
};
}();
o.default = r;
cc._RF.pop();
