const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const names=['jipai_laizi','peipaibiao','jinLog','huanLog'];
const meta=JSON.parse(fs.readFileSync('cocos-client/assets/resources/_RecoveredDependencies/Textures/140aeccfa.png.meta')).subMetas;
const root='cocos-client/build/web-mobile/assets/resources';
const config=JSON.parse(fs.readFileSync(path.join(root,'config.json')));
const requests=[],exportsObject={};
vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/Recovered/Loader.js','utf8'),{
  module:{exports:exportsObject},exports:exportsObject,require(){},
  cc:{_RF:{push(){},pop(){}},SpriteFrame:function(){},error(){throw Error('asset load failed');},
    assetManager:{loadAny(request,cb){requests.push(request);cb(null,{uuid:request.uuid});}}}
});
for(const name of names){
  let loaded;exportsObject.default.loadImg('Games/GdPoker/'+name,frame=>loaded=frame);
  assert.equal(loaded.uuid,meta[name].uuid);
  assert.equal(requests.at(-1).bundle,'resources','UUID must resolve inside its owning bundle');
  const hex=meta[name].uuid.replace(/-/g,''),encoded=hex.slice(0,2)+Buffer.from(hex.slice(2),'hex').toString('base64');
  const index=config.uuids.indexOf(encoded);assert.ok(index>=0);
  const entry=Object.entries(config.packs).find(([,ids])=>ids.includes(index));
  const pack=entry?entry[0]:meta[name].uuid;
  let found=[];
  function visit(v){if(!v||typeof v!=='object')return;if(v.name===name&&v.rect)found.push(v);Object.values(v).forEach(visit);}
  visit(JSON.parse(fs.readFileSync(path.join(root,'import',pack.slice(0,2),pack+'.json'))));
  assert.equal(found.length,1);
  const f=found[0],m=meta[name];
  assert.deepEqual(f.rect,[m.trimX,m.trimY,m.width,m.height]);
  assert.deepEqual(f.originalSize,[m.rawWidth,m.rawHeight]);
  assert.equal(!!f.rotated,m.rotated);
}
console.log('PASS original GD level / wild / tribute / return frames: bundle-qualified loading and packed rotated geometry');
