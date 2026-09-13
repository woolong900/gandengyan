// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ea5c0f91hROpo6lq2Assdq7", "ExGameAnalytics");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./GameConfig"), r = require("./CommonEnum"), i = require("./Bridge"), a = new (function() {
function e() {}
e.prototype.submitAccountInfo = function(e) {
var t = n.default.platform;
r.ePlatformType.android === t || r.ePlatformType.iOS === t ? i.default.gameAnalytics.invoke("submitAccountInfo", e, null) : cc.log("nosupport");
};
e.prototype.onMissionBegin = function(e) {
var t = n.default.platform;
r.ePlatformType.android === t || r.ePlatformType.iOS === t ? i.default.gameAnalytics.invoke("onMissionBegin", {
missionId: e
}, null) : cc.log("nosupport");
};
e.prototype.onMissionCompleted = function(e) {
var t = n.default.platform;
r.ePlatformType.android === t || r.ePlatformType.iOS === t ? i.default.gameAnalytics.invoke("onMissionCompleted", {
missionId: e
}, null) : cc.log("nosupport");
};
e.prototype.onMissiononFailed = function(e, t) {
var o = n.default.platform;
r.ePlatformType.android === o || r.ePlatformType.iOS === o ? i.default.gameAnalytics.invoke("onMissiononFailed", {
missionId: e,
cause: t
}, null) : cc.log("nosupport");
};
e.prototype.onEvent = function(e, t, o) {
var a = n.default.platform;
r.ePlatformType.android === a || r.ePlatformType.iOS === a ? i.default.gameAnalytics.invoke("onEvent", {
eventId: e,
key: t,
value: o
}, null) : cc.log("nosupport");
};
return e;
}())();
o.default = a;
cc._RF.pop();
