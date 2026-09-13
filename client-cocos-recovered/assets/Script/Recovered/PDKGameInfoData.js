// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f3c5e8FDV9NhLyjsFtRHYu4", "PDKGameInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./PDKSiteListData"), r = e("./PDKSiteCellData"), i = e("./gContext"), a = e("./PDKEnum"), s = e("./PDKEventKeys"), l = e("./EventKeys"), c = function() {
function e() {
this.curStep = 0;
this.status = a.ePDKGameStatus.Free;
this.siteInfos = null;
this.discards = [];
this.siteInfos = new n.default();
for (var e = 0; e < 3; e++) {
var t = new r.default(e);
this.siteInfos.upate(t);
}
}
e.prototype.update = function(e) {
for (var t = e.siteInfos || [], o = 0, n = t.length; o < n; o++) {
var r = t[o], i = r.pos, s = this.siteInfos.get(i);
s.clean(!1);
s.udpateHandCards(r.handCards);
s.updatePiao(r.piao);
}
this.updateStep(e.curStep || 0);
this.updateStatus(e.status || a.ePDKGameStatus.Free);
};
e.prototype.updateStatus = function(e) {
var t = this.status, o = e;
if (t !== o) {
this.status = e;
i.default.eventUtils.emit(s.default.data_status_change, {
o: t,
n: o
});
}
t === a.ePDKGameStatus.Free && o !== a.ePDKGameStatus.Free && i.default.eventUtils.emit(l.default.pulic_game_free2begin);
};
e.prototype.updateStep = function(e) {
if (this.curStep !== e) {
this.curStep = e;
i.default.eventUtils.emit(s.default.data_step_change);
}
};
return e;
}();
o.default = c;
cc._RF.pop();
