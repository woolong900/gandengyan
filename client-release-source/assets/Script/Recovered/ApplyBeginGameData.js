// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "61550/OK65LyotRY50Mtcom", "ApplyBeginGameData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonEnum"), r = require("./EventKeys"), i = require("./gContext"), a = new (function() {
function e() {
this.applying = !1;
this.agreeList = [];
this.disagreeList = [];
}
e.prototype.update = function(e) {
var t = this.applying, o = e.applying || !1;
this.applying = o;
this.disagreeList = [];
for (var n = e.disagreeList || [], a = 0; a < n.length; a++) this.disagreeList.push(n[a]);
if (this.applying) {
this.agreeList = [];
var s = e.agreeList || [];
for (a = 0; a < s.length; a++) this.agreeList.push(s[a]);
i.default.eventUtils.emit(r.default.data_apply_begin_game_data_change);
}
o !== t && i.default.eventUtils.emit(r.default.data_apply_begin_game_state_change, {
o: t,
n: o
});
};
e.prototype.isAgree = function(e) {
for (var t = 0, o = this.agreeList.length; t < o; t++) if (this.agreeList[t] === e) return !0;
return !1;
};
e.prototype.isDisagree = function(e) {
for (var t = 0, o = this.disagreeList.length; t < o; t++) if (this.disagreeList[t] === e) return !0;
return !1;
};
e.prototype.useChooseType = function(e) {
return this.isAgree(e) ? n.eUseChoose.Agree : this.isDisagree(e) ? n.eUseChoose.Disagree : n.eUseChoose.NotChoose;
};
return e;
}())();
o.default = a;
cc._RF.pop();
