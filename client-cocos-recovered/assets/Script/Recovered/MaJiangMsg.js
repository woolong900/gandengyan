// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "55e26OnO2BL8qVK8KmiI2/D", "MaJiangMsg");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./RoomInfoData"), r = e("./OperateCellData"), i = e("./OperateConfig"), a = e("./CardUtils"), s = e("./CommonEnum"), l = e("./UserData"), c = e("./GameControl"), u = e("./gContext"), d = e("./GameConn"), p = e("./OperateListData"), f = e("./GameSoundMJ"), h = function() {
function e() {}
e.adOperate = function(e, t) {
var o = function() {
var e = n.default.gameInfo.cardPointer;
if (e >= 0) {
n.default.gameInfo.siteInfos.get(e).popOutCard();
} else {
cc.error("lastPos:", e);
cc.error("牌面指针错误，可能重连数据未传。如果非重连，检查代码~");
d.default.reconnect();
}
};
if (e) {
var p = n.default.players.getByUid(e), h = p.pos, m = n.default.gameInfo.siteInfos.get(h), y = m.isHandCardVisible(), g = n.default.gameInfo.playerPointer;
t.pointTo = g;
var _ = new r.default(t);
if (_.category === i.eOperateCategory.LiangDao) {
var v = _.cards[0], C = _.cards[1], b = _.cards[2];
y ? m.removeHandCards([ v, C, b ], !0) : m.removeHandCards([ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0);
} else if (_.category === i.eOperateCategory.Chi || _.category === i.eOperateCategory.Peng) {
v = 0, C = 0;
if (_.category === i.eOperateCategory.Chi) {
v = _.cards[1];
C = _.cards[2];
} else {
v = _.cards[0];
C = _.cards[0];
}
y ? m.removeHandCards([ v, C ], !0) : m.removeHandCards([ a.MJ_BACK_ID, a.MJ_BACK_ID ], !0);
o();
n.default.gameInfo.updateCardPointer(s.eDeskPos.Stand);
} else if (_.category === i.eOperateCategory.Gang) {
var D = _.cards[0];
if (_.subType === i.eGangType.AnGang) y ? m.removeHandCards(u.default.gameLogic().is3CardGang(D) ? [ D, D, D ] : [ D, D, D, D ], !0) : m.removeHandCards(u.default.gameLogic().is3CardGang(D) ? [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ] : [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0); else if (_.subType === i.eGangType.MingGang) {
 y ? m.removeHandCards(u.default.gameLogic().is3CardGang(D) ? [ D, D ] : [ D, D, D ], !0) : m.removeHandCards(u.default.gameLogic().is3CardGang(D) ? [ a.MJ_BACK_ID, a.MJ_BACK_ID ] : [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0);
o();
n.default.gameInfo.updateCardPointer(s.eDeskPos.Stand);
} else _.subType === i.eGangType.BuGang ? y ? m.removeHandCards([ D ], !0) : m.removeHandCards([ a.MJ_BACK_ID ], !0) : _.subType === i.eGangType.BuGang && (y ? m.removeHandCards([ D ], !0) : m.removeHandCards([ a.MJ_BACK_ID ], !0));
} else if (_.category === i.eOperateCategory.Hu) {
e == l.default.uid && c.default.getInstance() && c.default.getInstance().playAnimationHu();
var S = t.horse;
if (S && S.length > 0) {
for (var w = [], O = S[0], P = 1; P <= O; P++) w.push(S[P]);
var I = S.slice(O + 1);
n.default.gameInfo.singleEndInfo.inHorse = w;
n.default.gameInfo.singleEndInfo.notInHorse = I;
c.default.getInstance().playInhorse();
}
n.default.gameInfo.siteInfos.get(h).updateOperateOptions(null);
} else if (_.category === i.eOperateCategory.Guo) n.default.gameInfo.siteInfos.get(h).updateOperateOptions(null); else if (n.default.config.index == s.eGameIds.QJHZ && _.category == i.eOperateCategory.XXF) if (1 == _.subType) ; else {
y ? m.removeHandCards(_.cards, !0) : m.removeHandCards([ a.MJ_BACK_ID ], !0);
setTimeout(function() {
for (var e = 0; e < _.draw_card.length; e++) y ? m.getCard(_.draw_card[e]) : m.getCard(a.MJ_BACK_ID);
}, 0);
} else if (n.default.config.index == s.eGameIds.QJHZ && _.category == i.eOperateCategory.PiZi) {
y ? m.removeHandCards(_.cards, !0) : m.removeHandCards([ a.MJ_BACK_ID ], !0);
setTimeout(function() {
for (var e = 0; e < _.draw_card.length; e++) y ? m.getCard(_.draw_card[e]) : m.getCard(a.MJ_BACK_ID);
}, 0);
}
_.category !== i.eOperateCategory.Guo && m.addOperate(_);
_.category !== i.eOperateCategory.LiangDao && n.default.gameInfo.updatePlayerPointer(h);
n.default.gameInfo.siteInfos.statisAllOuts();
1 === _.cards.length && _.category !== i.eOperateCategory.Hu && u.default.gameLogic().isGangCard(_.cards[0]) || f.default.getInstance().playOperate(_.sound(n.default.config.index), p.gender);
}
};
e.canOperate = function(e, t) {
var o = n.default.players.getByUid(e);
if (o) {
var r = new p.default(t), i = o.pos;
n.default.gameInfo.siteInfos.get(i).updateOperateOptions(r);
} else cc.error("ad can operate uid error.");
};
e.getCard = function(e, t) {
var o = n.default.players.getByUid(e);
n.default.gameInfo.getCard(o.pos, t, null);
t > 0 && n.default.gameInfo.siteInfos.statisAllOuts();
};
e.putCard = function(e, t) {
0;
var o = n.default.gameInfo.getPutCardVirtual();
if (o) {
o.card === t && o.uid === e || d.default.reconnect();
n.default.gameInfo.setPutCardVirtual(null);
} else {
var r = n.default.players.getByUid(e);
n.default.gameInfo.putCard(r, t);
t > 0 && (u.default.gameLogic().isGangCard(t) || n.default.gameInfo.siteInfos.statisAllOuts());
}
};
e.gameBegin = function(e) {
var t = c.default.getInstance();
t && (t.isPlayingBeginAnimation = !0);
n.default.updateGameData(e);
t && t.playAnimationBegin();
};
return e;
}();
o.default = h;
cc._RF.pop();
