const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../cocos-client/assets/Script/Recovered');
const rules=require('../server/rules');
const cc={_RF:{push(){},pop(){}},Node:function(){},Prefab:function(){},Label:function(){},
 _decorator:{ccclass:c=>c,property:()=>()=>{}}};
function load(file,mocks){const out={};vm.runInNewContext(fs.readFileSync(path.join(root,file+'.js'),'utf8'),{
 cc,module:{exports:out},exports:out,require:n=>mocks[n.slice(2)]||{default:{}}
});return out.default;}
for(const gameType of [23,24,25])for(const mode of [1,2])for(const result of ['unsupported','network','malformed','success']){
 let tips=[],removed=0,emits=0,sends=0,config={index:gameType};
 const context={gameLogic:()=>gameType===24?null:{roomConfig2Param:()=>({gameType,num:1,param1:1,param2:0})},
  uiHelper:{showTip:t=>tips.push(t),remove(){removed++;}},eventUtils:{emit(){emits++;}}};
 const club=load('ClubMsg',{gContext:{default:context},GameConn:{default:{sendMsg(proto,params,cb){
  sends++;assert.equal(proto,mode===1?149:150);
  assert.equal(rules.validateRoomConfig(params),null,'backend now accepts the added games');
  const error='测试服务端拒绝';
  if(result==='network')return cb(null,null,Error('offline'));
  if(result==='malformed')return cb(null,null,null);
  cb({res:{error:result==='success'?0:1,what:error}},null,null);
 }}}});
 club.getClubTableInfo=()=>{};
 const View=load('CreateRoomLayer',{BaseComponent:{default:function(){}},SoundUtils:{default:{clickBtn(){}}},
  gContext:{default:context},ClubMsg:{default:club},CreateRoomAssist:{default:{get:()=>config,
   getClubScheme:()=>mode,getSchemeId:()=>99,getSchemeData:()=>({color:''})}}});
 const view=new View();view._chooseGameId=gameType;view._clubId=1;
 view.onClickSave();assert.equal(tips.length,1,'every save has visible feedback');
 if(gameType===24){assert.equal(sends,0);assert.match(tips[0],/尚未接入俱乐部玩法配置/);assert.equal(removed,0);}
 else if(result==='success'){assert.equal(removed,1);assert.equal(emits,1);assert.match(tips[0],/成功/);}
 else{assert.equal(removed,0);assert.equal(emits,0);assert.match(tips[0],result==='unsupported'?/测试服务端拒绝/:/连接后重试/);}
}
const tips=[];
const View=load('CreateRoomLayer',{BaseComponent:{default:function(){}},SoundUtils:{default:{clickBtn(){}}},
 gContext:{default:{uiHelper:{showTip:t=>tips.push(t)}}},
 CreateRoomAssist:{default:{get:()=>null,getClubScheme:()=>1}}});
new View().onClickSave();assert.match(tips[0],/配置未就绪/);
console.log('PASS club save: DDZ/GD server rejection visible, TDak missing serializer guarded, add/edit success/network/malformed/config responses');
