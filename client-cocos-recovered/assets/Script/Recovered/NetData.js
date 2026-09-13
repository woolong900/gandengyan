// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dc9b4b54DFBRoC4yDfY5Lmz", "NetData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./2"), r = function() {
function e() {}
e.unpack = function(e) {
var t = new n.Buffer(e), o = 0, r = t.readUInt32BE(o, !0);
o += 4;
var i = t.readUInt32BE(o, !0);
o += 4;
var a = t.readUInt32BE(o, !0);
o += 4;
var s = t.subarray(o);
a - 12 !== s.length && cc.error("数据长度错误：", r, i, s);
return {
proto: r,
time: i,
pbMsg: s
};
};
e.pack = function(e, t) {
var o = 12 + (t = t || new Uint8Array(0)).length, r = new n.Buffer(o), i = 0;
r.writeUInt32BE(e, i, !0);
i += 4;
r.writeUInt32BE(0, i, !0);
i += 4;
r.writeUInt32BE(o, i, !0);
i += 4;
for (var a = 0, s = t.length; a < s; a++) {
var l = t[a];
r.writeUInt8(l, i, !0);
i += 1;
}
return r.buffer;
};
return e;
}();
o.default = r;
cc._RF.pop();
