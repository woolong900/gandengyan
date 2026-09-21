// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4badeRsSrdNCY7lwOc6CFq/", "PlaybackData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonEnum"), r = require("./RoomConfig"), i = require("./PlaybackDataMJ"), a = require("./PlaybackDataD7"), s = require("./PlaybackDataPDK"), l = require("./PlaybackDataWSK"), c = require("./PlaybackDataDBD"), u = require("./PlaybackDataDDZ"), d = new (function() {
function e() {
this._categort = 0;
}
e.prototype.setData = function(e, t) {
var o = e.roomInfo.type, d = r.default[o].category;
this._categort = d;
d === n.eGameCategort.MJ && i.default.setData(e, t);
d === n.eGameCategort.D7 && a.default.setData(e, t);
d === n.eGameCategort.PDK && s.default.setData(e, t);
d === n.eGameCategort.WSK && l.default.setData(e, t);
d === n.eGameCategort.DBD && c.default.setData(e, t);
d === n.eGameCategort.DDZ && u.default.setData(e, t);
};
e.prototype.init = function(e, t) {
this._categort === n.eGameCategort.MJ && i.default.init(e, t);
this._categort === n.eGameCategort.D7 && a.default.init(e, t);
this._categort === n.eGameCategort.PDK && s.default.init(e, t);
this._categort === n.eGameCategort.WSK && l.default.init(e, t);
this._categort === n.eGameCategort.DBD && c.default.init(e, t);
this._categort === n.eGameCategort.DDZ && u.default.init(e, t);
};
e.prototype._instance = function() {
return this._categort === n.eGameCategort.MJ ? i.default : this._categort === n.eGameCategort.D7 ? a.default : this._categort === n.eGameCategort.PDK ? s.default : this._categort === n.eGameCategort.WSK ? l.default : this._categort === n.eGameCategort.DBD ? c.default : this._categort === n.eGameCategort.DDZ ? u.default : void 0;
};
e.prototype.begin = function() {
this._instance().begin();
};
e.prototype.step = function(e) {
this._instance().step(e);
};
e.prototype.count = function() {
return this._instance().count();
};
e.prototype.playbackCode = function() {
return this._instance().playbackCode();
};
e.prototype.playbackRoom = function() {
return this._instance().playbackRoom();
};
return e;
}())();
o.default = d;
cc._RF.pop();
