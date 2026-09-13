// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "80a1dD31FVJIaiy/H84uqMm", "ClubMemberAntiAddictionCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = e("./pb"), i = e("./Constants"), a = e("./StringUtils"), s = e("./UserData");
(function(e) {
e[e.Player = 1] = "Player";
e[e.Admin = 2] = "Admin";
e[e.Master = 3] = "Master";
})(n = o.eClubMemberDegree || (o.eClubMemberDegree = {}));
var l = function() {
function e(e) {
this.uid = 0;
this.nickname = "";
this.avatarUrl = "";
this.degress = n.Player;
this.onLine = !1;
this.sex = r.pb.eGender.UNKNOWN;
this.userId = 0;
this.freeze = 0;
this.lastGame = 0;
this.remark = "";
this.joinTime = 0;
this.fatigueNum = 0;
this.uid = parseInt(e.code);
this.nickname = e.nickname;
this.avatarUrl = e.avatarUrl || i.default.defHeadUrl;
this.degress = e.memberType;
this.onLine = 0 != e.status;
this.sex = e.sex;
this.userId = e.userId;
this.freeze = e.freeze;
this.lastGame = e.lastGame;
this.remark = e.remark;
this.joinTime = e.joinTime;
this.fatigueNum = e.fatigueNum;
}
e.prototype.getFatigueNum = function() {
return this.fatigueNum;
};
e.prototype.degressStr = function() {
return this.degress === n.Player ? "玩家" : this.degress === n.Admin ? "管理员" : this.degress === n.Master ? "部长" : void 0;
};
e.prototype.statusStr = function() {
return 1 === this.freeze ? "冻结" : "正常";
};
e.prototype.showAlias = function(e) {
return (e === n.Master || e === n.Admin) && this.remark || this.nickname;
};
e.prototype.freezeStr = function() {
return 1 === this.freeze ? "冻结" : "未冻结";
};
e.prototype.timeStr = function() {
return 0 === this.lastGame ? "无对局" : a.default.dateFormat(1e3 * this.lastGame, "yyyy-MM-dd");
};
e.prototype.joinTimeStr = function() {
return a.default.dateFormat(1e3 * this.joinTime, "yyyy-MM-dd");
};
e.prototype.permissionAdmin = function() {
return this.degress === n.Master || this.degress === n.Admin;
};
e.prototype.permissionMaster = function() {
return this.degress === n.Master;
};
e.prototype.inActiveState = function() {
if (this.lastGame > 0) {
var e = a.default.intervalTimeFormat(s.default.second - this.lastGame, "d");
return parseInt(e) >= 15;
}
if (0 === this.lastGame) {
var t = a.default.intervalTimeFormat(s.default.second - this.joinTime, "d");
return parseInt(t) >= 15;
}
return !1;
};
e.prototype.lastGameStr = function() {
return 0 === this.lastGame ? "无对局" : a.default.intervalTimeFormat(s.default.second - this.lastGame, "d") + "天前";
};
return e;
}();
o.default = l;
cc._RF.pop();
