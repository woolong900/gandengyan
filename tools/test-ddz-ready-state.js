const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '../cocos-client/assets/Script/Recovered');
const players = [], listeners = [], updates = [], cache = {}, storage = new Map();
function player(data) {
  return Object.assign({}, data, { isReady() { return this.ready; }, isOnLine() { return true; },
    scoreDesc() { return String(this.score); }, pbData() { return {...this}; } });
}
const context = { eventUtils: { on(keys, fn) { listeners.push({keys,fn}); },
  emit(key) { listeners.filter(x => [].concat(x.keys).includes(key)).forEach(x => x.fn()); } } };
const room = { config: {}, roomId: 0, isPlayback: () => false, myAbsolutePos: () => 0, reset() {},
  setCountDown(value) { this._countDown = value; },
  players: { getByPos: pos => players[pos] }, myPlayerData: () => players[0],
  updatePlayerData(data) {
    if (Array.isArray(data)) data.forEach(x => players[x.pos] = player(x));
    else { players[data.pos] = player(data); updates.push(data.pos); context.eventUtils.emit('player_update'); }
  },
  updateGameData(data) { this.lastDeal = data; this.gameInfoDDZ.status = data.status; },
  gameInfoDDZ: { status: 0, setBottomCard() {}, SetLandlordUid() {}, setBankerUid() {},
    siteInfos: { get: () => ({ turn() {}, jiaoDiZhu() {} }) } }
};
const mocks = { RoomInfoData: {default:room}, UserData: {default:{uid:1,second:1000}}, gContext: {default:context},
  GameLogicDDZ:{default:{getInstance:()=>({autoGameCountDown:()=>15})}},
  PokerDealFlow:{begin:(room,done)=>done(),cancel(){}},
  PokerLocalTiming:{schedule(){}},
  DDZCardUtils: { eDDZOneHandType:{Error:0} }, StringUtils: {default:{clip:x=>x}},
  EventKeys: {default:{data_player_update:'player_update'}}, EventUtils:{eOffType:{OnDestroy:0}},
  DDZEventKeys: {default:{ui_double_update:'double_update'}} };
function load(name) {
  if (mocks[name]) return mocks[name];
  if (cache[name]) return cache[name];
  if (!['DDZStandalone','DDZPosPlayerInfoCtr','DDZEnum'].includes(name)) return {default:{}};
  const exports = {}; cache[name] = exports;
  vm.runInNewContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'), {
    module:{exports}, exports, require:n=>load(n.replace('./','')), setTimeout(){},
    cc:{_RF:{push(){},pop(){}},Component:function(){},Node:function(){},Label:function(){},
      _decorator:{ccclass:c=>c,property:()=>()=>{}},sys:{localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}}}
  });
  return exports;
}
const local = load('DDZStandalone').default;
local.start({});
assert.deepEqual(players.map(p=>p.ready),[false,true,true]);
assert.equal(local._phase,'waiting');
local.ready();
assert.deepEqual(players.map(p=>p.ready),[false,false,false]);
assert.deepEqual(updates,[0,0,1,2]);
assert.equal(players[0].deal,false,'landlord is not assigned before bidding');
assert.equal(room.lastDeal.siteInfos.reduce((sum,s)=>sum+s.handCards.length,0),51);
assert.equal(local._bottomCards.length,3);
const View = load('DDZPosPlayerInfoCtr').default, views=[];
for(let pos=0;pos<3;pos++) {
  players[pos].ready=true; // Pre-game readiness must still be visible.
  const view=new View(); view.posCtr={deskPos:()=>pos};
  for(const key of ['rootNode','offline','headImage','nameLabel','readyNode','dizhu','jiabei','scoreLabel']) view[key]={};
  view.start(); assert.equal(view.readyNode.active,true); views.push(view);
}
updates.length=0;
local._deal();
views.forEach(view=>{assert.equal(view._uiDirty,true);view.update();assert.equal(view.readyNode.active,false);});
assert.deepEqual(updates,[0,1,2]);
assert.deepEqual(players.map(p=>p.score),[0,0,0]);
local._deal();
assert.equal(updates.length,6,'each deal clears ready, landlord and double flags');
console.log('PASS: ready visible before start; ready/landlord/double reset on each deal; mounted views refreshed; 51 hand cards + 3 reserved cards');
