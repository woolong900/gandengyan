// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d3389ZmzQVIYJUqzKjrk/2O", "CheckCell");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./EventUtils"), l = require("./RoomConfigListData"), c = require("./SoundUtils"), u = require("./CreateRoomAssist"), d = require("./CheckCellNote"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._gameId = 0;
t._index = 0;
t.closeNode = null;
t.openNode = null;
t.closeLabel = null;
t.openLabel = null;
t.noteNode = null;
t.notePre = null;
t.grayMaterial = null;
t.normalMaterial = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.ui_create_room_item_clicked, function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.setData = function(e, t, o) {
this._gameId = e;
this._index = o;
this._uiDirty = !0;
this.updateUI();
};
t.prototype.onClicked = function() {
var e = u.default.get(this._gameId), t = e.isForceCheck(this._index), o = e.isForceUncheck(this._index);
if (!t && !o) {
c.default.clickBtn();
u.default.get(this._gameId).onClicked(this._index);
}
};
t.prototype.updateUI = function() {
var e = this, t = u.default.get(this._gameId), o = t.desc(this._index);
this.closeLabel.string = o;
this.openLabel.string = o;
var n = t.isVisible(this._index), r = t.isForceCheck(this._index), i = t.isForceUncheck(this._index);
this.node.getComponent(cc.Button).enabled = n;
if (n) {
this.openNode.getChildByName("Flag").getChildByName("radio").active = !0;
this.closeNode.getChildByName("Flag").getChildByName("radio").active = !0;
this.openNode.getChildByName("Flag").getChildByName("check").active = !1;
this.closeNode.getChildByName("Flag").getChildByName("check").active = !1;
if (r || i) {
this.openNode.getChildByName("Flag").getChildByName("radio").getComponent(cc.Sprite).setMaterial(0, this.grayMaterial);
this.openNode.getChildByName("Flag").getChildByName("check").getComponent(cc.Sprite).setMaterial(0, this.grayMaterial);
this.closeNode.getChildByName("Flag").getChildByName("radio").getComponent(cc.Sprite).setMaterial(0, this.grayMaterial);
this.closeNode.getChildByName("Flag").getChildByName("check").getComponent(cc.Sprite).setMaterial(0, this.grayMaterial);
} else {
this.openNode.getChildByName("Flag").getChildByName("radio").getComponent(cc.Sprite).setMaterial(0, this.normalMaterial);
this.openNode.getChildByName("Flag").getChildByName("check").getComponent(cc.Sprite).setMaterial(0, this.normalMaterial);
this.closeNode.getChildByName("Flag").getChildByName("radio").getComponent(cc.Sprite).setMaterial(0, this.normalMaterial);
this.closeNode.getChildByName("Flag").getChildByName("check").getComponent(cc.Sprite).setMaterial(0, this.normalMaterial);
}
var a = t.isChecked(this._index);
this.openNode.active = a;
this.closeNode.active = !a;
this.scheduleOnce(function() {
var o = e.openLabel.node.width, n = e.closeLabel.node.width, r = 65 + Math.max(o, n);
e.node.width = r;
if (t.note(e._index)) {
e.noteNode.active = !0;
e.noteNode.x = r;
}
});
} else {
this.openNode.active = !1;
this.closeNode.active = !1;
this.noteNode.active = !1;
}
};
t.prototype.onClickNote = function() {
c.default.clickBtn();
var e = l.default.get(this._gameId).note(this._index), t = cc.instantiate(this.notePre);
t.getComponent(d.default).setData(e, cc.v2(this.noteNode.width / 2, 30), this.node.x < 0);
this.noteNode.addChild(t);
i.default.eventUtils.emit(a.default.ui_create_room_note_show);
};
r([ h(cc.Node) ], t.prototype, "closeNode", void 0);
r([ h(cc.Node) ], t.prototype, "openNode", void 0);
r([ h(cc.Label) ], t.prototype, "closeLabel", void 0);
r([ h(cc.Label) ], t.prototype, "openLabel", void 0);
r([ h(cc.Node) ], t.prototype, "noteNode", void 0);
r([ h(cc.Prefab) ], t.prototype, "notePre", void 0);
r([ h(cc.Material) ], t.prototype, "grayMaterial", void 0);
r([ h(cc.Material) ], t.prototype, "normalMaterial", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
