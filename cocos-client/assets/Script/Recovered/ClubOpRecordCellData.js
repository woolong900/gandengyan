// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dc33boDDypFEZFiNJdKKoSL", "ClubOpRecordCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./Constants"), r = function() {
return function(e, t) {
this.weight = 0;
this.opAvatarUrl = "";
this.opCode = "";
this.opNickName = "";
this.source = 0;
this.userCode = "";
this.userNickName = "";
this.opObjects = 0;
this.roomCode = "";
this.time = 0;
this.uId = "1";
this.gameName = "";
this.uId = t + "";
this.opAvatarUrl = e.opAvatarUrl || n.default.defHeadUrl;
this.opCode = e.opCode;
this.opNickName = e.opNickname;
this.source = e.source;
if (e.user && e.user.length > 0) {
this.userCode = e.user[0].code;
this.userNickName = e.user[0].nickname;
}
this.opObjects = e.opObjects;
this.roomCode = e.roomCode;
this.time = e.ts;
this.gameName = e.gameName;
this.weight = t;
};
}();
o.default = r;
cc._RF.pop();
