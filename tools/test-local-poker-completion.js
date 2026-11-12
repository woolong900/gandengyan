const assert = require('node:assert/strict');
const harness = require('./local-poker-harness');

// Actual original models and rules, including bidding/doubling and all rounds.
for (const game of ['DDZ','GD']) {
  for(let seed=1;seed<=6;seed++) {
    const h=harness(game,{seed,rounds:4,base:2,ids:game==='DDZ'?[4,16,21,22]:[4,25,54]});
    const {local,room,queue,players,rules}=h;
    assert.equal(local.start(h.config),true);
    assert.equal(local.ready(),true);
    let steps=0, botPlays=0, tributeTurns=0, completed=0, lastCompleted=0;
    const apply=local._applyPlay;
    local._applyPlay=function(pos,...args){if(pos)botPlays++;return apply.call(this,pos,...args);};
    while(!local._matchFinished && steps++<6000) {
      if(local._roundFinished){
        if(lastCompleted!==local._roundNo){completed++;lastCompleted=local._roundNo;}
        while(queue.length)queue.shift()();
        assert.equal(local._roundNo,lastCompleted,'settlement waits for the user');
        assert.equal(local.ready(),true);continue;
      }
      const pos=local._currentPos;
      if(local._phase==='bid'){assert.equal(local._bid(pos,1),true);queue.length=0;}
      else if(local._phase==='double'){assert.equal(local._double(pos,pos===1?0:2),true);queue.length=0;}
      else if(local._phase==='tribute'){
        const task=local._tributeTasks[0];
        assert.equal(local.putCard([31],[31],1),false);
        assert.equal(local._supply(pos,999),false);
        assert.equal(local._supply(pos,local._tributeOptions(pos,task.returning)[0]),true);
        tributeTurns++;queue.length=0;
      } else if(pos!==0) {
        // Exercise the real scheduled robot callback, including phase guards.
        assert.ok(queue.length,game+' missing bot timer');queue.shift()();
      } else {
        const info=room['gameInfo'+game],hand=info.siteInfos.get(0).handCards;
        let play;
        if(game==='GD')play=local._choosePlay(hand);
        else {
          const cards=local._lastPutPos<0?local._leadCards(hand):local._tipResponse(hand);
          if(cards.length)play=local._makePlay(cards,local._lastPutType,local._lastPutCards);
        }
        if(play)assert.equal(local.putCard(play.showCards,play.handCards,play.type),true);
        else assert.equal(local.pass(),true);
      }
      // Clearing choice/tribute callbacks above also removes the new bot's
      // callback; restore only the active play turn's scheduling when needed.
      if(!queue.length && !local._roundFinished && local._phase==='play' && local._currentPos!==0) local._startTurn(local._currentPos);
      const hands=Array.from({length:players.length},(_,p)=>room['gameInfo'+game].siteInfos.get(p).handCards);
      assert.ok(hands.every(cards=>cards.length<=(game==='GD'?27:20)));
      assert.equal(players.reduce((sum,p)=>sum+p.score,0),0);
    }
    assert.ok(local._matchFinished,game+' must finish the configured match');
    assert.equal(local._roundNo,4);
    assert.equal(completed,3);
    assert.ok(botPlays>0);
    if(game==='GD')assert.ok(tributeTurns>0);
    assert.ok(room.getTotalEndData().isNormalEnd);
    assert.equal(room.getTotalEndData().players.length,players.length);
    assert.equal(h.summaries.length,0,'use original total-end UI, not a generic message box');
    assert.equal(local.ready(),false);
    while(queue.length)queue.shift()();
    assert.equal(local._roundNo,4,'old timers must not start an extra round');
    local.dismiss();assert.equal(local.isActive(),false);
  }
  console.log('PASS '+game+': 6 four-round matches; real models, choices, bot timers, zero-sum base/multiplier scoring, round limit and exit');
}

const h=harness('DDZ'),{local,room,queue}=h;
local.start(h.config); local.ready(); local._assignLandlord(0);queue.length=0;
const seat=room.gameInfoDDZ.siteInfos.get(0);
seat.udpateHandCards([31,41,51,61,71]);
assert.equal(local.putCard([81],[81],1),false);
assert.equal(local.putCard([31,31],[31,31],2),false);
assert.equal(local.putCard([31],[31],16),false);
assert.equal(local.putCard([41],[31],1),false);
assert.equal(local.putCard([31,41],[31,41],2),false);
assert.equal(local.pass(),false);
assert.equal(local.putCard([31],[31],1),true);
assert.equal(local.putCard([41],[41],1),false);
local._currentPos=0;local._lastPutCards=[81];local._lastPutType=1;local._lastPutPos=1;
assert.equal(local.putCard([41],[41],1),false);
assert.equal(seat.handCards.length,4);
local.dismiss();while(queue.length)queue.shift()();assert.equal(local.isActive(),false);
console.log('PASS DDZ: missing/duplicate/forged/illegal/undertrick cards and repeat/out-of-turn actions rejected');

for(const [game,ids] of [['DDZ',[5]],['DDZ',[6]],['DDZ',[7]],['GD',[5]],['GD',[6]]]) {
 const x=harness(game,{ids});assert.equal(x.local.start(x.config),false);assert.equal(x.room.roomId,0);assert.ok(x.tips.length);
}
console.log('PASS: unsupported variants rejected before room mutation, with an explicit explanation');

// Exact scores rather than only zero-sum: configured base, 6-bomb cap,
// independent farmer doubles, spring and reverse spring.
for(const capped of [true,false]) {
 const x=harness('DDZ',{base:2,ids:capped?[4,16,21]:[4,16]});
 const d=x.local;d.start(x.config);d.ready();d._assignLandlord(1);x.queue.length=0;
 for(let b=0;b<7;b++){
   x.room.gameInfoDDZ.siteInfos.get(1).udpateHandCards([31,32,33,34,41]);
   d._applyPlay(1,[31,32,33,34],[31,32,33,34],16);x.queue.length=0;
 }
 assert.equal(x.room.gameInfoDDZ.boomNum,7);
 assert.equal(x.room.gameInfoDDZ.betNum,capped?64:128);
 d._playCounts=[1,7,1];d._doubles=[2,2,1];d._finishRound(1);
 const unit=2*(capped?64:128);
 assert.deepEqual(Array.from(d._lastSettlement.deltas),[-unit*4,unit*6,-unit*2]);
}
for(const [winner,counts] of [[0,[3,0,0]],[1,[1,3,2]]]) {
 const x=harness('DDZ',{base:1.5});const d=x.local;d.start(x.config);d.ready();d._assignLandlord(0);
 d._playCounts=counts;d._finishRound(winner);
 assert.equal(d._lastSettlement.spring,true);
 assert.deepEqual(Array.from(d._lastSettlement.deltas),winner===0?[6,-3,-3]:[-6,3,3]);
}
const allPass=harness('DDZ');allPass.local.start(allPass.config);allPass.local.ready();
for(let p=0;p<3;p++)assert.equal(allPass.local._bid(allPass.local._currentPos,0),true);
while(allPass.local._roundFinished)allPass.queue.shift()();
assert.equal(allPass.local._roundNo,1);assert.equal(allPass.local._phase,'bid');
console.log('PASS DDZ: 6-bomb cap on/off, decimal base, unequal doubles, spring/reverse spring, all-pass redeal without consuming a round');

// Classic single/double tribute, anti-tribute, upgrades, strict selection and
// card conservation through the original seat mutation and UI statuses.
for(const ranks of [[0,1,2,3],[0,2,1,3]]) {
 const x=harness('GD',{base:3,ids:[4,24,54]}),d=x.local;d.start(x.config);d.ready();
 d._finished=ranks;d._finishRound();
 assert.equal(d._levels[0],ranks[1]===2?6:4);
 assert.equal(x.players[0].score,(ranks[1]===2?3:2)*3*10);
 d._deal();x.queue.length=0;
 let count=0;
 while(d._phase==='tribute') {
   const task=d._tributeTasks[0],options=d._tributeOptions(task.pos,task.returning);
   const before=x.room.gameInfoGD.siteInfos.get(task.pos).handCards.slice();
   assert.equal(d._supply(task.pos,999),false);
   assert.equal(d._supply(task.pos,options[0]),true);count++;
   const held=d._tributePairs.filter(p=>p.card!=null).length;
   const hands=[0,1,2,3].map(p=>x.room.gameInfoGD.siteInfos.get(p).handCards);
   assert.equal(hands.reduce((n,h)=>n+h.length,held),108);
   assert.ok(hands.every(h=>h.length<=27));
 }
 assert.equal(count,ranks[1]===2?4:2);
 assert.equal(x.room.gameInfoGD.GongPaiStaus,0);
 assert.equal(d._phase,'play');
}
const anti=harness('GD');anti.local.start(anti.config);anti.local.ready();anti.local._previousRanks=[0,1,2,3];
anti.room.gameInfoGD.siteInfos.get(3).udpateHandCards([180,180,31]);
anti.local._prepareTribute();assert.equal(anti.local._phase,'play');assert.equal(anti.local._currentPos,0);
console.log('PASS GD: base/upgrade (double-down +4), single/double tribute, anti-tribute, exchange conservation and return to play');

// Fixed +5 kicks and fixed-size all-in are distinct operations; a 30 raise is
// unavailable at price 41, rather than accepting an underpayment of 30.
const E=require('../cocos-client/assets/Script/TDak/TDakLocalEngine'),A=E.ACTION;
const g=E.createGame({players:3,allInMultiple:30});E.startRound(g);E.act(g,A.ADD,40);
assert.equal(E.legalActions(g).includes(A.ALL_IN),false);
assert.throws(()=>E.act(g,A.ALL_IN));
E.act(g,A.FOLLOW);E.act(g,A.FOLLOW);assert.equal(g.dealStage,4);
E.act(g,A.ALL_IN);assert.equal(g.currentBet,30);
E.act(g,A.FOLLOW);E.act(g,A.FOLLOW);assert.equal(g.dealStage,5);
E.act(g,A.KICK);assert.equal(g.currentBet,5);E.act(g,A.KICK_BACK);assert.equal(g.currentBet,10);
console.log('PASS TDak: reject underpayment/all-in repeat, reset response states, follow and fixed +5 kicks');
