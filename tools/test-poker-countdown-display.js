const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const harness = require('./local-poker-harness');
for (const game of ['GD', 'DDZ']) {
  const exports = {}, room = {getCountDown: () => 0};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../cocos-client/assets/Script/Recovered', game+'PosClockCtr.js'), 'utf8'), {
    module:{exports}, exports,
    require:n => n === './RoomInfoData' ? {default:room} : {default:function(){}},
    cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Label:function(){},
      _decorator:{ccclass:c=>c,property:()=>()=>{}}}
  });
  const view = new exports.default();
  let dirty = 0;
  view.rootNode = {active:false};
  view.timeLabel = {enabled:false,node:{active:false},string:'0',setVertsDirty(){dirty++;}};
  view._resetShow();
  assert.equal(view.rootNode.active,true);
  assert.equal(view.timeLabel.enabled,true);
  assert.equal(view.timeLabel.node.active,true);
  assert.ok(dirty>=1,'same-value zero must rebuild bitmap geometry on reactivation');
  for (const value of [NaN,undefined,Infinity,-Infinity,-1]) {
    view._writeTime(value); assert.equal(view.timeLabel.string,'0');
  }
  for(let value=180;value>=0;value--) {
    view._writeTime(value); assert.equal(view.timeLabel.string,String(value));
  }
  view._writeTime(2.2); assert.equal(view.timeLabel.string,'3');
}
for (const [option,seconds] of [[0,15],[42,30],[43,60],[44,120],[45,180]]) {
  const h=harness('DDZ',{ids:[4,16,21,22,option]}), d=h.local, user=h.load('UserData').default;
  d.start(h.config);d.ready();h.queue.length=0;
  assert.equal(h.room.getCountDown(),seconds);
  for (const [phase,pos] of [['bid',1],['double',2]]) {
    user.second += 7;
    const site=h.room.gameInfoDDZ.siteInfos.get(pos), original=site.jiaoDiZhu;
    site.jiaoDiZhu=function(...args){assert.equal(h.room.getCountDown(),seconds);return original.apply(this,args);};
    d._beginChoice(pos,phase);
    assert.deepEqual(h.players.map(p=>p.isTurn),[0,1,2].map(p=>p===pos));
  }
  user.second += 8; d._startTurn(0); assert.equal(h.room.getCountDown(),seconds);
  user.second++; assert.equal(h.room.getCountDown(),seconds-1);
  d.dismiss(); assert.equal(h.room.getCountDown(),0); assert.ok(h.players.every(p=>!p.isTurn));
}
console.log('PASS: GD/DDZ numeric glyph input, same-value reactivation, 180→0, enabled digit node; DDZ call/rob/double/play deadlines and exit cleanup');
