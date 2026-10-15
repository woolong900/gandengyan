// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e66c0tF6BRM/L0OBnVmNV0K", "UIHelper");
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
}, i = this && this.__awaiter || function(e, t, o, n) {
return new (o || (o = Promise))(function(r, i) {
function a(e) {
try {
l(n.next(e));
} catch (e) {
i(e);
}
}
function s(e) {
try {
l(n.throw(e));
} catch (e) {
i(e);
}
}
function l(e) {
e.done ? r(e.value) : new o(function(t) {
t(e.value);
}).then(a, s);
}
l((n = n.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var o, n, r, i, a = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return i = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function s(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, n && (r = 2 & i[0] ? n.return : i[0] ? n.throw || ((r = n.return) && r.call(n),
0) : n.next) && !(r = r.call(n, i[1])).done) return r;
(n = 0, r) && (i = [ 2 & i[0], r.value ]);
switch (i[0]) {
case 0:
case 1:
r = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(r = a.trys, r = r.length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < r[1]) {
a.label = r[1];
r = i;
break;
}
if (r && a.label < r[2]) {
a.label = r[2];
a.ops.push(i);
break;
}
r[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
n = 0;
} finally {
o = r = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var s = require("./MsgTipHelper"), l = require("./Loader"), c = require("./BaseComponent"), u = require("./WindowConfig"), d = require("./WindowMgr"), p = require("./Constants"), f = require("./ShowAction"), h = require("./WindowConfigComponent"), m = require("./RoomInfoData"), y = require("./GameChatUtils"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.commonNode = null;
t.loadingNode = null;
t.netErrorNode = null;
t.loadingPre = null;
t.netErrorPre = null;
t.maskSprite = null;
t.msgTipHelper = null;
t._isSceneLoading = !1;
return t;
}
t.prototype.show = function(e) {
for (var t = [], o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
var n = u.default[e], r = n.url, i = this._getRoot(n.type);
this._show(r, i, n, t);
};
t.prototype.showWithNode = function(e, t) {
for (var o = [], n = 2; n < arguments.length; n++) o[n - 2] = arguments[n];
var r = u.default[e], i = this._getRoot(r.type);
this._show(t, i, r, o);
};
t.prototype.gameShow = function(e) {
for (var t = [], o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
var n = cc.instantiate(e), r = n.getComponent(h.default).config(), i = this._getRoot(r.type);
this._show(n, i, r, t);
};
t.prototype.remove = function(e) {
null === e || void 0 === e ? this._removeByType(u.eWindowType.COMMON) : e instanceof c.default ? this._removeByID(e.getWindowID()) : this._removeByID(e);
};
t.prototype.showUploadFile = function(e, t) {
void 0 === e && (e = "提交中");
void 0 === t && (t = 0);
this.showWithNode(u.eWindowID.Loading, this.loadingPre, e, t);
};
t.prototype.showLoading = function(e, t) {
void 0 === e && (e = "加载中");
void 0 === t && (t = 0);
this.showWithNode(u.eWindowID.Loading, this.loadingPre, e, t);
};
t.prototype.removeLoading = function() {
this._removeByID(u.eWindowID.Loading);
};
t.prototype.showNetError = function(e, t) {
this.showWithNode(u.eWindowID.NetErrorTip, this.netErrorPre, e, t);
};
t.prototype.removeNetError = function() {
this._removeByID(u.eWindowID.NetErrorTip);
};
t.prototype.showTip = function(e, t) {
void 0 === t && (t = s.eTipType.COMMON);
e ? this.msgTipHelper.show(e, t) : cc.error("Show Tip String Null");
};
t.prototype.showTipNetError = function() {};
t.prototype.clean = function() {
for (var e = d.default.count() - 1; e >= 0; e--) this.remove();
};
t.prototype._removeByType = function(e) {
var t = d.default.popup(e);
this._removeCell(t);
};
t.prototype._removeByID = function(e) {
var t = d.default.popupID(e);
this._removeCell(t);
};
t.prototype._removeCell = function(e) {
if (e) {
var t = e.pop, o = function() {
e.root.removeFromParent();
e.root.destroy();
}, n = d.default.getCloseAction(t, e.config.animateClose, o);
n ? t.runAction(n) : o();
}
};
t.prototype.loadScene = function(e) {
var t = this, o = function() {
return i(t, void 0, void 0, function() {
var t = this;
return a(this, function(o) {
switch (o.label) {
case 0:
return e !== p.default.HallSceneName && e !== p.default.LoginSceneName && e !== p.default.ClubSceneName ? [ 3, 1 ] : [ 3, 3 ];

case 1:
return [ 4, y.default.getInstance().initData(m.default.config.index) ];

case 2:
o.sent();
o.label = 3;

case 3:
cc.director.loadScene(e, function() {
t._cleanAll();
t._isSceneLoading = !1;
});
return [ 2 ];
}
});
});
};
if (!this._isSceneLoading) {
this._isSceneLoading = !0;
this.showLoading(null, .1);
e === p.default.GameSceneName ? cc.loader.loadResDir("Hall/Res/Texture/Card", function() {
o();
}) : e === p.default.D7SceneName || e === p.default.PDKSceneName || e === p.default.WSKSceneName || e === p.default.DBDSceneName ? cc.loader.loadResDir("Games/d7/Poker", function() {
o();
}) : o();
}
};
t.prototype.runSceneImmediate = function(e) {
var t = this;
if (!this._isSceneLoading) {
this._isSceneLoading = !0;
this.showLoading();
cc.director.runSceneImmediate(e, void 0, function() {
t._cleanAll();
t._isSceneLoading = !1;
});
}
};
t.prototype._show = function(e, t, o) {
for (var n = [], r = 3; r < arguments.length; r++) n[r - 3] = arguments[r];
var i = function(e) {
var t, r = e.getComponent(c.default);
if (r) {
n && n.length > 0 && (t = r.setData).apply.apply(t, [ r ].concat(n));
r.setWindowID(o.id);
} else cc.error("UIHelper setData error.");
};
if (o.singleton && d.default.isShow(o.id)) cc.warn("单例窗口弹出~"); else {
var a = null;
if (e instanceof cc.Node) {
i(a = e);
cc.warn("打开的UI名称:", a.name);
d.default.getShowAction(a, o.animateShow) && (a.getComponent(f.default) || a.addComponent(f.default));
} else if (e instanceof cc.Prefab) {
a = cc.instantiate(e);
i(a);
cc.warn("打开的UI名称:", a.name);
d.default.getShowAction(a, o.animateShow) && (a.getComponent(f.default) || a.addComponent(f.default));
} else {
a = new cc.Node();
l.default.loadPre(e, function(e) {
if (a && a.isValid) {
var t = cc.instantiate(e);
i(t);
a.addChild(t);
cc.warn("打开的UI名称:", t.name);
d.default.getShowAction(a, o.animateShow) && (a.getComponent(f.default) || a.addComponent(f.default));
}
});
}
this._popup(a, t, o);
}
};
t.prototype._popup = function(e, t, o) {
var n = this, r = o.shadow, i = o.outside, a = new cc.Node("item"), s = this._createShadowLayer(r, function(e) {
i == u.eWindowTouchOutside.CLOSE && n.remove();
}, i);
a.addChild(s);
a.addChild(e);
d.default.push(a, o);
t.addChild(a);
};
t.prototype._getRoot = function(e) {
var t = this.commonNode;
e === u.eWindowType.COMMON || (e === u.eWindowType.LOADING ? t = this.loadingNode : e === u.eWindowType.NET_ERROR && (t = this.netErrorNode));
return t;
};
t.prototype._createShadowLayer = function(e, t, o) {
void 0 === e && (e = !1);
var n = new cc.Node("ShadowSprite"), r = n.addComponent(cc.Sprite);
r.sizeMode = cc.Sprite.SizeMode.CUSTOM;
r.spriteFrame = this.maskSprite.spriteFrame;
n.setContentSize(cc.winSize);
n.opacity = 0;
e && n.runAction(cc.fadeIn(.1));
o == u.eWindowTouchOutside.PASS || n.on(cc.Node.EventType.TOUCH_END, function(e) {
t && t(e);
}, n);
return n;
};
t.prototype._cleanAll = function() {
d.default.clean();
this.loadingNode.destroyAllChildren();
this.commonNode.destroyAllChildren();
this.netErrorNode.destroyAllChildren();
};
r([ v(cc.Node) ], t.prototype, "commonNode", void 0);
r([ v(cc.Node) ], t.prototype, "loadingNode", void 0);
r([ v(cc.Node) ], t.prototype, "netErrorNode", void 0);
r([ v(cc.Prefab) ], t.prototype, "loadingPre", void 0);
r([ v(cc.Prefab) ], t.prototype, "netErrorPre", void 0);
r([ v(cc.Sprite) ], t.prototype, "maskSprite", void 0);
r([ v(s.default) ], t.prototype, "msgTipHelper", void 0);
return t = r([ _ ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
