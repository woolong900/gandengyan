const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root='cocos-client/assets/resources/_RecoveredDependencies/Textures/';
const titles=JSON.parse(fs.readFileSync(root+'1963cdbbd.png.meta')).subMetas;
const roles=JSON.parse(fs.readFileSync(root+'147d4cd62.png.meta')).subMetas;
const out={},texture={};
const cc={Sprite:{SizeMode:{CUSTOM:0},Type:{SIMPLE:0}},
 rect:(x,y,width,height)=>({x,y,width,height}),v2:(x,y)=>({x,y}),size:(width,height)=>({width,height}),
 SpriteFrame:function(tex,rect,rotated,offset,size){Object.assign(this,{tex,rect,rotated,offset,size});this.destroy=()=>this.destroyed=true;}};
vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/Recovered/PokerSettlementStyle.js','utf8'),{exports:out,cc});
function node(){const sprite={spriteFrame:{getTexture:()=>texture}};return {sprite,getComponent:()=>sprite,setContentSize(w,h){this.width=w;this.height=h;}};}
const view={winNode:node(),loseNode:node()},cell={zhuang:node(),nongmin:node()};
const frames=out.titles(view).concat(out.roles(cell));
for(const [n,meta] of [[view.winNode,titles.win],[view.loseNode,titles.lose],[cell.zhuang,roles.dizhu],[cell.nongmin,roles.nongming]]){
 const f=n.sprite.spriteFrame;
 assert.deepEqual([f.rect.x,f.rect.y,f.rect.width,f.rect.height],[meta.trimX,meta.trimY,meta.width,meta.height]);
 assert.equal(f.rotated,meta.rotated);assert.equal(f.offset.x,0);assert.equal(f.offset.y,0);
 assert.equal(f.tex,texture);assert.equal(n.width,meta.width);assert.equal(n.height,meta.height);
 assert.equal(n.sprite.trim,true);assert.equal(n.sprite.sizeMode,0);
}
out.release(frames);assert.ok(frames.every(f=>f.destroyed));
const bundle=fs.readFileSync('cocos-client/build/web-mobile/assets/main/index.js','utf8');
const ctx={window:{},cc};vm.runInNewContext(bundle.replace(/\},\{\},\[[^\n]*\]\);\s*$/,'},{},[]);'),ctx);
assert.equal(typeof ctx.window.__require('PokerSettlementStyle').titles,'function');
assert.ok(bundle.includes('"./PokerSettlementStyle":"PokerSettlementStyle"'));
console.log('PASS: original full rotated win/lose artwork, correctly trimmed landlord/farmer badges, private frames, cleanup and packaged module');
