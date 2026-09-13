// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3ec55MSpP5GK4ZJQm12NRl4", "PlaybackDataBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./RoomInfoData"), r = e("./DismissRoomInfoData"), i = e("./gContext"), a = function() {
function e() {
this._dataSteps = null;
this._playbackCode = null;
this._playbackRoom = null;
this._data = null;
this._steps = [];
}
e.prototype.setData = function(e, t) {
this._playbackCode = t;
};
e.prototype.initData = function(e) {
n.default.reset();
this._playbackRoom = e;
r.default.update({
destroying: !1
});
};
e.prototype.begin = function() {};
e.prototype.step = function(e) {};
e.prototype.count = function() {
return this._dataSteps.length;
};
e.prototype.playbackCode = function() {
return this._playbackCode;
};
e.prototype.playbackRoom = function() {
return this._playbackRoom;
};
e.prototype.roomConfig = function(e) {
var t = e.type, o = e.maxStep, n = e.param1 || 1, r = e.param2;
return i.default.gameLogic(t).roomParam2Config(o, r, n);
};
return e;
}();
o.default = a;
cc._RF.pop();
