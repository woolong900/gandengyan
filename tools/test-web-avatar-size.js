const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname,'../cocos-client/assets/Script/Recovered/Image.js'),'utf8');
const pending = [], textureReady = [];
function Sprite() {this.sizeMode=2;}
Sprite.SizeMode={CUSTOM:0,TRIMMED:1,RAW:2};
Object.defineProperty(Sprite.prototype,'spriteFrame',{
 get(){return this.frame;},
 set(frame){
  this.frame=frame;
  const resize=()=>{
   if(this.sizeMode!==Sprite.SizeMode.CUSTOM){this.node.width=frame.width;this.node.height=frame.height;}
  };
  if(frame.loaded)resize();else textureReady.push(resize);
 }
});
const cc={Sprite,SpriteFrame:function(t){Object.assign(this,t);},Integer:Number,
 sys:{isBrowser:true},isValid:n=>!!n&&n.isValid,
 _RF:{push(){},pop(){}},_decorator:{ccclass:c=>c,property:()=>()=>{}},log(){},
 loader:{load(request,callback){pending.push(callback);}}};
const exportsMock={};
vm.runInNewContext(source,{module:{exports:exportsMock},exports:exportsMock,cc,
 require(name){return name==='./Loader'?{default:{loadImg(p,callback){pending.push((err,frame)=>callback(frame));}}}:{default:{},ePlatformType:{}};}});
const Image=exportsMock.default;
function avatar(w=126,h=126){
 const image=new Image();image.fixWidth=w;image.fixHeight=h;
 image.node={width:w,height:h,x:-225,y:87,isValid:true,activeInHierarchy:true,emit(){}};
 image.unschedule=()=>{};image.scheduleOnce=()=>{};
 image._nativeUrl=url=>url;
 image.onLoad();return image;
}
function assertSize(image,w,h){
 textureReady.splice(0).forEach(f=>f());
 assert.equal(image.node.width,w);assert.equal(image.node.height,h);
 assert.equal(image.node.x,-225);assert.equal(image.node.y,87);
}
// Default avatar: image callback precedes the actual texture-ready event.
const grey=avatar();grey.url='';
pending.shift()(null,{width:200,height:200,loaded:false});
assertSize(grey,126,126);assert.equal(grey.sizeMode,Sprite.SizeMode.CUSTOM);
// Remote images and cached frames, including images smaller than the display.
for(const loaded of [false,true])for(const size of [64,200,512]){
 const image=avatar(80,90);image.url='https://example.test/avatar.png';
 pending.shift()(null,{width:size,height:size,loaded});assertSize(image,80,90);
 image.defaultImage={width:200,height:200,loaded:false};image._resetImage();assertSize(image,80,90);
 image.setSpriteFrame({width:200,height:200,loaded});assertSize(image,80,90);
}
// Existing pending callbacks also respect CUSTOM after component initialization.
const initial=avatar();initial.sizeMode=2;initial.spriteFrame={width:200,height:200,loaded:false};
initial.onLoad();assertSize(initial,126,126);
// Keep native sizing behavior untouched.
cc.sys.isBrowser=false;const native=avatar();native.setSpriteFrame({width:64,height:64,loaded:true});
assert.equal(native.sizeMode,2);assertSize(native,64,64);
const prefab=JSON.parse(fs.readFileSync(path.join(__dirname,'../cocos-client/assets/resources/Hall/Res/Prefab/Game/GiftLayer.prefab')));
const head=prefab.find(n=>n._name==='avatar'),border=prefab.find(n=>n._name==='avatar_border');
assert.equal(head._contentSize.width,126);assert.equal(border._contentSize.width,139);
assert.deepEqual(head._position,border._position);
console.log('PASS: browser default/remote/cached/retry avatars retain authored dimensions after texture readiness; native sizing, border and positions unchanged');
