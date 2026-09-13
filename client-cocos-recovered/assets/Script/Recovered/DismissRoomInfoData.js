// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d6e97+pBF5HXqkNyupjwmQW", "DismissRoomInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonEnum"), r = e("./gContext"), i = e("./EventKeys"), a = new (function() {
function e() {
this.destroying = !1;
this.uid = 0;
this.endTime = 0;
this.agreeList = [];
this.disagreeList = [];
}
e.prototype.update = function(e) {
var t = this.destroying, o = e.destroying || !1;
this.destroying = o;
this.disagreeList = [];
for (var n = e.disagreeList || [], a = 0; a < n.length; a++) this.disagreeList.push(n[a]);
if (this.destroying) {
this.uid = e.uid;
this.endTime = e.endTime;
this.agreeList = [];
var s = e.agreeList || [];
for (a = 0; a < s.length; a++) this.agreeList.push(s[a]);
r.default.eventUtils.emit(i.default.data_dismiss_data_change);
}
o !== t && r.default.eventUtils.emit(i.default.data_dismiss_state_change, {
o: t,
n: o
});
};
e.prototype.isLeader = function(e) {
return this.uid === e;
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
