// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ce761bAgTBIFqtFvzPUCALT", "GameChatUtils");
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
var r = e("./Singleton"), i = e("./pb"), a = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._chatConfig = null;
return t;
}
t.prototype.initData = function(e) {
var t = this;
this._chatConfig && cc.loader.releaseAsset(this._chatConfig);
return new Promise(function(o, n) {
cc.loader.loadRes("Json/Chat/ChatConfig_" + e, cc.JsonAsset, function(e, n) {
e || (t._chatConfig = n);
o();
});
});
};
Object.defineProperty(t.prototype, "config", {
get: function() {
return this._chatConfig.json;
},
enumerable: !0,
configurable: !0
});
t.prototype.textList = function() {
return this.config.text;
};
t.prototype.textStr = function(e) {
var t = this.textList(), o = this.config.quickText || [];
return [].concat(t).concat(o)[e];
};
t.prototype.textSoundPath = function(e, t) {
var o = "";
o = t === i.pb.eGender.MAN ? "man" : "woman";
return this.config.sound[e].replace("___", o);
};
t.prototype.emojiLen = function() {
return this.config.emoji.length;
};
t.prototype.emojiPath = function(e) {
return this.config.emoji[e];
};
return t;
}(r.default);
o.default = a;
cc._RF.pop();
