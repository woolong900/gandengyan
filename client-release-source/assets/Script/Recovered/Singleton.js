// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e0c43fW4oxNtrqeIsz2VdMp", "Singleton");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.getInstance = function() {
this.instance || (this.instance = new this());
return this.instance;
};
return e;
}();
o.default = n;
cc._RF.pop();
