// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
var n = o;
n.build = "minimal";
n.Writer = e("./21");
n.BufferWriter = e("./22");
n.Reader = e("./14");
n.BufferReader = e("./15");
n.util = e("./20");
n.rpc = e("./17");
n.roots = e("./16");
n.configure = r;
function r() {
n.util._configure();
n.Writer._configure(n.BufferWriter);
n.Reader._configure(n.BufferReader);
}
r();
