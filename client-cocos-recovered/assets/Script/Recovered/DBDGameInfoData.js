// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0038cNSu/BE5ZCQO6Mi8aca", "DBDGameInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./RoomInfoData"), r = e("./EventKeys"), i = e("./gContext"), a = e("./DBDEnum"), s = e("./DBDEventKeys"), l = e("./DBDSiteCellData"), c = e("./DBDSiteListData"), u = function() {
function e() {
this.curStep = 0;
this.status = a.eDBDGameStatus.Free;
this.siteInfos = null;
this.discards = [];
this.bottomCard = [];
this.betNum = 0;
this.bankerUid = 0;
this.isDraw = !1;
this.boomNum = 0;
this.siteInfos = new c.default();
for (var e = 0; e < 4; e++) {
var t = new l.default(e);
this.siteInfos.upate(t);
}
}
e.prototype.update = function(e) {
for (var t = e.siteInfos || [], o = 0, n = t.length; o < n; o++) {
var r = t[o], i = r.pos, s = this.siteInfos.get(i);
s.clean(!1);
s.udpateHandCards(r.handCards);
}
this.updateStep(e.curStep || 0);
this.updateStatus(e.status || a.eDBDGameStatus.Free);
};
e.prototype.updateBetNum = function(e) {
this.betNum = e;
i.default.eventUtils.emit(s.default.data_score_update, {});
};
e.prototype.setIsDraw = function(e) {
this.isDraw = e;
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
t === a.eDBDGameStatus.Free && o !== a.eDBDGameStatus.Free && i.default.eventUtils.emit(r.default.pulic_game_free2begin);
};
e.prototype.setBoomNum = function(e) {
this.boomNum = e;
i.default.eventUtils.emit(s.default.data_score_update, {});
};
e.prototype.setBankerUid = function(e) {
this.bankerUid = e;
};
e.prototype.getRemain = function(e, t, o) {
for (var r = n.default.players.getByUid(e), i = this.siteInfos.get(r.pos), a = i.handCards || [], s = 0; s < t.length; s++) a.push(t[s]);
this.setBottomCard(o);
i.udpateHandCards(a);
};
e.prototype.setBottomCard = function(e) {
this.bottomCard = e;
i.default.eventUtils.emit(s.default.data_get_remain, {});
};
e.prototype.updateStep = function(e) {
if (this.curStep !== e) {
this.curStep = e;
i.default.eventUtils.emit(s.default.data_step_change);
}
};
return e;
}();
o.default = u;
cc._RF.pop();
