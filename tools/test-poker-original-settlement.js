const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const harness=require('./local-poker-harness');
for(const game of ['DDZ','GD']) {
  const h=harness(game),d=h.local;d.start(h.config);d.ready();h.queue.length=0;
  if(game==='DDZ')d._assignLandlord(0);
  const info=h.room['gameInfo'+game], types=h.load(game+'CardUtils')['e'+game+'OneHandType'];
  const bomb=game==='DDZ'?types.HardBomb:types.SiBomb;
  info.siteInfos.get(0).udpateHandCards([31,32,33,34,41]);
  if(game==='DDZ')d._applyPlay(0,[31,32,33,34],[31,32,33,34],bomb);
  else d._applyPlay(0,{type:bomb,showCards:[31,32,33,34],handCards:[31,32,33,34]});
  assert.equal(info.b_isDelay_time,true,'native bomb retention and clock-delay flag');
  if(game==='DDZ'){info.siteInfos.get(0).udpateHandCards([]);d._playCounts=[3,0,0];d._finishRound(0);}
  else {d._finished=[0,2,1,3];d._finishRound();}
  assert.equal(info.status,h.load(game+'Enum')['e'+game+'GameStatus'].SingleEnd);
  const end=h.load(game+'SingleEndData').default.getInstance();
  assert.equal(end.playerCount(),game==='DDZ'?3:4);
  assert.equal(end.playerInitCards(0).length,game==='DDZ'?17:27);
  for(let pos=0;pos<end.playerCount();pos++)assert.equal(end.playerTotal(pos),h.players[pos].score);
  if(game==='DDZ'){assert.equal(end.bChunTian(),true);assert.equal(end.bFanChun(),false);}
  else {
    assert.equal(info.endShuangShang,true);
    assert.equal(info.siteInfos.get(1).rank,0);
    assert.ok(h.events.some(e=>e[0]===h.load('GDEventKeys').default.end_shuangshang));
  }
  while(h.queue.length)h.queue.shift()();
  assert.equal(d._roundNo,1,'no timer may dismiss native settlement');
  assert.equal(d.ready(),true);assert.equal(d._roundNo,2);assert.equal(info.b_isDelay_time,false);
  assert.equal(d.ready(),false,'double-click next cannot redeal twice');
  console.log('PASS '+game+': native settlement model/status, retained cards, bomb delay, explicit next, stale timers');
}
const h=harness('DDZ');h.local.start(h.config);h.local.ready();h.local._assignLandlord(1);
h.room.gameInfoDDZ.siteInfos.get(0).udpateHandCards([31]);
h.room.gameInfoDDZ.siteInfos.get(2).udpateHandCards([]);
h.local._playCounts=[1,2,3];h.local._finishRound(2);
assert.ok(h.local._lastSettlement.deltas[0]>0);
assert.equal(h.sounds.at(-1)[0],'gameLose','match original remaining-hand verdict even if farmer teammate wins');
console.log('PASS DDZ: original teammate-win sound verdict');

const out={},timers=[];let remaining=1056,acted=0;
vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/Recovered/PokerLocalTiming.js','utf8'),{
 exports:out,require:()=>({default:{pokerVoiceDelay:()=>remaining}}),setTimeout:(fn,delay)=>timers.push({fn,delay})
});
const adapter={_roundToken:1,_roundFinished:false,isActive:()=>true};
out.schedule(adapter,'ddz',650,()=>acted++);assert.equal(timers[0].delay,650);
timers.shift().fn();assert.equal(acted,0);remaining=0;timers.shift().fn();assert.equal(acted,1);
out.schedule(adapter,'ddz',650,()=>acted++);adapter._roundToken++;timers.shift().fn();assert.equal(acted,1);
out.schedule(adapter,'ddz',650,()=>acted++);adapter._roundFinished=true;timers.shift().fn();assert.equal(acted,1);
console.log('PASS: robot waits for actual voice completion; old round and settlement cancel action');
const bundle=fs.readFileSync('cocos-client/build/web-mobile/assets/main/index.js','utf8');
assert.ok(bundle.includes('"PokerLocalTiming":[function('),'timing module must be in the served bundle, not just source tests');
assert.ok(bundle.includes('"./PokerLocalTiming":"PokerLocalTiming"'),'adapter dependency must resolve in PWA');
console.log('PASS: served bundle includes the local timing module and dependency mapping');
