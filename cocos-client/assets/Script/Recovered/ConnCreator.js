// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "47ea8oHYB1HY5RgBQvsRtrl", "ConnCreator");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./NetData"), r = require("./gContext"), i = require("./GameConfig"), a = require("./CenterMsg"), s = function() {
r.default.uiHelper.showTip("网络错误，请检查您的网络.");
}, l = function() {
function e(e) {
var t = this;
this.info = {
hostUrl: "",
isconnecting: !1,
inited: !1,
isLostConnect: !1,
reconnectCount: 0,
autoReconnectTimes: -1,
autoReconnectTimesOutCB: null,
reconnectCB: void 0
};
this._requestArray = [];
this._notifyMap = {};
this._reconnectTimer = null;
this._ws = null;
this._onMessage = null;
this._encode = null;
this._connectCB = null;
this._encode = function(t, o) {
var r = null;
if (o || 0 === o) {
var i = e[t].cs;
if (!i) {
cc.error("encode msg data error:");
cc.error("proto is:", t);
cc.error("msg is:", o);
return null;
}
r = i.encode(o).finish();
}
return n.default.pack(t, r);
};
this._onMessage = function(o) {
var r = function(e, o, n) {
for (var r = 0, i = t._requestArray.length; r < i; r++) {
if (t._requestArray[r].proto === e) {
var a = t._requestArray[r].cb;
try {
99 != e && cc.log("服务器发来：", e, o);
n ? a(null, e, n) : a(o, e, null);
} catch (t) {
cc.error("Do IRequesetCallBack proto:", e);
cc.error("Do IRequesetCallBack Error:", JSON.stringify(t));
}
t._requestArray.splice(r, 1);
break;
}
}
}, i = n.default.unpack(o), a = i.proto, s = e[a];
if (s) {
var l = s.sc, c = null;
l && (c = l.decode(i.pbMsg));
var u = t._notifyMap[a];
u ? u(c) : r(a, c, null);
} else {
1007 != a && cc.error("decode data proto id is error:", a);
r(a, null, "decode_error");
}
};
}
e.prototype.init = function(e, t, o, n, i, a) {
var l = this, c = function() {
if (l.info.inited && l.info.isLostConnect && !l.info.isconnecting) {
cc.log("now is reconnecting...");
if (l.info.autoReconnectTimes > 0 && l.info.reconnectCount >= l.info.autoReconnectTimes) {
l.info.autoReconnectTimesOutCB();
l.close();
}
new Date().getTime();
r.default.uiHelper.showLoading("重连中");
l.connect(function(e) {
if (e) l.info.reconnectCount++; else {
r.default.uiHelper.removeLoading();
l.info.reconnectCount = 0;
}
}, !1);
}
};
this.close(function(r) {
if (r) l._connectCB && l._connectCB("close old socket error:" + r); else {
n && (l.info.reconnectCB = n);
l.info.autoReconnectTimes = i || -1;
a ? l.info.autoReconnectTimesOutCB : l.info.autoReconnectTimesOutCB = s;
l._notifyMap = o || {};
l.info.hostUrl = e;
l.info.inited = !0;
l.info.reconnectCount = 0;
l.info.isLostConnect = !1;
cc.log(new Date().getTime());
l._reconnectTimer = setInterval(c, 1e3);
l.connect(t, !0);
}
});
};
e.prototype.connect = function(e, t) {
var o = this;
cc.log("to connnectting...");
this._connectCB = this.once(e);
var n = null;
try {
if (cc.sys.OS_ANDROID == cc.sys.os) {
var r = cc.url.raw("resources/ssl/cacert.pem");
if (r) {
cc.loader.md5Pipe && (r = cc.loader.md5Pipe.transformURL(r));
n = new WebSocket(i.default.appDunUrl(this.info.hostUrl), [], r);
} else n = new WebSocket(i.default.appDunUrl(this.info.hostUrl));
} else n = new WebSocket(i.default.appDunUrl(this.info.hostUrl));
n.binaryType = "arraybuffer";
} catch (e) {
this._connectCB("url invalid");
return;
}
this.info.isconnecting = !0;
n.onopen = function() {
o.info.isconnecting = !1;
o._requestArray = [];
if (o.info.inited) {
o.info.isLostConnect = !1;
o._ws = n;
o._connectCB(null);
if (t) ; else {
o.info.reconnectCB();
setTimeout(function() {
if (o.info.isLostConnect) cc.warn("重连确认前断开了链接！！！"); else {
a.default.reConnectIsOk();
cc.log("重连成功！！！！");
}
}, 500);
}
} else if (t) {
o._connectCB("connect closed");
o.close();
}
cc.log("concect is open.");
};
n.onclose = function() {
o.info.isconnecting = !1;
o._cleanWS("onclose");
};
n.onerror = function(e) {
cc.log("on error ev is:", e);
if (o.info.isconnecting) {
o.info.isconnecting = !1;
o._connectCB("net error");
}
o._cleanWS("onerror");
};
n.onmessage = function(e) {
o._onMessage(e.data);
};
};
e.prototype._cleanRequestArray = function(e) {
for (var t = 0, o = this._requestArray.length; t < o; t++) {
var n = this._requestArray[t];
n.cb(null, n.proto, e);
}
this._requestArray = [];
};
e.prototype._cleanWS = function(e) {
if (this._ws) {
this._ws.onerror = null;
this._ws.onclose = null;
this._ws.onmessage = null;
}
this._ws = null;
cc.log("connect is close reason is:", e);
this.info.isLostConnect = !0;
this._cleanRequestArray(e);
};
e.prototype.sendMsg = function(e, t, o, n) {
void 0 === n && (n = !1);
if (this._ws) {
var i = this._encode(e, t);
if (i) {
n || r.default.uiHelper.showLoading("加载中", .1);
if (99 != e) {
cc.log("客户端发送 proto:", e);
cc.log("客户端发送 netData:", t);
}
this._ws.send(i);
this._requestArray.push({
proto: e,
cb: function(e, t, i) {
n || r.default.uiHelper.removeLoading();
o && o(e, t, i);
}
});
} else {
cc.error("net data pack error.");
cc.error("proto:", e);
cc.error("msg:", t);
cc.error("net data pack error.");
o && o(null, e, "net data pack error");
}
} else {
cc.log("can not send msg:connect is lost.");
o && o(null, e, "connect is lost");
}
};
e.prototype.close = function(e) {
var t = this;
this.info.inited = !1;
if (this.info.isconnecting) e && e("connecting"); else {
if (this._reconnectTimer) {
clearInterval(this._reconnectTimer);
this._reconnectTimer = null;
}
this.info.reconnectCount = 0;
this.info.isLostConnect = !1;
this.info.autoReconnectTimes = -1;
this.info.autoReconnectTimesOutCB = s;
this._notifyMap = {};
if (this._ws) {
this._ws.onclose = function() {
t._cleanWS("manual_close");
e && e(null);
};
this._ws.close();
} else e && e(null);
}
};
e.prototype.isOpen = function() {
return !!this._ws;
};
e.prototype.reconnect = function() {
this._cleanWS("reconnect");
};
e.prototype.once = function(e) {
var t = !0;
return function(o) {
t && e && e(o);
t = !1;
};
};
return e;
}();
o.default = l;
cc._RF.pop();
