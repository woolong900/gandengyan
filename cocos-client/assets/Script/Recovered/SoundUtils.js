// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c371ebtxdFIw4Mhi1nJN5JQ", "SoundUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./Storage"), r = new (function() {
function e() {
this._isInit = !1;
this._bgm = null;
this._pokerVoices = [];
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
// The original network flow supplies turn pacing. Local robots instead wait
// for these original clips; do not queue, replace or interrupt the audio itself.
var match = /^Games\/(ddz|gd)\/Sound\/(man|woman)\//.exec(e), voice = null;
if (match && cc.sys.localStorage.getItem(match[1] + "_local_room") === "1") {
voice = { game: match[1], until: Date.now() + 5000 };
this._pokerVoices.push(voice);
}
function play(clip, volume) {
var id = cc.audioEngine.play(clip, t, volume);
if (voice) {
var duration = Number(clip.duration);
if (!(duration > 0) && cc.audioEngine.getDuration) duration = cc.audioEngine.getDuration(id);
voice.until = Date.now() + (duration > 0 ? duration * 1000 : 1500);
}
return id;
}
var r = cc.loader.getRes(e, cc.AudioClip);
if (r) {
return play(r, n);
}
cc.loader.loadRes(e, cc.AudioClip, function(error, clip) {
if (error || !clip) {
if (voice) voice.until = 0;
console.warn("++++ sound load error:", e, error);
return;
}
// A cache miss is normal on first use. Play the loaded clip directly instead
// of recursively loading again, and respect a mute made while loading.
var volume = o.getEffectVolume();
if (volume > 0) play(clip, volume); else if (voice) voice.until = 0;
});
};
e.prototype.pokerVoiceDelay = function(game) {
var now = Date.now(), until = now;
this._pokerVoices = this._pokerVoices.filter(function(voice) { return voice.until > now; });
if (this.getEffectVolume() <= 0) return 0;
this._pokerVoices.forEach(function(voice) { if (voice.game === game) until = Math.max(until, voice.until); });
return until - now;
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
var token = this._musicLoadToken;
cc.loader.loadRes(e, cc.AudioClip, function(error, clip) {
if (error || !clip) { console.warn("++++ music load error:", e, error); return; }
if (token !== o._musicLoadToken || o.getMusiceVolume() <= 0) return;
var id = cc.audioEngine.playMusic(clip, t);
cc.audioEngine.setFinishCallback(id, function() { o.replayMusic(); });
});
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
this._musicLoadToken = (this._musicLoadToken || 0) + 1;
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
this._pokerVoices = [];
cc.audioEngine.stopAllEffects();
this.stopMusic();
};
e.prototype.save = function() {
n.default.effect.setValue(this.getEffectVolume());
n.default.music.setValue(this.getMusiceVolume());
};
return e;
}())();
o.default = r;
cc._RF.pop();
