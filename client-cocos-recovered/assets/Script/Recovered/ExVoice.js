// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "22ed4KKe7ZNVI3d9/Agg9lC", "ExVoice");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./GameConfig"), r = e("./CommonEnum"), i = e("./Bridge"), a = new (function() {
function e() {}
e.prototype.init = function(e) {
this._caller("init", e);
};
e.prototype.joinRoom = function(e, t) {
var o = n.default.platform;
if (r.ePlatformType.android === o || r.ePlatformType.iOS === o) {
return "ok" === i.default.voice.invoke("joinRoom", {
roomName: "" + e,
msTimeOut: 6e3
}, t);
}
cc.log("unsuppert.");
return !0;
};
e.prototype.quitRoom = function(e, t) {
var o = n.default.platform;
if (r.ePlatformType.android === o || r.ePlatformType.iOS === o) {
return "ok" === i.default.voice.invoke("quitRoom", {
roomName: "" + e,
msTimeOut: 6e3
}, t);
}
return !0;
};
e.prototype.openMic = function() {
var e = n.default.platform;
if (r.ePlatformType.android === e || r.ePlatformType.iOS === e) {
return "ok" === i.default.voice.invoke("openMic", null, void 0);
}
return !0;
};
e.prototype.closeMic = function() {
var e = n.default.platform;
if (r.ePlatformType.android === e || r.ePlatformType.iOS === e) {
return "ok" === i.default.voice.invoke("closeMic", null, void 0);
}
return !0;
};
e.prototype.openSpeaker = function() {
var e = n.default.platform;
if (r.ePlatformType.android === e || r.ePlatformType.iOS === e) {
return "ok" === i.default.voice.invoke("openSpeaker", null, void 0);
}
return !0;
};
e.prototype.closeSpeaker = function() {
var e = n.default.platform;
if (r.ePlatformType.android === e || r.ePlatformType.iOS === e) {
var t = "closeSpeaker";
r.ePlatformType.iOS === e && (t = "closeSpraker");
return "ok" === i.default.voice.invoke(t, null, void 0);
}
return !0;
};
e.prototype.setMode = function(e) {
var t = n.default.platform;
if (r.ePlatformType.android !== t && r.ePlatformType.iOS !== t) {
cc.log("unsuppert.");
return !0;
}
i.default.voice.invoke("setMode", e, void 0);
};
e.prototype.startRecording = function() {
var e = n.default.platform;
if (r.ePlatformType.android === e || r.ePlatformType.iOS === e) {
var t = i.default.voice.invoke("startRecording", null, void 0);
cc.log("startRecording:", t);
return "ok" === t;
}
cc.log("unsuppert.");
return !0;
};
e.prototype.stopRecording = function() {
var e = n.default.platform;
if (r.ePlatformType.android === e || r.ePlatformType.iOS === e) {
var t = i.default.voice.invoke("stopRecording", null, void 0);
cc.log("stopRecording:", t);
return "ok" === t;
}
cc.log("unsuppert.");
return !0;
};
e.prototype.uploadRecordedFile = function(e) {
var t = n.default.platform;
r.ePlatformType.android === t || r.ePlatformType.iOS === t ? i.default.voice.invoke("uploadRecordedFile", null, function(t, o) {
e && e(t, o);
}) : e && e(r.eExCallBackMsg.fail);
};
e.prototype.downloadRecordedFile = function(e, t) {
var o = n.default.platform;
if (r.ePlatformType.android === o || r.ePlatformType.iOS === o) i.default.voice.invoke("downloadRecordedFile", e, function(e, o) {
t && t(e, o);
}); else t && t(r.eExCallBackMsg.fail);
};
e.prototype.playRecordedFile = function() {
var e = n.default.platform;
r.ePlatformType.android === e || r.ePlatformType.iOS === e ? i.default.voice.invoke("playRecordedFile", null, null) : cc.log("unsupport");
};
e.prototype.stopPlayFile = function() {
var e = n.default.platform;
if (r.ePlatformType.android === e || r.ePlatformType.iOS === e) {
var t = i.default.voice.invoke("stopPlayFile", null, void 0);
cc.log("stopPlayFile:", t);
return "ok" === t;
}
cc.log("unsuppert.");
return !0;
};
e.prototype._caller = function(e, t) {
var o = n.default.platform;
r.ePlatformType.android === o || r.ePlatformType.iOS === o ? i.default.voice.invoke(e, t, void 0) : cc.log("unsuppert.");
};
return e;
}())();
o.default = a;
cc._RF.pop();
