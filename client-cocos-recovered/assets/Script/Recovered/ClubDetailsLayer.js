// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ccc12cVJydCk7vxUaNqpIG4", "ClubDetailsLayer");
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
var i = e("./ClubControl"), a = e("./SoundUtils"), s = e("./ClubMsg"), l = e("./gContext"), c = e("./BaseComponent"), u = e("./ClubListData"), d = e("./Image"), p = e("./Constants"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.clubName = null;
t.ownerName = null;
t.ownerID = null;
t.headImg = null;
t.checkedNode = null;
return t;
}
t.prototype.start = function() {
var e = i.default.getCurClubData();
this.clubName.string = e.clubName;
var t = e.memberList().clubMaster();
this.ownerName.string = "部长：" + t.nickname;
this.ownerID.string = "ID：" + t.uid;
this.headImg.url = t.avatarUrl;
this.checkedNode.active = !1;
};
t.prototype.onClickCheck = function() {
a.default.clickBtn();
var e = this.checkedNode.active;
this.checkedNode.active = !e;
};
t.prototype.onClickOk = function() {
var e = this;
a.default.clickBtn();
this.checkedNode.active ? l.default.msgBox.show("退出操作不可取消，确定退出俱乐部吗？", function() {
s.default.quitClub(u.default.focus, function(t, o) {
if (o) l.default.uiHelper.showTipNetError(); else if (0 === t.res.error) {
l.default.uiHelper.remove(e);
e._reLoadClub();
} else l.default.uiHelper.showTip(t.res.what);
});
}) : l.default.uiHelper.remove(this);
};
t.prototype._reLoadClub = function() {
s.default.getClubList(function(e, t) {
if (t) l.default.uiHelper.showTipNetError(); else if (0 === e.res.error) if (u.default.haveClub()) if (u.default.get(u.default.focus)) cc.log("当前俱乐部还在～"); else {
var o = u.default.collection(), n = parseInt(o[0]);
s.default.getClubData(n, function(e, t) {
t ? l.default.uiHelper.showTipNetError() : 0 === e.error || l.default.msgBox.showOnlyOk("俱乐部数据异常～", function() {
l.default.uiHelper.loadScene(p.default.HallSceneName);
});
});
} else l.default.uiHelper.loadScene(p.default.HallSceneName);
});
};
r([ m(cc.Label) ], t.prototype, "clubName", void 0);
r([ m(cc.Label) ], t.prototype, "ownerName", void 0);
r([ m(cc.Label) ], t.prototype, "ownerID", void 0);
r([ m(d.default) ], t.prototype, "headImg", void 0);
r([ m(cc.Node) ], t.prototype, "checkedNode", void 0);
return t = r([ h ], t);
}(c.default);
o.default = y;
cc._RF.pop();
