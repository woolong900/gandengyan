const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const harness = require('./local-poker-harness');
const root = path.join(__dirname, '../cocos-client');
const config = JSON.parse(fs.readFileSync(path.join(root,'build/web-mobile/assets/resources/config.json')));
const bundledPaths = new Set(Object.values(config.paths).map(v=>v[0]));
let checkedClips = 0;
for (const game of ['DDZ','GD']) {
  const h=harness(game,{ids:game==='DDZ'?[4,16,21,22]:[4,25,54]}), d=h.local;
  d.start(h.config);d.ready();h.queue.length=0;h.sounds.length=0;
  if(game==='DDZ') {
    d._beginChoice(0,'bid');d.bid(1);
    assert.deepEqual(h.sounds,[['jiaoDiZhu',1,h.players[0].gender]]);
    for(const value of [2,0,2]) {
      const pos=d._currentPos;d._double(pos,value);
      assert.deepEqual(h.sounds.at(-1),['jiaoDiZhu',value===2?3:2,h.players[pos].gender]);
    }
  }
  h.queue.length=0;h.sounds.length=0;
  const sites=h.room['gameInfo'+game].siteInfos;
  d._lastPutPos=-1;d._lastPutCards=[];d._currentPos=0;
  sites.get(0).udpateHandCards([31,41,51]);
  assert.equal(d.putCard([999],[999],1),false);assert.equal(h.sounds.length,0,'invalid action is silent');
  assert.equal(d.putCard([31],[31],1),true);
  assert.deepEqual(h.sounds[0],['put',1,[31],true,h.players[0].gender]);
  const warning=h.queue.shift();warning();
  assert.deepEqual(h.sounds.at(-1),['warningOnly',h.players[0].gender,2]);
  h.queue.length=0;
  sites.get(1).udpateHandCards([61,71,81,91]);d._startTurn(1);h.queue.length=0;
  if(game==='DDZ')d._applyPlay(1,[61],[61],1);
  else d._applyPlay(1,{type:1,showCards:[61],handCards:[61]});
  assert.deepEqual(h.sounds.at(-1),['put',1,[61],false,h.players[1].gender],'response uses original follow voice flag');
  h.queue.length=0;d._currentPos=0;
  assert.equal(d.pass(),true);assert.deepEqual(h.sounds.at(-1),['pass',h.players[0].gender]);
  h.queue.length=0;d._currentPos=2;d._lastPutPos=1;
  if(game==='GD')d._choosePlay=()=>null;
  else d._tipResponse=()=>[];
  d._runBotTurn(2);assert.deepEqual(h.sounds.at(-1),['pass',h.players[2].gender]);
  h.queue.length=0;h.sounds.length=0;
  d._warningVoice(0,1);const stale=h.queue.shift();d._roundToken++;stale();
  assert.equal(h.sounds.length,0,'previous-round warning cannot leak');
  d._warningVoice(0,1);h.queue.shift()();
  assert.equal(h.sounds.length,0,'changed remaining count cannot announce stale count');
  if(game==='DDZ') {sites.get(0).udpateHandCards([]);d._landlordPos=0;d._playCounts=[2,1,1];d._finishRound(0);}
  else {d._finished=[0,2,1,3];d._finishRound();}
  assert.equal(h.sounds.at(-1)[0],'gameWin');
  const soundCount=h.sounds.length;
  game==='DDZ'?d._finishRound(0):d._finishRound();
  assert.equal(h.sounds.length,soundCount,'settlement sound plays once');

  // Load the unmodified original voice mapper with real original card utilities.
  const clips=[], out={}, deps={
    Singleton:{default:function(){}},SoundUtils:{default:{playEffect:p=>clips.push(p)}},
    pb:{pb:{eGender:{WOMAN:2}}},CommonEnum:{eArea:{QJ:1}},GameConfig:{default:{area:()=>1}},
    [game+'CardUtils']:h.load(game+'CardUtils')
  };
  const random=Object.create(Math);random.random=()=>0;
  vm.runInNewContext(fs.readFileSync(path.join(root,'assets/Script/Recovered/GameSound'+game+'.js'),'utf8'),{
    module:{exports:out},exports:out,require:n=>deps[n.replace('./','')],Math:random,cc:{_RF:{push(){},pop(){}}}
  });
  const audio=new out.default(), types=deps[game+'CardUtils']['e'+game+'OneHandType'];
  for(const gender of [1,2]) {
    for(const type of Object.values(types).filter(v=>typeof v==='number'&&v>0))audio.put(type,[31],true,gender);
    for(let rank=1;rank<=13;rank++)for(const type of [types.Single,types.Double,types.Three])audio.put(type,[rank*10+1],true,gender);
    for(const card of [170,180])audio.put(types.Single,[card],true,gender);
    if(game==='GD')audio.put(types.Double,[170,170],true,gender);
    for(let value=0;value<4;value++)audio.jiaoDiZhu(value,gender);
    audio.warningOnly(gender,1);audio.warningOnly(gender,2);
    for(let variant=0;variant<4;variant++){random.random=()=>variant/4;audio.pass(gender);}
  }
  for(const method of ['dealCard','selectCard','selectCardEnd','clock','gameWin','gameLose'])audio[method]();
  audio.wzSound('zd_Bomb');audio.wzSound('wz_common');
  if(game==='GD'){audio.showFirendCard();audio.cardRound();}
  for(const resource of new Set(clips)) {
    const file=['.mp3','.ogg'].map(ext=>path.join(root,'assets/resources',resource+ext)).find(fs.existsSync);
    assert.ok(file,'original clip exists: '+resource);assert.ok(bundledPaths.has(resource),'registered resource: '+resource);
    const meta=JSON.parse(fs.readFileSync(file+'.meta'));
    const native=path.join(root,'build/web-mobile/assets/resources/native',meta.uuid.slice(0,2),meta.uuid+path.extname(file));
    assert.ok(fs.existsSync(native),'packaged clip exists: '+resource);
    assert.ok(fs.readFileSync(file).equals(fs.readFileSync(native)),'packaged clip matches original bytes: '+resource);
    checkedClips++;
  }
  assert.ok(clips.some(p=>p.includes('/man/'))&&clips.some(p=>p.includes('/woman/')));
  if(game==='GD') {assert.ok(clips.some(p=>p.endsWith('/gangban')));assert.ok(clips.some(p=>p.endsWith('/ths')));}
  console.log('PASS '+game+': real adapter voice triggers, gender, lead/follow, rejected actions, bots, delayed warning guards, settlement; original voice mapping/resources');
}
console.log('PASS '+checkedClips+' original audio resources registered and byte-identical in PWA');
