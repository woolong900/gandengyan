// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2b5604d5UNA5KrlvpOwHV9A", "CenterMsg");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./GameConn"), r = require("./UserData"), i = require("./gContext"), a = require("./GameRecordCellData"), s = require("./GameRecordDetailsData"), l = require("./PlaybackData"), c = function() {
function e() {}
e.prototype.getRealName = function(e, t) {
n.default.sendMsg(101, null, function(t, o, n) {
if (n) e && e(null, n); else {
if (0 === t.res.error) {
r.default.realName = t.realName || "";
r.default.idCard = t.idCard || "";
r.default.realNameAward = t.giveCard || 0;
}
e && e(t.res, null);
}
}, t);
};
e.prototype.reporting = function(e, t) {
n.default.sendMsg(911, e, function(e, o, n) {
t(e, n);
}, !1);
};
e.prototype.bindRealName = function(e, t) {
n.default.sendMsg(102, e, function(e, o, n) {
t(e, n);
}, !1);
};
e.prototype.getInviteCode = function(e, t) {
n.default.sendMsg(103, null, function(t, o, n) {
if (n) e && e(null, n); else {
if (0 === t.res.error) {
r.default.inviteCode = t.inviteCode || "";
r.default.myInviteCode = t.username || "";
r.default.inviteCodeAward = t.giveCard || 0;
}
e && e(t.res, null);
}
}, t);
};
e.prototype.bindInviteCode = function(e, t) {
n.default.sendMsg(104, e, function(o, n, i) {
if (i) t && t(o, i); else {
0 === o.res.error && (r.default.inviteCode = e.inviteCode);
t && t(o, null);
}
}, !1);
};
e.prototype.getMobile = function(e, t) {
n.default.sendMsg(105, null, function(t, o, n) {
if (n) e && e(null, n); else {
if (0 === t.res.error) {
r.default.mobile = t.mobile || "";
r.default.mobileAward = t.giveCard || 0;
}
e && e(t.res, null);
}
}, t);
};
e.prototype.getVerifyCode = function(e, t) {
n.default.sendMsg(106, e, function(e, o, n) {
n ? t(e, n) : e.res.error ? i.default.uiHelper.showTip(e.res.what) : t(e, null);
}, !1);
};
e.prototype.bindMobile = function(e, t) {
n.default.sendMsg(107, e, function(o, n, i) {
if (i) t && t(o, i); else {
0 === o.res.error && (r.default.mobile = e.mobile);
t && t(o, null);
}
}, !1);
};
e.prototype.applyAgent = function(e, t) {
n.default.sendMsg(108, e, function(e, o, n) {
t(e, n || null);
}, !1);
};
e.prototype.getQRcode = function(e, t) {
n.default.sendMsg(109, null, function(t, o, n) {
if (n) e && e(null, n); else {
0 === t.res.error && (r.default.appearance = t.weChatUrl);
e && e(t.res, null);
}
}, t);
};
e.prototype.editQRcode = function(e, t) {
n.default.sendMsg(110, e, function(o, n, a) {
if (a) t(o, a); else if (0 === o.res.error) {
r.default.appearance = e.weChatUrl;
t(o, null);
} else i.default.uiHelper.showTip(o.res.what);
}, !1);
};
e.prototype.shareForCard = function(e) {
n.default.sendMsg(111, null, function(t, o, n) {
n ? e(t, n) : t.res.error ? i.default.uiHelper.showTip(t.res.what) : e(t, null);
}, !1);
};
e.prototype.getGoodsInfo = function(e, t) {
n.default.sendMsg(112, e, function(e, o, n) {
n ? t(e, n) : e.res.error ? i.default.uiHelper.showTip(e.res.what) : t(e, null);
}, !1);
};
e.prototype._getRecordList = function(e, t, o) {
void 0 === o && (o = !1);
n.default.sendMsg(125, e, function(o, n, i) {
if (i) t(null, i); else {
if (0 === o.res.error) {
r.default.gameRecordList.destroy();
r.default.gameRecordList.belongClub = e.clubId;
for (var s = 0, l = o.records.length; s < l; s++) {
var c = o.records[s], u = new a.default(c);
r.default.gameRecordList.update(u);
}
}
t(o.res, null);
}
}, o);
};
e.prototype.getMyRecordList = function(e, t, o) {
void 0 === o && (o = !1);
var n = {
type: 0,
time: e
};
this._getRecordList(n, t);
};
e.prototype.getClubRecordList = function(e, t, o, n, r, i, a) {
void 0 === a && (a = !1);
var s = {
type: 1,
clubId: e,
time: t,
userCode: o,
startTime: n,
endTime: r
};
this._getRecordList(s, i);
};
e.prototype.getRecordDetails = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
id: e
};
n.default.sendMsg(126, r, function(e, o, n) {
if (n) t(null, n, null); else {
var r = null;
0 === e.res.error && (r = new s.default(e.details));
t(e.res, null, r);
}
}, o);
};
e.prototype.getRecordPlayback = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
id: e
};
n.default.sendMsg(127, r, function(o, n, r) {
if (r) t(null, r); else {
0 === o.res.error && l.default.setData(o, e);
t(o.res, null);
}
}, o);
};
e.prototype.setUserSex = function(e, t, o) {
void 0 === o && (o = !1);
var i = {
sex: e
};
n.default.sendMsg(159, i, function(o, n, i) {
if (i) t(null, i); else {
if (0 === o.res.error) {
var a = parseInt(e);
r.default.setGender(a);
}
t(o, null);
}
}, o);
};
e.prototype.reConnectIsOk = function() {
n.default.sendMsg(168, null, null, !0);
};
return e;
}();
o.CenterMsg = c;
var u = new c();
o.default = u;
cc._RF.pop();
