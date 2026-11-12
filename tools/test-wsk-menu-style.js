const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const scene = JSON.parse(read('cocos-client/assets/resources/Games/wsk/Scene/SceneWSK.fire'));
const meta = JSON.parse(read('cocos-client/assets/resources/_RecoveredDependencies/Textures/1ee0cabd5.png.meta')).subMetas;
const components = scene.flatMap(n => n._components || []).map(c => c.__id__ === undefined ? c : scene[c.__id__]);
const saved = components.find(c => c.popMenu && c.btnBack);
const cc = {_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Prefab:function(){},Layout:'layout',
  _decorator:{ccclass:c=>c,property:()=>()=>{}},
  Sprite:{SizeMode:{CUSTOM:0},Type:{SIMPLE:0}}, rect:(x,y,width,height)=>({x,y,width,height}),
  v2:(x,y)=>({x,y}),size:(width,height)=>({width,height}),
  SpriteFrame:function(texture,rect,rotated,offset,size){Object.assign(this,{texture,rect,rotated,offset,size});this.getTexture=()=>texture;this.destroy=()=>{this.destroyed=true;};}};
const out={};vm.runInNewContext(read('cocos-client/assets/Script/Recovered/WSKMeanLayer.js'),{
  module:{exports:out},exports:out,cc,require:()=>({default:{}})
});
const nodes=new Map();let layoutUpdates=0;
function node(id){
  if(nodes.has(id))return nodes.get(id);
  const data=scene[id],comps=(data._components||[]).map(c=>c.__id__===undefined?c:scene[c.__id__]);
  const art=comps.find(c=>c.__type__==='cc.Sprite');
  const texture={uuid:art&&art._spriteFrame.__uuid__};
  const sprite=art&&{sizeMode:art._sizeMode,spriteFrame:{getTexture:()=>texture}};
  const result={name:data._name,active:data._active!==false,position:data._position,anchor:data._anchorPoint,
    getComponent(type){return type===cc.Sprite?sprite:type===cc.Layout?{updateLayout(){layoutUpdates++;}}:null;},
    getChildByName(name){const ref=(data._children||[]).find(r=>scene[r.__id__]._name===name);return ref&&node(ref.__id__);},
    setContentSize(w,h){this.width=w;this.height=h;}};
  nodes.set(id,result);return result;
}
const view=new out.default();view.popMenu=node(saved.popMenu.__id__);view.btnBack=node(saved.btnBack.__id__);
view.restoreMenuButtonFrames();
const drawer=view.popMenu.getChildByName('sz_db'),buttons=drawer.getChildByName('Btns');
assert.equal(drawer.width,450);assert.equal(drawer.height,720);
const specs={BtnExit:'wsk_tc',BtnJS:'wsk_js',BtnQZJS:'wsk_force_destroy',BtnLocation:'wsk_dw',BtnSetting:'wsk_sz'};
for(const [name,key]of Object.entries(specs)){
  const button=buttons.getChildByName(name),sprite=button.getComponent(cc.Sprite),frame=sprite.spriteFrame,m=meta[key];
  assert.equal(frame.rect.x,m.trimX);assert.equal(frame.rect.y,m.trimY);
  assert.equal(frame.rect.width,m.width);assert.equal(frame.rect.height,m.height);
  assert.equal(frame.rotated,m.rotated);assert.equal(frame.offset.x,0);assert.equal(frame.offset.y,0);
  assert.equal(button.width,m.width);assert.equal(button.height,57);assert.equal(sprite.sizeMode,cc.Sprite.SizeMode.CUSTOM);
}
assert.equal(view.btnBack.width,127);assert.equal(view.btnBack.getComponent(cc.Sprite).spriteFrame.rotated,false);
assert.equal(layoutUpdates,1);assert.equal(view._menuFrames.length,7);
view.restoreMenuButtonFrames();assert.equal(view._menuFrames.length,7,'no duplicate frame allocation');
// Keep all original SCALE press transitions, handlers and ownership rules.
for(const ref of scene[scene[saved.popMenu.__id__]._children[0].__id__]._children){
  for(const r of scene[ref.__id__]._children||[]){
    const b=scene[r.__id__]._components.find(c=>c.__type__==='cc.Button');
    assert.equal(b.transition,3);assert.equal(b.zoomScale,.95);assert.ok(b.clickEvents[0].handler);
  }
}
const owned=view._menuFrames.slice();view.onDestroy();assert.ok(owned.every(f=>f.destroyed));
assert.ok(read('cocos-client/build/web-mobile/assets/main/index.js').includes('WSK uses its own atlas (1ee0cabd5)'));
console.log('PASS WSK menu: original atlas rectangles for all 6 buttons, 450x720 drawer, original press/handlers preserved, no duplicate allocation, bundled fix');
