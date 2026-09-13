// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2c04emOet9DRqOg+E+yQtoj", "VoiceMessages");
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
var i, a, s, l = e("./ExVoice"), c = e("./CommonEnum"), u = e("./gContext"), d = e("./EventKeys"), p = e("./SoundUtils"), f = cc._decorator, h = f.ccclass, m = f.property;
(function(e) {
e.SpeakFail = "speak_fail";
e.SpeakSuccess = "speak_success";
})(i || (i = {}));
(function(e) {
e.SpeakTimeShort = "Speak_time_short";
e.SpeakIntervalShort = "speak_interval_short";
e.CheckVoicePermission = "check_voice_permission";
e.StopFail = "stop_fail";
})(a || (a = {}));
(function(e) {
e.Normal = "normal";
e.Speaking = "speaking";
})(s || (s = {}));
var y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.tStart = -1;
t.tEnd = -1;
t.uiDirty = !0;
t.status = s.Normal;
t.speakDuration = 0;
t.speakIcon = null;
t.speakStatusNode = null;
t.pBar = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.scheduleOnce(function() {
var t = cc.winSize.width, o = cc.winSize.height, n = e.node.convertToNodeSpaceAR(cc.v2(t / 2, o / 2));
e.speakStatusNode.position = cc.v2(n.x, n.y + 25);
});
this.speakIcon.on(cc.Node.EventType.TOUCH_START, function(t) {
var o = new Date().getTime() - e.tEnd;
if (e.tEnd > 0 && o < 3e3) e.speakEnd(i.SpeakFail, a.SpeakIntervalShort); else {
l.default.stopPlayFile() && u.default.eventUtils.emit(d.default.todo_voice_stop_play);
if (l.default.startRecording()) {
e.status = s.Speaking;
p.default.pauseMusic();
e.tStart = new Date().getTime();
e.speakDuration = 0;
e.uiDirty = !0;
} else e.speakEnd(i.SpeakFail, a.CheckVoicePermission);
}
});
var t = function() {
if (e.status === s.Speaking) {
l.default.stopRecording() ? new Date().getTime() - e.tStart < 1e3 ? e.speakEnd(i.SpeakFail, a.SpeakTimeShort) : e.speakEnd(i.SpeakSuccess, null) : e.speakEnd(i.SpeakFail, a.StopFail);
}
};
this.speakIcon.on(cc.Node.EventType.TOUCH_END, function() {
t();
});
this.speakIcon.on(cc.Node.EventType.TOUCH_CANCEL, function() {
t();
});
};
t.prototype.update = function() {
if (this.status === s.Speaking) {
if (new Date().getTime() - this.tStart >= 15e3) {
if (l.default.stopRecording()) this.speakEnd(i.SpeakSuccess, null); else {
cc.log("error to stop speak.");
l.default.stopRecording();
this.speakEnd(i.SpeakFail, a.StopFail);
}
} else {
var e = new Date().getTime() - this.tStart;
if (e - this.speakDuration > 100) {
this.speakDuration = e;
this.uiDirty = !0;
}
}
}
if (this.uiDirty) {
this.uiDirty = !1;
if (this.status === s.Speaking) {
this.speakStatusNode.active = !0;
this.pBar.progress = this.speakDuration / 15e3;
} else {
this.pBar.progress = 0;
this.speakStatusNode.active = !1;
}
}
};
t.prototype.speakEnd = function(e, t) {
var o = this;
this.uiDirty = !0;
this.status === s.Speaking && p.default.resumeMusic();
this.status = s.Normal;
if (e === i.SpeakSuccess) {
this.tEnd = new Date().getTime();
l.default.uploadRecordedFile(function(e, t) {
if (e === c.eExCallBackMsg.success) {
var n = o.tEnd - o.tStart;
cc.log("extra:", t);
u.default.gameMsgBase().sendChatMsg(c.eChatMsgType.ChatVoice, t, function(e, t) {}, null, n);
} else u.default.uiHelper.showTip("语音发送失败~");
});
} else t === a.SpeakTimeShort ? u.default.uiHelper.showTip("录音时间太短~") : t === a.SpeakIntervalShort ? u.default.uiHelper.showTip("喝杯茶休息一下再发吧~") : t === a.CheckVoicePermission ? u.default.uiHelper.showTip("应用权限未开启，无法发送语音消息~") : u.default.uiHelper.showTip("录音失败~");
};
r([ m(cc.Node) ], t.prototype, "speakIcon", void 0);
r([ m(cc.Node) ], t.prototype, "speakStatusNode", void 0);
r([ m(cc.ProgressBar) ], t.prototype, "pBar", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
