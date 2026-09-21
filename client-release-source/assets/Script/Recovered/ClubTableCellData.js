// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3637edM8RNI/a1qPxf/KtVo", "ClubTableCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./RoomConfigCellData"), r = require("./gContext"), i = function() {
function e(e) {
this.id = 0;
this.status = 0;
this.owner = "";
this.cardNum = 0;
this.playerUids = [];
this.curStep = 0;
this._roomConfig = null;
this.schemeId = 0;
this.maxPlayers = 0;
this.id = e.id || 0;
this.status = e.status;
this.owner = e.owner.code;
this.cardNum = e.num;
this.schemeId = e.schemeId;
this.maxPlayers = e.maxPlayers;
var t = r.default.gameLogic(e.gameType).roomParam2Config(e.maxStep, e.param2, e.param1);
this._roomConfig = new n.default({
index: e.gameType,
ipLimit: t.ipLimit,
ids: t.ids,
other: t.other
});
this.playerUids = [];
for (var o = e.players || [], i = 0, a = o.length; i < a; i++) {
var s = parseInt(o[i].code);
s && this.playerUids.push(s);
}
this.curStep = e.curStep || 0;
}
e.prototype.config = function() {
return this._roomConfig;
};
e.prototype.isGameing = function() {
return this.curStep > 0;
};
e.prototype.havePlayer = function() {
return this.playerUids.length > 0 && this.playerUids.length < this.maxPlayers;
};
e.prototype.isFull = function() {
return this.playerUids.length === this.maxPlayers;
};
e.prototype.bgImgPath = function() {
return "Hall/Res/Texture/Club/New/table_horizen";
};
return e;
}();
o.default = i;
cc._RF.pop();
