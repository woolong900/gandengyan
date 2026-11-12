const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const {repair, NAMES} = require('./repair-gd-atlas-frames');
const metaFile = path.join(__dirname, '../cocos-client/assets/resources/_RecoveredDependencies/Textures/144a59770.png.meta');
const metas = JSON.parse(fs.readFileSync(metaFile)).subMetas;
const expected = {
  shuangshang: [[385,3,300,202],[0,-1],[314,216],false],
  shuangxia: [[691,3,251,200],[0,0],[251,200],false],
  lipai: [[897,209,140,45],[0,0],[140,45],true],
  huifu: [[179,157,140,45],[0,0],[140,45],false],
  hengpai: [[179,208,140,45],[0,0],[140,45],false],
  shupai: [[3,233,140,45],[0,0],[140,45],false]
};
function verify(frame) {
  assert.deepEqual([frame.rect, frame.offset, frame.originalSize, !!frame.rotated], expected[frame.name]);
}
// Simulate the faulty import, including trimmed rotated width; unrelated records survive.
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gd-atlas-test-'));
try {
  const root = path.join(temp, 'assets/resources'), folder = path.join(root, 'import/aa');
  fs.mkdirSync(folder, {recursive:true});
  fs.writeFileSync(path.join(root, 'config.json'), JSON.stringify({uuids:NAMES.map(name=>metas[name].uuid),packs:{aatest:NAMES.map((_,i)=>i)}}));
  const frames = NAMES.map(name=>({name,rect:[0,0,124,45],offset:[448.5,-27.5],originalSize:[1021,408]}));
  const unrelated = {name:'another-game-button',rect:[1,2,3,4],originalSize:[5,6]};
  const file = path.join(folder, 'aatest.json');
  fs.writeFileSync(file, JSON.stringify([unrelated,frames]));
  assert.equal(repair(temp),1);
  const result = JSON.parse(fs.readFileSync(file));
  assert.deepEqual(result[0], unrelated);result[1].forEach(verify);
  const once = fs.readFileSync(file,'utf8');
  assert.equal(repair(temp),0);assert.equal(fs.readFileSync(file,'utf8'),once);
} finally { fs.rmSync(temp,{recursive:true}); }
// Check the actual packed data, not only source metadata or a helper mock.
const root = path.join(__dirname, '../cocos-client/build/web-mobile/assets/resources');
const config = JSON.parse(fs.readFileSync(path.join(root,'config.json'))), counts = Object.fromEntries(NAMES.map(n=>[n,0]));
const packs = new Set();
for (const name of NAMES) {
  const hex = metas[name].uuid.replace(/-/g,''), encoded = hex.slice(0,2)+Buffer.from(hex.slice(2),'hex').toString('base64');
  const index = config.uuids.indexOf(encoded);
  assert.ok(index>=0);
  packs.add(Object.entries(config.packs).find(([,ids])=>ids.includes(index))[0]);
}
function visit(value) {
  if(!value||typeof value!=='object')return;
  if(NAMES.includes(value.name)&&value.rect&&value.originalSize){verify(value);counts[value.name]++;}
  Object.values(value).forEach(visit);
}
for (const pack of packs) visit(JSON.parse(fs.readFileSync(path.join(root,'import',pack.slice(0,2),pack+'.json'))));
for(const name of NAMES)assert.equal(counts[name],1);
console.log('PASS: six original GD frame geometries, complete rotated sort button, settlement size/offset, unrelated assets preserved, idempotent packaging and actual PWA packs');
