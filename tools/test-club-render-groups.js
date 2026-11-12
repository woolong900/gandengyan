const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const out={},cc={game:{groupList:['default']},Component:function(){},
  _RF:{push(){},pop(){}},_decorator:{ccclass:c=>c,menu:()=>c=>c,requireComponent:()=>c=>c}};
vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/Recovered/ScrollViewOptimization.js','utf8'),{module:{exports:out},exports:out,cc,require});
const ctr=new out.default(),child={group:'default',position:{add:()=>({x:0,y:0})},getContentSize:()=>({width:100,height:100})};
ctr._con={children:[child]};ctr._top=100;ctr._bottom=-100;ctr._left=-100;ctr._right=100;
ctr.update();assert.equal(child.group,'default','web missing groups cannot hide tables');
cc.game.groupList=['default','UI','NoRender'];ctr.update();assert.equal(child.group,'UI','native optimization retained');
child.position.add=()=>({x:1000,y:0});ctr.update();assert.equal(child.group,'NoRender');
console.log('PASS club table render groups: web fallback and native visibility culling');
