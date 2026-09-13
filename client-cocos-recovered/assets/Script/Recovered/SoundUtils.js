// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c371ebtxdFIw4Mhi1nJN5JQ", "SoundUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./Storage"), r = new (function() {
function e() {
this._isInit = !1;
this._bgm = null;
}
e.prototype.init = function() {
var e = n.default.effect.getValue();
this.setEffectVolume(e);
var t = n.default.music.getValue();
this.setMusicVolume(t);
};
e.prototype.getEffectVolume = function() {
return cc.audioEngine.getEffectsVolume();
};
e.prototype.setEffectVolume = function(e) {
cc.audioEngine.setEffectsVolume(e);
};
e.prototype.getMusiceVolume = function() {
return cc.audioEngine.getMusicVolume();
};
e.prototype.setMusicVolume = function(e) {
cc.audioEngine.setMusicVolume(e);
};
e.prototype.playJoy = function(e) {
this.playEffect("Hall/Sound/JoyEmoj/" + e, !1);
};
e.prototype.playReady = function() {
this.playEffect("Hall/Sound/ready", !1);
};
e.prototype.enterRoom = function() {
this.playEffect("Hall/Sound/audio_enter_room", !1);
};
e.prototype.exitRoom = function() {
this.playEffect("Hall/Sound/audio_exit_room", !1);
};
e.prototype.warning = function() {
this.playEffect("Hall/Sound/warning", !1);
};
e.prototype.playEffect = function(e, t) {
var o = this;
void 0 === t && (t = !1);
var n = this.getEffectVolume();
if (n <= 0) return -1;
if (!e) return -1;
var r = cc.loader.getRes(e, cc.AudioClip);
if (r) {
return cc.audioEngine.play(r, t, n);
}
cc.loader.loadRes(e, cc.AudioClip, function(n) {
if (!n) return o.playEffect(e, t);
console.warn("++++ sound load error:", e);
});
console.warn("++++ playSound error:", e);
};
e.prototype.clickBtn = function() {
this.playEffect("Hall/Sound/clickbtn", !1);
};
e.prototype.stopEffect = function(e) {
void 0 === e && (e = null);
"number" == typeof e && cc.audioEngine.stop(e);
};
e.prototype.playMusic = function(e, t) {
var o = this;
void 0 === t && (t = !0);
this.stopMusic();
if (this.getMusiceVolume() <= 0) return -1;
if (!e) return -1;
var n = cc.loader.getRes(e, cc.AudioClip);
if (!n) {
cc.loader.loadRes(e, cc.AudioClip, function(n) {
o.playMusic(e, t);
});
console.warn("++++ _realPlayMusic error:", e);
return 0;
}
var r = cc.audioEngine.playMusic(n, t);
cc.audioEngine.setFinishCallback(r, function() {
o.replayMusic();
});
return r;
};
e.prototype.playMusicMain = function() {
if ("Hall/Sound/mainBgm" === this._bgm) cc.audioEngine.isMusicPlaying() || r.playMusic(this._bgm); else {
this._bgm = "Hall/Sound/mainBgm";
r.playMusic(this._bgm);
}
};
e.prototype.playMusicGame = function(e) {
if (this._bgm === e) cc.audioEngine.isMusicPlaying() || r.playMusic(this._bgm); else {
this._bgm = e;
r.playMusic(this._bgm);
}
};
e.prototype.replayMusic = function() {
this._bgm && (cc.audioEngine.isMusicPlaying() || r.playMusic(this._bgm));
};
e.prototype.stopMusic = function() {
cc.audioEngine.stopMusic();
};
e.prototype.pauseMusic = function() {
cc.audioEngine.pauseMusic();
};
e.prototype.resumeMusic = function() {
cc.audioEngine.pauseMusic();
cc.audioEngine.resumeMusic();
};
e.prototype.stopAll = function() {
cc.audioEngine.stopAllEffects();
cc.audioEngine.stopMusic();
};
e.prototype.save = function() {
n.default.effect.setValue(this.getEffectVolume());
n.default.music.setValue(this.getMusiceVolume());
};
return e;
}())();
o.default = r;
cc._RF.pop();
