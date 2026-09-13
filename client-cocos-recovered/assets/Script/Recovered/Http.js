// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "da93fDZF9tJpZrXqrFOiNLA", "Http");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = new (function() {
function e() {}
e.prototype.send = function(e, t, o, n, r) {
var i = function(e, t) {
r && r(e, t);
r = null;
}, a = new XMLHttpRequest();
a.timeout = 1e4;
a.onreadystatechange = function() {
var e = null, t = null;
if (4 == a.readyState) {
if (200 == a.status) {
t = null;
e = a.responseText;
} else t = "http error status:" + a.status;
i(t, e);
} else console.log("xhr.readyState:" + a.readyState);
};
a.onerror = function() {
console.log("http error:url error");
i("url_error");
};
a.ontimeout = function() {
console.log("http error:time out");
i("time_out");
};
a.open(e, t, !0);
if (o && "object" == typeof o) for (var s in o) {
var l = o[s];
a.setRequestHeader(s, l);
}
if (n) {
var c = "";
c = "object" == typeof n ? JSON.stringify(n) : n;
cc.log("send data is:", c);
a.send(c);
} else a.send();
};
e.prototype.get = function(e, t, o) {
this.send("GET", e, t, null, o);
};
e.prototype.post = function(e, t, o, n) {
this.send("POST", e, t, o, n);
};
e.prototype.formatUrl = function(e, t, o) {
if (t && "object" == typeof t) {
var n = "?";
for (var r in t) {
var i = t[r];
if ("" !== i && null !== i && void 0 !== i) {
"?" === n || (n += "&");
n += r + "=" + t[r];
} else cc.log("format url value is :", i);
}
e += n;
}
o && "string" == typeof o && (e += o);
return e;
};
e.prototype._removePrefix = function(e, t) {
var o = t.length;
return 0 === e.indexOf(t) ? e.substr(o) : e;
};
e.prototype._removePostfix = function(e, t) {
var o = e.indexOf(t);
return o > 0 ? e.substr(0, o) : e;
};
e.prototype.replaceDomain = function(e, t) {
var o = e;
o = this._removePrefix(o, "http://");
o = this._removePrefix(o, "https://");
o = this._removePrefix(o, "wss://");
o = this._removePrefix(o, "ws://");
o = this._removePostfix(o, "/");
return e.replace(o, t);
};
e.prototype.replaceDomainHead = function(e, t, o) {
var n = t.length;
return 0 === e.indexOf(t) ? o + e.substr(n) : e;
};
return e;
}())();
o.default = n;
cc._RF.pop();
