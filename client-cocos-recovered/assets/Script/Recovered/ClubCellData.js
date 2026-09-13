// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "cc013gt08hLdY84m8ZYDu0V", "ClubCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./ClubTableListData"), r = require("./ClubMemberListData"), i = require("./ClubTableSchemeListData"), a = require("./gContext"), s = require("./EventKeys"), l = require("./ClubMemberAntiAddictionListData"), c = require("./ClubMemberCellData"), u = function() {
function e(e) {
this.id = 0;
this.avatarUrl = "";
this.clubName = "";
this.clubID = "";
this.notice = "";
this.roomNum = 0;
this.cardNum = 0;
this.maxMemberNum = 0;
this.curMemberNum = 0;
this.enableEmptyRoomLast = !0;
this.enableRoomInvite = !1;
this.enableClosed = !1;
this.enablePlayerNoDismiss = !1;
this.enableQuitApply = !1;
this.enableAntiAddiction = !1;
this.antiAddictionMemberType = c.eClubMemberDegree.Player;
this.enablePersonRecord = !1;
this._tableList = null;
this._memberList = null;
this._schemeList = null;
this._antiAddictionList = null;
this.id = e.id;
this.avatarUrl = e.avatarUrl;
this.clubName = e.name;
this.clubID = e.code;
this.notice = e.announcement;
this.roomNum = e.roomNum;
this.cardNum = e.balanceCard;
this.maxMemberNum = e.maxUsers;
this.curMemberNum = e.affiliationsCount;
this.enableEmptyRoomLast = e.emptyRoomLast;
this.enableRoomInvite = e.roomInvite;
this.enableClosed = e.closed;
this.enablePlayerNoDismiss = e.playerNodismissRoom;
this.enableQuitApply = e.quitApply;
this.enableAntiAddiction = e.antiAddiction;
this.antiAddictionMemberType = e.memberType;
this.enablePersonRecord = e.member_Record;
}
e.prototype.tableList = function() {
this._tableList || (this._tableList = new n.default(this.id));
return this._tableList;
};
e.prototype.memberList = function() {
this._memberList || (this._memberList = new r.default(this.id));
return this._memberList;
};
e.prototype.schemeList = function() {
this._schemeList || (this._schemeList = new i.default(this.id));
return this._schemeList;
};
e.prototype.memberAntiAddictionList = function() {
this._antiAddictionList || (this._antiAddictionList = new l.default(this.id));
return this._antiAddictionList;
};
e.prototype.curPlayerMemberType = function() {
return this.antiAddictionMemberType;
};
e.prototype.update = function(e) {
if (this.enableEmptyRoomLast !== e.emptyRoomLast) {
this.enableEmptyRoomLast = e.emptyRoomLast;
a.default.eventUtils.emit(s.default.data_club_setting_empty_change);
}
this.enablePlayerNoDismiss !== e.playerNodismissRoom && (this.enablePlayerNoDismiss = e.playerNodismissRoom);
this.enableQuitApply !== e.quitApply && (this.enableQuitApply = e.quitApply);
this.enableAntiAddiction !== e.antiAddiction && (this.enableAntiAddiction = e.antiAddiction);
if (this.enablePersonRecord !== e.member_Record) {
this.enablePersonRecord = e.member_Record;
a.default.eventUtils.emit(s.default.data_club_focus_change);
}
this.enableRoomInvite = e.roomInvite;
this.enableClosed = e.closed;
a.default.eventUtils.emit(s.default.data_club_setting_update);
if (e.name && e.name !== this.clubName) {
this.clubName = e.name;
a.default.eventUtils.emit(s.default.data_club_setting_name_change);
} else if (e.announcement && e.announcement !== this.notice) {
this.notice = e.announcement;
a.default.eventUtils.emit(s.default.data_club_setting_notice_change);
}
};
return e;
}();
o.default = u;
cc._RF.pop();
