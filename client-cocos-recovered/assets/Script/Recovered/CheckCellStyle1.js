// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8709arESSREXIUQXXeeXaMW", "CheckCellStyle1");
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
var i = e("./SoundUtils"), a = e("./gContext"), s = e("./EventKeys"), l = e("./EventUtils"), c = e("./CheckCellNote"), u = e("./CreateRoomAssist"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._list = [];
t._gameId = 0;
t._index = 0;
t.desc = null;
t.noteNode = null;
t.notePre = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(s.default.ui_create_room_item_clicked, function(t, o) {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.setData = function(e, t, o) {
this._gameId = e;
this._index = o;
this._updateUI();
};
t.prototype._updateUI = function() {
var e = u.default.get(this._gameId);
this.desc.string = "" + e.getValue(this._index);
e.note(this._index) ? this.noteNode.active = !0 : this.noteNode.active = !1;
};
t.prototype._getCheckIndex = function() {};
t.prototype.onClickSub = function() {
i.default.clickBtn();
u.default.get(this._gameId).onClickSub(this._index);
};
t.prototype.onClickAdd = function() {
i.default.clickBtn();
u.default.get(this._gameId).onClickAdd(this._index);
};
t.prototype.onClickNote = function() {
i.default.clickBtn();
var e = u.default.get(this._gameId).note(this._index), t = cc.instantiate(this.notePre);
t.getComponent(c.default).setData(e, cc.v2(this.noteNode.width / 2, 30), this.node.x < 0);
this.noteNode.addChild(t);
a.default.eventUtils.emit(s.default.ui_create_room_note_show);
};
r([ f(cc.Label) ], t.prototype, "desc", void 0);
r([ f(cc.Node) ], t.prototype, "noteNode", void 0);
r([ f(cc.Prefab) ], t.prototype, "notePre", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
