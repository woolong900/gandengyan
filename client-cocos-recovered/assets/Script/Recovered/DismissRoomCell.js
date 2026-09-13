// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dbd7485AwFH95wBOUs2uDvT", "DismissRoomCell");
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
var i = e("./RoomInfoData"), a = e("./Image"), s = e("./DismissRoomInfoData"), l = e("./CommonEnum"), c = e("./StringUtils"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uid = -1;
t._uiDirty = !1;
t.nameLabel = null;
t.stateLabel = null;
t.head = null;
return t;
}
t.prototype.setData = function(e) {
this._uid = e;
this._uiDirty = !0;
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
var e = i.default.players.getByUid(this._uid);
this.nameLabel.string = c.default.clip(e.name);
this.head.url = e.headImg;
if (s.default.isLeader(this._uid)) this.stateLabel.string = "（申请解散）"; else {
var t = s.default.useChooseType(this._uid);
t === l.eUseChoose.Agree ? this.stateLabel.string = "（已同意）" : t === l.eUseChoose.Disagree ? this.stateLabel.string = "（已拒绝）" : this.stateLabel.string = "";
}
}
};
r([ p(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ p(cc.Label) ], t.prototype, "stateLabel", void 0);
r([ p(a.default) ], t.prototype, "head", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
