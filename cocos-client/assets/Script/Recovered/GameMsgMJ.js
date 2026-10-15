// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "90093Ggxw1LNIVTbh51tNmT", "GameMsgMJ");
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
}();
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = require("./GameConn"), i = require("./RoomInfoData"), a = require("./OperateConfig"), s = require("./GameMsgBase"), l = require("./SoundUtils"), c = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype._pos2Index = function(e) {
if (2 === i.default.config.peopleCount()) {
if (0 === e) return 1;
if (2 === e) return 2;
} else {
if (0 === e) return 1;
if (3 === e) return 2;
if (2 === e) return 3;
if (1 === e) return 4;
}
};
t.prototype.ready = function(e) {
l.default.playReady();
if (e) {
var t = i.default.myPlayerData().pos, o = this._pos2Index(t), n = {
msghead: "gameready",
msgdata: JSON.stringify({
site: o
})
};
this.gameJson(n, null, !0);
} else {
n = {
msghead: "gameready",
msgdata: JSON.stringify({})
};
this.gameJson(n, null, !0);
}
};
t.prototype.changePos = function(e, t) {
l.default.playReady();
var o = this._pos2Index(e), n = {
msghead: "gameready",
msgdata: JSON.stringify({
site: o
})
};
this.gameJson(n, null, !0);
};
t.prototype.operate = function(e, t, o, n) {
var s = {
msghead: "",
msgdata: JSON.stringify({})
};
if (e === a.eOperateCategory.Guo) s.msghead = "gameguo"; else if (e === a.eOperateCategory.Chi) {
s.msghead = "gamechi";
s.msgdata = JSON.stringify({
chicard: o
});
} else if (e === a.eOperateCategory.Peng) s.msghead = "gamepeng"; else if (e === a.eOperateCategory.Gang) {
s.msghead = "gamegang";
s.msgdata = JSON.stringify({
card: o[0]
});
} else if (e === a.eOperateCategory.Hu) s.msghead = "gamehu"; else if (e === a.eOperateCategory.WarnLL) s.msghead = "gameshowlz"; else if (e === a.eOperateCategory.ShowCard) s.msghead = "gameshowcard"; else if (e === a.eOperateCategory.WarnQYS) {
s.msghead = "gamenotice";
s.msgdata = JSON.stringify({
type: 0
});
} else if (e === a.eOperateCategory.WarnJYS) {
s.msghead = "gamenotice";
s.msgdata = JSON.stringify({
type: 1
});
} else if (e === a.eOperateCategory.WarnFYS) {
s.msghead = "gamenotice";
s.msgdata = JSON.stringify({
type: 2
});
} else if (e === a.eOperateCategory.WarnQQR) {
s.msghead = "gamenotice";
s.msgdata = JSON.stringify({
type: 2
});
} else if (e === a.eOperateCategory.LiangDao) {
s.msghead = "gameshowzfb";
s.msgdata = JSON.stringify({
show_op: 1
});
} else if (e === a.eOperateCategory.NotLiangDao) {
s.msghead = "gameshowzfb";
s.msgdata = JSON.stringify({
show_op: 2
});
}
this.gameJson(s, function(e, t, o) {
o || 0 === e.res.error || r.default.reconnect();
}, !0);
var l = i.default.myAbsolutePos();
i.default.gameInfo.siteInfos.get(l).updateOperateOptions(null);
};
t.prototype.pubCard = function(e, t) {
var o = {
msghead: "gamestep",
msgdata: JSON.stringify({
card: e
})
};
this.gameJson(o, function(e, o, n) {
n ? t(null, n) : t(e.res, null);
}, !0);
};
t._instance = null;
return t;
}(s.default);
o.GameMsgMJ = c;
cc._RF.pop();
