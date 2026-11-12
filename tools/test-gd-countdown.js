const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const harness=require('./local-poker-harness');
function view(h,pos=0){
  const out={},mocks={RoomInfoData:{default:h.room},GDEnum:h.load('GDEnum'),GameSoundGD:{default:{getInstance:()=>({clock(){}})}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../cocos-client/assets/Script/Recovered/GDPosClockCtr.js'),'utf8'),{
    module:{exports:out},exports:out,require:n=>mocks[n.replace('./','')]||{default:function(){}},
    cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Label:function(){},_decorator:{ccclass:c=>c,property:()=>()=>{}}}
  });
  const clock=new out.default();Object.assign(clock,{timeLabel:{string:''},rootNode:{active:false},buttonRoot:{active:false},posCtr:{uiPos:pos,deskPos:()=>pos}});return clock;
}
for(const [option,seconds] of [[0,15],[42,30],[43,60],[44,120],[45,180]]){
  const h=harness('GD',{ids:[4,24,53,option]}),d=h.local,user=h.load('UserData').default;
  d.start(h.config);d.ready();h.queue.length=0;
  assert.equal(h.room.getCountDown(),seconds,'opening turn initializes original duration');
  const clock=view(h);clock._reset();clock.lateUpdate();assert.equal(clock.timeLabel.string,String(seconds));
  user.second++;clock._updateTime();assert.equal(clock.timeLabel.string,String(seconds-1));
  // Sort/layout refreshes only read the same deadline; never restart it.
  clock._reset();clock.lateUpdate();assert.equal(clock.timeLabel.string,String(seconds-1));
  user.second+=seconds+10;clock._updateTime();assert.equal(clock.timeLabel.string,'0');
  const site=h.room.gameInfoGD.siteInfos.get(1),turn=site.turn;
  site.turn=function(...args){assert.equal(h.room.getCountDown(),seconds,'deadline precedes turn UI notification');return turn.apply(this,args);};
  d._startTurn(1);assert.equal(h.room.getCountDown(),seconds);
  assert.deepEqual(h.players.map(p=>p.isTurn),[false,true,false,false]);
  // Tribute has its own fresh action deadline too.
  d._tributeTasks=[{pos:0,to:1,returning:false,pair:{}}];d._nextTribute();
  clock._reset();clock.lateUpdate();assert.equal(clock.rootNode.active,true);assert.equal(clock.timeLabel.string,String(seconds));
  user.second+=2;clock._updateTime();assert.equal(clock.timeLabel.string,String(seconds-2));
  d._finished=[0,2,1,3];d._finishRound();
  assert.equal(h.room.getCountDown(),0);assert.ok(h.players.every(p=>!p.isTurn));clock._reset();clock.lateUpdate();assert.equal(clock.rootNode.active,false);
  d.dismiss();while(h.queue.length)h.queue.shift()();assert.equal(h.room.getCountDown(),0);
}
console.log('PASS GD: native 15/30/60/120/180 durations, visible ticking text, layout preserves deadline, turn resets before event, tribute, zero clamp, end/exit timer cleanup');
