// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "49eeaDKqY5FXJzoD/bYvJT3", "RecordGameChoose");
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
var i = e("./BaseComponent"), a = e("./RoomConfig"), s = e("./RecordGameChooseItem"), l = e("./gContext"), c = e("./EventKeys"), u = e("./EventUtils"), d = e("./RoomConfigListData"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._selectedId = "";
t.chooseItemNode = null;
t.content = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.loadList();
l.default.eventUtils.on(c.default.ui_record_game_choose, function(t, o) {
e.onClickClose();
}, this, u.eOffType.OnDestroy);
};
t.prototype.setData = function(e) {
this._selectedId = e;
};
t.prototype.loadList = function() {
var e = this, t = [];
(t = t.concat(d.default.collectionShow())).unshift(-1);
var o = [];
t.forEach(function(t) {
var n = {
id: t + "",
name: -1 == t ? "所有玩法" : a.default[t + ""].name,
selected: e._selectedId == t + ""
};
o.push(n);
var r = cc.instantiate(e.chooseItemNode);
r.active = !0;
r.getComponent(s.default).setData(n);
e.content.addChild(r);
});
};
r([ h(cc.Node) ], t.prototype, "chooseItemNode", void 0);
r([ h(cc.Node) ], t.prototype, "content", void 0);
return t = r([ f ], t);
}(i.default);
o.default = m;
cc._RF.pop();
