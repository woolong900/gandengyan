const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const out={},listeners={},types={Null:0,JiaoDiZhu:1,Turn:2},sites=[{roundType:0},{roundType:0},{roundType:0}];
const keys={data_round_data_update:'round',ui_jiaodizhu_change:'choice'};
const mocks={gContext:{default:{eventUtils:{on(key,fn){(listeners[key] ||= []).push(fn);}}}},
  DDZEventKeys:{default:keys},EventUtils:{eOffType:{OnDestroy:1}},
  DDZEnum:{eRoundTypeDDZ:types},RoomInfoData:{default:{gameInfoDDZ:{siteInfos:{get:pos=>sites[pos]}}}}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../cocos-client/assets/Script/Recovered/DDZPosTipCtr.js'),'utf8'),{
  module:{exports:out},exports:out,require:name=>mocks[name.replace('./','')]||{default:{}},
  cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Label:function(){},
    _decorator:{ccclass:c=>c,property:()=>()=>{}},delayTime:n=>n,callFunc:f=>f,sequence:(...a)=>a}
});
const emit=(key,data)=>listeners[key].forEach(fn=>fn(null,data));
for(let pos=0;pos<3;pos++) {
  const node={x:20,y:53.681,active:false,stopAllActions(){this.stopped=true;},runAction(a){this.action=a;},
    setPosition(){throw Error('choice tips must not be repositioned');}};
  const tip=new out.default();tip.posCtr={uiPos:pos,deskPos:()=>pos};tip.scoreTip={node,string:''};tip.start();
  assert.equal(tip.lateUpdate,undefined,'no per-frame dynamic avoidance');
  for(const [value,text] of [[1,'叫地主'],[0,'不叫'],[3,'加倍'],[2,'不加倍']]) {
    emit('choice',{pos,otType:value,choicePhase:'call'});
    assert.equal(node.active,true);assert.equal(tip.scoreTip.string,text);
    assert.equal(node.y,53.681);
    sites[pos].roundType=types.Null;emit('round',{pos});
    assert.equal(node.active,true,'completing a choice preserves its result');
    emit('round',{pos:(pos+1)%3});assert.equal(node.active,true,'another seat cannot clear this result');
    sites[pos].roundType=types.JiaoDiZhu;emit('round',{pos});
    assert.equal(node.active,false,'next choice clears stale result before buttons appear');
    emit('choice',{pos,otType:value});sites[pos].roundType=types.Turn;emit('round',{pos});
    assert.equal(node.active,false,'play turn clears stale double result');
    assert.equal(node.y,53.681);
  }
}
console.log('PASS DDZ: fixed native tip positions, no dynamic avoidance, stale results cleared on next choice/play, other seats unaffected');
