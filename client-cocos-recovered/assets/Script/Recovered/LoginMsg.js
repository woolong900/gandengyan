// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "89c11LihKVLN6VMs1liOAhf", "LoginMsg");
var n = this && this.__awaiter || function(e, t, o, n) {
return new (o || (o = Promise))(function(r, i) {
function a(e) {
try {
l(n.next(e));
} catch (e) {
i(e);
}
}
function s(e) {
try {
l(n.throw(e));
} catch (e) {
i(e);
}
}
function l(e) {
e.done ? r(e.value) : new o(function(t) {
t(e.value);
}).then(a, s);
}
l((n = n.apply(e, t || [])).next());
});
}, r = this && this.__generator || function(e, t) {
var o, n, r, i, a = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return i = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function s(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, n && (r = 2 & i[0] ? n.return : i[0] ? n.throw || ((r = n.return) && r.call(n),
0) : n.next) && !(r = r.call(n, i[1])).done) return r;
(n = 0, r) && (i = [ 2 & i[0], r.value ]);
switch (i[0]) {
case 0:
case 1:
r = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(r = a.trys, r = r.length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < r[1]) {
a.label = r[1];
r = i;
break;
}
if (r && a.label < r[2]) {
a.label = r[2];
a.ops.push(i);
break;
}
r[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
n = 0;
} finally {
o = r = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i, a = require("./GameConn"), s = require("./UserData"), l = require("./gContext"), c = require("./Constants"), u = require("./ClubMsg"), d = require("./ClubControl"), p = require("./ClubListData"), f = require("./RoomInfoData"), h = require("./CenterMsg"), m = require("./EventKeys");
(function(e) {
e.NetError = "net_error";
e.DataError = "data_error";
})(i || (i = {}));
var y = function(e) {
void 0 === e && (e = "重连失败，请重试～");
l.default.msgBox.showOnlyOk(e, function() {
a.default.reconnect();
});
}, g = function() {
function e() {}
e.prototype.initGameServer = function(e) {
var t = this;
a.default.init(function(t) {
cc.log("init game server error:", t);
t && a.default.close();
e(t);
}, function() {
t.re_login();
});
};
e.prototype.re_login = function() {
var e = this;
this.login(function(t, o) {
if (o) ; else if (0 === t.res.error) {
var n = d.default.getCurClubData(), r = n ? n.id : -1;
e.syncData(function(o) {
o === i.DataError ? y() : o === i.NetError || e._reLoginEx(t, r);
});
} else y();
});
};
e.prototype._reLoginEx = function(e, t) {
if (e.roomId > 0) l.default.gameMsgBase().joinRoom(e.roomId, !1, !1, function(e) {
e && y();
}); else {
var o = cc.director.getScene().name;
if (o === c.default.ClubSceneName) {
var n = -1;
if (t > 0 && p.default.get(t)) n = t; else {
var r = p.default.collection();
r.length > 0 && (n = parseInt(r[0]));
}
n && n > 0 ? u.default.getClubData(n, function(e, t) {
t || (0 === e.error ? l.default.eventUtils.emit(m.default.data_reconnect_club) : l.default.uiHelper.loadScene(c.default.HallSceneName));
}) : l.default.uiHelper.loadScene(c.default.HallSceneName);
} else o !== c.default.GameSceneName && o !== c.default.D7SceneName && o !== c.default.PDKSceneName && o !== c.default.WSKSceneName && o !== c.default.DBDSceneName && o !== c.default.DDZSceneName || f.default.isPlayback() || f.default.getTotalEndData() || f.default.leaveRoom();
}
};
e.prototype.syncData = function(e) {
var t = this, o = new Promise(function(e, t) {
u.default.getClubList(function(o, n) {
n ? t(i.NetError) : 0 === o.res.error ? e() : t(i.DataError);
}, !0);
});
Promise.all([ o ]).then(function(o) {
t._syncOtherData();
e(null);
}).catch(function(t) {
e(t);
});
};
e.prototype._syncOtherData = function() {
var e = function(e) {
return function(t, o) {
o ? cc.error(e + ": net error") : 0 === t.error ? cc.log(e + ": ok") : cc.error(e + ": error is " + t.what);
};
};
h.default.getRealName(e("getRealName"), !0);
h.default.getInviteCode(e("getInviteCode"), !0);
h.default.getMobile(e("getMobile"), !0);
h.default.getQRcode(e("getQRcode"), !0);
u.default.getClubInviteMsgList(e("getClubInviteMsgList"), !0);
};
e.prototype.dataList = function() {
return n(this, void 0, void 0, function() {
return r(this, function(e) {
switch (e.label) {
case 0:
return [ 4, new Promise(function(e, t) {
u.default.getClubList(function(o, n) {
n ? t("net_error") : 0 === o.res.error ? e() : t("data_error");
}, !0);
}) ];

case 1:
e.sent();
return [ 4, new Promise(function(e, t) {
u.default.getClubInviteMsgList(function(o, n) {
n ? t("net_error") : 0 === o.error ? e() : t("data_error");
}, !0);
}) ];

case 2:
e.sent();
return [ 2 ];
}
});
});
};
e.prototype.login = function(e, t) {
void 0 === t && (t = !1);
var o = {
token: s.default.token
};
a.default.sendMsg(100, o, function(t, o, n) {
if (n) e && e(null, n); else {
if (0 === t.res.error) {
s.default.uid = t.uid;
s.default.headUrl = t.avatarUrl;
s.default.nickname = t.nickname;
s.default.sex = t.sex;
s.default.updateCardNum(t.cardNum || 0);
s.default.ip = t.ip || "未知";
}
e && e(t, null);
}
}, t);
};
return e;
}();
o.LoginMsg = g;
var _ = new g();
o.default = _;
cc._RF.pop();
