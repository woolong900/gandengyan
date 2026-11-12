const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const project=path.join(__dirname,'../cocos-client');
const meta=JSON.parse(fs.readFileSync(path.join(project,'assets/resources/_RecoveredDependencies/Textures/19c83aa89.png.meta')));
const source=fs.readFileSync(path.join(project,'assets/Script/Recovered/PokerActionButtonStyle.js'),'utf8');
const exportsMock={},texture={},callbacks=[];
const cc={Button:{Transition:{SPRITE:2,COLOR:1}},Sprite:{SizeMode:{CUSTOM:0},Type:{SIMPLE:0}},Texture2D:{},
  SpriteFrame:function(texture,rect,rotated,offset,size){Object.assign(this,{texture,rect,rotated,offset,size});},
  rect:(...v)=>v,v2:(x,y)=>({x,y}),size:(width,height)=>({width,height}),color:(r,g,b,a)=>({r,g,b,a}),isValid:n=>!n.destroyed,
  loader:{loadRes(p,t,cb){assert.ok(['19c83aa89','13d635c84','144a59770'].some(id=>p.endsWith('/'+id)));callbacks.push(cb);}},
  error(){throw Error('unexpected resource error');}};
vm.runInNewContext(source,{exports:exportsMock,cc});
// Exercise named buttons using real dimensions and Cocos-like component nodes.
cc.Label={HorizontalAlign:{CENTER:1},VerticalAlign:{CENTER:1},Overflow:{SHRINK:2}};
cc.LabelOutline={};
cc.Class=spec=>{function C(){} Object.assign(C.prototype,spec);return C;};
cc.Node=function(name){
 this.name=name;this.children=[];this.components=new Map();this.width=226;this.height=88;
 this.x=0;this.y=0;this.anchorX=.5;this.anchorY=.5;this.color=cc.color(255,255,255,255);this.active=true;
 this.setContentSize=(w,h)=>{this.width=w;this.height=h;};
 this.setPosition=(x,y)=>{this.x=x;this.y=y;};
 this.setScale=(x,y)=>{this.scaleX=x;this.scaleY=y;};
 this.addChild=n=>{this.children.push(n);n.parent=this;};
 this.getChildByName=n=>this.children.find(c=>c.name===n);
 this.addComponent=t=>{const c=typeof t==='function'?new t():{};c.node=this;this.components.set(t,c);return c;};
 this.getComponent=t=>this.components.get(t);
};
cc.SpriteFrame.prototype.destroy=function(){this.destroyed=true;};
function choice(w=226,h=88){
 const node=new cc.Node('choice'),sprite=node.addComponent(cc.Sprite),button=node.addComponent(cc.Button);
 node.setContentSize(w,h);node.setPosition(42,99);node.active=false;
 button.clickEvents=[()=>{}];button.enabled=true;button.interactable=true;button.target=node;
 return {node,sprite,button};
}
function assertDisabledText(skin) {
 assert.deepEqual(skin.label.node.color,cc.color(180,180,180,255));
 assert.deepEqual(skin.outline.color,cc.color(45,45,45,255));
 assert.ok(skin.parts.every(p=>p.color.r===76),'background remains dimmed');
}
// Match actual scene hierarchy, including D7's extra OperateRoot and WSK's alias.
for(const game of ['ddz','gd','wsk','pdk','dbd','d7']) {
 const scene=JSON.parse(fs.readFileSync(path.join(project,`assets/resources/Games/${game}/Scene/Scene${game.toUpperCase()}.fire`)));
 const source=fs.readFileSync(path.join(project,'assets/Script/Recovered',game.toUpperCase()+'GameControl.js'),'utf8');
 assert.ok(source.includes('require("./PokerActionButtonStyle").apply(this.node)'));
 const canvas=new cc.Node('Canvas'),root=new cc.Node('Root'),operate=new cc.Node('MyOperateRoot'),row=new cc.Node('BtnRoot');
 canvas.addChild(root);root.addChild(operate);
 if(game==='d7'){const extra=new cc.Node('OperateRoot');operate.addChild(extra);extra.addChild(row);}else operate.addChild(row);
 const expected=[];
 for(const [name,key,text]of [['BtnPass','btn_put_0','不出'],['BtnPutPass','btn_put_0','不出'],['BtnTip','btn_pass','提示'],['BtnPut','btn_tip_0','出牌']]) {
  const original=scene.find(n=>n._name===name);if(!original)continue;
  const item=choice(original._contentSize.width,original._contentSize.height),n=item.node;
  n.name=name;n.setPosition(original._position?.x||0,original._position?.y||0);
  item.button.interactable=name!=='BtnPut';
  const target=new cc.Node('Background');target.addComponent(cc.Sprite);n.addChild(target);item.button.target=target;
  row.addChild(n);expected.push({...item,key,text,x:n.x,y:n.y,handler:item.button.clickEvents[0]});
 }
 const untouched=choice().node;untouched.name='BtnBao';row.addChild(untouched);
 exportsMock.apply(canvas);callbacks.shift()(null,texture);
 for(const {node:n,button,key,text,x,y,handler}of expected) {
  const skin=n._pokerSkin,f=meta.subMetas[key];
  assert.equal(skin.label.string,text);
  assert.deepEqual(Array.from(skin.frames[0].rect),[f.trimX,f.trimY,48,88]);
  assert.equal(n.width,226);assert.equal(n.height,88);assert.equal(skin.host.width,226);assert.equal(skin.host.height,88);
  assert.equal(n.x,x);assert.equal(n.y,y);assert.equal(n.active,false);assert.equal(button.clickEvents[0],handler);
  assert.equal(button.interactable,n.name!=='BtnPut');assert.equal(button.transition,cc.Button.Transition.COLOR);
  if(!button.interactable)assertDisabledText(skin); // Already disabled when texture loads.
  const normalOutline=skin.normalOutlineColor;
  button.interactable=true;skin.node.color=button.pressedColor;skin.lateUpdate();assert.equal(skin.parts[0].color.r,220);
  assert.deepEqual(skin.outline.color,normalOutline);
  button.interactable=false;skin.lateUpdate();assertDisabledText(skin);
  assert.equal(button.interactable,false,'styling must not enable play');
  button.interactable=true;skin.node.color=button.normalColor;skin.lateUpdate();assert.equal(skin.label.node.color.r,255);
  assert.deepEqual(skin.outline.color,normalOutline);
  button.enabled=false;skin.lateUpdate();assertDisabledText(skin);
  assert.equal(button.enabled,false);
  button.enabled=true;skin.lateUpdate();assert.equal(skin.label.node.color.r,255);
  assert.deepEqual(skin.outline.color,normalOutline);
  assert.equal(skin.node.scaleX,1);assert.equal(skin.node.scaleY,1);
 }
 assert.equal(untouched._pokerSkin,undefined,'unrelated action is unchanged');
 exportsMock.apply(canvas);row.destroyed=true;callbacks.shift()(null,texture);
 console.log('PASS '+game+': green Put, red Pass, yellow Tip; correct text, native size, original positions/handlers, press/disable feedback');
}
const bidding={node:{}};
for(const name of ['jiaodizhu','buJiaodizhu','Redouble','unRedouble'])bidding[name]=choice().node;
exportsMock.applyBidding(bidding);callbacks.shift()(null,texture);
for(const [name,kind,text]of [['jiaodizhu','pass','叫地主'],['buJiaodizhu','put','不叫'],['Redouble','pass','加倍'],['unRedouble','put','不加倍']]){
 const n=bidding[name],sync=n._pokerSkin,button=n.getComponent(cc.Button),f=meta.subMetas[kind==='pass'?'btn_pass':'btn_put_0'];
 assert.equal(sync.label.string,text);assert.equal(n.getComponent(cc.Sprite).enabled,false);
 assert.deepEqual(Array.from(sync.frames,f=>Array.from(f.rect)),[[f.trimX,f.trimY,48,88],[f.trimX+48,f.trimY,1,88],[f.trimX+178,f.trimY,48,88]]);
 assert.equal(n.x,42);assert.equal(n.y,99);assert.equal(n.active,false);assert.equal(n.width,226);
 assert.equal(button.transition,cc.Button.Transition.COLOR);assert.equal(button.enabled,true);
 sync.node.color=button.pressedColor;sync.lateUpdate();
 assert.ok(sync.parts.every(p=>p.color.r===220));assert.equal(sync.label.node.color.r,220);
 sync.node.color=button.normalColor;button.interactable=false;sync.lateUpdate();
 assertDisabledText(sync);
 button.interactable=true;sync.lateUpdate();assert.equal(sync.label.node.color.r,255);
 const count=n.children.length;exportsMock.applyBidding(bidding);callbacks.shift()(null,texture);
 assert.equal(n.children.length,count,'no duplicate overlays on repeated attachment');
 sync.onDestroy();assert.ok(sync.frames.every(f=>f.destroyed));
}
const c=choice(170,70),tribute={node:{},jiaodizhu:c.node,jiaodizhu_sprrt:c.sprite};
exportsMock.applyTribute(tribute);
exportsMock.updateTribute(tribute,true,false); // State may change before atlas finishes loading.
callbacks.shift()(null,texture);
assert.equal(c.node._pokerSkin.label.string,'还贡');
assert.equal(c.button.interactable,false);assert.equal(c.button.enabled,true);
assert.equal(c.node.width,226);assert.equal(c.node.height,88);
assert.equal(c.node._pokerSkin.node.scaleX,1);
assert.equal(c.node._pokerSkin.node.scaleY,1);
exportsMock.updateTribute(tribute,false,true);
assert.equal(c.node._pokerSkin.label.string,'进贡');assert.equal(c.button.interactable,true);
for(const [method,fields]of [
 ['applyTable',{btnInvite:'邀请好友',btnReady:'准备',btnClubInvite:'邀请好友',btnClubOnline:'在线玩家',shareEnd:'分享',next:'继续',gameend:'总结算'}],
 ['applySettlement',{btnNext:'继续',btnEnd:'总结算',btnExit:'退出',btnShare:'分享'}],
 ['applyDdzSettlement',{btnNext:'继续',btnEnd:'总结算',btnShare:'退出'}],
 ['applyGdTable',{btnInvite:'邀请好友',btnReady:'准备',btnClubInvite:'邀请好友',btnClubOnline:'在线玩家',shareEnd:'退出',next:'继续',gameend:'总结算'}]
]){
 const controller={node:{},menu:choice().node,chat:choice().node,lipai:choice().node};
 for(const field of Object.keys(fields))controller[field]=choice(309,95).node;
 exportsMock[method](controller);callbacks.shift()(null,texture);
 for(const [field,text]of Object.entries(fields)){
  const node=controller[field],skin=node._pokerSkin;
  assert.equal(skin.label.string,text);
  assert.equal(node.width,226);assert.equal(node.height,88);
  assert.equal(skin.host.width,226);assert.equal(skin.host.height,88);
  assert.equal(skin.node.scaleX,1);assert.equal(skin.node.scaleY,1);
  assert.equal(skin.label.fontSize,38);
  assert.equal(node.x,42);assert.equal(node.y,99);
 }
 for(const field of ['menu','chat','lipai'])assert.equal(controller[field]._pokerSkin,undefined);
}
const piao={node:{},piaoBtns:[choice().node,choice().node],piaoDesc:[{string:'飘 1'}]};
exportsMock.applyPiao(piao);callbacks.shift()(null,texture);
piao.piaoDesc[0].string='飘 3';piao.piaoBtns[1]._pokerSkin.lateUpdate();
assert.equal(piao.piaoBtns[1]._pokerSkin.label.string,'飘 3');
const dead={node:{destroyed:true},jiaodizhu:choice().node};
exportsMock.applyBidding(dead);callbacks.shift()(null,texture);assert.equal(dead.jiaodizhu._pokerSkin,undefined);
console.log('PASS: shared atlas skins; call/double/tribute/table/settlement/piao labels; press/disable/re-enable; async tribute; cleanup; unchanged geometry/clicks; excluded controls untouched');

// Every game's native waiting controller uses the same green/yellow artwork.
for (const controllerName of ['D7TableBtnCtr','DBDTableBtnCtr','DDZTableBtnCtr','GDTableBtnCtr','PDKTableBtnCtr','WSKTableBtnCtr','TableBtns']) {
 const method = controllerName === 'GDTableBtnCtr' ? 'applyGdTable' : /^DDZ/.test(controllerName) ? 'applyTable' : 'applyWaiting';
 const source = fs.readFileSync(path.join(project,'assets/Script/Recovered',controllerName+'.js'),'utf8');
 assert.ok(source.includes('require("./PokerActionButtonStyle").'+method+'(this)'),controllerName+' must attach waiting skins');
 const controller={node:{}};
 for(const field of ['btnInvite','btnReady','btnClubInvite','btnClubOnline','btnGameNext','menu','chat','lipai'])controller[field]=choice(198,73).node;
 const handlers=new Map(Object.values(controller).filter(n=>n.getComponent).map(n=>[n,n.getComponent(cc.Button).clickEvents]));
 exportsMock[method](controller);callbacks.shift()(null,texture);
 for(const [field,key,text]of [['btnInvite','btn_tip_0','邀请好友'],['btnReady','btn_pass','准备'],['btnClubInvite','btn_tip_0','邀请好友']]) {
  const node=controller[field],skin=node._pokerSkin,button=node.getComponent(cc.Button),f=meta.subMetas[key];
  assert.equal(skin.label.string,text);
  assert.equal(node.width,226);assert.equal(node.height,88);
  assert.equal(skin.node.scaleX,1);assert.equal(skin.node.scaleY,1);
  assert.deepEqual(Array.from(skin.frames[0].rect),[f.trimX,f.trimY,48,88]);
  assert.equal(button.clickEvents,handlers.get(node));
  assert.equal(node.active,false);assert.equal(node.x,42);assert.equal(node.y,99);
  assert.equal(button.transition,cc.Button.Transition.COLOR);
  skin.node.color=button.pressedColor;skin.lateUpdate();assert.ok(skin.parts.every(p=>p.color.r===220));
  button.interactable=false;skin.lateUpdate();assertDisabledText(skin);
  button.interactable=true;skin.node.color=button.normalColor;skin.lateUpdate();assert.equal(skin.label.node.color.r,255);
 }
 for(const field of ['btnGameNext','menu','chat','lipai'])assert.equal(controller[field]._pokerSkin,undefined);
 if(method==='applyWaiting')assert.equal(controller.btnClubOnline._pokerSkin,undefined);
 const count=controller.btnReady.children.length;
 exportsMock[method](controller);callbacks.shift()(null,texture);
 assert.equal(controller.btnReady.children.length,count,'one skin per ready button');
}
// Native 3D seat-change arrows live under a misleadingly named Ready container.
const seats={node:{},btnReady:new cc.Node('Ready'),btnInvite:choice().node};
for(const name of ['down','left','up','right']) {
 const n=choice(139,117).node;n.name=name;
 n.getComponent(cc.Button).clickEvents=[{handler:'onClickChangePos'}];seats.btnReady.addChild(n);
}
exportsMock.applyWaiting(seats);callbacks.shift()(null,texture);
assert.ok(seats.btnReady.children.every(n=>!n._pokerSkin&&n.width===139));
assert.equal(seats.btnInvite._pokerSkin.label.string,'邀请好友');
const unavailable={node:{},btnReady:choice().node};
exportsMock.applyWaiting(unavailable);callbacks.shift()(Error('load failed'));
assert.equal(unavailable.btnReady._pokerSkin,undefined,'failed loading preserves original button');
console.log('PASS: all seven waiting controllers, yellow Ready/green Invite including clubs, press/disable/release, original handlers and visibility, seat controls and other functions preserved');
const ddzEnd={node:{},btnNext:choice().node,btnShare:choice().node,btnEnd:choice().node,btnExit:choice().node};
exportsMock.applyDdzSettlement(ddzEnd);callbacks.shift()(null,texture);
assert.equal(ddzEnd.btnExit._pokerSkin,undefined);
for(const [field,key]of [['btnNext','btn_tip_0'],['btnShare','btn_put_0']]) {
 const f=meta.subMetas[key];
 assert.deepEqual(Array.from(ddzEnd[field]._pokerSkin.frames[0].rect),[f.trimX,f.trimY,48,88]);
}
console.log('PASS: DDZ bottom-left red Exit and bottom-right green Continue, no redundant top Exit skin');
const gdEnd={node:{},next:choice().node,shareEnd:choice().node};
exportsMock.applyGdTable(gdEnd);callbacks.shift()(null,texture);
for(const [field,key]of [['next','btn_tip_0'],['shareEnd','btn_put_0']]) {
 const f=meta.subMetas[key];
 assert.deepEqual(Array.from(gdEnd[field]._pokerSkin.frames[0].rect),[f.trimX,f.trimY,48,88]);
}
console.log('PASS: GD table settlement matches green Continue/red Exit skins');
