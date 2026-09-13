// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "33899D8d+hOx5Rt7oKqZZu5", "CreateRoomAssist");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./GameConstant"), r = e("./RoomConfigListData"), i = e("./RoomConfigCellData"), a = e("./ClubListData"), s = new (function() {
function e() {
this._clubId = 0;
this._clubType = 0;
this._selectClubGameId = -1;
this._schemeId = 0;
this._clubRoomData = Object.create(null);
}
e.prototype.setData = function(e, t, o, n) {
this._clubType = e;
this._selectClubGameId = t;
this._schemeId = o;
this._clubId = n;
this._clubRoomData = Object.create(null);
};
e.prototype.getClubScheme = function() {
return this._clubType;
};
e.prototype.getSchemeId = function() {
return this._schemeId;
};
e.prototype.getSchemeData = function() {
return a.default.get(this._clubId).schemeList().get(this._schemeId);
};
e.prototype.get = function(e) {
if (1 === this._clubType) {
if (this._clubRoomData[e]) return this._clubRoomData[e];
var t = i.default.defData(e), o = new i.default(t);
this._clubRoomData[e] = o;
return o;
}
if (2 === this._clubType) {
return a.default.get(this._clubId).schemeList().get(this._schemeId).roomConfig;
}
return r.default.get(e);
};
e.prototype.collectionGames = function() {
if (2 === this._clubType) {
for (var e = [], t = 0; t < n.default.gameList.length; t++) if (this._selectClubGameId === n.default.gameList[t]) {
e.push(n.default.gameList[t]);
break;
}
return e;
}
return r.default.collectionShow();
};
e.prototype.onDestroy = function() {
this._clubType = 0;
this._selectClubGameId = -1;
this._schemeId = 0;
this._clubId = 0;
};
return e;
}())();
o.default = s;
cc._RF.pop();
