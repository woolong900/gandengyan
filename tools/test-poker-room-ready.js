const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const harness=require('./local-poker-harness');
for(const game of ['DDZ','GD']) {
  const h=harness(game,{manualDeal:true}),d=h.local,room=h.room;
  room.isWatcher=()=>false;
  assert.equal(d.start(h.config),true);
  const info=()=>room['gameInfo'+game];
  const statuses=h.load(game+'Enum')['e'+game+'GameStatus'];
  function assertWaiting() {
    assert.equal(d._phase,'waiting');assert.equal(d._roundNo,0);
    assert.equal(info().status,statuses.Free);assert.equal(info().curStep,0);
    assert.equal(room.myPlayerData().isReady(),false);
    assert.ok(h.players.slice(1).every(p=>p.isReady()));
    assert.ok(h.players.every(p=>info().siteInfos.get(p.pos).handCards.length===0));
    assert.equal(room.getCountDown(),0);assert.equal(d._currentPos,-1);
    assert.equal(d._pendingDeal,null);
  }
  assertWaiting();
  while(h.queue.length)h.queue.shift()();
  assertWaiting();assert.equal(h.dealCallbacks.length,0);
  assert.equal(d.pass(),false);assert.equal(d.putCard([31],[31],1),false);
  // Exercise the actual native table controller's visibility and Ready handler.
  const out={},mock={RoomInfoData:{default:room},[game+'Enum']:h.load(game+'Enum'),
    ['GameMsg'+game]:{default:{getInstance:()=>({ready:()=>d.ready()})}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../cocos-client/assets/Script/Recovered',game+'TableBtnCtr.js'),'utf8'),{
    exports:out,module:{exports:out},require:n=>mock[n.replace('./','')]||{default:{}},
    cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Prefab:function(){},
      _decorator:{ccclass:c=>c,property:()=>()=>{}}}
  });
  const view=new out.default();
  for(const name of ['btnInvite','btnReady','btnClubInvite','btnClubOnline','shareEnd','next','gameend'])view[name]={active:false};
  view.updateUI();assert.equal(view.btnReady.active,true);
  view.onClickReady();view.updateUI();assert.equal(view.btnReady.active,false);
  assert.equal(d._phase,'dealing');assert.equal(d._roundNo,1);
  assert.equal(h.dealCallbacks.length,1);assert.equal(d.ready(),false);
  assert.ok(h.players.every(p=>!p.isReady()),'ready icons clear when dealing begins');
  assert.equal(info().siteInfos.get(0).handCards.length,game==='DDZ'?17:27);
  const oldDone=h.dealCallbacks.shift();oldDone();
  assert.equal(d._phase,game==='DDZ'?'bid':'play');
  assert.equal(room.getCountDown(),15);
  const oldJobs=h.queue.splice(0);
  d.start(h.config);oldDone();oldJobs.forEach(fn=>fn());
  assertWaiting();view.updateUI();assert.equal(view.btnReady.active,true);
  assert.equal(d.ready(),true);const staleDeal=h.dealCallbacks.shift();
  d.start(h.config);staleDeal();assertWaiting();
  d.dismiss();assert.equal(d.ready(),false);
  console.log('PASS '+game+': native Ready button, empty waiting room, idle timer, explicit first deal, duplicate click, reopening/stale callbacks, exit');
}
