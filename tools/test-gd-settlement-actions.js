const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
let clicks=0,exits=0,readies=0,invites=0;
const out={},mocks={
 SoundUtils:{default:{clickBtn(){clicks++;}}},
 GameMsgGD:{default:{getInstance:()=>({ready(value){assert.equal(value,false);readies++;}})}},
 gContext:{default:{msgBox:{customExitRoom(){exits++;}},uiHelper:{show(){invites++;}}}},
 WindowConfig:{eWindowID:{ShareLayer:1}},ShareLayer:{eShareUIType:{ShareGameInvite:2}},
 TextureRender:{default:{screenCapture(){throw Error('Exit must not capture a screenshot');}}}
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../cocos-client/assets/Script/Recovered/GDTableBtnCtr.js'),'utf8'),{
 module:{exports:out},exports:out,require:n=>mocks[n.replace('./','')]||{default:{}},
 cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Prefab:function(){},
 _decorator:{ccclass:c=>c,property:()=>()=>{}}}
});
const view=new out.default();
view.shareEnd={active:true};view.next={active:true};
view.onClickShare();
assert.equal(exits,1);assert.equal(clicks,1);assert.equal(invites,0);
assert.equal(view.shareEnd.active,true,'keep settlement visible until exit confirmation');
view.onClickNext();
assert.equal(readies,1);assert.equal(clicks,2);
assert.equal(view.shareEnd.active,false);assert.equal(view.next.active,false);
view.onClickInvite();view.onClickClubInvite();
assert.equal(invites,2,'ordinary/club invites still share invitations');
assert.equal(exits,1);
console.log('PASS GD table settlement: Exit confirmation, Continue readiness, invitation sharing unchanged');
