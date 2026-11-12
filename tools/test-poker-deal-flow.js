const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const harness=require('./local-poker-harness');
for(const game of ['DDZ','GD']) {
  const h=harness(game,{manualDeal:true,rounds:12}),d=h.local,info=()=>h.room['gameInfo'+game];
  h.dealFlow.detach(d,h.dealView);
  d.start(h.config);
  assert.equal(d._phase,'waiting');
  assert.equal(d._pendingDeal,null);
  assert.equal(h.dealCallbacks.length,0,'entering room cannot deal');
  assert.equal(d.ready(),true);
  assert.equal(d._phase,'dealing');assert.equal(d._currentPos,-1);
  assert.equal(h.room.getCountDown(),0);assert.equal(h.queue.length,0);
  assert.equal(h.dealCallbacks.length,0,'first deal waits for scene mount');
  h.dealFlow.attach(d,h.dealView);h.dealFlow.attach(d,h.dealView);
  assert.equal(h.dealCallbacks.length,1,'mount is idempotent');
  const hand=info().siteInfos.get(0).handCards.slice();
  assert.equal(d.putCard(hand.slice(0,1)),false,'no play while cards are being dealt');
  const done=h.dealCallbacks.shift();done();
  assert.equal(d._phase,game==='DDZ'?'bid':'play');
  assert.equal(h.room.getCountDown(),15);
  h.load('UserData').default.second++;done();
  assert.equal(h.room.getCountDown(),14,'duplicate animation completion cannot restart timer');
  d._deal();assert.equal(d._phase,'dealing');assert.equal(h.room.getCountDown(),0);
  const stale=h.dealCallbacks.shift();d._deal();stale();
  assert.equal(d._phase,'dealing','previous round callback is ignored');
  h.dealCallbacks.shift()();
  if(game==='GD') {
    d._previousRanks=[1,3,0,2];d._deal();
    assert.equal(d._phase,'dealing','tribute cannot run during deal');
    h.dealCallbacks.shift()();assert.notEqual(d._phase,'dealing');
  }
  d._deal();const dismissed=h.dealCallbacks.shift();d.dismiss();dismissed();
  assert.equal(h.room.getCountDown(),0);assert.equal(d._currentPos,-1);
  assert.equal(d._pendingDeal,null);
}
// Run the actual native animation components against a deterministic action clock.
for(const [game,count] of [['DDZ',17],['GD',27]]) {
  const out={},jobs=[],faces=Array(count).fill(null),hand=Array.from({length:count},(_,i)=>31+i);
  let sounds=0,completed=0,now=0;
  const cards=hand.map(()=>({node:{width:164,x:0,stopAllActions(){},runAction(sequence){
    let at=0;for(const a of sequence){at+=a.duration||0;if(a.fn)jobs.push({at,fn:a.fn});}
  }}}));
  const friendPrompt={active:true};
  const pointer={node:{parent:{getChildByName:()=>friendPrompt}},getCard:i=>cards[i],hideAll(){},initPosition(){},getPosition:i=>({x:i,y:0}),setCard(i,value){faces[i]=value;}};
  const info={is_shuCard:false,lipaiBtnStuas:false,siteInfos:{get:()=>({handCards:hand})},updatebeginAnim(value){this.is_beginAnim=value;}};
  const mocks={RoomInfoData:{default:{myAbsolutePos:()=>0,['gameInfo'+game]:info}},
    [game+'CardUtils']:{[game+'_HIDE_ID']:0},['GameSound'+game]:{default:{getInstance:()=>({dealCard(){sounds++;}})}}};
  const cc={_RF:{push(){},pop(){}},Component:function(){},Node:function(){},winSize:{width:1280},
    _decorator:{ccclass:c=>c,property:()=>()=>{}},delayTime:duration=>({duration}),
    moveTo:duration=>({duration}),callFunc:fn=>({fn}),sequence:(...actions)=>actions};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../cocos-client/assets/Script/Recovered',game+'AnimationBeginCtr.js'),'utf8'),{
    module:{exports:out},exports:out,require:n=>mocks[n.replace('./','')]||{default:function(){}},cc
  });
  const anim=new out.default();Object.assign(anim,{myCardsPointer:pointer,ctrRoot:{active:true},clockRoot:{active:true},bottomUIRoot:{restEndways(){},retsLiPaiBtn(){}}});
  anim.play(()=>{completed++;assert.deepEqual(faces,hand,'all cards revealed before completion');});
  if(game==='GD') assert.equal(friendPrompt.active,false,'previous teammate prompt is cleared before any deal action');
  assert.ok(pointer._dealing);assert.equal(anim.ctrRoot.active,false);assert.equal(anim.clockRoot.active,false);
  assert.ok(faces.every(x=>x===0),'cards start face-down');
  jobs.sort((a,b)=>a.at-b.at);
  for(const job of jobs){now=job.at;job.fn();}
  assert.equal(completed,1);assert.equal(sounds,count);assert.equal(pointer._dealing,false);
  assert.equal(anim.ctrRoot.active,true);assert.equal(anim.clockRoot.active,true);
  assert.ok(Math.abs(now-(.09*(count-1)+.18+.04*count))<1e-8,'original native timing');
}
console.log('PASS: deferred scene mount, one deal per round, blocked actions/robots/timer, stale callbacks, tribute sequencing, dismissal; native 17/27-card move/flip/sound and completion after last reveal');
