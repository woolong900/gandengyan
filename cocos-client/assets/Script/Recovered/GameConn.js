// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f15b4YexyxEDLw3P7H/3B5e", "GameConn");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./ConnCreator"), r = require("./protocol"), i = require("./NotifyMsg"), a = require("./UserData");
(function(e) {
e[e.Null = 0] = "Null";
e[e.TokenInvalid = 1] = "TokenInvalid";
e[e.OtherLogin = 2] = "OtherLogin";
})(o.eConnLoseReason || (o.eConnLoseReason = {}));
var s = new n.default(r.protocol), l = {
init: function(e, t) {
var o = a.default.formatSocketAddr(), n = i.default;
s.init(o, e, n, t, -1);
},
sendMsg: function(e, t, o, n) {
void 0 === n && (n = !1);
s.sendMsg(e, t, o, n);
},
close: function() {
s.close();
},
reconnect: function() {
s.reconnect();
},
isOpen: function() {
return s.isOpen();
},
getDelay: function() {
return this._delay;
},
setDelay: function(e) {
this._delay = e;
}
};
o.default = l;
cc._RF.pop();
