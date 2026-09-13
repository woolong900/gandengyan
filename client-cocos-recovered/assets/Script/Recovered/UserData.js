// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "02989Il48RLKbTwmzbvIxB6", "UserData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonEnum"), r = require("./Storage"), i = require("./gContext"), a = require("./EventKeys"), s = require("./GameConfig"), l = require("./Constants"), c = require("./GameRecordListData"), u = require("./RoomInfoData"), d = require("./GameConstant"), p = new (function() {
function e() {
this.sex = 0;
this._inviteCode = null;
this.inviteCodeAward = 0;
this.mobile = "";
this.mobileAward = 0;
this.realName = null;
this.idCard = null;
this.realNameAward = 0;
this.cardNum = 0;
this.ip = "";
this.showPopActivity = !0;
this.isAgent = !1;
this._activityData = null;
this._token = "";
this._accountType = n.eAccountType.guest;
this._nickname = "";
this._uid = null;
this._headUrl = null;
this._lastRecordTime = 0;
this._syncTime = 0;
this._gameView = null;
this._appearance = null;
this._giftForbidList = null;
this._hallMarquee = "";
this._serviceWechat = null;
this._serviceQQ = null;
this._isReview = !1;
this._gameRecordList = null;
}
Object.defineProperty(e.prototype, "isReivew", {
get: function() {
return this._isReview;
},
set: function(e) {
this._isReview = e;
},
enumerable: !0,
configurable: !0
});
e.prototype.isGameShow = function(e) {
return -1 !== d.default.gameList.indexOf(e);
};
Object.defineProperty(e.prototype, "gameRecordList", {
get: function() {
this._gameRecordList || (this._gameRecordList = new c.default());
return this._gameRecordList;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "token", {
get: function() {
return this._token;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "activityData", {
get: function() {
return this._activityData;
},
set: function(e) {
this._activityData = e;
},
enumerable: !0,
configurable: !0
});
e.prototype.saveLoginData = function(e, t) {
this._token = e;
this._accountType = t;
t === n.eAccountType.xianLiao ? r.default.xlToken.setValue(e) : t === n.eAccountType.wechat ? r.default.wxToken.setValue(e) : t === n.eAccountType.guest ? r.default.guestToken.setValue(e) : t === n.eAccountType.mobile && r.default.mobileToken.setValue(e);
};
e.prototype.cleanLoginData = function() {
this._token = "";
var e = this._accountType;
e === n.eAccountType.xianLiao ? r.default.xlToken.clean() : e === n.eAccountType.wechat ? r.default.wxToken.clean() : e === n.eAccountType.guest ? r.default.guestToken.clean() : e === n.eAccountType.mobile && r.default.mobileToken.clean();
};
e.prototype.cleanAll = function() {
r.default.wxToken.clean();
r.default.guestToken.clean();
r.default.mobileToken.clean();
};
Object.defineProperty(e.prototype, "nickname", {
get: function() {
return this._nickname || "";
},
set: function(e) {
this._nickname = e;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "uid", {
get: function() {
return this._uid;
},
set: function(e) {
this._uid = e;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "headUrl", {
get: function() {
return this._headUrl || l.default.defHeadUrl;
},
set: function(e) {
this._headUrl = e;
},
enumerable: !0,
configurable: !0
});
e.prototype.setGender = function(e) {
if (this.sex !== e) {
this.sex = e;
i.default.eventUtils.emit(a.default.player_gender_change);
}
};
Object.defineProperty(e.prototype, "appearance", {
get: function() {
return this._appearance;
},
set: function(e) {
this._appearance = e;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "inviteCode", {
get: function() {
return this._inviteCode;
},
set: function(e) {
if (this._inviteCode !== e) {
this._inviteCode = e;
i.default.eventUtils.emit(a.default.data_invite_change);
}
},
enumerable: !0,
configurable: !0
});
e.prototype.isBindInviteCode = function() {
return !!(this._inviteCode && this._inviteCode.length > 0);
};
e.prototype.formatSocketAddr = function() {
return s.default.socketServerAddr + "?token=" + this._token;
};
e.prototype.syncTime = function(e) {
this._syncTime = e;
this._lastRecordTime = new Date().valueOf();
};
Object.defineProperty(e.prototype, "millisecond", {
get: function() {
var e = new Date().valueOf();
return this._syncTime + (e - this._lastRecordTime);
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "second", {
get: function() {
return Math.floor(this.millisecond / 1e3);
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "gameView", {
get: function() {
if (u.default.isPlayback()) return n.eGameView.View2D;
var e = i.default.gameLogic().fixGameView();
if (e) return e;
this._gameView === n.eGameView.View2D || this._gameView === n.eGameView.View3D || (this._gameView = r.default.gameView.getValue());
return this._gameView;
},
set: function(e) {
if (this._gameView !== e) {
this._gameView = e;
r.default.gameView.setValue(this._gameView);
i.default.eventUtils.emit(a.default.data_game_view_changed);
}
},
enumerable: !0,
configurable: !0
});
e.prototype.isMe = function(e) {
return e === this._uid;
};
e.prototype.updateCardNum = function(e) {
if (this.cardNum !== e) {
this.cardNum = e;
i.default.eventUtils.emit(a.default.data_card_num_change);
}
};
Object.defineProperty(e.prototype, "hallMarquee", {
get: function() {
return this._hallMarquee;
},
set: function(e) {
if (this._hallMarquee !== e) {
this._hallMarquee = e;
i.default.eventUtils.emit(a.default.data_marquee_change);
}
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "serviceWechat", {
get: function() {
return this._serviceWechat;
},
set: function(e) {
if (this._serviceWechat != e) {
this._serviceWechat = e;
i.default.eventUtils.emit(a.default.data_wechat_change);
}
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "serviceQQ", {
get: function() {
return this._serviceQQ;
},
set: function(e) {
if (this._serviceQQ != e) {
this._serviceQQ = e;
i.default.eventUtils.emit(a.default.data_tencentqq_change);
}
},
enumerable: !0,
configurable: !0
});
e.prototype._getGiftForbidList = function() {
null === this._giftForbidList && (this._giftForbidList = r.default.giftForbidList.getValue());
return this._giftForbidList;
};
e.prototype._saveGiftForbidList = function(e) {
this._giftForbidList = e;
r.default.giftForbidList.setValue(e);
};
e.prototype.isGiftForbid = function(e) {
for (var t = this._getGiftForbidList(), o = 0, n = t.length; o < n; o++) if (e == t[o]) return !0;
return !1;
};
e.prototype.addGiftForbid = function(e) {
var t = this._getGiftForbidList(), o = 0, n = t.length;
n >= 100 && (o = 1);
for (var r = [], i = o; i < n; i++) r.push(t[i]);
r.push(e);
this._saveGiftForbidList(r);
};
e.prototype.removeGiftForbid = function(e) {
for (var t = [], o = this._getGiftForbidList(), n = 0, r = o.length; n < r; n++) {
var i = o[n];
i != e && t.push(i);
}
this._saveGiftForbidList(t);
};
return e;
}())();
o.default = p;
cc._RF.pop();
