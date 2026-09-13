// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = i;
var n = e("./14");
(i.prototype = Object.create(n.prototype)).constructor = i;
var r = e("./20");
function i(e) {
n.call(this, e);
}
i._configure = function() {
r.Buffer && (i.prototype._slice = r.Buffer.prototype.slice);
};
i.prototype.string = function() {
var e = this.uint32();
return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + e, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + e, this.len));
};
i._configure();
