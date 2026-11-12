const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const harness = require('./local-poker-harness');
const source = fs.readFileSync(path.join(__dirname, '../cocos-client/assets/Script/Recovered/DDZPosTipCtr.js'), 'utf8');
const exportsMock = {};
vm.runInNewContext(source, {
  module:{}, exports:exportsMock, require:()=>({default:{}}),
  cc:{_RF:{push(){},pop(){}},Component:function(){}, Node:function(){},Label:function(){},
    _decorator:{ccclass:c=>c,property:()=>()=>{}},
    delayTime:n=>n,callFunc:fn=>fn,sequence:(...a)=>a}
});
const tip = new exportsMock.default();
tip.scoreTip = {string:''};
function messages(h) {
  return h.events.filter(e=>e[0]==='ui_jiaodizhu_change').map(([,data])=>{
    tip._updateScore(data.otType,data.choicePhase);
    return [data.pos,tip.scoreTip.string];
  });
}
const starters=new Set(), landlords=new Set();
for(let seed=1;seed<=12;seed++) for(const bids of [[1],[0,1],[0,0,1]]) {
  const h=harness('DDZ',{seed,ids:[4,16,21,22]}), d=h.local;
  d.start(h.config);d.ready();h.queue.length=0;h.events.length=0;
  starters.add(d._currentPos);
  const expected=[];
  for(const value of bids){
    const pos=d._currentPos;
    assert.equal(d._bid((pos+1)%3,value),false,'only current seat may call');
    expected.push([pos,value?'叫地主':'不叫']);
    assert.equal(d._bid(pos,value),true);
    if(value) assert.equal(d._landlordPos,pos,'first caller is immediately landlord');
    else assert.equal(d._currentPos,(pos+1)%3);
  }
  assert.equal(d._phase,'double');
  const landlord=d._landlordPos,bet=h.room.gameInfoDDZ.betNum;
  landlords.add(landlord);
  assert.equal(bet,1,'calling does not multiply the stake');
  for(let pos=0;pos<3;pos++) {
    assert.equal(d._bid(pos,1),false,'no seat may rob after landlord is assigned');
    assert.equal(h.room.gameInfoDDZ.siteInfos.get(pos).handCards.length,pos===landlord?20:17);
  }
  for(const [index,value] of [2,0,2].entries()){
    const pos=d._currentPos;
    assert.equal(pos,(landlord+index+1)%3,'double order: next farmer, other farmer, landlord');
    assert.equal(d._double((pos+1)%3,value),false,'double choices must be sequential');
    expected.push([pos,value?'加倍':'不加倍']);
    assert.equal(d._double(pos,value),true);
  }
  assert.deepEqual(messages(h),expected);
  assert.equal(d._phase,'play');
  assert.equal(d._currentPos,landlord,'landlord leads after doubling');
  assert.equal(d._landlordPos,landlord);
  assert.equal(h.room.gameInfoDDZ.betNum,bet);
  assert.equal(h.players.filter(p=>p.deal).length,1);
  assert.equal(d.redouble(2),false);
}
assert.equal(starters.size,3,'random starting caller covers all seats');
assert.equal(landlords.size,3);
// Exercise real scheduled robots before the landlord's double.
const h=harness('DDZ',{ids:[4,16,21,22]}), d=h.local;
d.start(h.config);d.ready();h.queue.length=0;
d._beginChoice(0,'bid');d.bid(1);h.events.length=0;
h.room.gameInfoDDZ.siteInfos.get(1).udpateHandCards([31,41]);
h.room.gameInfoDDZ.siteInfos.get(2).udpateHandCards([21,170,180]);
while(d._currentPos!==0)h.queue.shift()();
assert.equal(d._phase,'double');assert.equal(d.redouble(2),true);
assert.deepEqual(messages(h),[[1,'不加倍'],[2,'加倍'],[0,'加倍']]);
const stale=harness('DDZ',{ids:[4,16,21,22]});
stale.local.start(stale.config);stale.local.ready();stale.queue.length=0;
stale.local._beginChoice(1,'bid');const oldBid=stale.queue.shift();
stale.local._bid(1,1);oldBid();
assert.equal(stale.local._phase,'double');assert.equal(stale.local._landlordPos,1);
assert.equal(stale.local._currentPos,2);
const noDouble=harness('DDZ');noDouble.local.start(noDouble.config);noDouble.local.ready();
const caller=noDouble.local._currentPos;noDouble.local._bid(caller,1);
assert.equal(noDouble.local._phase,'play');assert.equal(noDouble.local._currentPos,caller);
// A stale previous tip timer must not hide a new phase's message.
const node={stopAllActions(){this.stopped=true;},runAction(a){this.action=a;}};
tip._showAnimate(node);assert.equal(node.stopped,true);assert.equal(node.active,true);
// Existing network/replay enum text stays unchanged without local metadata.
for(const [value,text] of [[0,'不叫'],[1,'叫地主'],[2,'不加倍'],[3,'加倍']]){
  tip._updateScore(value);assert.equal(tip.scoreTip.string,text);
}
console.log('PASS DDZ: random caller, first call wins, no rob or bid multiplier, farmer/farmer/landlord doubling, robots, stale callbacks, no-double option, visible text');
