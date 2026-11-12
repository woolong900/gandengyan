const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../cocos-client');
const out={},callbacks=[];
function Sprite(){};Sprite.SizeMode={CUSTOM:0};Sprite.Type={SIMPLE:0};
function Widget(){};
function Label(){};Label.HorizontalAlign={CENTER:1};Label.VerticalAlign={CENTER:1};
function Node(){this.getComponent=()=>this.label;this.addComponent=()=>this.label={};this.setContentSize=(w,h)=>this.size=[w,h];}
const cc={_RF:{push(){},pop(){}},Component:function(){},Node,Prefab:function(){},Camera:function(){},
 _decorator:{ccclass:c=>c,property:()=>()=>{}},Sprite,Widget,Label,color:(...v)=>v,Texture2D:function(){},
 isValid:n=>!!n&&!n.destroyed,
 SpriteFrame:function(texture){this.texture=texture;this.destroy=function(){this.destroyed=true;};},
 loader:{loadRes(name,type,cb){callbacks.push({name,cb});}}
};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/Script/Recovered/GDGameControl.js'),'utf8'),{
 module:{exports:out},exports:out,cc,
 require:n=>n==='./PokerDealFlow'?{detach(){}}:{default:{}},sp:{Skeleton:function(){}}
});
function node(){return {active:false,title:{active:false,getChildByName(){return this.child;},addChild(n){this.child=n;},getComponent(t){return t===Sprite?this.sprite:this.label;},sprite:{enabled:true},addComponent(){throw Error('second render component on sprite node');},setContentSize(w,h){this.size=[w,h];}},getChildByName(){return this.title;},sprite:{spriteFrame:'old'},getComponent(t){return t===Sprite?this.sprite:this.widget;},
 addComponent(){return this.widget={updateAlignment(){this.updated=true;}};},
 setScale(x,y){this.scale=[x,y];},setPosition(x,y){this.position=[x,y];},setContentSize(w,h){this.size=[w,h];}};}
function view(){const v=new out.default();v.node={};v.bg_node_one=node();v.bg_node_two=node();return v;}
const scenes=JSON.parse(fs.readFileSync(path.join(root,'assets/resources/Games/wsk/Scene/SceneWSK.fire')));
const v=view();v.changeBg();v.changeBg();assert.equal(callbacks.length,2,'deduplicate in-flight changes');
const pending=callbacks.splice(0);
for(let i=0;i<2;i++){
 const ext=i===0?'.jpg':'.png';
 const meta=JSON.parse(fs.readFileSync(path.join(root,'assets/resources',pending[i].name+ext+'.meta')));
 const bg=scenes.find(n=>n._name===`bg${i+1}`);
 assert.equal(Object.values(meta.subMetas)[0].uuid,bg._components[0]._spriteFrame.__uuid__,'exact WSK art');
}
pending[1].cb(null,'table');assert.equal(v.bg_node_two.sprite.spriteFrame,'old','atomic two-layer switch');
pending[0].cb(null,'room');
assert.deepEqual(v.bg_node_one.size,[1700,720]);assert.deepEqual(v.bg_node_one.position,[0,0]);
assert.deepEqual(v.bg_node_two.size,[1280,673]);assert.deepEqual(v.bg_node_two.position,[0,-23.5]);
assert.equal(v.bg_node_one.active,true);assert.equal(v.bg_node_two.active,true);
assert.equal(v.bg_node_one.sprite.spriteFrame.texture,'room');
assert.equal(v.bg_node_two.sprite.spriteFrame.texture,'table');
assert.equal(v.bg_node_two.widget.isAlignRight,true);assert.equal(v.bg_node_two.widget.bottom,0);
assert.equal(v.bg_node_two.widget.updated,true);
assert.equal(v.bg_node_two.title.active,true);assert.equal(v.bg_node_two.title.y,135.5);
assert.equal(v.bg_node_two.title.sprite.enabled,false,'never display the inherited PDK title');
assert.equal(v.bg_node_two.title.child.label.string,'元来掼蛋');
v.changeBg();assert.equal(callbacks.length,0,'settings refresh does not restore the old skin');
v.onDestroy();assert.ok(v._wskBackgroundFrames.every(f=>f.destroyed));
const failed=view();failed.changeBg();callbacks.shift().cb(Error('offline'));callbacks.shift().cb(null,'table');
assert.equal(failed.bg_node_one.sprite.spriteFrame,'old');assert.equal(failed._wskBackgroundLoading,false);
failed.changeBg();assert.equal(callbacks.length,2,'failed loads can retry');
failed.node.destroyed=true;callbacks.splice(0).forEach(c=>c.cb(null,'late'));
assert.equal(failed.bg_node_two.sprite.spriteFrame,'old','late callbacks cannot touch destroyed scenes');
console.log('PASS GD background: exact two WSK assets, original geometry/widget, atomic load, retry, lifecycle and no skin reversion');
