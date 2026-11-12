const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../cocos-client/assets/Script/Recovered');
for(const game of ['DDZ','GD'])for(const final of [false,true])for(const watcher of [false,true]) {
 let clicks=0,exits=0,readies=0,destroyed=0,totals=0,styled=0;
 const out={},room={roomId:123456,config:{gameCount:()=>5},gameInfoDDZ:{curStep:final?5:1,m_iBaseScore:1,betNum:1},isWatcher:()=>watcher};
 const mocks={RoomInfoData:{default:room},DDZSingleEndData:{default:{getInstance:()=>({time:0,playerCount:()=>0})}},
  PokerSettlementStyle:{titles:()=>[],release(){}},PokerActionButtonStyle:{applyDdzSettlement(){styled++;}},
  SoundUtils:{default:{clickBtn(){clicks++;}}},GameMsgDDZ:{default:{getInstance:()=>({ready(value){assert.equal(value,false);readies++;}})}},
  StringUtils:{default:{dateFormat:()=>''}},EventUtils:{eOffType:{OnDestroy:0}},
  gContext:{default:{eventUtils:{on(){}},msgBox:{customExitRoom(){exits++;}},
   uiHelper:{gameShow(){totals++;},show(){throw Error('Share popup must not open');}}}},
  TextureRender:{default:{screenCapture(){throw Error('Exit must not capture a screenshot');}}}};
 room.gameInfoGD=room.gameInfoDDZ;
 mocks.GDSingleEndData=mocks.DDZSingleEndData;
 mocks.GameMsgGD=mocks.GameMsgDDZ;
 vm.runInNewContext(fs.readFileSync(path.join(root,game+'SingleEndLayer.js'),'utf8'),{
  module:{exports:out},exports:out,require:n=>mocks[n.replace('./','')]||{default:{}},
  cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Label:function(){},Prefab:function(){},Button:{},
   _decorator:{ccclass:c=>c,property:()=>()=>{}}}
 });
 const view=new out.default();view.node={destroy(){destroyed++;}};
 const button={interactable:true};
 for(const name of ['btnExit','btnNext','btnShare','btnEnd','winNode','loseNode'])view[name]={active:true,getComponent:()=>button};
 for(const name of ['roomId','gameCount','baseScore','betnum','timeLabel'])view[name]={string:''};
 view.start();assert.equal(styled,1);assert.equal(view.btnExit.active,false);
 assert.equal(view.btnShare.active,true);assert.equal(view.btnNext.active,!final);assert.equal(view.btnEnd.active,final);
 assert.equal(button.interactable,!watcher);
 view.onClickShare();assert.equal(exits,1);assert.equal(clicks,1);assert.equal(destroyed,0,'keep original exit confirmation flow');
 if(final){view.onClickEnd();assert.equal(totals,1);assert.equal(readies,0);}
 else{view.onClickNext();assert.equal(readies,1);assert.equal(totals,0);}
 assert.equal(destroyed,1);assert.equal(clicks,2);
}
console.log('PASS: DDZ/GD hidden top exit, bottom serialized Share action routes to Exit confirmation, no capture/share, Continue/final summary and watcher gating retained');
