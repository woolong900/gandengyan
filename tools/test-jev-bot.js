#!/usr/bin/env node
const assert = require('node:assert/strict');
const { JevBot } = require('../server/jev-bot');
const { Round } = require('../server/round');
const { Table, BOT_MIN_DELAY_MS } = require('../server/table');
const { emptyMember } = require('../server/shared');
const rules = require('../server/rules');

const response = (choice, confidence = 0.9, usage = {}) => ({
  ok: true,
  status: 200,
  json: async () => ({
    answers: { mahjong_action: { type: 'choice', choice, confidence } },
    usage,
  }),
});

const run = async () => {
  let calls = 0;
  let sent = null;
  const bot = new JevBot({ apiKey: 'test-key', minConfidence: 0.55, fetchImpl: async (_url, options) => {
    calls++;
    sent = JSON.parse(options.body);
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    return response('b', 0.91, { input_tokens: 12, output_tokens: 2 });
  } });
  const state = { hand: [11, 12] };
  const criteria = { a: 'first legal action', b: 'second legal action' };
  assert.equal(await bot.choose('mahjong_action', state, criteria, 'a'), 'b');
  assert.equal(sent.model, 'jev-latest');
  assert.deepEqual(Object.keys(sent.questions.mahjong_action.criteria), ['a', 'b']);
  assert.equal(await bot.choose('mahjong_action', state, criteria, 'a'), 'b');
  assert.equal(calls, 1, '相同局面应使用缓存');
  assert.deepEqual({ calls: bot.stats().calls, successes: bot.stats().successes,
    cacheHits: bot.stats().cacheHits, inputTokens: bot.stats().inputTokens },
  { calls: 1, successes: 1, cacheHits: 1, inputTokens: 12 });

  const lowConfidence = new JevBot({ apiKey: 'test-key', minConfidence: 0.55,
    fetchImpl: async () => response('b', 0.2) });
  assert.equal(await lowConfidence.choose('mahjong_action', state, criteria, 'a'), 'a');
  assert.equal(lowConfidence.stats().lowConfidence, 1);
  assert.equal(lowConfidence.stats().fallbacks, 1);

  const invalid = new JevBot({ apiKey: 'test-key', fetchImpl: async () => response('invented', 0.99) });
  assert.equal(await invalid.choose('mahjong_action', state, criteria, 'a'), 'a');
  assert.equal(invalid.stats().invalidChoices, 1);

  const failed = new JevBot({ apiKey: 'test-key', fetchImpl: async () => { throw new Error('offline'); } });
  assert.equal(await failed.choose('mahjong_action', state, criteria, 'a'), 'a');
  assert.equal(failed.stats().errors, 1);

  let calledWithoutKey = false;
  const unconfigured = new JevBot({ apiKey: '', fetchImpl: async () => { calledWithoutKey = true; } });
  assert.equal(await unconfigured.choose('mahjong_action', state, criteria, 'a'), 'a');
  assert.equal(calledWithoutKey, false);
  assert.equal(unconfigured.stats().configured, false);
  assert.equal(unconfigured.stats().fallbacks, 1);

  let gatewayPayload = null;
  const gateway = new JevBot({ apiKey: 'gateway-key', endpoint: 'https://example.test/api/v1/decide',
    fetchImpl: async (_url, options) => {
      gatewayPayload = JSON.parse(options.body);
      return response('a', 0.9);
    } });
  assert.equal(await gateway.choose('mahjong_action', state, criteria, 'b'), 'a');
  assert.equal(Object.hasOwn(gatewayPayload, 'model'), false,
    '兼容网关请求不应携带官方接口专用的 model 字段');

  let smartPayload = null;
  const smartSeats = Array.from({ length: 4 }, (_, index) => ({
    player: { uid: 200001 + index }, site: index + 1, score: 0, bot: index === 0,
  }));
  const smartConfig = rules.parseConfig(...Object.values(rules.buildParam({
    人数: 4, 玩法: '土豪必杠', 只许自摸: true, 清一色: true,
  })));
  const smartRound = new Round(smartSeats, { config: smartConfig, dealerSeat: 0 },
    { log() {}, all() {}, each() {}, one() {}, over() {} });
  smartRound.start();
  smartRound.pizi = 28;
  smartRound.laizi = 29;
  // 两个候选各有取舍（牌形质量 vs 两步收益），应继续交给 Jev 决策。
  smartRound.hands[0] = [38, 37, 1, 37, 16, 36, 27, 38, 16, 35, 27, 2, 16];
  smartRound.drawn[0] = 11;
  smartRound.melds[0] = [];
  smartRound.discards = [[], [], [], []];
  smartRound.shuai = [[], [], [], []];
  const ranked = require('../server/mahjong-bot').rankDiscardOptions(smartRound, 0, { limit: 4 });
  const selectedCard = ranked[ranked.length - 1].card;
  const smartJev = new JevBot({ apiKey: 'test-key', fetchImpl: async (_url, options) => {
    smartPayload = JSON.parse(options.body);
    return response(`discard_${selectedCard}`, 0.9);
  } });
  assert.equal(await smartJev.chooseDiscard(smartRound, 0, ranked[0].card, ranked), selectedCard);
  const smartQuestion = smartPayload.questions.mahjong_action;
  assert.equal(Object.keys(smartQuestion.criteria).length <= 4, true,
    'Jev 只应在本地筛出的四个最优候选中选择');
  assert.equal(Object.values(smartPayload.state.candidateAnalysis).every((item) => (
    Number.isFinite(item.twoPlyExpectedValue) && Number.isFinite(item.expectedScore)
      && Number.isFinite(item.estimatedLiveOuts)
  )), true, 'Jev 候选应包含两步搜索、预期得分和公开信息活张估计');
  assert.deepEqual(smartPayload.state.rules.excludedPatterns, ['pure_suit', 'seven_pairs']);
  assert.equal(JSON.stringify(smartPayload).includes('declaredPureSuit'), false,
    'Jev 状态不应把清一色当成潜江麻将策略');

  // 摸齐三张朝天属于确定性的朝天笑，不能再交给 Jev 选择“过”。
  smartRound.pizi = 5;
  smartRound.laizi = 6;
  smartRound.hands[0] = [1, 2, 3, 4, 5, 5, 7, 8, 9, 11, 12, 13, 14];
  smartRound.drawn[0] = 5;
  smartRound.melds[0] = [];
  smartRound.pending = { kind: 'self', seat: 0, hu: false, qys: false, gang: [5] };
  smartRound.turn = 0;
  let askedJevToPassPizi = false;
  const forcedPizi = smartRound.prepareAutoPlayJev(0, {
    chooseSelfAction: async () => {
      askedJevToPassPizi = true;
      return { op: 'pass', data: {} };
    },
  });
  assert.deepEqual(await forcedPizi.promise, { op: 'gang', data: { card: 5 } });
  assert.equal(askedJevToPassPizi, false, '朝天笑应由规则层直接决定，不允许 Jev 放弃');

  // 对家打出的合法点杠同样是确定性收益，不能再让 Jev 改成“过”。
  smartRound.hands[0] = [7, 7, 7, 1, 2, 4, 5, 8, 9, 11, 12, 13, 14];
  smartRound.drawn[0] = null;
  smartRound.pending = {
    kind: 'discard', from: 1, card: 7,
    candidates: [{ seat: 0, ops: { hu: 0, peng: true, gang: true } }],
    replies: new Map(),
  };
  let askedJevToPassMingGang = false;
  const forcedMingGang = smartRound.prepareAutoPlayJev(0, {
    chooseDiscardResponse: async () => {
      askedJevToPassMingGang = true;
      return { op: 'pass', data: {} };
    },
  });
  assert.deepEqual(await forcedMingGang.promise, { op: 'gang', data: { card: 7 } });
  assert.equal(askedJevToPassMingGang, false, '合法点杠应由规则层直接决定，不允许 Jev 放弃');

  // Jev 返回前若操作窗口已经变化，旧结果绝不能落到下一手。
  let responded = false;
  const pending = { kind: 'self', seat: 0, hu: false, qys: true, gang: [] };
  const fakeRound = {
    over: false,
    pending,
    turn: 0,
    smartBot: () => true,
    automatedSeat: () => true,
    prepareAutoPlayJev: Round.prototype.prepareAutoPlayJev,
    applyPreparedAutoPlayJev: Round.prototype.applyPreparedAutoPlayJev,
    looseTiles: () => [11, 12, 13, 14],
    respond: () => { responded = true; },
  };
  await Round.prototype.autoPlayJev.call(fakeRound, 0, {
    chooseSelfAction: async () => {
      fakeRound.pending = { kind: 'self', seat: 0, hu: false, qys: false, gang: [] };
      return { op: 'qys', data: {} };
    },
  });
  assert.equal(responded, false, '晚到的 Jev 结果不应操作已经变化的牌局');

  // 后台移出托管白名单时，已发出的异步 Jev 请求也不能再落子。
  responded = false;
  fakeRound.pending = pending;
  let managed = true;
  fakeRound.automatedSeat = () => managed;
  await Round.prototype.autoPlayJev.call(fakeRound, 0, {
    chooseSelfAction: async () => {
      managed = false;
      return { op: 'qys', data: {} };
    },
  });
  assert.equal(responded, false, '移出白名单后晚到的 Jev 结果不应再代打');

  // 牌桌在轮到机器人的同一刻就发起请求，提前返回的结果仍要等到最短表现时间。
  let now = 10000;
  let requested = 0;
  let applied = 0;
  let localFallbacks = 0;
  const timers = new Map();
  const config = rules.parseConfig(...Object.values(rules.buildParam({ 人数: 2 })));
  const host = {
    now: () => now,
    random: () => 0,
    schedule: (name, dueAt) => timers.set(name, dueAt),
    cancel: (name) => timers.delete(name),
    send() {}, persist() {}, log() {}, onUidRoom() {},
    jevBot: {},
  };
  const table = new Table({ roomId: 100038, gameType: 2, num: 1, host: 100001, config }, host);
  const member = emptyMember({ uid: 100001, roomId: table.roomId, botStrategy: 'jev' }, {
    site: 1, bot: true, trustee: true, botStrategy: 'jev',
  });
  table.members = [member];
  const prepared = { marker: 'jev-result' };
  let waiting = true;
  table.round = {
    over: false,
    pending: null,
    turn: 0,
    waitingSeats: () => waiting ? [0] : [],
    seatOf: () => 0,
    looseTiles: () => [1, 2, 3],
    prepareAutoPlayJev: () => {
      requested++;
      return { promise: Promise.resolve(prepared) };
    },
    applyPreparedAutoPlayJev: (_snapshot, result) => {
      assert.equal(result, prepared);
      applied++;
      waiting = false;
      return true;
    },
    autoPlay: () => { localFallbacks++; },
  };
  table.armTurns();
  assert.equal(requested, 1, '应在轮到机器人时立即请求 Jev');
  assert.equal(applied, 0, 'Jev 提前返回也不能瞬间出牌');
  await Promise.resolve();
  assert.equal(applied, 0, '决策准备好后仍要等待最短表现时间');
  assert.equal(timers.get(`turn-${member.player.uid}`), now + BOT_MIN_DELAY_MS);
  now += BOT_MIN_DELAY_MS;
  table.onTimer(`turn-${member.player.uid}`);
  assert.deepEqual([applied, localFallbacks], [1, 0], '期限点应使用已准备的 Jev 结果');

  console.log('Jev 机器人：合法选择、缓存、置信度、异常回退及晚到响应保护均通过');
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
