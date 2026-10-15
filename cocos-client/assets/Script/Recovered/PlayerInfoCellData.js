// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8e1a8kTdCFLXqNyqv4AFr9c", "PlayerInfoCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./LocationData"), r = require("./pb"), i = require("./UserData"), a = require("./Constants"), s = require("./gContext"), l = require("./EventKeys"), c = require("./RoomInfoData"), u = function() {
function e(e) {
this.uid = 0;
this.headImg = "";
this.name = "";
this.ip = "0.0.0.0";
this.location = null;
this.pos = -1;
this.score = 0;
this.gender = r.pb.eGender.UNKNOWN;
this.deal = !1;
this.onLine = !0;
this.isDouble = 1;
this.ready = !0;
this._isAutoGameing = !1;
this.isTurn = !1;
this.isManager = !1;
this.uid = e.uid;
this.headImg = e.headImg || a.default.defHeadUrl;
this.name = e.name || "";
this.ip = e.ip || this.ip;
this.location = new n.default(e.location);
this.pos = e.pos;
this.score = e.score || 0;
this.gender = e.gender;
this.onLine = e.onLine;
this.ready = e.ready;
this.deal = e.deal || !1;
this._isAutoGameing = e.isAutoGameing || !1;
this.isTurn = e.isTurn || !1;
this.isManager = e.isManager || !1;
this.isDouble = e.isdouble || 1;
}
e.prototype.pbData = function() {
return new r.pb.PlayerInfo({
uid: this.uid,
headImg: this.headImg,
name: this.name,
ip: this.ip,
location: {
longitude: this.location.longitude,
latitude: this.location.latitude,
country: this.location.country,
province: this.location.province,
city: this.location.city,
citycode: this.location.citycode,
district: this.location.district,
adcode: this.location.adcode,
address: this.location.address
},
onLine: this.onLine,
ready: this.ready,
pos: this.pos,
score: this.score,
gender: this.gender,
deal: this.deal,
isAutoGameing: this._isAutoGameing,
isTurn: this.isTurn,
isManager: this.isManager,
isdouble: this.isDouble
});
};
e.prototype.updateScore = function(e, t) {
this.score = e;
t /= c.default.scoreRatio;
s.default.eventUtils.emit(l.default.data_game_score_change, {
pos: this.pos,
dt: t
});
};
e.prototype.updateAutoGame = function(e) {
if (e !== this._isAutoGameing) {
this._isAutoGameing = e;
s.default.eventUtils.emit(l.default.data_player_auto_game_change, {
pos: this.pos
});
}
};
e.prototype.isAutoGameing = function() {
return this._isAutoGameing;
};
e.prototype.isOnLine = function() {
return this.onLine;
};
e.prototype.isReady = function() {
return this.ready;
};
e.prototype.setReady = function(e) {
this.ready = e;
};
e.prototype.setIsDoublee = function(e) {
this.isDouble = e;
};
e.prototype.scoreDesc = function() {
return "" + this.score / c.default.scoreRatio;
};
e.prototype.isMe = function() {
return i.default.uid == this.uid;
};
e.prototype.isWatcher = function() {
return -9999 === this.pos;
};
return e;
}();
o.default = u;
cc._RF.pop();
