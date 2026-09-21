// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6a1b7Zuo35IRY9VnX1+2Faf", "Image");
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
}(), r = this && this.__decorate || function(e, t, o, n) {
var r, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, o, a) : r(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i, a = require("./GameConfig"), s = require("./CommonEnum"), l = require("./md5"), c = require("./Loader"), u = cc._decorator, d = u.ccclass, p = u.property;
(function(e) {
e[e.RED = 1] = "RED";
e[e.GREY = 2] = "GREY";
})(i = o.eHeadType || (o.eHeadType = {}));
var f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.defaultImage = null;
t.fixWidth = 80;
t.fixHeight = 80;
t.fileName = "";
t._url = null;
t._retryCount = 0;
t._retryHandler = null;
return t;
}
Object.defineProperty(t.prototype, "url", {
get: function() {
return this._url || "";
},
set: function(e) {
this._reset();
if (e) {
this._url = e;
this._loadImage();
} else this._loadHead(i.GREY);
},
enumerable: !0,
configurable: !0
});
t.prototype.onLoad = function() {
!this.defaultImage && this.spriteFrame && (this.defaultImage = this.spriteFrame);
this._retryHandler = this._retry.bind(this);
};
t.prototype._reset = function() {
this._resetRetry();
this._resetImage();
};
t.prototype._resetImage = function() {
if (this.defaultImage) {
this.spriteFrame = this.defaultImage;
this.node.width > this.fixWidth && (this.node.width = this.fixWidth);
this.node.height > this.fixHeight && (this.node.height = this.fixHeight);
}
};
t.prototype._loadImage = function() {
var e = this;
if (this.node && cc.isValid(this.node)) if (!this.url || this.url.length <= 0) cc.log("Image url invalid!"); else {
this.unschedule(this._retryHandler);
var t = this._nativeUrl(this.url), o = function(t, o) {
if (e.node && e.node.isValid && e.node.activeInHierarchy) if (t) {
e._resetImage();
e.scheduleOnce(e._retryHandler, 3);
} else if (o) {
var n = new cc.SpriteFrame(o);
e.spriteFrame = n;
o.width > e.fixWidth && (e.node.width = e.fixWidth);
o.height > e.fixHeight && (e.node.height = e.fixHeight);
e.node.emit("loading", !0);
}
};
t === this.url ? cc.loader.load({
url: t,
type: "png"
}, function(e, t) {
o(e, t);
}) : cc.loader.load(t, function(e, t) {
o(e, t);
});
}
};
t.prototype._nativeUrl = function(e) {
if (a.default.platform !== s.ePlatformType.android) return e;
var t = "headimg";
"" !== this.fileName && this.fileName.length > 0 && (t = this.fileName);
var o = jsb.fileUtils.getWritablePath() + t + "/", n = o + l.Md5.hashStr(e) + ".jpg";
if (jsb.fileUtils.isFileExist(n)) return n;
var r = function(e) {
if (e) {
jsb.fileUtils.isDirectoryExist(o) || jsb.fileUtils.createDirectory(o);
jsb.fileUtils.writeDataToFile(new Uint8Array(e), n) ? console.log("Remote write file succeed.") : console.log("Remote write file failed.");
} else console.log("Remote download file failed.");
}, i = new XMLHttpRequest();
i.responseType = "arraybuffer";
i.onreadystatechange = function() {
cc.log("xhr.readyState  " + i.readyState);
cc.log("xhr.status  " + i.status);
4 === i.readyState && (200 === i.status ? r(i.response) : r(null));
};
i.open("GET", e, !0);
i.send();
return e;
};
t.prototype._retry = function() {
this._retryCount++;
if (this._retryCount <= 3) {
this._loadImage();
cc.log("重试:", this._retryCount);
} else {
this.unschedule(this._retryHandler);
cc.log("重试超过次数:", 3);
this.node.emit("loading", !1);
}
};
t.prototype._resetRetry = function() {
this._retryCount = 0;
this.unschedule(this._retryHandler);
};
t.prototype._loadHead = function(e) {
var t = this;
void 0 === e && (e = i.GREY);
c.default.loadImg("Hall/Res/Texture/UserInfo/New/greyHead", function(e) {
t.setSpriteFrame(e);
});
};
t.prototype.setSpriteFrame = function(e) {
if (e) {
this.spriteFrame = e;
this.node.width > this.fixWidth && (this.node.width = this.fixWidth);
this.node.height > this.fixHeight && (this.node.height = this.fixHeight);
}
};
r([ p(cc.SpriteFrame) ], t.prototype, "defaultImage", void 0);
r([ p(cc.Integer) ], t.prototype, "fixWidth", void 0);
r([ p(cc.Integer) ], t.prototype, "fixHeight", void 0);
r([ p(cc.Integer) ], t.prototype, "fileName", void 0);
return t = r([ d ], t);
}(cc.Sprite);
o.default = f;
cc._RF.pop();
