const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '../cocos-client/assets/Script/Recovered');
const handlers = new Map(), snapshots = [];
const info = {is_shuCard:false,lipaiBtnStuas:false,lipaiHandCardsAry:[],
  siteInfos:{get:()=>({handCards:[31,32,41]})},status:1};
const room = {gameInfoGD:info,myAbsolutePos:()=>0,isPlayback:()=>false,isWatcher:()=>false};
const events = {on(keys,fn){for(const k of [].concat(keys))handlers.set(k,fn);},
  emit(k,data){snapshots.push({k,sorted:info.lipaiBtnStuas,y:ui.btnRoot.y});handlers.get(k)?.(k,data);}};
const mocks = {RoomInfoData:{default:room},gContext:{default:{eventUtils:events}},
  EventUtils:{eOffType:{OnDestroy:1}},GDEventKeys:{default:new Proxy({},{get:(_,k)=>k})},
  GDEnum:{eGDGameStatus:{Gameing:1,SingleEnd:2,gongpai:3}},
  GDCardUtils:{default:{lipai:()=>[[31,32],[41]]}},SoundUtils:{default:{clickBtn(){}}}};
function load(name){const exports={};vm.runInNewContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'),{
  module:{exports},exports,require:n=>mocks[n.replace('./','')]||{default:function(){}},
  cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Sprite:function(){},
    _decorator:{ccclass:c=>c,property:()=>()=>{}},v2:(x,y)=>({x,y}),winSize:{width:1280}}
});return exports.default;}
const Bottom=load('GDMyBottomUi'),ui=new Bottom();
Object.assign(ui,{shuPaiBtn:{},liPaiBtn:{},hengPai:'horizontal',shuPai:'vertical',liPai:'sort',huiFu:'restore',
  hengBtn:{},liBtn:{},btnRoot:{y:63,setPosition(p){this.y=p.y;}},cardsPointer:{initShuPaiPosition(){}}});
ui.getAllTongHuaCards=()=>{};ui._updateBoomShow=()=>{};
ui.start();
assert.equal(ui.btnRoot.y,-23,'mounted horizontal hand must restore original button height');
ui.endways();assert.equal(info.is_shuCard,true);assert.equal(ui.btnRoot.y,63);
ui.endways();assert.equal(info.is_shuCard,false);assert.equal(ui.btnRoot.y,-23);
ui.clickLiPai();assert.equal(ui.btnRoot.y,63);
ui.updateButton();assert.equal(ui.btnRoot.y,63,'sorted layout must retain original raised row');
ui.clickLiPai();assert.equal(ui.btnRoot.y,-23,'restore horizontal cards must also lower buttons');
assert.equal(snapshots.filter(s=>s.k==='data_hand_card_reset').at(-1).sorted,false,
  'reset listeners must observe the restored mode, not the previous sorted mode');
ui.endways();ui.clickLiPai();ui.clickLiPai();
assert.equal(info.is_shuCard,true);assert.equal(ui.btnRoot.y,63,'restoring vertical layout stays raised');
// The original deal animation resets mode then calls the same layout methods.
const Anim=load('GDAnimationBeginCtr'),anim=new Anim();
Object.assign(anim,{bottomUIRoot:ui,myCardsPointer:{hideAll(){},getCard:()=>({node:{width:164}})},ctrRoot:{},clockRoot:{},scheduleOnce(){}});
info.siteInfos.get=()=>({handCards:[]});info.updatebeginAnim=()=>{};
anim.play();assert.equal(info.is_shuCard,false);assert.equal(info.lipaiBtnStuas,false);assert.equal(ui.btnRoot.y,-23);
// Local rounds must match the original reset even without running the animation.
info.is_shuCard=false;info.lipaiBtnStuas=false;ui.btnRoot.y=63;
events.emit('data_hand_card_reset',{pos:0});assert.equal(ui.btnRoot.y,-23);
info.lipaiBtnStuas=false;ui.btnRoot.y=63;
events.emit('data_status_change',{o:2,n:1});assert.equal(ui.btnRoot.y,-23);
console.log('PASS: original deal reset, mount, horizontal/vertical switch, sort/restore event order and local round refresh');
