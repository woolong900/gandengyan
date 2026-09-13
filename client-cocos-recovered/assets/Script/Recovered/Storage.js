// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "98ccc4iP05OQJl0wwPnWb+6", "Storage");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = require("./UserData"), i = require("./CommonEnum");
(function(e) {
e[e.user = 1] = "user";
e[e.global = 2] = "global";
})(n || (n = {}));
var a = new (function() {
function e() {
this.lastGameClub = this._builder("last_game_club", n.user, -1);
this.wxToken = this._builder("wx_token", n.global);
this.xlToken = this._builder("xl_token", n.global);
this.guestToken = this._builder("guest_token", n.global);
this.mobileToken = this._builder("mobile_token", n.global);
this.loginMobile = this._builder("login_mobile", n.global);
this.lastLoginType = this._builder("last_login_type", n.global);
this.effect = this._builder("sound_effect", n.global, .5);
this.music = this._builder("sound_volume", n.global, .5);
this.gameView = this._builder("game_view", n.global, i.eGameView.View2D);
this.outCardClickOnce = this._builder("out_card_click_once", n.global, !1);
this.outCardQuick = this._builder("out_card_quick", n.global, !1);
this.giftForbidList = this._builder("gift_forbid_list", n.global, []);
this.lastLocation = this._builder("last_location", n.global, "");
this.lastCreateRoomGameId = this._builder("last_create_room_id", n.global, -1);
this.forceUpdatgePackage = this._builder("force_updatge_package", n.global, !1);
this.wskHandCardsSortType = this._builder("wsk_hand_cards_sort_type", n.global, 0);
this.activityForceUpdateImageUrl = this._builder("activity_force_update_image_url", n.global);
this.activityCacheImageUrl = this._builder("activity_cache_image_url", n.global);
}
e.prototype.gGet = function() {
var t = cc.sys.localStorage.getItem(e.KEY);
if (void 0 === t || null === t || "" === t) return {};
return JSON.parse(t) || {};
};
e.prototype.gSave = function(t) {
var o = JSON.stringify(t);
cc.sys.localStorage.setItem(e.KEY, o);
};
e.prototype.uGet = function() {
return this.gGet()[r.default.uid] || {};
};
e.prototype.uSave = function(e) {
var t = this.gGet();
t[r.default.uid] = e || {};
this.gSave(t);
};
e.prototype.getGlobal = function(e) {
return this.gGet()[e];
};
e.prototype.saveGlobal = function(e, t) {
var o = this.gGet();
o[e] = t;
this.gSave(o);
};
e.prototype.getUser = function(e) {
return this.uGet()[e];
};
e.prototype.saveUser = function(e, t) {
var o = this.uGet();
o[e] = t;
this.uSave(o);
};
e.prototype._builder = function(e, t, o) {
var r = this, i = function(o) {
t === n.user && r.saveUser(e, o);
t === n.global && r.saveGlobal(e, o);
};
return {
setValue: i,
getValue: function() {
var i = void 0;
t === n.user && (i = r.getUser(e));
t === n.global && (i = r.getGlobal(e));
return void 0 !== i && null !== i || void 0 === o || null === o ? i : o;
},
clean: function() {
i(void 0);
}
};
};
e.prototype.getRoomConfig = function(e) {
return this.getGlobal("_room_" + e);
};
e.prototype.saveRoomConfig = function(e, t) {
this.saveGlobal("_room_" + e, t);
};
e.prototype.getClubWfConfig = function(e) {
return !1 !== this.getUser("_clubwf_" + e);
};
e.prototype.saveClubWfConfig = function(e, t) {
this.saveUser("_clubwf_" + e, t);
};
e.KEY = "__STORAGE_CONFIG_DATA__";
return e;
}())();
o.default = a;
cc._RF.pop();
