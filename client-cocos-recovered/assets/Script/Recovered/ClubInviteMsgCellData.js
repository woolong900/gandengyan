// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2a88aP8rJ9Cmp5xDxhW7oBL", "ClubInviteMsgCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
return function(e) {
this.id = 0;
this.clubAvatarUrl = "";
this.inviterName = "";
this.clubName = "";
this.policy = 0;
this.messageContent = "";
this.id = e.id;
this.inviterName = e.inviter;
this.clubName = e.name;
this.clubAvatarUrl = e.avatarUrl;
this.policy = e.policy || 0;
this.messageContent = this.policy ? e.name : "";
};
}();
o.default = n;
cc._RF.pop();
