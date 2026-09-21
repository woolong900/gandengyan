// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
var n = o;
n.build = "minimal";
n.Writer = require("./module_21");
n.BufferWriter = require("./module_22");
n.Reader = require("./module_14");
n.BufferReader = require("./module_15");
n.util = require("./module_20");
n.rpc = require("./module_17");
n.roots = require("./module_16");
n.configure = r;
function r() {
n.util._configure();
n.Writer._configure(n.BufferWriter);
n.Reader._configure(n.BufferReader);
}
r();
