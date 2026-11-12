// Exercises the real recovered card rules and seat models without a renderer.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '../cocos-client/assets/Script/Recovered');
const storage = new Map(), queue = [], cache = {};
const room = { roomId: 0, isPlayback: () => false, myAbsolutePos: () => 0,
  setCountDown(end) { this._countDown = end; },
  reset() {}, leaveRoom() { this.roomId = 0; },
  myPlayerData() { return this.players.getByPos(0); },
  updatePlayerData(data) {
    const players = Array.isArray(data) ? data : Array.from({length:4}, (_,pos)=>this.players.getByPos(pos));
    if (!Array.isArray(data)) players[data.pos]=data;
    this.players = { getByPos: pos => players[pos] };
    players.forEach(p => {p.updateScore = score => p.score = score;p.pbData=()=>({...p});});
  },
  updateGameData(data) {
    const List = load('GDSiteListData').default, Cell = load('GDSiteCellData').default;
    this.gameInfoGD = Object.assign({}, data, { m_iLaiziValue: data.bottomCard / 10, siteInfos: new List() });
    this.gameInfoGD.setBottomCard = value => this.gameInfoGD.bottomCard = value;
    this.gameInfoGD.setSelfOtheCard = (self, other) => { this.gameInfoGD.selfLevel = self; this.gameInfoGD.otherLevel = other; };
    (data.siteInfos || []).forEach(seat => { const cell = new Cell(seat.pos); cell.udpateHandCards(seat.handCards); this.gameInfoGD.siteInfos.add(cell); });
  }
};
const mocks = {
  GameSoundGD: { default: { getInstance: () => ({put(){},pass(){},warningOnly(){},gameWin(){},gameLose(){}}) } },
  SoundUtils: { default: { pokerVoiceDelay: () => 0 } },
  RoomInfoData: { default: room }, UserData: { default: { uid: 1, second: 1000 } },
  gContext: { default: { eventUtils: { emit() {} }, uiHelper: { showTip() {} } } },
  GDMyRoundTipCtr: { SetTipIndex() {} }
};
function load(name) {
  if (mocks[name]) return mocks[name];
  if (cache[name]) return cache[name];
  const exports = {}; cache[name] = exports;
  vm.runInNewContext(fs.readFileSync(path.join(root, name + '.js'), 'utf8'), {
    module: { exports }, exports, require: name => load(name.replace('./', '')),
    cc: { _RF: { push() {}, pop() {} }, log() {}, error: console.error,
      sys: { localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) } } },
    console: { log() {} }, setTimeout: fn => queue.push(fn)
  }, { filename: name });
  return exports;
}
const local = load('GDStandalone').default, rules = load('GDCardUtils').default;
load('PokerDealFlow').attach(local,{scheduleOnce:fn=>fn(),play:done=>done()});
local.start({});
local.ready();
// New local rounds must perform the native deal's mode/cache reset before
// publishing new cards; this renderer-free harness completes animation immediately.
const previousRound = room.gameInfoGD;
Object.assign(previousRound,{is_shuCard:true,lipaiBtnStuas:true,lipaiHandCards:[31],lipaiHandCardsAry:[[31]]});
local._deal();
assert.equal(previousRound.is_shuCard,false);
assert.equal(previousRound.lipaiBtnStuas,false);
assert.equal(previousRound.lipaiHandCards.length,0);
assert.equal(previousRound.lipaiHandCardsAry.length,0);
function reply(hand, last, type) {
  local._lastPutCards = last; local._lastPutType = type; local._lastPutPos = last.length ? 0 : -1;
  return local._choosePlay(hand);
}
for (const [hand, last, type] of [
  [[41,51], [31], 1],
  [[41,42,51], [31,32], 2],
  [[41,42,43,51], [31,32,33], 5],
  [[41,52,63,74,81], [31,42,53,64,71], 3],
  [[41,42,51,52,61,62], [31,32,41,42,51,52], 4],
  [[41,42,43,51,52,53], [31,32,33,41,42,43], 6],
  [[41,42,43,51,52], [31,32,33,41,42], 7],
  [[41,42,43,44], [31,32,33,34], 13],
  [[41,51,61,71,81], [31,32,33,34,31], 14],
  [[41,23,91], [31,32], 2]
]) {
  const play = reply(hand, last, type);
  assert.ok(play, 'expected a response: ' + JSON.stringify({hand,last,type}));
  assert.ok(rules.compareToPut(play.handCards.slice(), last, type) > 0);
}
assert.equal(reply([31,41], [180], 1), null);
assert.equal(reply([31,41], [170,170,180,180], 21), null);
console.log('PASS: singles, pairs, triples, straights, consecutive pairs/triples, full house, bombs, straight flush, wildcard, no-beat pass');

// Exhaust complete games with real seat mutation and every move revalidated.
for (let game = 0; game < 20; game++) {
  local.start({}); local.ready(); queue.length = 0;
  let turns = 0, played = 0;
  while (!local._roundFinished && turns++ < 1000) {
    const pos = local._currentPos, site = room.gameInfoGD.siteInfos.get(pos);
    const last = room.gameInfoGD.siteInfos.getLastPut(pos);
    assert.equal(Boolean(last), local._lastPutPos >= 0, 'UI and adapter must agree on trick leader');
    const play = local._choosePlay(site.handCards);
    if (play) {
      const before = site.handCards.length;
      local._applyPlay(pos, play);
      assert.equal(before - site.handCards.length, play.handCards.length);
      played += play.handCards.length;
    } else {
      assert.ok(local._lastPutPos >= 0, 'must never pass a free lead');
      site.pass(); local._passed.push(pos); local._advance(pos);
    }
    let remaining = 0;
    for (let p = 0; p < 4; p++) remaining += room.gameInfoGD.siteInfos.get(p).handCards.length;
    assert.equal(remaining + played, 108, 'card conservation');
    queue.length = 0;
  }
  assert.ok(local._roundFinished, 'game must terminate');
  assert.equal(new Set(local._finished).size, 4);
  assert.equal([0,1,2,3].reduce((sum,p) => sum + room.players.getByPos(p).score, 0), 0);
}
console.log('PASS: 20 complete four-seat games, legal responses, hand counts, trick reset, ranks, zero-sum scores');

for (let game = 0; game < 10; game++) {
  local.start({}); local.ready(); queue.length = 0;
  let turns = 0;
  while (!local._roundFinished && turns++ < 1000) {
    local._runBotTurn(local._currentPos);
    queue.length = 0;
  }
  assert.ok(local._roundFinished, 'teammate-pass policy must not deadlock');
}
local.start({}); local.ready(); queue.length = 0;
local._finished = [1]; local._lastPutPos = 1; local._lastPutCards = [180]; local._lastPutType = 1;
local._passed = [2,3,0]; local._advance(0);
assert.equal(local._currentPos, 3, 'finished trick winner relays lead to partner');
assert.equal(local._lastPutPos, -1);
assert.ok(local._makePlay([31,32,23], [31,32,30], 5), 'preserve wildcard display chosen by player');
assert.equal(local._makePlay([31,32,23], [41,42,40], 5), null, 'reject a display not formed by the selected cards');
console.log('PASS: 10 games using actual partner policy, teammate relay, wildcard chooser validation');

// Human gating, real scheduled bot response, and dismissal callback invalidation.
local.start({}); local.ready(); queue.length = 0;
room.gameInfoGD.siteInfos.get(0).handCards = [31,91];
room.gameInfoGD.siteInfos.get(1).handCards = [41,101];
assert.equal(local.pass(), false);
assert.equal(local.putCard([51],[51],1), false);
assert.equal(local.putCard([31],[31],1), true);
assert.equal(local.putCard([91],[91],1), false);
// Original remaining-one voice runs at 500 ms, before the robot's action.
for (let pending = 0; pending < 2 && local._lastPutPos !== 1; pending++) queue.shift()();
assert.equal(room.gameInfoGD.siteInfos.get(1).handCards.length, 1);
assert.equal(local._lastPutPos, 1);
local.dismiss();
while (queue.length) queue.shift()();
assert.equal(room.roomId, 0);
assert.equal(local.isActive(), false);
console.log('PASS: turn gating, missing-card rejection, real bot follow, dismissal invalidates timers');
