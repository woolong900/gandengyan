const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const harness=require('./local-poker-harness');
const h=harness('GD');h.local.start(h.config);h.local.ready();
const info=h.room.gameInfoGD, seat=info.siteInfos.get(0), root=path.join(__dirname,'../cocos-client');
const assets=new Set(Object.values(JSON.parse(fs.readFileSync(path.join(root,'build/web-mobile/assets/resources/config.json'))).paths).map(p=>p[0]));
const sorted=a=>Array.from(a).sort((a,b)=>a-b);
const fixture=[24,131,131,123,114,93,83,84,73,74,71,63,64,61];
const events=[];
const mocks={RoomInfoData:{default:h.room},GDCardUtils:{default:h.rules},SoundUtils:{default:{clickBtn(){}}},gContext:{default:{eventUtils:{emit:(...e)=>events.push(e)}}},GDEventKeys:{default:{lipai_btn_click:'sort',data_hand_card_reset:'reset'}}};
const out={};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/Script/Recovered/GDMyBottomUi.js'),'utf8'),{
  module:{exports:out},exports:out,require:n=>mocks[n.replace('./','')]||{default:function(){}},
  cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Sprite:function(){},_decorator:{ccclass:c=>c,property:()=>()=>{}},v2:(x,y)=>({x,y})}
});
const ui=new out.default();Object.assign(ui,{liPaiBtn:{},shuPaiBtn:{},btnRoot:{setPosition(){}},cardsPointer:{initShuPaiPosition(){}}});
const fixtures=[fixture,...Array.from({length:30},()=>h.local._deck().slice(0,27))];
for(const hand of fixtures){
  seat.udpateHandCards(hand.slice());const before=Array.from(seat.handCards);
  info.is_shuCard=false;info.lipaiBtnStuas=false;
  info.lipaiHandCardsAry=[[31,32]]; // stale view from another hand must not be reused.
  ui.clickLiPai();
  assert.deepEqual(sorted(info.lipaiHandCardsAry.flat()),sorted(before));
  assert.deepEqual(sorted(info.lipaiHandCards),sorted(before));
  assert.deepEqual(Array.from(seat.handCards),before);
  for(const card of info.lipaiHandCards){
    const compact=h.rules.imgPath(card);assert.ok(assets.has(compact),'missing compact card '+compact);
    info.lipaiBtnStuas=false;const normal=h.rules.imgPath(card);info.lipaiBtnStuas=true;
    assert.equal(compact,normal,'same card must retain rank and suit across layouts');
  }
  ui.clickLiPai();assert.deepEqual(Array.from(seat.handCards),before);
  seat.udpateHandCards(before.slice(3));ui.clickLiPai();
  assert.deepEqual(sorted(info.lipaiHandCards),sorted(before.slice(3)));
  ui.clickLiPai();
}
for(const card of [0,...h.local._deck()])for(const mode of ['horizontal','vertical','sort']){
  info.is_shuCard=mode==='vertical';info.lipaiBtnStuas=mode==='sort';
  assert.ok(assets.has(h.rules.imgPath(card)),`${card} ${mode} resource must be packaged`);
}
console.log('PASS GD: screenshot hand + 30 double-deck hands preserve every rank/suit/count through sort/restore, discard and stale cache; all layout card resources exist');
