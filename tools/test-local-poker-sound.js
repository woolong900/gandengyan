const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const exports_={},callbacks=[],warnings=[],played=[],music=[];let volume=.5,cached=null,now=0;
vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/Recovered/SoundUtils.js','utf8'),{
 module:{exports:exports_},exports:exports_,require:()=>({default:{}}),Date:{now:()=>now},
 cc:{_RF:{push(){},pop(){}},sys:{localStorage:{getItem:()=> '1'}},AudioClip:function(){},loader:{getRes:()=>cached,loadRes:(p,t,cb)=>callbacks.push(cb)},
 audioEngine:{getEffectsVolume:()=>volume,play:(...args)=>played.push(args),getMusicVolume:()=>volume,
 stopMusic(){},playMusic:(...args)=>music.push(args),setFinishCallback(){}}},console:{warn:(...args)=>warnings.push(args)}
});
const sound=exports_.default,clip={id:'entry'};
sound.enterRoom();assert.equal(warnings.length,0);callbacks.shift()(null,clip);assert.equal(played.length,1);
sound.enterRoom();volume=0;callbacks.shift()(null,clip);assert.equal(played.length,1);
volume=.5;sound.enterRoom();callbacks.shift()(new Error('missing'));assert.equal(warnings.length,1);assert.equal(callbacks.length,0);
cached=clip;sound.clickBtn();assert.equal(played.length,2);
cached=null;sound.playMusic('old');sound.playMusic('new');callbacks.shift()(null,clip);assert.equal(music.length,0);
callbacks.shift()(null,clip);assert.equal(music.length,1);
sound.playMusic('stopped');sound.stopMusic();callbacks.shift()(null,clip);assert.equal(music.length,1);
sound.playMusic('missing');callbacks.shift()(new Error('missing'));assert.equal(callbacks.length,0);assert.equal(warnings.length,2);
console.log('PASS: audio cache miss is not an error; loaded clips play once, loading-time mute respected, real failures logged without recursion');
console.log('PASS: background music cache miss, failed load, stopped/superseded request guards');
cached={duration:1.224};sound.playEffect('Games/gd/Sound/woman/ths');
assert.equal(sound.pokerVoiceDelay('gd'),1224);assert.equal(sound.pokerVoiceDelay('ddz'),0);
now=500;cached={duration:1};sound.playEffect('Games/gd/Sound/man/warning');
assert.equal(sound.pokerVoiceDelay('gd'),1000,'include delayed remaining-card warning');
now=1500;assert.equal(sound.pokerVoiceDelay('gd'),0);
cached=null;sound.playEffect('Games/ddz/Sound/man/JDZ');assert.equal(sound.pokerVoiceDelay('ddz'),5000);
callbacks.shift()(null,{duration:1.056});assert.equal(sound.pokerVoiceDelay('ddz'),1056);
volume=0;assert.equal(sound.pokerVoiceDelay('ddz'),0);volume=.5;
now+=1056;assert.equal(sound.pokerVoiceDelay('ddz'),0);
sound.playEffect('Games/ddz/Sound/man/JDZ');callbacks.shift()(new Error('missing'));
assert.equal(sound.pokerVoiceDelay('ddz'),0,'load failure cannot stall robots');
console.log('PASS: local voice duration tracking, asynchronous loads, delayed warnings, mute/failure release, per-game isolation');
