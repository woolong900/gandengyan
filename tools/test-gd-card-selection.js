const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname,'../cocos-client/assets/Script/Recovered');
const room = {gameInfoGD:{bottomCard:20},myAbsolutePos:()=>0};
const cc = {_RF:{push(){},pop(){}},Component:function(){},_decorator:{ccclass:c=>c,property:()=>()=>{}},
  color:(r,g,b)=>({r,g,b}),v2:(x,y)=>({x,y})};
const mocks = {RoomInfoData:{default:room},Loader:{default:{setImg(){}}},
  GDCardUtils:{default:{imgPath:()=>''}},gContext:{default:{eventUtils:{emit(){}}}},
  GameSoundGD:{default:{getInstance:()=>({selectCard(){},selectCardEnd(){}})}}};
function load(name) {
  const exports={};
  vm.runInNewContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'),{
    module:{exports},exports,cc,require:name=>mocks[name.replace('./','')]||{default:{}}
  });
  return exports.default;
}
const Card=load('GDMyCardItemCtr'),Touch=load('GDMyCardsTouchCtr');
function card(y=0) { const c=new Card(); const sprite={spriteFrame:'old face'}; c.node={x:0,y:0,removeAllChildren(){},getComponent(){return sprite;}}; c.initPosition(10,y); return c; }
function white(c) { assert.deepEqual(c.node.color,{r:255,g:255,b:255}); }
for(const y of [0,60,120]) {
  const c=card(y);
  c.setChoose(); assert.equal(c.node.y,y+40); white(c);
  c.setChoose(); assert.equal(c.node.y,y+40,'no cumulative lift');
  c.setNormal(); assert.equal(c.node.y,y); white(c);
  c.setChooseFocus(); assert.equal(c.node.y,y+40); white(c);
  c.initPosition(50,y+20); assert.equal(c.node.y,y+60,'relayout keeps relative lift');
  c.initCard(31); assert.equal(c.node.y,y+20,'recycled card clears previous lift'); white(c);
  assert.equal(c.node.getComponent().spriteFrame,null,'reused node clears previous face before loading');
  c.setInvalid(); c.setSelectColor(); c.cleanSelectColor(); assert.equal(c.node.color.r,67);
  c.setNormalAll(); c.setGongPaiInvalid(); c.cleanSelectColor(); assert.equal(c.node.color.r,67);
  assert.equal(c.node.y,y+20,'tribute restriction remains unchanged');
}
const cards=Array.from({length:27},()=>card()),touch=new Touch();
touch.myCardsPointer={cards,getCard:i=>cards[i]};
touch._rects=[{},{}];
touch._setSelect(0,2); assert.equal(cards[2].node.color.r,67);
touch._cleanSelect(); touch._setSelect(0,1);
touch._beginIndex=0;touch._endIndex=1;touch._touchEnd();
for(let i=0;i<3;i++){white(cards[i]);assert.equal(cards[i].node.y,i<2?40:0);}
touch._showSelect(0,1);
assert.equal(cards[0].node.y,0);assert.equal(cards[1].node.y,0);
cards[26].setSelectColor(); touch._cleanSelect(); white(cards[26]);
console.log('PASS: 40px lift, white selected cards, deselection, relayout/reuse, invalid/tribute states, drag preview cleanup, high-index vertical cards');
