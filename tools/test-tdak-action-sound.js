const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Engine = require('../cocos-client/assets/Script/TDak/TDakLocalEngine');
const {ACTION} = Engine;
const root = path.join(__dirname, '../cocos-client');
const source = fs.readFileSync(path.join(root, 'assets/Script/TDak/TDakStandalone.js'), 'utf8');
let methods, random = 0, loads = [];
const math = Object.create(Math);
math.random = () => random;
const cc = {
  Color: function() {}, Component: function() {}, AudioClip: function() {},
  Class(spec) { methods = spec; }, isValid: node => !!node,
  resources: {load(name, type, done) { loads.push(name); done(null, name); }},
  audioEngine: {playEffect() {}}
};
vm.runInNewContext(source, {cc, Math: math,
  require: name => name === './TDakLocalEngine' ? Engine : {default:{}}});
function controller() {
  const game = Engine.createGame({allInMultiple:10, random:()=>0.5});
  Engine.startRound(game);
  return Object.assign({}, methods, {
    node:{}, game, sounds:[], bets:[],
    _play(name) { this.sounds.push(name); }, render() {},
    _animateBet(chair, amount, delay, sound) { this.bets.push({chair,amount,sound}); }
  });
}
// Verified against original SCSoundTDK SoundActionMap AND playByActionType:
// ADD is explicitly silent; FOLLOW_KICK uses gen, not ti; GIVE_UP uses kou.
const voices = {
  FOLLOW:'gen', FOLLOW_KICK:'gen', KICK:'ti', NO_KICK:'bt',
  KICK_BACK:'ft', KICK_DEAD:'ft', FOLD:'kou', OPEN:'kai'
};
for (let variant = 1; variant <= 3; variant++) {
  random = (variant - 0.5) / 3;
  for (const [action, voice] of Object.entries(voices)) {
    const c = controller();
    c.game.dealStage = 5;
    if (['FOLLOW_KICK','KICK_BACK','KICK_DEAD'].includes(action)) {
      c.game.kickPhase = 'active'; c.game.kickDepth = 2;
    }
    c._takeAction(ACTION[action]);
    assert.deepEqual(c.sounds, [`man/m_${voice}${variant}`], action);
    assert.ok(fs.existsSync(path.join(root,
      'assets/resources/Games/tdak/tdak/audio/assets/audio', c.sounds[0] + '.mp3')));
  }
}
const add = controller();
add._takeAction(ACTION.ADD, 2);
assert.deepEqual(add.sounds, [], 'raising must not announce folding or kicking');
assert.deepEqual(add.bets, [{chair:0,amount:2,sound:true}], 'raise retains chip animation/sound');
for (const action of [ACTION.FESTER, ACTION.LEISURE, -1]) {
  add._playActionVoice(action);
  assert.deepEqual(add.sounds, [], 'unmapped actions must not fall back to another voice');
}
const invalid = controller();
assert.throws(() => invalid._takeAction(ACTION.OPEN), /illegal action/);
assert.deepEqual(invalid.sounds, [], 'rejected actions must not speak');
invalid.game.currentChair = 1;
invalid._takeAction(ACTION.ADD);
assert.deepEqual(invalid.sounds, [], 'out-of-turn clicks must not speak');

// Bots go through the same verified mapping, including follow-kick responses.
for (const [phase, depth, stage, chair, expected] of [
  ['idle',0,3,1,'gen'], ['idle',0,4,4,'ti'],
  ['active',1,4,1,'gen'], ['active',2,4,4,'ft']
]) {
  random = 0;
  const c = controller();
  Object.assign(c.game, {kickPhase:phase, kickDepth:depth, dealStage:stage, currentChair:chair});
  c._botTurn();
  assert.deepEqual(c.sounds, [`man/m_${expected}1`]);
}
const allIn = controller();
allIn._takeAction(ACTION.ALL_IN);
assert.equal(allIn.game.players[0].allIn, true);
assert.deepEqual(allIn.sounds, ['man/allin']);
assert.ok(fs.existsSync(path.join(root,
  'assets/resources/Games/tdak/tdak/audio/assets/audio/man/allin.mp3')));
Engine.act(allIn.game, ACTION.ALL_IN);
for (const [idx, response] of ['gen2','kai3','kai2'].entries()) {
  random = (idx + 0.5) / 3;
  allIn._playActionVoice(ACTION.ALL_IN);
  assert.equal(allIn.sounds.at(-1), `man/m_${response}`);
}
allIn.game.state = 'finished';
Engine.startRound(allIn.game);
assert.ok(allIn.game.players.every(player => player.allIn === false), 'all-in voice state resets each round');

const muted = controller();
muted._play = methods._play;
muted._effectEnabled = false;
muted._playActionVoice(ACTION.FOLD);
assert.equal(loads.length, 0, 'effect mute applies to action voices');
muted._effectEnabled = true;
muted._playActionVoice(ACTION.FOLD);
assert.equal(loads.length, 1);
assert.match(loads[0], /man\/m_kou[123]$/);
console.log('PASS TDak action audio: original mappings/variants, silent ADD with chips, bot parity, all-in responses/reset, invalid actions and mute');
