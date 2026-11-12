const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const harness=require('./local-poker-harness');
const root=path.join(__dirname,'../cocos-client/assets/Script/Recovered');
function playerPrototype(h) {
  const out={},mocks={RoomInfoData:{default:h.room},CommonEnum:h.load('CommonEnum'),
    gContext:{default:{eventUtils:{emit:(...args)=>h.events.push(args)}}},EventKeys:h.load('EventKeys')};
  vm.runInNewContext(fs.readFileSync(path.join(root,'PlayerInfoCellData.js'),'utf8'),{
    module:{exports:out},exports:out,require:n=>mocks[n.replace('./','')]||{default:{}},cc:{_RF:{push(){},pop(){}}}
  });
  return out.default.prototype;
}
for(const base of [1,3,5])for(const multiplier of [1,2,8])for(const ranks of [[0,2,1,3],[0,1,2,3],[0,1,3,2],[1,3,0,2]]) {
  const h=harness('GD',{base,rounds:2}),d=h.local;
  d.start(h.config);d.ready();h.queue.length=0;
  assert.equal(h.room.scoreRatio,10);
  const proto=playerPrototype(h),info=h.room.gameInfoGD;
  h.players.forEach(p=>{p.updateScore=proto.updateScore;p.scoreDesc=proto.scoreDesc;});
  info.updateBetNum(multiplier);
  d._finished=ranks.slice();d._finishRound();
  const points=5-(ranks.indexOf((ranks[0]+2)%4)+1),team=ranks[0]%2;
  const end=h.load('GDSingleEndData').default.getInstance();
  for(let pos=0;pos<4;pos++) {
    const display=(pos%2===team?points:-points)*base*multiplier,raw=display*10;
    assert.equal(h.players[pos].score,raw);
    assert.equal(h.players[pos].scoreDesc(),String(display),'original avatar score formatter');
    assert.equal(info.siteInfos.get(pos).endScore/10,display,'original table floating score conversion');
    assert.equal(end.playerScore(pos)/h.room.scoreRatio,display,'single-end score conversion');
    assert.equal(end.playerTotal(pos)/h.room.scoreRatio,display,'single-end total conversion');
    assert.equal(end._players[pos].card_score,raw);
    const event=h.events.filter(([key,data])=>key===h.load('EventKeys').default.data_game_score_change&&data.pos===pos).at(-1);
    assert.equal(event[1].dt,display,'score-change event uses displayed points');
  }
  const totals=h.players.map(p=>p.score);
  d._finishRound();assert.deepEqual(h.players.map(p=>p.score),totals,'no duplicate credit');
  // A second round accumulates in the same raw unit, including final match data.
  d.ready();h.queue.length=0;info.updateBetNum(multiplier);
  h.players.forEach(p=>{p.updateScore=proto.updateScore;p.scoreDesc=proto.scoreDesc;});
  d._finished=ranks.slice();d._finishRound();
  assert.equal(d._matchFinished,true);
  assert.deepEqual(h.players.map(p=>p.score),totals.map(score=>score*2));
  const total=h.room.getTotalEndData();
  for(let pos=0;pos<4;pos++)assert.equal(total.players[pos].score(),totals[pos]*2/10,'native final-score formatter');
  assert.equal(h.players.reduce((sum,p)=>sum+p.score,0),0);
  assert.equal(d._levels[team],Math.min(14,2+points*2),'score unit must not change level upgrades');
}
const h=harness('DDZ');h.local.start(h.config);
assert.equal(h.room.scoreRatio,1,'DDZ keeps its own scoring unit');
console.log('PASS: GD 1/2/3-point finishes, both teams, base 1/3/5, multiplier 1/2/8, floating/avatar/single/final scores, two-round accumulation, no duplicate credit; upgrades and DDZ unaffected');
