const assert = require('node:assert/strict');
const {ClubPokerRound} = require('../server/club-poker-round');
const rules = require('../server/club-poker-rules');
for (const type of [23,25,24]) {
  const config=rules.parse(type,type===25?1011001:type===24?35:1001,0);
  const seats=Array.from({length:config.人数},(_,i)=>({player:{uid:100+i,nickname:'玩家'+i},score:0,ready:true}));
  let result,events=[];
  const table={gameType:type,step:1,host:{now:()=>Date.now()}};
  const io={table,all:(h,d)=>events.push([h,d]),one:(s,h,d)=>events.push([h,d]),each(h,fn){for(let s=0;s<seats.length;s++)events.push([h,fn(s)]);},over:r=>result=r};
  let round=new ClubPokerRound(seats,{config},io);round.start();
  assert.match(round.handleAction((round.current()+1)%seats.length,'gameguo',{}),/尚未/);
  for(let step=0;!round.over&&step<1500;step++) {
    if(step%7===0){
      const snap=round.snapshot(0),dump=JSON.parse(JSON.stringify(round.dump()));
      round=ClubPokerRound.restore(dump,seats,io,config);
      assert.deepEqual(JSON.parse(JSON.stringify(round.snapshot(0))),JSON.parse(JSON.stringify(snap)),'restore snapshot');
    }
    const snapshot=round.snapshot(0);
    if(type!==24)assert.ok(snapshot.players.slice(1).every(p=>!p.card.hand_card.length),'private hands');
    const error=round.autoPlay(round.current());
    assert.equal(error,null,`type ${type} autoplay step ${step}: ${error}`);
  }
  assert.ok(round.over,`type ${type} completes`);assert.ok(result);assert.equal(result.scores.reduce((a,b)=>a+b,0),0);
  console.log('PASS authoritative round / private hands / restore / settlement',type);
}
