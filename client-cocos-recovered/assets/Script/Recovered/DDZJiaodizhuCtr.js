// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dd81d8tAvZKS5YPOGMf3BDb", "DDZJiaodizhuCtr");
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
var i = e("./RoomInfoData"), a = e("./gContext"), s = e("./DDZEnum"), l = e("./DDZEventKeys"), c = e("./EventUtils"), u = e("./SoundUtils"), d = e("./GameMsgDDZ"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.jiaodizhu = null;
t.buJiaodizhu = null;
t.Redouble = null;
t.unRedouble = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(l.default.data_round_data_update, function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, c.eOffType.OnDestroy);
a.default.eventUtils.on(l.default.ui_jiaodizhu_change, function(t, o) {
if (o.pos === i.default.myAbsolutePos()) {
e.jiaodizhu.active = !1;
e.buJiaodizhu.active = !1;
e.Redouble.active = !1;
e.unRedouble.active = !1;
}
}, this, c.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.jiaodizhu.active = !1;
this.buJiaodizhu.active = !1;
this.Redouble.active = !1;
this.unRedouble.active = !1;
if (i.default.gameInfoDDZ.status === s.eDDZGameStatus.JiaoDiZhu) {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoDDZ.siteInfos.get(e);
if (t.roundType > 0) {
var o = t.jiaoDizhuType();
if (1 == o) {
this.jiaodizhu.active = !0;
this.buJiaodizhu.active = !0;
} else if (4 == o) {
this.Redouble.active = !0;
this.unRedouble.active = !0;
} else {
this.jiaodizhu.active = !1;
this.buJiaodizhu.active = !1;
this.Redouble.active = !1;
this.unRedouble.active = !1;
}
} else {
this.jiaodizhu.active = !1;
this.buJiaodizhu.active = !1;
this.Redouble.active = !1;
this.unRedouble.active = !1;
}
} else {
this.jiaodizhu.active = !1;
this.buJiaodizhu.active = !1;
this.Redouble.active = !1;
this.unRedouble.active = !1;
}
};
t.prototype.onClickCancelJiaodizhu = function(e) {
u.default.clickBtn();
d.default.getInstance().jiaodizhu(0);
};
t.prototype.onClickJiao = function(e, t) {
u.default.clickBtn();
d.default.getInstance().jiaodizhu(1);
};
t.prototype.onClickCancelRedouble = function(e) {
u.default.clickBtn();
d.default.getInstance().DoRedouble(0);
};
t.prototype.onClickRedouble = function(e, t) {
u.default.clickBtn();
d.default.getInstance().DoRedouble(2);
};
r([ h(cc.Node) ], t.prototype, "jiaodizhu", void 0);
r([ h(cc.Node) ], t.prototype, "buJiaodizhu", void 0);
r([ h(cc.Node) ], t.prototype, "Redouble", void 0);
r([ h(cc.Node) ], t.prototype, "unRedouble", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
