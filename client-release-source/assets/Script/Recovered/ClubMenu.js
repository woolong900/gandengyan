// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "032f9U32ExPrLSM1khjg3Fe", "ClubMenu");
var n = this && this.__extends || function() {
var e = function(t, o) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) t.hasOwnProperty(o) && (e[o] = t[o]);
})(t, o);
};
return function(t, o) {
e(t, o);
function n() {
this.constructor = t;
}
t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype, new n());
};
}(), r = this && this.__decorate || function(e, t, o, n) {
var r, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, o, a) : r(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = require("./gContext"), a = require("./BaseComponent"), s = require("./SoundUtils"), l = require("./Loader"), c = require("./WindowConfig"), u = require("./ShareLayer"), d = require("./ClubMsg"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._clubId = "";
t.clubData = null;
t._clubListShow = !1;
t.event = null;
t.cellContainer = null;
t.clubTablePre = null;
t.clubListPre = null;
t.noticeNode = null;
t.clubListBtn = null;
t.clubNameLabel = null;
t.clubIdLabel = null;
t.onlineLabel = null;
t.emptyLabel = null;
t.cardNumLabel = null;
t.btnFullNode = null;
t.settingPanalNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.node.getChildByName("Content").width = cc.winSize.width;
this.event = i.default.eventUtils.on("club_choosed", function() {
e.setClubInfo();
}, this.node);
};
t.prototype.getClubInfo = function() {};
t.prototype.setClubInfo = function() {};
t.prototype.loadClub = function() {
var e = cc.instantiate(this.clubListPre);
this.clubListBtn.addChild(e);
e.x = -149.7;
};
t.prototype.getTables = function() {};
t.prototype.loadTables = function() {};
t.prototype.showClubList = function() {
var e = cc.v2(this.clubListBtn.x, this.clubListBtn.y), t = cc.moveTo(.3, cc.v2(e.x + 300, e.y)).easing(cc.easeSineIn()), o = cc.moveTo(.3, cc.v2(e.x - 300, e.y)).easing(cc.easeSineOut());
this.clubListBtn.runAction(this._clubListShow ? o : t);
l.default.setImg(this._clubListShow ? "Hall/Res/Texture/Club/New/btn_clublist" : "Hall/Res/Texture/Club/New/btn_clublistback", this.clubListBtn.children[0]);
var n = cc.moveBy(.3, cc.v2(300, 0)), r = cc.moveBy(.3, cc.v2(-300, 0));
if (this._clubListShow) this.cellContainer.node.runAction(r); else {
this.cellContainer.node.runAction(n);
this.btnFullNode.active = !0;
}
this._clubListShow = !this._clubListShow;
};
t.prototype.closeAllWindows = function() {
this._clubListShow && this.showClubList();
this.settingPanalNode.active = !1;
this.btnFullNode.active = !this.btnFullNode.active;
};
t.prototype.copyClubId = function() {};
t.prototype.buyCard = function() {
s.default.clickBtn();
i.default.uiHelper.show(c.eWindowID.ShoppingMall);
};
t.prototype.startGame = function() {
s.default.clickBtn();
cc.log("快速开始");
};
t.prototype.showMember = function() {
s.default.clickBtn();
};
t.prototype.showRecord = function() {
s.default.clickBtn();
};
t.prototype.showMsg = function() {
s.default.clickBtn();
i.default.uiHelper.show(c.eWindowID.ClubMsgListLayer);
};
t.prototype.showRange = function() {
s.default.clickBtn();
};
t.prototype.showAddict = function() {
s.default.clickBtn();
};
t.prototype.showManage = function() {
s.default.clickBtn();
i.default.uiHelper.show(c.eWindowID.AllianceManageLayer);
};
t.prototype.showGift = function() {
s.default.clickBtn();
i.default.uiHelper.show(c.eWindowID.CardSendLayer);
};
t.prototype.showSettingPanal = function() {
s.default.clickBtn();
this.settingPanalNode.active = !this.settingPanalNode.active;
this.btnFullNode.active = !this.btnFullNode.active;
};
t.prototype.showPlayType = function() {
s.default.clickBtn();
i.default.uiHelper.show(c.eWindowID.ClubGameChoose);
};
t.prototype.clubSetting = function() {
s.default.clickBtn();
i.default.uiHelper.show(c.eWindowID.ClubManageLayer);
};
t.prototype.clubShare = function() {
s.default.clickBtn();
i.default.uiHelper.show(c.eWindowID.ShareLayer, u.eShareUIType.ShareHall);
};
t.prototype.update = function(e) {
this.noticeNode.x -= 1;
this.noticeNode.x < -this.noticeNode.width - this.noticeNode.getParent().width / 2 && (this.noticeNode.x = this.noticeNode.getParent().width / 2);
};
t.prototype.onClickClose = function() {
s.default.clickBtn();
d.default.leaveClub(function(e) {
cc.log(e);
});
i.default.uiHelper.remove(this);
};
t.prototype.onDestroy = function() {
i.default.eventUtils.off(this.event);
};
r([ h(cc.ScrollView) ], t.prototype, "cellContainer", void 0);
r([ h(cc.Prefab) ], t.prototype, "clubTablePre", void 0);
r([ h(cc.Prefab) ], t.prototype, "clubListPre", void 0);
r([ h(cc.Node) ], t.prototype, "noticeNode", void 0);
r([ h(cc.Node) ], t.prototype, "clubListBtn", void 0);
r([ h(cc.Label) ], t.prototype, "clubNameLabel", void 0);
r([ h(cc.Label) ], t.prototype, "clubIdLabel", void 0);
r([ h(cc.Label) ], t.prototype, "onlineLabel", void 0);
r([ h(cc.Label) ], t.prototype, "emptyLabel", void 0);
r([ h(cc.Label) ], t.prototype, "cardNumLabel", void 0);
r([ h(cc.Node) ], t.prototype, "btnFullNode", void 0);
r([ h(cc.Node) ], t.prototype, "settingPanalNode", void 0);
return t = r([ f ], t);
}(a.default);
o.default = m;
cc._RF.pop();
