// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1f9bdNZL71IyauiXdJ+AlUB", "PlayerInfoListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./gContext"), r = require("./EventKeys"), i = require("./CommonUtils"), a = require("./UserData"), s = require("./SoundUtils"), l = function() {
function e() {
this._data = null;
this._count = 0;
this._data = Object.create(null);
this._count = 0;
}
e.prototype.add = function(e) {
var t = e.uid;
this._data[t] = e;
this._count++;
t != a.default.uid && s.default.enterRoom();
n.default.eventUtils.emit(r.default.data_player_add, {
o: e
});
};
e.prototype.getByUid = function(e) {
return this._data[e];
};
e.prototype.getByPos = function(e) {
for (var t = this.collection(), o = 0, n = t.length; o < n; o++) {
var r = parseInt(t[o]), i = this.getByUid(r);
if (i.pos === e) return i;
}
return null;
};
e.prototype.update = function(e) {
var t = e.uid, o = this._data[t];
if (o) {
this._data[t] = e;
n.default.eventUtils.emit(r.default.data_player_update, {
o: o,
n: e
});
} else this.add(e);
};
e.prototype.remove = function(e) {
var t = this._data[e];
if (t) {
delete this._data[e];
this._count--;
e != a.default.uid && s.default.exitRoom();
n.default.eventUtils.emit(r.default.data_player_remove, {
o: t
});
} else cc.error("player info list delete error.");
};
e.prototype.collection = function(e, t) {
return i.default.collection(this._data, e, t);
};
e.prototype.count = function() {
return this._count;
};
e.prototype.clean = function() {
this._data = Object.create(null);
this._count = 0;
};
return e;
}();
o.default = l;
cc._RF.pop();
