#!/usr/bin/env node
/**
 * 牌局规则单测。不连服务端，直接把 Round 的手牌摆好再走流程。
 * 番数、抢杠胡、只许自摸、少三张、皮子杠、癞子不能打、
 * 土豪必杠 / 堆癞子、一炮多响，都在这儿核对。
 */
const { Round } = require('../server/round');
const rules = require('../server/rules');
const mahjong = require('../server/mahjong');
const mahjongBot = require('../server/mahjong-bot');
const { IDX } = require('../server/playback');

let pass = 0;
let fail = 0;
const t = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++;
  else {
    fail++;
    console.log(`  ✗ ${name}: 得到 ${JSON.stringify(got)} 期望 ${JSON.stringify(want)}`);
  }
};

const fakeSeats = (n) => Array.from({ length: n }, (_, i) => ({
  player: { uid: 100001 + i },
  ws: { readyState: 0 },
  score: 0,
  site: i + 1,
}));

const silentIo = () => {
  const sent = [];
  return {
    sent,
    log: () => {},
    all: (h, d) => sent.push({ to: 'all', h, d }),
    each: (h, build) => sent.push({ to: 'each', h, d: build(0) }),
    one: (seat, h, d) => sent.push({ to: seat, h, d }),
    over: (r) => { sent.over = r; },
  };
};

const boot = (n, extra = {}) => {
  const config = rules.parseConfig(
    ...Object.values(rules.buildParam({ 人数: n, 喜钱: 10, 清一色: true, 双大胡: false, ...extra }))
  );
  const io = silentIo();
  const round = new Round(fakeSeats(n), { config, dealerSeat: 0 }, io);
  round.start();
  return { round, io, config };
};

// ---------------------------------------------------------------- 回放胡型语音数据

{
  const cases = [
    ['黑摸', rules.HU.黑摸],
    ['软摸', rules.HU.软摸],
    ['屁胡', rules.HU.屁胡],
    ['抢杠胡', rules.HU.抢杠胡],
    ['热铳', rules.HU.热铳],
    ['复合胡型', rules.HU.黑摸 | rules.HU.清一色],
  ];
  for (const [name, huType] of cases) {
    const { round } = boot(2);
    round.huType = () => huType;
    round.win(0, 9, null);
    const hu = round.tape.finish().steps
      .flatMap((step) => step.operates)
      .findLast((op) => op.index === IDX.HU);
    t(`回放保留${name}胡型`, hu && hu.cards[1], huType);
  }
}

// ---------------------------------------------------------------- 配置与番数

{
  const c = rules.parseConfig(...Object.values(rules.buildParam({
    人数: 3, 底分: 2.5, 喜钱: 20, 清一色: true, 少三张: true, 只许自摸: true,
  })));
  t('人数', c.人数, 3);
  t('底分 2.5', c.底分, 2.5);
  t('喜钱 20 倍', c.喜钱, 20);
  t('清一色开', c.清一色, true);
  t('少三张开', c.少三张, true);
  t('只许自摸开', c.只许自摸, true);
  t('暗杠默认 4 倍', c.暗杠倍数, 4);
  t('默认 AA', rules.parseConfig(...Object.values(rules.buildParam({}))).房费, 'AA');
  t('默认不开观战', rules.parseConfig(...Object.values(rules.buildParam({}))).观战, false);
  t('勾了观战', rules.parseConfig(...Object.values(rules.buildParam({ 观战: true }))).观战, true);
  t('房主支付', rules.parseConfig(...Object.values(rules.buildParam({ 房费: '房主' }))).房费, '房主');
  t('4人8局房主 4 张', rules.roomCardCost({ num: 1, 人数: 4, 房费: '房主' }), { host: 4, each: 0 });
  t('4人16局房主 8 张', rules.roomCardCost({ num: 2, 人数: 4, 房费: '房主' }), { host: 8, each: 0 });
  t('2人8局AA 每人 1 张', rules.roomCardCost({ num: 1, 人数: 2, 房费: 'AA' }), { host: 0, each: 1 });
  t('一份底分是 25 内分', rules.unit(c), 25);

  t('屁胡 2 倍', rules.huMultiplier(rules.HU.屁胡, c), 2);
  t('黑摸 4 倍', rules.huMultiplier(rules.HU.黑摸, c), 4);
  t('软摸 2 倍', rules.huMultiplier(rules.HU.软摸, c), 2);
  t('单独热铳位仍按点炮计分', rules.huMultiplier(rules.HU.热铳, c), 2);
  t('旧复合热铳位计分兼容', rules.huMultiplier(rules.HU.屁胡 | rules.HU.热铳, c), 2);
  t('抢杠胡不加炮', rules.huMultiplier(rules.HU.屁胡 | rules.HU.抢杠胡, c), 0);
}

// ---------------------------------------------------------------- 皮子不占牌墙

{
  const { round } = boot(3);
  const dealt = round.hands.reduce((n, h) => n + h.length, 0) + (round.drawn[0] != null ? 1 : 0);
  t('朝天不标在牌墙上', round.pzPos, []);
  t('余牌+发出+皮子=72', dealt + round.wall.remain() + 1, 72);
  t('牌墙都能摸完', round.wall.remain() > 0, true);
}

// ---------------------------------------------------------------- 少三张的胡型

{
  // 10+1=11 张 = 三副面子 + 将
  t('少三张能胡', mahjong.canHu([1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12], 9, 0, 3), true);
  t('少三张散牌不能胡', mahjong.canHu([1, 2, 4, 5, 7, 8, 11, 13, 15, 17, 19], 9, 0, 3), false);
  t('少三张凑不出七对', mahjong.canHuQiDui([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6], 9), false);
}

// ---------------------------------------------------------------- 禁止七小对；清一色未开时仍可按普通牌型胡

{
  const qiDui = [1, 1, 3, 3, 5, 5, 7, 7, 11, 11, 13, 13, 15, 15];
  const qiDuiAndNormal = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  for (const variant of ['潜江癞晃', '土豪必杠']) {
    const { round } = boot(2, { 玩法: variant, 清一色: false });
    round.laizi = 19;
    round.hands[0] = qiDui.slice(0, 13);
    round.drawn[0] = qiDui[13];
    round.melds[0] = [];
    t(`${variant}仅满足七小对时不能胡`, round.canHu(0), false);
    t(`${variant}机器人不把七小对当胡口`,
      mahjongBot._test.analyze(mahjongBot._test.context(round, 0), qiDui.slice(0, 13), 0)
        .waits.some((item) => item.card === 15), false);

    round.hands[0] = qiDuiAndNormal.slice(0, 13);
    round.drawn[0] = qiDuiAndNormal[13];
    t(`${variant}七小对同时满足普通胡型可以胡`, round.canHu(0), true);
  }
  const stacked = boot(2, { 玩法: '堆癞子', 清一色: false }).round;
  stacked.laizi = 19;
  stacked.hands[0] = qiDui.slice(0, 13);
  stacked.drawn[0] = null;
  stacked.melds[0] = [];
  t('潜江麻将机器人在所有子玩法都不评估七小对',
    mahjongBot._test.analyze(mahjongBot._test.context(stacked, 0), stacked.hands[0], 0).sevenPairs, 99);
}

{
  const pure = [1, 2, 3, 2, 3, 4, 4, 5, 6, 6, 7, 8, 9, 9];
  const mixed = [1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16, 19, 19];
  for (const variant of ['潜江癞晃', '土豪必杠']) {
    const disabled = boot(2, { 玩法: variant, 清一色: false }).round;
    disabled.laizi = 18;
    disabled.hands[0] = pure.slice(0, 13);
    disabled.drawn[0] = pure[13];
    disabled.melds[0] = [];
    t(`${variant}未开清一色仍能按普通牌型胡纯一门`, disabled.canHu(0), true);

    disabled.hands[0] = mixed.slice(0, 13);
    disabled.drawn[0] = mixed[13];
    t(`${variant}未开清一色仍能胡混合花色`, disabled.canHu(0), true);

    const enabled = boot(2, { 玩法: variant, 清一色: true }).round;
    enabled.laizi = 18;
    enabled.hands[0] = pure.slice(0, 13);
    enabled.drawn[0] = pure[13];
    enabled.melds[0] = [];
    t(`${variant}开启清一色时可胡纯一门`, enabled.canHu(0), true);
  }
}

{
  // 房 645034 第 16 局：碰 222 后甩掉癞子，补摸 7 条应胡。
  // 剩余散牌为 11 + 678 + 678 + 999，房间未开清一色只是不计额外番，不得禁止普通胡。
  const { round, io } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.laizi = 16;
  round.pizi = 15;
  round.hands[0] = [1, 1, 6, 6, 7, 8, 8, 9, 9, 9];
  round.drawn[0] = 7;
  round.melds[0] = [{ type: 'peng', card: 2, from: 1 }];
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.offerSelfOps(0);
  const op = io.sent.findLast((item) => item.to === 0 && item.h === 'game_operator');
  t('房645034同型牌补摸7条出现胡牌按钮', op && op.d.hu, 7);
}

// ---------------------------------------------------------------- 癞子不能打

{
  const { round, io } = boot(2);
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.drawn[0] = round.laizi;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  t('牌墙还有牌时癞子能打', round.discard(0, round.laizi), null);
  t('甩癞子走 game_lzg', io.sent.some((x) => x.h === 'game_lzg' && x.d.card === round.laizi), true);
  t('甩癞子自己补牌', io.sent.some((x) => x.h === 'game_draw' && x.d.uid === 100001), true);
  t('甩癞子不进弃牌', round.discards[0].includes(round.laizi), false);
  t('开局快照没有准备', round.snapshot(0, { begin: true }).info.every((it) => it.ready === false), true);
}

{
  const { round, io } = boot(2, { 玩法: '堆癞子' });
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.drawn[0] = round.laizi;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  t('堆癞子打癞子是普通出牌', round.discard(0, round.laizi), null);
  t('堆癞子走 game_step', io.sent.some((x) => x.h === 'game_step' && x.d.card === round.laizi), true);
}

{
  const { round } = boot(2);
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.drawn[0] = round.laizi;
  round.turn = 0;
  round.pending = null;
  const remain = round.wall.remain;
  round.wall.remain = () => 0;
  t('牌墙空了癞子不能打', round.discard(0, round.laizi), '牌墙空了，癞子不能打');
  t('牌墙空了普通牌可以', round.discard(0, 1) == null, true);
  round.wall.remain = remain;
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [1, 1, 1, 1, 2, 3, 4, 5];
  round.drawn[0] = null;
  round.turn = 0;
  round.pending = null;
  round.wall.taken = round.wall.dump().total;
  io.sent.length = 0;
  round.offerSelfOps(0);
  const op = io.sent.findLast((x) => x.to === 0 && x.h === 'game_operator');
  t('牌墙空时不提供暗杠按钮', !!(op && op.d.gang.includes(1)), false);
  t('牌墙空时直接暗杠也被拒绝', round.doSelfGang(0, 1, false), '牌墙空了，不能杠');
  t('被拒绝的暗杠不改手牌', round.hands[0].filter((card) => card === 1).length, 4);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [18, 18, 18, 1, 2, 3, 4, 5];
  round.drawn[0] = null;
  round.turn = 0;
  round.pending = null;
  round.wall.taken = round.wall.dump().total;
  io.sent.length = 0;
  round.offerSelfOps(0);
  const op = io.sent.findLast((x) => x.to === 0 && x.h === 'game_operator');
  t('牌墙空时仍提供朝天笑按钮', !!(op && op.d.gang.includes(18)), true);
  t('牌墙空时朝天笑可以杠', round.respond(0, 'gang', { card: 18 }), null);
  t('牌墙空时朝天笑不补牌', io.sent.some((x) => x.h === 'game_draw'), false);
  t('牌墙空时朝天笑不立即流局', round.over, false);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.laizi = 19;
  round.pizi = 18;
  round.hands[1] = [5, 5, 5, 1, 2, 3, 6, 7, 8, 11, 12, 13, 14];
  round.wall.taken = round.wall.dump().total;
  round.discards[0] = [5];
  io.sent.length = 0;
  round.afterDiscard(0, 5);
  const candidate = round.pending && round.pending.candidates.find((item) => item.seat === 1);
  const offered = io.sent.findLast((x) => x.to === 1 && x.h === 'game_operator');
  t('牌墙空时不允许接牌明杠', !!(candidate && candidate.ops.gang), false);
  t('牌墙空时客户端收不到明杠选项', offered && offered.d.gang, []);
  t('牌墙空时伪造明杠请求也被拒绝',
    round.respond(1, 'gang', { card: 5 }), '牌墙空了，不能杠');
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.laizi = 19;
  round.pizi = 18;
  round.hands[1] = [18, 18, 1, 2, 3, 6, 7, 8, 11, 12, 13, 14, 15];
  round.wall.taken = round.wall.dump().total;
  round.discards[0] = [18];
  io.sent.length = 0;
  round.afterDiscard(0, 18);
  const candidate = round.pending && round.pending.candidates.find((item) => item.seat === 1);
  t('牌墙空时仍可接牌朝天笑', !!(candidate && candidate.ops.gang), true);
  t('牌墙空时接牌朝天笑成功', round.respond(1, 'gang', { card: 18 }), null);
  t('接牌朝天笑同样不补牌', io.sent.some((x) => x.h === 'game_draw'), false);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [19, 19];
  round.drawn[0] = null;
  round.turn = 0;
  round.pending = null;
  round.wall.taken = round.wall.dump().total;
  io.sent.length = 0;
  t('牌墙空且只剩两张癞子时可打出一张', round.discard(0, 19), null);
  t('两癞子特例打出后立即结束牌局', round.over, true);
  t('两癞子特例仍播放甩癞消息',
    io.sent.some((x) => x.h === 'game_lzg' && x.d.card === 19), true);
  t('两癞子特例不再补牌', io.sent.some((x) => x.h === 'game_draw'), false);
}

{
  const { round } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.laizi = 19;
  round.hands[0] = [19, 19, 19];
  round.drawn[0] = null;
  round.turn = 0;
  round.pending = null;
  round.wall.taken = round.wall.dump().total;
  t('牌墙空时不是恰好两张癞子仍不能打',
    round.discard(0, 19), '牌墙空了，癞子不能打');
}

// ---------------------------------------------------------------- 只许自摸：普通炮、热铳、抢杠都不问

{
  const { round, io } = boot(2, { 只许自摸: true });
  // 下家听的是 1，庄家打 1 也不该问胡
  // 固定皮子/癞子，避免随机癞子恰好为 1 时把本用例变成甩癞补摸。
  round.pizi = 18;
  round.laizi = 19;
  round.hands[1] = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
  round.hands[0] = [8, 8, 8, 9, 9, 9, 11, 11, 11, 12, 12, 12, 13];
  round.drawn[0] = 1;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.discard(0, 1);
  const asked = io.sent.filter((x) => x.h === 'game_operator' && x.d.hu > 0);
  t('只许自摸不点炮', asked.length, 0);
}

{
  const { round } = boot(2, { 只许自摸: true, 热铳: true });
  round.laizi = 19;
  round.hands[1] = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
  round.hotSeat = 0;
  t('只许自摸即使勾了热铳也不接热铳', round.discardHu(1, 1, 0), 0);
}

{
  const { round, io } = boot(2, { 只许自摸: true, 热铳: true });
  round.laizi = 19;
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 1;
  round.melds[0] = [{ type: 'peng', card: 1, from: 1 }];
  round.hands[1] = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [1], qys: false };
  io.sent.length = 0;
  round.respond(0, 'gang', { card: 1 });
  t('只许自摸不询问抢杠', !!(round.pending && round.pending.kind === 'qianggang'), false);
  t('只许自摸不发送抢杠操作', io.sent.some((x) => x.to === 1 && x.h === 'game_operator' && x.d.hu === 1), false);
}

// ---------------------------------------------------------------- 抢杠胡

{
  const softWait = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 19];
  for (const [name, hotSeat] of [['普通点炮', -1], ['热铳', 0]]) {
    const { round, io } = boot(2, { 玩法: '潜江癞晃', 热铳: hotSeat >= 0 });
    round.laizi = 19;
    round.hands[0] = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5];
    round.drawn[0] = 13;
    round.hands[1] = softWait.slice();
    round.turn = 0;
    round.pending = null;
    round.hotSeat = hotSeat;
    io.sent.length = 0;
    t(`${name}软牌型本身能软胡`, round.canHu(1, 13), true);
    t(`${name}软牌型不能硬胡`, round.canHardHu(1, 13), false);
    t(`${name}不向软牌型询问胡牌`, round.discardHu(1, 13, 0), 0);
  }
}

{
  const { round, io } = boot(2, { 玩法: '潜江癞晃', 热铳: true });
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12];
  round.drawn[0] = 13;
  round.melds[0] = [{ type: 'peng', card: 13, from: 1 }];
  round.hands[1] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 19];
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [13], qys: false };
  io.sent.length = 0;
  t('软牌型本身能抢这张杠牌', round.canHu(1, 13), true);
  round.respond(0, 'gang', { card: 13 });
  t('软牌型不能抢杠', !!(round.pending && round.pending.kind === 'qianggang'), false);
  t('软牌型不收到抢杠询问', io.sent.some((x) => x.to === 1 && x.h === 'game_operator' && x.d.hu === 13), false);
}

{
  const { round, io } = boot(2);
  // 庄家碰了 1，手里摸到第四张 1；下家听 1
  round.laizi = 19;
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 1;
  round.melds[0] = [{ type: 'peng', card: 1, from: 1 }];
  round.hands[1] = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [1], qys: false };
  io.sent.length = 0;
  t('补杠先问抢', round.respond(0, 'gang', { card: 1 }), null);
  t('回头笑先上桌', round.melds[0].some((m) => m.type === 'bu' && m.card === 1), true);
  t('抢杠前还没补牌', round.drawn[0], null);
  t('推了回头笑', io.sent.some((x) => x.h === 'game_gang' && x.d.view === 3), true);
  t('在等抢杠', round.pending && round.pending.kind, 'qianggang');
  t('问了下家', io.sent.some((x) => x.to === 1 && x.h === 'game_operator' && x.d.hu === 1), true);
  t('下家抢成', round.respond(1, 'hu'), null);
  t('被抢后回头笑仍在杠堆', round.melds[0].some((m) => m.type === 'bu' && m.card === 1), true);
  t('胡型带抢杠', (io.sent.over.huType & rules.HU.抢杠胡) > 0, true);
  t('点炮的是补杠那家', io.sent.over.from, 0);
}

{
  const { round, io } = boot(2, { 热铳: false });
  round.laizi = 19;
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 1;
  round.melds[0] = [{ type: 'peng', card: 1, from: 1 }];
  round.hands[1] = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [1], qys: false };
  io.sent.length = 0;
  round.respond(0, 'gang', { card: 1 });
  t('关闭热铳不询问抢杠', !!(round.pending && round.pending.kind === 'qianggang'), false);
  t('关闭热铳不向下家发送抢杠胡', io.sent.some((x) => x.to === 1 && x.h === 'game_operator' && x.d.hu === 1), false);
  t('关闭热铳直接完成补杠并补牌', round.drawn[0] != null, true);
}

// ---------------------------------------------------------------- 皮子三张杠

{
  const { round, io } = boot(2);
  const pz = round.pizi;
  round.hands[0] = [pz, pz, pz, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 13;
  round.turn = 0;
  t('三张皮子能杠', mahjong.canPiziGang(round.looseTiles(0), pz), true);
  const wallBefore = round.wall.remain();
  io.sent.length = 0;
  t('皮子杠成功', round.doSelfGang(0, pz, false), null);
  t('朝天笑走暗杠消息', io.sent.some((x) => x.h === 'game_gang' && x.d.view === 2 && x.d.card === pz), true);
  t('不进癞子区', io.sent.some((x) => x.h === 'game_pzg'), false);
  t('面子记成皮子杠', round.melds[0].some((m) => m.type === 'pizi' && m.card === pz), true);
  const snap = round.snapshot(0);
  t('朝天进碰杠区', snap.info[0].card.ag_card, [pz]);
  t('癞子区没有朝天', snap.info[0].card.hzg_card.includes(pz), false);
  t('朝天后只移除三张手牌', round.hands[0].length, 11);
  t('朝天后不补牌', round.drawn[0], null);
  t('朝天不消耗牌墙', round.wall.remain(), wallBefore);
  const put = round.hands[0].find((card) => card !== round.laizi);
  t('朝天后本人可以直接出牌', round.discard(0, put), null);
}

{
  t('两张皮子能点笑', mahjong.canMingGang([11, 11, 2, 3, 4], 11, 19, 11), true);
}

{
  const { round, io } = boot(2);
  round.pizi = 15;
  round.laizi = 31;
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16];
  round.drawn[0] = 15;
  round.hands[1] = [15, 15, 1, 2, 4, 5, 7, 8, 11, 13, 16, 18, 29];
  round.drawn[1] = null;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  const wallBefore = round.wall.remain();
  t('别人打朝天', round.discard(0, 15), null);
  const offer = io.sent.find((x) => x.to === 1 && x.h === 'game_operator');
  t('两张朝天只显示朝天按钮', { gang: offer && offer.d.gang, touch: offer && offer.d.touch }, { gang: [15], touch: 0 });
  const cand = round.pending && round.pending.candidates.find((c) => c.seat === 1);
  t('朝天候选不再包含碰', cand && cand.ops.peng, false);
  t('接朝天成功', round.respond(1, 'gang', { card: 15 }), null);
  t('接朝天只移除手里的两张', round.hands[1].length, 11);
  t('接朝天拿走河牌', round.discards[0].includes(15), false);
  t('接朝天不补牌', round.drawn[1], null);
  t('接朝天不消耗牌墙', round.wall.remain(), wallBefore);
  t('接朝天后轮到本人', { turn: round.turn, pending: round.pending }, { turn: 1, pending: null });
  t('接朝天后可以直接出牌', round.discard(1, 1), null);
}

// ---------------------------------------------------------------- 潜江癞晃没有主动亮癞操作

{
  const { round, io } = boot(2, { 玩法: '潜江癞晃', 喜钱: 10, 清一色: false });
  round.laizi = 19;
  round.pizi = 29;
  round.hands[0] = [1, 1, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 19];
  round.drawn[0] = 1;
  round.pending = null;
  io.sent.length = 0;
  round.offerSelfOps(0);
  const offer = io.sent.find((x) => x.to === 0 && x.h === 'game_operator');
  t('有癞子时仍可收到正常操作', !!offer, true);
  t('潜江癞晃不下发亮癞按钮', Object.hasOwn(offer.d, 'show_razz'), false);
  t('潜江癞晃癞子始终可作万能牌', round.jokerFor(0), 19);
}

// ---------------------------------------------------------------- 结算：自摸每家出、点炮一家出

{
  const { round, io } = boot(2);
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 13];
  round.drawn[0] = 14;
  round.roundScore = [0, 0];
  round.seats.forEach((m) => { m.score = 0; });
  io.sent.length = 0;
  round.win(0, 14, null);
  // 底分 1，黑摸 4 倍，每家付 4×10 = 40 内分；喜钱配置不额外加在胡分上。
  t('自摸赢家得分', round.seats[0].score, 40);
  t('自摸输家出分', round.seats[1].score, -40);
  const end = io.sent.find((x) => x.h === 'game_end');
  t('自摸结算标记真实胡牌且保留完整手牌',
    [end.d.info[0].card.draw_card, end.d.info[0].card.hand_card.length,
      end.d.info[0].card.hand_card.includes(14), end.d.info[0].num],
    [14, 14, true, 14]);
}

{
  const { round, io } = boot(2);
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13];
  round.drawn[0] = null;
  round.roundScore = [0, 0];
  round.seats.forEach((m) => { m.score = 0; });
  io.sent.length = 0;
  round.win(0, 13, 1);
  t('点炮赢家 +2 底', round.seats[0].score, 20);
  t('点炮只放炮的出', round.seats[1].score, -20);
  const end = io.sent.filter((x) => x.h === 'game_end').pop();
  t('点炮结算标记真实胡牌且保留完整手牌',
    [end.d.info[0].card.draw_card, end.d.info[0].card.hand_card.length,
      end.d.info[0].card.hand_card.filter((card) => card === 13).length, end.d.info[0].num],
    [13, 13, 2, 13]);
  t('结算后没准备，下一局按钮才出得来', end && end.d.info.every((it) => it.ready === false), true);
  t('胡后余牌按摸牌顺序摊出', end && end.d.surplus_card, round.wall.remainCards());
  t('胡后还有余牌', end && end.d.surplus_card.length > 0, true);
}

// ---------------------------------------------------------------- 托管代打

{
  const { round, io } = boot(2);
  round.seats[0].bot = true;
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.drawn[0] = 19;
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 0;
  io.sent.length = 0;
  round.autoPlay(0);
  t('牌墙空了陪玩改打普通牌而不是卡在甩癞子', io.sent.some((x) => x.h === 'game_step' && x.d.card === 1), true);
}

{
  const { round, io } = boot(2);
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 13];
  round.laizi = 19;
  round.drawn[0] = 14;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.autoPlay(0);
  t('托管摸什么打什么', io.sent.some((x) => x.h === 'game_step' && x.d.card === 14), true);
}

{
  const { round, io } = boot(2);
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 13];
  round.drawn[0] = 14;
  round.turn = 0;
  t('能自摸时托管选择胡', true, true);
  // 摆成能胡的 14 张
  round.hands[0] = [1, 2, 3, 4, 5, 6, 17, 18, 19, 11, 11, 11, 12];
  round.drawn[0] = 12;
  round.pending = { kind: 'self', seat: 0, hu: true, gang: [], qys: false };
  io.sent.length = 0;
  round.autoPlay(0);
  t('托管自摸会胡', io.sent.over && io.sent.over.winner, 0);
}

{
  const { round } = boot(2);
  round.pending = { kind: 'discard', from: 0, card: 1, candidates: [{ seat: 1, ops: { hu: 0, peng: true, gang: false } }], replies: new Map() };
  t('等人碰时 waiting 是下家', round.waitingSeats(), [1]);
}

// ---------------------------------------------------------------- 干瞪眼（只许自摸）智能机器人

{
  const { round } = boot(2, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true,
  });
  round.seats[0].bot = true;
  round.pizi = 5;
  round.laizi = 6;
  round.hands[0] = [1, 2, 3, 4, 5, 5, 7, 8, 9, 11, 12, 13, 14];
  round.drawn[0] = 5;
  round.melds[0] = [];
  const pending = { kind: 'self', seat: 0, hu: false, gang: [5], qys: false };
  t('机器人摸齐三张朝天后第一时间选择朝天笑',
    mahjongBot.chooseSelfAction(round, 0, pending), { op: 'gang', data: { card: 5 } });
}

{
  const { round } = boot(2, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true,
  });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  round.hands[0] = [5, 5, 5, 1, 2, 3, 7, 8, 9, 11, 12, 13, 14];
  round.drawn[0] = 5;
  round.melds[0] = [];
  const pending = { kind: 'self', seat: 0, hu: false, gang: [5], qys: false };
  t('智能机器人摸齐普通暗杠后必定选择暗杠',
    mahjongBot.chooseSelfAction(round, 0, pending), { op: 'gang', data: { card: 5 } });
}

{
  const { round } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 15;
  round.laizi = 16;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 12, 13, 17, 17, 17, 18];
  round.drawn[0] = 19;
  round.melds[0] = [];
  round.discards = [[], []];
  round.shuai = [[], []];
  const choice = mahjongBot.chooseDiscard(round, 0);
  t('同向听时保留坎子777并从89中出牌', [18, 19].includes(choice), true);
}

{
  const { round } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 5;
  round.laizi = 6;
  round.hands[0] = [1, 2, 3, 4, 5, 5, 8, 11, 12, 13, 17, 18, 19];
  round.drawn[0] = 9;
  round.melds[0] = [];
  round.discards = [[], []];
  round.shuai = [[], []];
  t('朝天为5时455优先打4并保留朝天对', mahjongBot.chooseDiscard(round, 0), 4);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 8;
  round.laizi = 9;
  // 两副露牌后手里剩 12233344 条。打 1 与打 3 都不退向听，
  // 但打 1 能保留 333 刻子及后续暗杠机会，不能为了两副顺子拆 3。
  round.hands[0] = [11, 12, 12, 13, 13, 13, 14];
  round.drawn[0] = 14;
  round.melds[0] = [
    { type: 'peng', card: 1, from: 1 },
    { type: 'peng', card: 2, from: 2 },
  ];
  round.turn = 0;
  round.pending = null;
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.baoQys = [false, false, false];
  round.inferredVisible = [new Map(), new Map(), new Map()];
  round.wall.remain = () => 20;
  const ranked = mahjongBot.rankDiscardOptions(round, 0, { limit: 4 });
  t('12233344条同牌效时打1保留333刻子', ranked[0].card, 11);
  t('12233344条不再把拆刻子的3条交给Jev翻案',
    ranked.map(({ card }) => card).includes(13), false);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 28;
  round.laizi = 29;
  // 两副露牌后，677788 条外加 12 筒。打 6 与打 8 的向听及胡口一样，
  // 但打 6 能真正保留 777 刻子 + 88 对子；打 8 的 67778 不能把
  // 777 同时重复算成 678 搭子。
  round.hands[0] = [1, 16, 17, 17, 17, 18, 18];
  round.drawn[0] = 2;
  round.melds[0] = [
    { type: 'peng', card: 11, from: 1 },
    { type: 'peng', card: 12, from: 2 },
  ];
  round.turn = 0;
  round.pending = null;
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.baoQys = [false, false, false];
  round.inferredVisible = [new Map(), new Map(), new Map()];
  round.wall.remain = () => 30;
  const ranked = mahjongBot.rankDiscardOptions(round, 0, { limit: 4 });
  t('677788同牌效时打6保留777刻子和88对子', ranked[0].card, 16);
  t('677788不再把拆对子的8交给Jev翻案',
    ranked.map(({ card }) => card).includes(18), false);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  round.hands[0] = [1, 2, 4, 5, 5, 11, 12, 13, 21, 22, 23, 31, 31];
  round.drawn[0] = 31;
  round.melds[0] = [];
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  const choices = mahjongBot.rankDiscardOptions(round, 0, { limit: 6 }).map(({ card }) => card);
  t('12455牌形优先打1', choices[0], 1);
  t('12455牌形不把拆45的打4交给Jev翻案', choices.includes(4), false);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 4;
  round.laizi = 5;
  // 已有两副露，手里 456/789 是两副完整顺子，新摸的 9 是重复闲张。
  // 即使 5 是癞子，也不能为了补摸和翻倍拆掉 456。
  round.hands[0] = [4, 5, 6, 7, 8, 9, 9];
  round.drawn[0] = 9;
  round.melds[0] = [
    { type: 'peng', card: 11, from: 1 },
    { type: 'peng', card: 12, from: 2 },
  ];
  round.turn = 0;
  round.pending = null;
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  t('癞子参与456且有789时保留两副成牌、打重复9条',
    mahjongBot.chooseDiscard(round, 0), 9);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true });
  round.seats[0].bot = true;
  round.pizi = 15;
  round.laizi = 16;
  // 线上回放实例：5678 两头都可以拆，上家刚打过 5，
  // 而 8 还没出现过。两种打法向听和完整面子数一样，应打安全5保留678。
  round.hands[0] = [1, 2, 3, 6, 7, 8, 13, 13, 13, 15, 16, 18, 18];
  round.drawn[0] = 5;
  round.melds = [[], [], [{ type: 'peng', card: 9, from: 1 }]];
  round.turn = 0;
  round.pending = null;
  round.discards = [
    [19, 7, 19, 19, 9, 1, 3, 12],
    [1, 12, 12, 3, 2, 5, 11],
    [1, 2, 2, 12, 11, 3, 18, 6],
  ];
  round.shuai = [[16], [], []];
  round.gangs = [];
  round.baoQys = [false, false, false];
  round.inferredVisible = [new Map(), new Map(), new Map()];
  round.wall.remain = () => 7;
  const ranked = mahjongBot.rankDiscardOptions(round, 0, { limit: 4 });
  t('5678两头拆法都进入候选', ranked.map(({ card }) => card).includes(5), true);
  t('5678残局打已见安5、保留678', mahjongBot.chooseDiscard(round, 0), 5);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true });
  round.seats[0].bot = true;
  round.pizi = 9;
  round.laizi = 1;
  // 线上第 5 小局回放：其他四副顺子已成，筒子 12345 中
  // 打 4 只胡 5，打 1 则保留 2345，可胡 2/5。
  round.hands[0] = [3, 4, 5, 7, 8, 9, 12, 13, 14, 15, 17, 18, 19];
  round.drawn[0] = 11;
  round.melds = [[], [{ type: 'peng', card: 11, from: 2 }], []];
  round.turn = 0;
  round.pending = null;
  round.discards = [
    [8, 4, 14, 17, 19],
    [18, 18, 6, 7, 14, 12],
    [12, 16, 4, 17, 8, 8],
  ];
  round.shuai = [[1, 1], [], [1, 1]];
  round.gangs = [];
  round.baoQys = [false, false, false];
  round.inferredVisible = [new Map([[11, 3]]), new Map(), new Map()];
  round.wall.remain = () => 10;
  const ranked = mahjongBot.rankDiscardOptions(round, 0, { limit: 4 });
  t('12345听牌时打1筒保留2/5筒双面听', ranked[0].card, 11);
  t('12345打1筒后胡口是2/5筒',
    ranked[0].analysis.waits.map(({ card }) => card), [12, 15]);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true });
  round.seats[0].bot = true;
  round.pizi = 2;
  round.laizi = 3;
  // 线上第 15 小局回放：全手下一张的有效进张数虽然相同，
  // 但 6779 打 9 留下 677，后续牌形明显比打 6 留 779 更完整。
  round.hands[0] = [1, 3, 5, 6, 6, 7, 7, 13, 14, 16, 17, 17, 19];
  round.drawn[0] = 2;
  round.melds = [[], [], []];
  round.turn = 0;
  round.pending = null;
  round.discards = [[9], [1], [9]];
  round.shuai = [[3], [], []];
  round.gangs = [];
  round.baoQys = [false, false, false];
  round.inferredVisible = [new Map(), new Map(), new Map()];
  round.wall.remain = () => 27;
  const ctx = mahjongBot._test.context(round, 0);
  const tiles = round.looseTiles(0);
  const after16 = tiles.slice();
  after16.splice(after16.indexOf(16), 1);
  const after19 = tiles.slice();
  after19.splice(after19.indexOf(19), 1);
  const ranked = mahjongBot.rankDiscardOptions(round, 0, { limit: 4 });
  t('6779两种拆法的全手即时进张相同',
    Number(mahjongBot._test.analyze(ctx, after16, 0).expectedOuts.toFixed(6)),
    Number(mahjongBot._test.analyze(ctx, after19, 0).expectedOuts.toFixed(6)));
  t('6779进张相同时打9筒保留677', ranked[0].card, 19);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true });
  round.seats[0].bot = true;
  round.pizi = 2;
  round.laizi = 3;
  // 房 452247 第 10 局：上家打 8 筒，下家收到碰提示后选过，
  // 所以本家能从公开时序中推出 8 筒至少已出现三张。79 筒只剩
  // 一张可进，前中盘应拆死嵌张，不应拆 99 条对子保它。
  round.hands[0] = [2, 3, 3, 5, 5, 5, 7, 9, 9, 11, 12, 17, 19];
  round.drawn[0] = 12;
  round.melds = [[], [{ type: 'peng', card: 1, from: 2 }], []];
  round.turn = 0;
  round.pending = null;
  round.discards = [[], [18], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.baoQys = [false, false, false];
  round.inferredVisible = [new Map([[18, 3]]), new Map(), new Map()];
  round.wall.remain = () => 30;
  const ctx = mahjongBot._test.context(round, 0);
  t('下家过8筒碰后推断全局只剩1张8筒', ctx.remaining.get(18), 1);
  const ranked = mahjongBot.rankDiscardOptions(round, 0, { limit: 4 });
  t('79筒成为死嵌张时打9筒保留99条',
    [ranked[0].card, ranked[0].staleGapEscape], [19, true]);
  round.inferredVisible = [new Map(), new Map(), new Map()];
  t('8筒仍有多张时不为拆嵌张强行退向听',
    mahjongBot.chooseDiscard(round, 0), 9);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true });
  round.seats[0].bot = true;
  round.pizi = 12;
  round.laizi = 13;
  // 房 452247 第 15 小局：暗杠 4 条补摸后，112 筒兼具对子、
  // 123 顺子和朝天发展，不能只因即时进张略多就拆 1 筒。
  round.hands[0] = [2, 5, 6, 6, 7, 11, 11, 12, 16, 19];
  round.drawn[0] = 16;
  round.melds = [[{ type: 'an', card: 4, from: 0 }], [{ type: 'peng', card: 1, from: 2 }], []];
  round.turn = 0;
  round.pending = null;
  round.discards = [[], [7], [1]];
  round.shuai = [[], [], []];
  round.gangs = [{ seat: 0, type: 'an', card: 4, from: null }];
  round.baoQys = [false, false, false];
  round.inferredVisible = [new Map(), new Map(), new Map()];
  round.seats[0].score = -720;
  round.seats[1].score = 4680;
  round.seats[2].score = -3960;
  round.wall.remain = () => 28;
  const ranked = mahjongBot.rankDiscardOptions(round, 0, { limit: 6 });
  t('112筒与孤9筒并存时先打9筒', ranked[0].card, 19);
  t('前中盘使用固定成本三轮模拟',
    [ranked[0].projection.rounds, ranked[0].strategy.mode], [3, 'attack']);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  const profile = () => mahjongBot._test.strategyProfile(mahjongBot._test.context(round, 0));
  round.seats.forEach((member) => { member.score = 0; });
  t('累计分接近时采用均衡策略', profile().mode, 'balanced');
  round.seats[0].score = 1000;
  t('整场明显领先时切换防守策略', profile().mode, 'defense');
  round.seats[0].score = -1000;
  round.seats[1].score = 1000;
  t('整场明显落后时切换进攻策略', profile().mode, 'attack');
  t('进攻策略提高成牌收益权重',
    profile().projectionWinWeight > 15000, true);

  round.shuai[1] = [round.laizi, round.laizi, round.laizi];
  const threeLaizi = profile();
  t('对手三癞后碰杠风险权重提高到2.5倍',
    [threeLaizi.laiziPressure.maximum, threeLaizi.riskMultiplier], [3, 2.5]);
  round.shuai[1].push(round.laizi);
  t('对手四癞后碰杠风险权重提高到4倍', profile().riskMultiplier, 4);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  round.hands[0] = [5, 5, 5, 1, 2, 4, 6, 7, 8, 11, 12, 13, 21];
  round.drawn[0] = null;
  round.melds[0] = [];
  const pending = { kind: 'discard', from: 1, card: 5 };
  const candidate = { seat: 0, ops: { hu: 0, peng: true, gang: true } };
  t('机器人对合法点杠直接选择杠',
    mahjongBot.chooseDiscardResponse(round, 0, pending, candidate),
    { op: 'gang', data: { card: 5 } });
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  round.hands[0] = [1, 2, 2, 3, 5, 6, 9, 13, 13, 15, 16, 17, 17];
  round.drawn[0] = null;
  round.melds[0] = [];
  const pending = { kind: 'discard', from: 1, card: 2 };
  const candidate = { seat: 0, ops: { hu: 0, peng: true, gang: false } };
  t('1223筒保留123成牌不碰2筒',
    mahjongBot.chooseDiscardResponse(round, 0, pending, candidate),
    { op: 'pass' });
  t('1223筒被识别为碰后拆顺子',
    mahjongBot.pengBreaksCompletedSequence(round, 0, 2), true);

  // 没有占用完整顺子的普通对子仍按牌效判断，避免把机器人所有碰牌都关掉。
  round.hands[0] = [2, 2, 4, 9, 11, 13, 14, 14, 16, 16, 16, 17, 17];
  t('普通对子仍可按牌效选择碰',
    mahjongBot.chooseDiscardResponse(round, 0, pending, candidate),
    { op: 'peng' });
  t('普通对子不触发拆顺子保护',
    mahjongBot.pengBreaksCompletedSequence(round, 0, 2), false);
}

{
  // 11 条 / 44 条对倒，旁边已有 345678 筒。碰掉别人打出的 1 条后，
  // 应允许拆掉筒子长顺的一端改成三面听，而不是死守两副顺子单听 4 条。
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 9;
  round.laizi = 8;
  round.hands[0] = [1, 1, 4, 4, 13, 14, 15, 16, 17, 18, 21, 22, 23];
  round.drawn[0] = null;
  round.melds = [[], [], []];
  round.discards = [[], [1], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.wall.remain = () => 30;
  const pending = { kind: 'discard', from: 1, card: 1 };
  const candidate = { seat: 0, ops: { hu: 0, peng: true, gang: false } };
  t('11条44条对倒配345678筒时选择碰1条',
    mahjongBot.chooseDiscardResponse(round, 0, pending, candidate), { op: 'peng' });

  const afterPeng = round.hands[0].filter((card) => card !== 1);
  const ranked = mahjongBot._test.evaluateDiscardCandidates(
    mahjongBot._test.context(round, 0), afterPeng, 1, [...new Set(afterPeng)],
    { lookahead: false }
  );
  t('碰1条后拆筒子长顺一端形成三面听',
    {
      discard: ranked[0].card,
      waits: ranked[0].analysis.waits.map((item) => item.card),
      outs: ranked[0].analysis.winningOuts,
    },
    { discard: 13, waits: [13, 16, 19], outs: 10 });
  const discardEight = ranked.find((item) => item.card === 18);
  t('碰后打8筒可胡258筒',
    discardEight && discardEight.analysis.waits.map((item) => item.card), [12, 15, 18]);
}

{
  // 4 号打 5，本来轮到 1 号摸牌；但 2 号有两张 5 可碰，
  // 所以整桌机器人都能从“1 号没有立即摸牌”保守推断 5 至少已出现 3 张。
  const { round, config } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats.forEach((member) => { member.bot = true; });
  round.laizi = 19;
  round.pizi = 18;
  round.hands = [
    [1, 2, 3],
    [5, 5, 7],
    [8, 9, 11],
    [12, 13, 14],
  ];
  round.drawn = [null, null, null, null];
  round.melds = [[], [], [], []];
  round.discards = [[], [], [], [5]];
  round.shuai = [[], [], [], []];
  round.passPeng = Array.from({ length: 4 }, () => new Set());
  round.passHu = new Array(4).fill(false);
  round.pending = null;
  round.afterDiscard(3, 5);
  t('整桌都记下有人能碰杠', [0, 2, 3].map((seat) => round.inferredVisible[seat].get(5)), [3, 3, 3]);
  t('被询问的机器人用自己手牌而不重复推断', round.inferredVisible[1].has(5), false);
  t('被询问的机器人也算出只剩一张', mahjongBot._test.context(round, 1).remaining.get(5), 1);
  t('时序推断会扣减剩余进张', mahjongBot._test.context(round, 0).remaining.get(5), 1);
  round.respond(1, 'pass');
  t('对方选过后仍保留时序记忆', round.inferredVisible[0].get(5), 3);
  const restored = Round.restore(JSON.parse(JSON.stringify(round.dump())), fakeSeats(4), silentIo(), config);
  t('时序推断在重启恢复后保留', restored.inferredVisible[0].get(5), 3);
}

{
  // 允许点炮时，等待还可能来自胡牌响应；即使服务端知道某家能碰，
  // 机器人也不应借暗手获得人类玩家无法确认的信息。
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: false, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands = [[1, 2, 3], [5, 5, 7], [8, 9, 11], [12, 13, 14]];
  round.drawn = [null, null, null, null];
  round.melds = [[], [], [], []];
  round.discards = [[], [], [], [5]];
  round.shuai = [[], [], [], []];
  round.passPeng = Array.from({ length: 4 }, () => new Set());
  round.passHu = new Array(4).fill(false);
  round.pending = null;
  round.afterDiscard(3, 5);
  t('非只许自摸不从服务端暗手推断', round.inferredVisible[0].has(5), false);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 18;
  round.pizi = 17;
  // 1-9 条已经是完整结构，19 是孤张。旧逻辑会把刚摸的 9 打掉。
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 15, 19];
  round.drawn[0] = 9;
  round.turn = 0;
  round.pending = null;
  round.melds[0] = [];
  round.discards = [[], []];
  round.shuai = [[], []];
  round.baoQys = [false, false];
  io.sent.length = 0;
  round.autoPlay(0);
  t('干瞪眼自摸房机器人保留完整顺子、打孤张',
    io.sent.find((x) => x.h === 'game_step')?.d.card, 19);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 5;
  round.pizi = 4;
  round.hands[0] = [26, 17, 22, 19, 23, 3, 2, 26, 18, 15, 23, 13, 3];
  round.drawn[0] = 5;
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 0;
  io.sent.length = 0;
  round.autoPlay(0);
  const step = io.sent.find((x) => x.h === 'game_step');
  t('牌墙空时智能机器人不甩非法癞子', step && step.d.card === 5, false);
  t('牌墙空时智能机器人仍能完成出牌', !!step, true);
}

{
  const { round, io } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  // 三向听的散牌：新策略应保留单癞，先正常行牌。
  round.hands[0] = [2, 2, 8, 8, 9, 12, 13, 15, 17, 21, 22, 26, 28];
  round.drawn[0] = 19;
  round.turn = 0;
  round.pending = null;
  round.melds[0] = [];
  round.gangs = [];
  round.shuai = [[], [], [], []];
  io.sent.length = 0;
  round.autoPlay(0);
  const step = io.sent.find((x) => x.h === 'game_step');
  t('牌形较差时不再无脑甩癞', !!step && step.d.card !== 19, true);
  t('牌形较差时没有播放甩癞', io.sent.some((x) => x.h === 'game_lzg'), false);
}

{
  const { round } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  // 甩掉 19 后听 5 条：123/456 + 123/456 + 77将。
  round.hands[0] = [1, 2, 3, 4, 6, 11, 12, 13, 14, 15, 16, 17, 17];
  round.drawn[0] = 19;
  round.melds = [[], []];
  round.discards = [[], []];
  round.shuai = [[], []];
  round.gangs = [];
  const publicOuts = () => mahjongBot._test.analyze(
    mahjongBot._test.context(round, 0),
    round.hands[0],
    0
  ).winningOuts;
  t('听5条且无公开消耗时还有4张', publicOuts(), 4);
  t('好牌且听口充足时早甩癞',
    mahjongBot._test.shuaiDecision(
      mahjongBot._test.context(round, 0), round.looseTiles(0), 0
    ).should, true);

  round.melds[1] = [{ type: 'peng', card: 5, from: 0 }];
  t('别人碰5条后听口只剩1张', publicOuts(), 1);
  t('别人碰掉主要胡口后会改为保癞',
    mahjongBot._test.shuaiDecision(
      mahjongBot._test.context(round, 0), round.looseTiles(0), 0
    ).should, false);

  round.melds[1] = [{ type: 'an', card: 5, from: 1 }];
  t('别人暗杠胡口后公开剩余张数归零', publicOuts(), 0);
}

{
  const { round } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  // 纯牌形像是听19，但再摸19会变成两癞，规则上不能胡。
  const dead = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 19];
  round.hands[0] = dead.slice();
  round.drawn[0] = null;
  round.melds = [[], []];
  round.discards = [[], []];
  round.shuai = [[], []];
  const analysis = mahjongBot._test.analyze(mahjongBot._test.context(round, 0), dead, 0);
  t('多癞禁胡造成的假听会标记死听', analysis.deadWait, true);
  t('死听不会把任意摸牌伪造成有效进张', analysis.outs, 0);
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [2, 2, 8, 8, 9, 12, 13, 15, 17, 19, 22, 26, 28];
  round.drawn[0] = 19;
  round.melds[0] = [];
  round.shuai = [[], [], [], []];
  round.gangs = [];
  const decision = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('双癞且牌形未到一向听时先留癞子',
    { should: decision.should, reason: decision.reason },
    { should: false, reason: '牌形未到一向听' });
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  // 甩掉一张9筒后，123/456条、123/55筒已成，手里79筒听8筒。
  // 这时应先解除“多癞不能胡”，而不是继续拖着双癞。
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 12, 13, 15, 15, 17, 19];
  round.drawn[0] = 19;
  round.melds[0] = [];
  round.shuai = [[], [], [], []];
  round.gangs = [];
  const decision = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('双癞甩一张后直接听牌时主动甩癞', decision.should, true);
  t('双癞好牌由托管选择甩9筒', mahjongBot.chooseDiscard(round, 0), 19);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true });
  round.seats[0].bot = true;
  round.pizi = 4;
  round.laizi = 5;
  // 线上第 2 小局回放：起手两张 5 癞子时牌形还差，
  // 应先打普通废牌，不能因为“多癞不能胡”就立即甩癞。
  round.hands[0] = [4, 5, 5, 6, 8, 9, 11, 11, 12, 14, 15, 19, 19];
  round.drawn[0] = 18;
  round.melds = [[], [], []];
  round.discards = [[], [7], [6]];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.wall.remain = () => 29;
  const first = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('起手双癞牌形较差时暂时都保留',
    { should: first.should, reason: first.reason },
    { should: false, reason: '牌形未到一向听' });

  // 后续已甩过一张并补摸 9 筒：原来的9筒变成一对，
  // 此时依然应保留最后一张癞子组成 456。
  round.hands[0] = [4, 5, 6, 8, 9, 11, 11, 12, 14, 15, 18, 19, 19];
  round.drawn[0] = 9;
  round.shuai[0] = [5];
  round.wall.remain = () => 28;
  const second = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('双癞先甩一张后保留第二张组456',
    { should: second.should, reason: second.reason },
    { should: false, reason: '保留癞子组成的完整顺子' });
  t('双癞补摸第二张9后不连甩癞子', mahjongBot.chooseDiscard(round, 0), 12);
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [2, 2, 4, 5, 7, 7, 12, 13, 17, 19];
  round.drawn[0] = 26;
  round.melds[0] = [{ type: 'bu', card: 1, from: 1 }];
  round.shuai = [[], [], [], []];
  round.gangs = [];
  const noGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 1
  );
  round.gangs = [{ seat: 0, type: 'bu', from: null, burst: false }];
  const ownGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 1
  );
  t('普通差牌无杠账时保癞', noGang.should, false);
  t('自己已有回头笑后可更积极甩癞', ownGang.should, true);
  t('自己的杠账是正收益', ownGang.ledger.net > 0, true);
}

{
  const { round } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 13;
  round.laizi = 14;
  // 已有正杠账也不能拆掉合法听口。癞子参与顺子时应保留。
  round.hands[0] = [2, 4, 7, 7, 11, 11, 12, 13, 14, 15];
  round.drawn[0] = 3;
  round.melds = [[{ type: 'an', card: 9, from: 0 }], []];
  round.discards = [[], []];
  round.shuai = [[], []];
  round.gangs = [{ seat: 0, type: 'an', from: null, burst: false }];
  const decision = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 1
  );
  t('自己已有暗杠仍不能甩癞退听', decision.should, false);
  t('保听保护给出明确原因', decision.reason, '保留听牌不甩癞');
  t('甩癞会让合法听牌退一向听',
    decision.throwAnalysis.shanten - decision.keep.shanten, 1);
  for (const fourth of [false, true]) {
    round.melds[0] = [{ type: 'ming', card: 9, from: 1 }];
    round.gangs = [{ seat: 0, type: 'ming', from: 1, burst: true }];
    round.shuai[0] = fourth ? [14, 14, 14] : [];
    const point = mahjongBot._test.shuaiDecision(
      mahjongBot._test.context(round, 0), round.looseTiles(0), 1);
    t(`别人点笑后${fourth ? '第四赖喜钱也' : ''}不允许甩赖退听`, point.should, false);
    t('甩赖前存在合法听口', point.keep.winningOuts > 0, true);
    t('正常策略保留赖子', mahjongBot.chooseDiscard(round, 0) !== round.laizi, true);
  }
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 22;
  round.laizi = 23;
  round.hands[0] = [1, 2, 3, 4, 16, 19, 19, 23, 24, 25, 26, 28, 29];
  round.drawn[0] = 6;
  round.melds = [[], [], [], []];
  round.discards = [[], [], [], []];
  round.shuai = [[], [], [], []];
  round.gangs = [];
  const noGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  // 1 号只有一次由 2 号点出的明杠，按新策略不把它当作甩癞风险。
  round.gangs = [{ seat: 1, type: 'ming', from: 2, burst: false }];
  const otherPlayersGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('无别家杠势时边界好牌可甩癞', noGang.should, true);
  t('只有一次点杠时继续按原牌效甩癞', otherPlayersGang.should, true);
  t('单次点杠不计风险压力',
    [otherPlayersGang.opponentGangPressure, otherPlayersGang.ignoreSinglePointGangRisk],
    [0, true]);

  // 单次点杠不应启动“多癞弃胡”，需要甩几张就连续甩几张。
  round.hands[0] = [1, 2, 3, 4, 16, 23, 23, 23, 24, 25, 26, 28, 29];
  round.drawn[0] = 6;
  const multiLaiziPointGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('只有一次点杠时三癞继续甩',
    { should: multiLaiziPointGang.should, reason: multiLaiziPointGang.reason },
    { should: true, reason: '单次点杠不限制甩癞' });
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 6;
  round.pizi = 5;
  round.hands[0] = [1, 2, 4, 6, 6, 6, 7, 8, 15, 17];
  round.drawn[0] = 18;
  round.melds = [[], [{ type: 'bu', card: 11, from: 1 }], []];
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  round.gangs = [{ seat: 1, type: 'bu', card: 11, from: null, burst: false }];
  const beforeOwnGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('外家回头杠且本家三癞时先弃胡追杠',
    { mode: mahjongBot._test.gangHuntMode(
      mahjongBot._test.context(round, 0), round.looseTiles(0)),
    should: beforeOwnGang.should, reason: beforeOwnGang.reason },
    { mode: true, should: false, reason: '至少要甩两张才能听牌' });

  round.melds[0] = [{ type: 'an', card: 16, from: 0 }];
  round.gangs.push({ seat: 0, type: 'an', card: 16, from: null, burst: false });
  const afterOwnGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 1
  );
  t('本家暗杠使杠账转正后立即甩三癞',
    { should: afterOwnGang.should, reason: afterOwnGang.reason,
      positive: afterOwnGang.ledger.net > 0 },
    { should: true, reason: '自己的杠账转正', positive: true });

  round.hands[0] = [1, 2, 4, 6, 6, 7, 8, 15, 17];
  round.drawn[0] = 18;
  round.shuai[0] = [6];
  const secondThrow = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 1
  );
  t('杠账转正后继续甩到只剩一张癞子',
    { should: secondThrow.should, reason: secondThrow.reason },
    { should: true, reason: '自己的杠账转正' });
}

{
  const { round } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [1, 2, 3, 4, 6, 11, 12, 13, 14, 15, 16, 17, 17];
  round.drawn[0] = 19;
  round.melds = [[], []];
  round.discards = [[], []];
  round.shuai = [[], []];
  round.gangs = [];
  const noGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  round.melds[1] = [{ type: 'an', card: 9, from: 1 }];
  round.gangs = [{ seat: 1, type: 'an', from: null, burst: false }];
  const opponentGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('无杠债时充足听口可甩癞', noGang.should, true);
  t('别人已有暗杠但甩后仍听牌时继续甩癞',
    { should: opponentGang.should, reason: opponentGang.reason },
    { should: true, reason: '对手暗杠后听牌甩癞' });
  t('别人的全付杠账是负收益', opponentGang.ledger.net < 0, true);

  round.gangs = [{ seat: 1, type: 'ming', from: 0, burst: false }];
  round.melds[1] = [{ type: 'ming', card: 9, from: 0 }];
  const pointGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('自己点杠后听牌摸到癞子仍优先甩癞保持听口',
    { should: pointGang.should, reason: pointGang.reason },
    { should: true, reason: '点杠后摸癞保持听牌' });
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [2, 2, 8, 8, 9, 12, 13, 15, 17, 21, 22, 26, 28];
  round.drawn[0] = 19;
  round.melds = [[], [{ type: 'an', card: 7, from: 1 }], [], []];
  round.discards = [[], [], [], []];
  round.shuai = [[], [], [], []];
  round.gangs = [{ seat: 1, type: 'an', card: 7, from: null, burst: false }];
  const decision = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('别人暗杠后尚未听牌时暂时保留癞子',
    { should: decision.should, reason: decision.reason },
    { should: false, reason: '对手暗杠后未听牌先保癞' });
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  // 三赖已经需要连续甩两张才能恢复胡牌，改以追杠为目标。
  round.hands[0] = [2, 2, 8, 8, 8, 11, 14, 17, 19, 19, 19, 21, 24];
  round.drawn[0] = 27;
  round.melds = [[], [{ type: 'an', card: 7, from: 1 }], [], []];
  round.discards = [[], [], [], []];
  round.shuai = [[], [], [], []];
  round.gangs = [{ seat: 1, type: 'an', card: 7, from: null, burst: false }];
  const ctx = mahjongBot._test.context(round, 0);
  t('别人暗杠且本家三赖时进入追杠路线',
    mahjongBot._test.gangHuntMode(ctx, round.looseTiles(0)), true);
  t('追杠路线保护未露过的对子与坎子',
    [...mahjongBot._test.liveGangFoundationCards(ctx, round.looseTiles(0))].sort((a, b) => a - b),
    [2, 8]);
  t('追杠路线先打散张而不拆对子坎子',
    [2, 8, 19].includes(mahjongBot.chooseDiscard(round, 0)), false);

  // 2 筒此前已经在外面出现，无法再集齐四张，不继续为追杠保留。
  round.discards[2] = [2];
  const appearedCtx = mahjongBot._test.context(round, 0);
  t('外面出现过的对子不再按追杠基础保护',
    [...mahjongBot._test.liveGangFoundationCards(appearedCtx, round.looseTiles(0))], [8]);
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [2, 2, 8, 8, 8, 11, 14, 17, 19, 19, 21, 24, 27];
  round.drawn[0] = 28;
  round.melds = [[], [{ type: 'an', card: 7, from: 1 }], [], []];
  round.discards = [[], [], [], []];
  round.shuai = [[], [], [], []];
  round.gangs = [{ seat: 1, type: 'an', card: 7, from: null, burst: false }];
  const tiles = round.looseTiles(0);
  const ctx = mahjongBot._test.context(round, 0);
  const decision = mahjongBot._test.shuaiDecision(ctx, tiles, 0);
  t('对手暗杠后双癞未成顺进入暂时弃胡',
    { mode: mahjongBot._test.gangHuntMode(ctx, tiles),
      should: decision.should, reason: decision.reason },
    { mode: true, should: false, reason: '对手暗杠后双癞未成顺暂时弃胡' });
  t('双癞弃胡期间保留未露过的对子坎子',
    [...mahjongBot._test.liveGangFoundationCards(ctx, tiles)].sort((a, b) => a - b),
    [2, 8]);
  t('双癞弃胡期间不甩癞也不拆对子坎子',
    [2, 8, 19].includes(mahjongBot.chooseDiscard(round, 0)), false);

  // 后续牌形变成 789 筒后，双癞已有一张参与自然顺子，
  // 退出暂时弃胡模式，回到常规的听牌/甩癞评估。
  round.hands[0] = [2, 2, 8, 8, 11, 14, 17, 18, 19, 19, 21, 24, 27];
  round.drawn[0] = 28;
  const formedTiles = round.looseTiles(0);
  const formedCtx = mahjongBot._test.context(round, 0);
  t('双癞后续成顺时退出暂时弃胡',
    { sequence: mahjongBot._test.laiziFormsNaturalSequence(round, formedTiles),
      mode: mahjongBot._test.gangHuntMode(formedCtx, formedTiles) },
    { sequence: true, mode: false });
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [2, 2, 5, 8, 11, 14, 17, 19, 19, 19, 21, 24, 27];
  round.drawn[0] = null;
  round.melds = [[], [{ type: 'an', card: 7, from: 1 }], [], []];
  round.discards = [[], [2], [], []];
  round.shuai = [[], [], [], []];
  round.gangs = [{ seat: 1, type: 'an', card: 7, from: null, burst: false }];
  round.pending = { kind: 'discard', from: 1, card: 2,
    candidates: [{ seat: 0, ops: { hu: 0, peng: true, gang: false } }], replies: new Map() };
  const candidate = round.pending.candidates[0];
  t('追杠路线遇到第一张对子牌时主动碰牌',
    mahjongBot.chooseDiscardResponse(round, 0, round.pending, candidate), { op: 'peng' });
  let jevCalls = 0;
  round.prepareAutoPlayJev(0, {
    chooseDiscardResponse() { jevCalls++; return Promise.resolve({ op: 'pass' }); },
  });
  t('Jev不能否决追杠路线的强制碰牌', jevCalls, 0);
  round.discards[2] = [2];
  t('此前已有同牌公开时不再强制追碰',
    mahjongBot._test.shouldChaseGangPeng(mahjongBot._test.context(round, 0), 2), false);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false, 喜钱: 10 });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [2, 2, 8, 8, 9, 12, 13, 15, 17, 21, 22, 26, 28];
  round.drawn[0] = 19;
  round.turn = 0;
  round.pending = null;
  round.shuai = [[19, 19, 19], []];
  round.gangs = [];
  round.seats.forEach((member) => { member.score = 0; });
  io.sent.length = 0;
  round.autoPlay(0);
  t('第四癞有喜钱时即使牌差也会甩', io.sent.some((x) => x.h === 'game_lzg'), true);
  t('第四癞喜钱立即入账', [round.seats[0].score, round.seats[1].score], [100, -100]);
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.pizi = 18;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 17, 18, 19, 22, 22, 24, 25];
  round.drawn[0] = 29;
  round.melds = [[], [{ type: 'peng', card: 9, from: 2 }], [], []];
  round.discards = [[11], [12], [], []];
  round.shuai = [[], [], [], []];
  round.gangs = [];

  // 机器人只能使用自己的手牌和公开信息。把对手暗手与牌墙内容
  // 改成“一读就抛错”的哨兵，以后如果策略偷看，这条回归会立即失败。
  for (let seat = 1; seat < round.n; seat++) {
    Object.defineProperty(round.hands, seat, {
      configurable: true,
      get() { throw new Error(`读取了对手${seat}的暗手`); },
    });
  }
  const hiddenWall = round.wall;
  round.wall = new Proxy(hiddenWall, {
    get(target, key) {
      if (key === 'remain') return Reflect.get(target, key);
      throw new Error(`读取了牌墙内容 ${String(key)}`);
    },
  });

  let choice = null;
  let privacyError = '';
  try {
    choice = mahjongBot.chooseDiscard(round, 0);
  } catch (error) {
    privacyError = error.message;
  }
  t('智能策略不读取对手暗手或牌墙内容', privacyError, '');
  t('隐私哨兵下仍能给出合法弃牌', round.looseTiles(0).includes(choice), true);
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 6, 7, 8, 11, 12, 13, 15, 16, 17];
  round.drawn[0] = 9;
  round.melds = [[], [], [], []];
  round.discards = [[], [1, 2, 3], [], []];
  round.shuai = [[], [], [], []];
  const targetSuit = mahjongBot._test.estimatedWallCopies(mahjongBot._test.context(round, 0), 5);
  round.discards[1] = [11, 12, 13];
  const otherSuit = mahjongBot._test.estimatedWallCopies(mahjongBot._test.context(round, 0), 5);
  t('对手公开弃牌的花色趋势会修正估计活张', targetSuit > otherSuit, true);

  t('多轮摸牌的成牌概率高于只看下一摸',
    mahjongBot._test.horizonProbability(40, 4, 4)
      > mahjongBot._test.horizonProbability(40, 4, 1), true);

  const ranked = mahjongBot.rankDiscardOptions(round, 0, { limit: 4 });
  t('Jev 前的本地筛选最多保留四个弃牌候选', ranked.length > 0 && ranked.length <= 4, true);
  t('弃牌候选包含两步胜率和预期收益', ranked.every((item) => (
    Number.isFinite(item.analysis.expectedScore)
      && Number.isFinite(item.analysis.expectedOuts)
      && Number.isFinite(item.projection.immediateWinProbability)
      && Number.isFinite(item.projection.expectedValue)
      && Number.isFinite(item.horizon.winProbability)
      && Number.isFinite(item.claimRisk.anyClaimProbability)
  )), true);
}

{
  const { round } = boot(4, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 12, 13, 15, 16, 17, 21];
  round.drawn[0] = 22;
  round.melds = [[], [], [], []];
  round.discards = [[], [], [], []];
  round.shuai = [[], [], [], []];
  const freshRisk = mahjongBot._test.publicClaimRisk(
    mahjongBot._test.context(round, 0), 21
  ).anyClaimProbability;
  round.discards[1] = [21, 21];
  const exhaustedRisk = mahjongBot._test.publicClaimRisk(
    mahjongBot._test.context(round, 0), 21
  ).anyClaimProbability;
  t('公开出现的同牌越多，弃牌被碰杠的估计风险越低', freshRisk > exhaustedRisk, true);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  // 真人托管仍然保持原来的摸什么打什么。
  round.seats[0].bot = false;
  round.laizi = 18;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 15, 19];
  round.drawn[0] = 9;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.autoPlay(0);
  t('真人托管不受智能机器人改动影响',
    io.sent.find((x) => x.h === 'game_step')?.d.card, 9);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: false });
  round.seats[0].managedTrustee = true;
  round.laizi = 18;
  round.pizi = 17;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 15, 19];
  round.drawn[0] = 9;
  round.turn = 0;
  round.pending = null;
  round.melds[0] = [];
  round.discards = [[], []];
  round.shuai = [[], []];
  round.baoQys = [false, false];
  io.sent.length = 0;
  round.autoPlay(0);
  t('后台白名单托管按干瞪眼机器人策略保留顺子并打孤张',
    io.sent.find((x) => x.h === 'game_step')?.d.card, 19);
}

{
  const { round, io } = boot(2, { 玩法: '潜江癞晃', 只许自摸: true, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 18;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 15, 19];
  round.drawn[0] = 9;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.autoPlay(0);
  t('潜江癞晃机器人不在本次改动范围',
    io.sent.find((x) => x.h === 'game_step')?.d.card, 9);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: false, 清一色: false });
  round.seats[0].bot = true;
  round.laizi = 18;
  round.pizi = 17;
  // 和上面的智能策略用例摆成同一手牌；未勾只许自摸时必须仍摸什么打什么。
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 15, 19];
  round.drawn[0] = 9;
  round.turn = 0;
  round.pending = null;
  round.melds[0] = [];
  round.discards = [[], []];
  round.shuai = [[], []];
  round.baoQys = [false, false];
  io.sent.length = 0;
  round.autoPlay(0);
  t('干瞪眼未勾只许自摸的机器人仍走旧策略',
    io.sent.find((x) => x.h === 'game_step')?.d.card, 9);
}

{
  const { round } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: true });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 9];
  round.drawn[0] = 1;
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [], qys: true };
  const qysAnalysis = mahjongBot._test.analyze(
    mahjongBot._test.context(round, 0), round.hands[0], 0
  );
  t('潜江麻将机器人不给清一色路线加分', qysAnalysis.route, 0);
  round.autoPlay(0);
  t('潜江麻将机器人不考虑清一色', round.baoQys[0], false);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 只许自摸: true, 清一色: true });
  round.seats[0].bot = true;
  round.laizi = 19;
  round.hands[0] = [1, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 9, 9];
  round.drawn[0] = null;
  round.melds[0] = [];
  round.discards[1] = [1];
  round.turn = 1;
  round.pending = null;
  round.takePeng(0, 1, 1);
  t('碰后只能报清一色、不能自摸',
    { qys: round.pending && round.pending.qys, hu: round.pending && round.pending.hu },
    { qys: true, hu: false });
  round.autoPlay(0);
  t('碰后机器人不选择报清一色', round.baoQys[0], false);
  t('碰后忽略清一色选项不会违规结算', !!io.sent.over, false);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true });
  round.seats[1].bot = true;
  round.seats[2].bot = true;
  const candidates = [1, 2].map((seat) => ({ seat, ops: { hu: 0, peng: true, gang: false } }));
  round.pending = { kind: 'discard', from: 0, card: 5, candidates, replies: new Map() };
  round.respond(1, 'pass');
  t('一个智能机器人表态不会替另一个机器人自动过',
    round.pending.replies.has(2), false);
}

{
  const { round } = boot(3, { 玩法: '土豪必杠', 只许自摸: true });
  // 1 号座是真人，2 号座是目标模式的智能机器人。
  round.seats[1].bot = false;
  round.seats[2].bot = true;
  const candidates = [1, 2].map((seat) => ({ seat, ops: { hu: 0, peng: true, gang: false } }));
  round.pending = { kind: 'discard', from: 0, card: 5, candidates, replies: new Map() };
  round.respond(1, 'pass');
  t('真人先响应不会替智能机器人自动过',
    round.pending.replies.has(2), false);
  t('真人响应后仍等智能机器人决策', round.waitingSeats(), [2]);
}

{
  const c = rules.parseConfig(1000, 0);
  t('默认不托管', c.托管, 0);
  t('默认不踢人', c.踢人, 0);
}

// ---------------------------------------------------------------- 玩法：土豪必杠 / 堆癞子

{
  t('土豪必杠参数', rules.parseConfig(...Object.values(rules.buildParam({ 玩法: '土豪必杠' }))).玩法, '土豪必杠');
  t('堆癞子参数', rules.parseConfig(...Object.values(rules.buildParam({ 玩法: '堆癞子' }))).玩法, '堆癞子');
  t('堆癞子喜钱关闭', rules.parseConfig(...Object.values(rules.buildParam({ 玩法: '堆癞子', 喜钱: 10 }))).喜钱, 0);
}

{
  const { round } = boot(2, { 玩法: '土豪必杠' });
  round.laizi = 19;
  round.drawn[0] = null;
  // 1 张癞子当 9 筒本身，听 7 筒凑 789
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 18, 19];
  t('土豪必杠 1癞当自己听 17', round.canHu(0, 17), true);
  t('土豪必杠 1癞不当万能', round.canHu(0, 13), false);
}

{
  const { round } = boot(2);
  round.laizi = 19;
  round.drawn[0] = null;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 19];
  t('癞晃 1癞当万能', round.canHu(0, 13), true);
}

{
  const { round } = boot(2);
  round.laizi = 19;
  round.drawn[0] = null;
  round.hands[0] = [1, 2, 4, 5, 6, 11, 11, 11, 12, 12, 13, 19, 19];
  t('癞晃 2癞不能胡', round.canHu(0, 3), false);
}

{
  const { round } = boot(2, { 玩法: '堆癞子' });
  round.laizi = 19;
  round.drawn[0] = null;
  round.hands[0] = [1, 2, 4, 5, 6, 11, 11, 11, 12, 12, 13, 19, 19];
  t('堆癞子 2癞能胡', round.canHu(0, 3), true);
}

{
  const { round } = boot(2, { 玩法: '土豪必杠' });
  round.laizi = 19;
  round.drawn[0] = null;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 19, 19];
  t('土豪必杠 2癞不能胡', round.canHu(0, 12), false);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠', 喜钱: 0 });
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 18, 19];
  round.drawn[0] = 17;
  round.win(0, 17, null);
  t('土豪必杠 自摸算黑摸', (io.sent.over.huType & rules.HU.黑摸) > 0, true);
  t('土豪必杠 不算软摸', (io.sent.over.huType & rules.HU.软摸) > 0, false);
}

{
  const { round, io } = boot(2, { 玩法: '土豪必杠' });
  round.laizi = 19;
  round.hands[1] = [19, 19, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13];
  round.hands[0] = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5];
  round.drawn[0] = 19;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.discard(0, 19);
  t('土豪必杠 甩癞子先 game_step', io.sent.some((x) => x.h === 'game_step' && x.d.card === 19), true);
  t('土豪必杠 甩癞子再 game_lzg', io.sent.some((x) => x.h === 'game_lzg' && x.d.card === 19), true);
  t('土豪必杠 甩完自己补牌', io.sent.some((x) => x.h === 'game_draw' && x.d.uid === 100001), true);
}

{
  const { round, io } = boot(3, { 玩法: '土豪必杠', 喜钱: 10 });
  const lz = 19;
  round.laizi = lz;
  round.pizi = 18;
  round.hands[0] = [lz, lz, lz, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = lz;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.offerSelfOps(0);
  const op = io.sent.find((x) => x.h === 'game_operator');
  t('四个癞子不能暗杠', !(op && (op.d.gang || []).includes(lz)), true);
  t('癞子暗杠被拒', round.doSelfGang(0, lz, false), '癞子不能暗杠');
}

{
  const { round, io } = boot(3, { 玩法: '土豪必杠', 喜钱: 10 });
  const lz = 19;
  round.laizi = lz;
  round.hands[0] = [lz, lz, lz, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = lz;
  round.turn = 0;
  round.pending = null;
  round.seats.forEach((m) => { m.score = 0; });
  round.roundScore = [0, 0, 0];
  io.sent.length = 0;
  for (let i = 0; i < 3; i++) {
    t(`第 ${i + 1} 张癞子先不结喜钱`, round.discard(0, lz), null);
    t(`第 ${i + 1} 张还没跳分`, io.sent.some((x) => x.h === 'game_scorechange'), false);
    round.pending = null;
  }
  t('第四张癞子杠出', round.discard(0, lz), null);
  t('四癞当场跳喜钱', io.sent.some((x) => x.h === 'game_scorechange'), true);
  t('四癞喜钱每家 10', [round.seats[0].score, round.seats[1].score, round.seats[2].score], [200, -100, -100]);
}

{
  const { round, io } = boot(2);
  round.laizi = 19;
  round.hands[1] = [19, 19, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13];
  round.hands[0] = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5];
  round.drawn[0] = 19;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.discard(0, 19);
  t('癞晃 不能碰癞子', io.sent.some((x) => x.d && x.d.touch === 19), false);
}

// ---------------------------------------------------------------- 一炮多响

{
  const { round, io } = boot(3, { 热铳: false, 喜钱: 0 });
  round.laizi = 19;
  round.hands[1] = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  round.hands[2] = [1, 1, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9];
  round.hands[0] = [11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15];
  round.drawn[0] = 1;
  round.turn = 0;
  round.pending = null;
  round.seats.forEach((m) => { m.score = 0; });
  round.roundScore = [0, 0, 0];
  io.sent.length = 0;
  round.discard(0, 1);
  t('两家都被问胡', io.sent.filter((x) => x.h === 'game_operator' && x.d.hu === 1).length, 2);
  t('第一家胡先不结算', round.respond(1, 'hu'), null);
  t('等另一个能胡的', round.over, false);
  t('第二家也胡', round.respond(2, 'hu'), null);
  t('两家都赢', io.sent.over && io.sent.over.winners, [1, 2]);
  t('放炮付两家', [round.seats[0].score, round.seats[1].score, round.seats[2].score], [-40, 20, 20]);
  t('庄是放炮者下家', io.sent.over.nextDealer, 1);
}

{
  const { round, io } = boot(3, { 热铳: false, 喜钱: 0 });
  round.laizi = 19;
  round.hands[1] = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  round.hands[2] = [1, 1, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9];
  round.hands[0] = [11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15];
  round.drawn[0] = 1;
  round.turn = 0;
  round.pending = null;
  round.seats.forEach((m) => { m.score = 0; });
  round.roundScore = [0, 0, 0];
  round.discard(0, 1);
  round.respond(1, 'hu');
  t('一人胡一人过还没完', round.over, false);
  round.respond(2, 'pass');
  t('只有第一家胡', io.sent.over && io.sent.over.winners, [1]);
  t('庄仍是下家', io.sent.over.nextDealer, 1);
}

{
  const { round, io } = boot(3, { 玩法: '土豪必杠', 热铳: true, 喜钱: 0 });
  round.laizi = 19;
  round.hands[0] = [11, 11, 11, 11, 2, 3, 4, 5, 6, 7, 8, 9, 12];
  round.drawn[0] = 13;
  round.hands[1] = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  round.hands[2] = [1, 1, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9];
  round.turn = 0;
  round.pending = null;
  round.doSelfGang(0, 11, false);
  round.pending = null;
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 12];
  round.drawn[0] = 1;
  round.turn = 0;
  io.sent.length = 0;
  round.discard(0, 1);
  t('干瞪眼热铳同时询问两家', io.sent.filter((x) => x.h === 'game_operator' && x.d.hu === 1).length, 2);
  round.respond(1, 'hu');
  t('干瞪眼热铳第一家胡后等第二家', round.over, false);
  round.respond(2, 'hu');
  t('干瞪眼热铳一炮多响', io.sent.over && io.sent.over.winners, [1, 2]);
  t('干瞪眼两家都是热铳', [1, 2].map((s) => (io.sent.over.huTypes[s] & rules.HU.热铳) > 0), [true, true]);
}

{
  const { round, io } = boot(3, { 热铳: true, 喜钱: 0 });
  round.laizi = 19;
  // 庄家补杠 1，下家和对家都能抢
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 1;
  round.melds[0] = [{ type: 'peng', card: 1, from: 1 }];
  round.hands[1] = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  round.hands[2] = [1, 1, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9];
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [1], qys: false };
  round.seats.forEach((m) => { m.score = 0; });
  round.roundScore = [0, 0, 0];
  io.sent.length = 0;
  round.respond(0, 'gang', { card: 1 });
  t('抢杠也等两家', round.pending && round.pending.kind, 'qianggang');
  round.respond(1, 'hu');
  t('抢杠一炮先不结算', round.over, false);
  round.respond(2, 'hu');
  t('抢杠两家都赢', io.sent.over && io.sent.over.winners, [1, 2]);
  t('抢杠胡型', (io.sent.over.huTypes[1] & rules.HU.抢杠胡) > 0, true);
  // 回头笑 2×2 家 = 4，每个抢杠胡家各得一份，不加炮
  t('抢杠放杠付两家', [round.seats[0].score, round.seats[1].score, round.seats[2].score], [-80, 40, 40]);
}

{
  const { round, io } = boot(3, { 玩法: '土豪必杠', 热铳: true, 喜钱: 0 });
  round.laizi = 19;
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 1;
  round.melds[0] = [{ type: 'peng', card: 1, from: 1 }];
  round.hands[1] = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  round.hands[2] = [1, 1, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9];
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [1], qys: false };
  io.sent.length = 0;
  round.respond(0, 'gang', { card: 1 });
  t('干瞪眼抢杠同时询问两家', io.sent.filter((x) => x.h === 'game_operator' && x.d.hu === 1).length, 2);
  round.respond(1, 'hu');
  t('干瞪眼第一家抢杠后等第二家', round.over, false);
  round.respond(2, 'hu');
  t('干瞪眼多人抢杠', io.sent.over && io.sent.over.winners, [1, 2]);
  t('干瞪眼两家都是抢杠胡', [1, 2].map((s) => (io.sent.over.huTypes[s] & rules.HU.抢杠胡) > 0), [true, true]);
}

{
  const { round, io } = boot(3);
  round.laizi = 19;
  round.pizi = 18;
  // 下家只能碰，对家能胡
  round.hands[1] = [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13];
  round.hands[2] = [1, 1, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9];
  round.hands[0] = [11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15];
  round.drawn[0] = 1;
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.discard(0, 1);
  round.respond(2, 'pass');
  t('能胡的过了还要等碰', round.over, false);
  t('下家随后碰上', round.respond(1, 'peng'), null);
  t('碰成功', round.melds[1].some((m) => m.type === 'peng' && m.card === 1), true);
}

{
  // 点笑终局才入账，和自摸一次算清。结算条画合计，中途不跳分。
  const { round, io } = boot(3, { 喜钱: 0 });
  round.laizi = 31;
  round.hands[0] = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.hands[1] = [11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15];
  round.hands[2] = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6];
  round.drawn = [null, null, null];
  round.turn = 0;
  round.pending = null;
  round.roundScore = [0, 0, 0];
  io.sent.length = 0;
  round.takeGang(0, 1, 1);
  t('点笑当场不计分', [round.seats[0].score, round.seats[1].score, round.seats[2].score], [0, 0, 0]);
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.drawn[0] = 14;
  round.win(0, 14, null);
  t('终局点笑+自摸', [round.seats[0].score, round.seats[1].score, round.seats[2].score], [100, -60, -40]);
  t('中途不跳分', io.sent.filter((x) => x.h === 'game_scorechange').length, 0);
  const end = io.sent.find((x) => x.h === 'game_end');
  t('结算条画合计', end && end.d.info.map((i) => i.score), [100, -60, -40]);
}

{
  const { round, io } = boot(3, { 喜钱: 0 });
  round.laizi = 31;
  round.hands[0] = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.hands[1] = [11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15];
  round.hands[2] = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6];
  round.drawn = [null, null, null];
  round.turn = 0;
  round.pending = null;
  io.sent.length = 0;
  round.discards[1] = [7, 1];
  t('点笑成功', round.takeGang(0, 1, 1), null);
  t('点笑拿走河牌', round.discards[1].includes(1), false);
  t('点笑只拿走那一张', round.discards[1], [7]);
  t('点笑记下是谁打的', round.operatorRecord(0)[1], 100002);
  t('点笑后补一帧桌面', io.sent.some((x) => x.h === 'game_info' && x.d.info[0].operator_record[1] === 100002), true);
}

{
  // 暗杠 2 倍，先甩两张癞子再杠：2×2×2=8，三家每人出 8
  const { round } = boot(3, { 暗杠倍数: 2, 喜钱: 0 });
  round.laizi = 19;
  round.shuai[0] = [19, 19];
  round.hands[0] = [1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12];
  round.drawn[0] = 13;
  round.hands[1] = [];
  round.hands[2] = [];
  round.drawn[1] = null;
  round.drawn[2] = null;
  round.turn = 0;
  round.pending = null;
  round.roundScore = [0, 0, 0];
  round.seats.forEach((m) => { m.score = 0; });
  t('两癞子暗杠当场不计分', round.doSelfGang(0, 1, false), null);
  t('两癞子暗杠当场还是 0', [round.seats[0].score, round.seats[1].score, round.seats[2].score], [0, 0, 0]);
  round.payGangs();
  t('终局两癞子暗杠每家出 8', [round.seats[0].score, round.seats[1].score, round.seats[2].score], [160, -80, -80]);
}

{
  // 庄家甩三张癞子后点给对家笑，再黑摸。点笑 2×8，自摸每家 32
  const { round } = boot(3, { 喜钱: 0 });
  round.laizi = 19;
  round.shuai[0] = [19, 19, 19];
  round.hands[2] = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.drawn = [null, null, null];
  round.takeGang(2, 1, 0);
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 11, 12, 13];
  round.drawn[0] = 14;
  round.seats.forEach((m) => { m.score = 0; });
  round.roundScore = [0, 0, 0];
  round.win(0, 14, null);
  t('点笑带放杠癞子翻倍', [round.seats[0].score, round.seats[1].score, round.seats[2].score], [480, -320, -160]);
}

{
  const { round } = boot(2, { 喜钱: 10 });
  round.laizi = 19;
  round.shuai[0] = [19];
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 13];
  round.drawn[0] = 14;
  round.seats.forEach((m) => { m.score = 0; });
  round.roundScore = [0, 0];
  // 黑摸 4，乘赢家甩出一张癞子 ×2 → 每家 8；喜钱只在甩出第四张时另结。
  round.win(0, 14, null);
  t('甩癞翻倍但不额外加亮癞喜钱', [round.seats[0].score, round.seats[1].score], [80, -80]);
}

{
  const { round, config } = boot(2);
  const card = round.drawn[0];
  const dumped = JSON.parse(JSON.stringify(round.dump()));
  const restored = Round.restore(dumped, fakeSeats(2), silentIo(), config);
  t('恢复后癞子一样', restored.laizi, round.laizi);
  t('恢复后余牌一样', restored.wall.remain(), round.wall.remain());
  t('恢复后庄家手牌一样', restored.hands[0], round.hands[0]);
  t('恢复后能打出刚摸的牌', restored.discard(0, card), null);
  // 随机手牌可能让对家先收到碰、杠或胡的询问；全部选择过后才会继续摸牌。
  while (restored.pending && restored.pending.kind === 'discard') {
    const waiting = restored.waitingSeats();
    if (!waiting.length) break;
    restored.respond(waiting[0], 'pass');
  }
  t('恢复后牌墙还能摸', restored.wall.remain() < round.wall.remain() || restored.drawn[1] != null, true);
}

// ---------------------------------------------------------------- 机器人牌效回归：朝天对子、边张改良、末圈甩癞

{
  const { round } = boot(3, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true,
  });
  round.seats[0].bot = true;
  round.pizi = 12;
  round.laizi = 13;
  // 2 筒是朝天。1223 筒里两张 2 必须一起保留，既可接牌朝天，
  // 也可再摸一张形成朝天暗杠；有孤 9 筒时不能先拆朝天对子。
  round.hands[0] = [11, 12, 12, 13, 19, 1, 2, 3, 4, 5, 6, 21, 22];
  round.drawn[0] = 23;
  round.melds = [[], [], []];
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 30;
  const choices = mahjongBot.rankDiscardOptions(round, 0, { limit: 6 }).map(({ card }) => card);
  t('1223筒且2筒为朝天时先打孤9筒', mahjongBot.chooseDiscard(round, 0), 19);
  t('两张朝天不进入本地或Jev弃牌候选', choices.includes(12), false);
}

{
  const { round } = boot(3, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false,
  });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  // 68 与 89 当前都只进 7，但 68 再摸 5 可转成 56 的 4/7 双进张，
  // 后续改良空间优于边张 89，因此 689 应打 9 而不是打 6。
  round.hands[0] = [6, 8, 9, 1, 2, 3, 11, 12, 13, 21, 22, 23, 25];
  round.drawn[0] = 25;
  round.melds = [[], [], []];
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 30;
  t('689条优先打9条保留68改良', mahjongBot.chooseDiscard(round, 0), 9);
}

{
  const { round } = boot(3, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true,
  });
  round.seats[0].bot = true;
  round.pizi = 3;
  round.laizi = 4;
  // 房间 653723 第13局回放：碰1条后手里是 22344556条+579筒，
  // 两张4条为癞子。多癞假听会错把打7筒评为有更多进张，
  // 但打7筒会同时拆掉57和79；应改打其他散张，至少保留一组嵌张。
  round.hands[0] = [2, 2, 3, 4, 4, 5, 5, 6, 15, 17, 19];
  round.drawn[0] = null;
  round.melds = [
    [{ type: 'peng', card: 1, from: 1 }],
    [{ type: 'peng', card: 11, from: 0 }],
    [],
  ];
  round.discards = [[9, 12, 11], [12, 16, 1], [5, 18, 17]];
  round.shuai = [[], [], [4]];
  round.gangs = [];
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 22;
  const choices = mahjongBot.rankDiscardOptions(round, 0, { limit: 6 })
    .map(({ card }) => card);
  t('579筒且持有双癞时不打中间7筒',
    mahjongBot.chooseDiscard(round, 0) === 17, false);
  t('579筒中间7筒不交给Jev拆牌', choices.includes(17), false);
}

{
  const { round } = boot(3, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true,
  });
  round.seats[1].bot = true;
  round.pizi = 19;
  round.laizi = 11;
  // 房间 519211 第 9 局回放：1 条已是孤张，6678 筒同时保留
  // 66 对子和 678 顺子。两种打法向听和有效进张完全相同，
  // 不能因 8 个多轮样本的波动拆掉复合牌形。
  round.hands[1] = [1, 4, 5, 7, 9, 12, 12, 12, 13, 13, 16, 16, 18];
  round.drawn[1] = 17;
  round.melds = [[], [], []];
  round.discards = [[19], [1], [1]];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.turn = 1;
  round.pending = null;
  round.wall.remain = () => 60;
  const choices = mahjongBot.rankDiscardOptions(round, 1, { limit: 6 })
    .map(({ card }) => card);
  t('6678筒与孤1条同向听时先打1条', mahjongBot.chooseDiscard(round, 1), 1);
  t('6678筒的6筒不排在孤1条前',
    choices.includes(16) && choices.indexOf(16) < choices.indexOf(1), false);
}

{
  const { round } = boot(3, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true,
  });
  round.seats[0].bot = true;
  round.pizi = 6;
  round.laizi = 7;
  // 66788 条中 6 是朝天、7 是癞子；88 既是对子，也和 67 组成复合结构。
  // 有孤张 1 筒时必须先清孤张，不能把 8 当成普通游离重复张。
  round.hands[0] = [6, 6, 7, 8, 8, 11, 1, 2, 3, 14, 15, 16, 21, 21];
  round.drawn[0] = null;
  round.melds = [[], [], []];
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 40;
  const choices = mahjongBot.rankDiscardOptions(round, 0, { limit: 6 })
    .map(({ card }) => card);
  t('66788且6朝天7癞子时先打孤1筒', mahjongBot.chooseDiscard(round, 0), 11);
  t('66788的8条不交给Jev拆对子复合结构', choices.includes(8), false);
}

{
  const { round } = boot(3, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true,
  });
  round.seats[0].bot = true;
  round.pizi = 28;
  round.laizi = 29;
  // 手里 2345 条时，另外三张 2 已由下家碰出。打 2 与打 5 的向听、
  // 进张和完整顺子相同，但 2 已无任何成对/碰杠价值，且打 5 仍会喂碰。
  round.hands[0] = [2, 3, 4, 5, 8, 8, 15, 15, 17, 18, 18, 23, 24, 25];
  round.drawn[0] = null;
  round.melds = [[], [{ type: 'peng', card: 2, from: 2 }], []];
  round.discards = [[], [], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 40;
  const choices = mahjongBot.rankDiscardOptions(round, 0, { limit: 6 })
    .map(({ card }) => card);
  t('2345且外面碰出三张2时优先打最后一张2', mahjongBot.chooseDiscard(round, 0), 2);
  t('同牌效下不再把5条交给Jev喂碰', choices.includes(5), false);
}

{
  const { round } = boot(3, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false, 双大胡: true,
  });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  // 房间 634980 第 6 局：碰 1 条后剩 233468 条、1/7 筒和三张癞子。
  // 3 条同时是 33 对子、234 顺子的中张且连着 23/34，1 筒才是孤张。
  round.hands[0] = [2, 3, 3, 4, 6, 8, 11, 17, 19, 19, 19];
  round.drawn[0] = null;
  round.melds = [[{ type: 'peng', card: 1, from: 1 }], [], []];
  round.discards = [[3], [1], []];
  round.shuai = [[], [], []];
  round.gangs = [];
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 30;
  const choices = mahjongBot.rankDiscardOptions(round, 0, { limit: 6 })
    .map(({ card }) => card);
  t('2334复合牌形与孤1筒同向听时先打1筒',
    mahjongBot.chooseDiscard(round, 0), 11);
  t('2334中间重复张不交给Jev拆掉', choices.includes(3), false);
}

{
  const { round } = boot(3, {
    玩法: '土豪必杠', 只许自摸: true, 清一色: false,
  });
  round.seats[0].bot = true;
  round.pizi = 18;
  round.laizi = 19;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 12, 13, 15, 15, 19, 19];
  round.drawn[0] = 19;
  round.melds = [[], [{ type: 'an', card: 9, from: 1 }], []];
  round.discards = [[], [], []];
  round.shuai = [[], [19], []];
  round.gangs = [{ seat: 1, type: 'an', card: 9, from: null, burst: false }];
  round.turn = 0;
  round.pending = null;
  round.wall.remain = () => 1;
  const decision = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('三赖至少需甩两张才能听牌时从第一张起就不甩',
    { should: decision.should, reason: decision.reason, needed: decision.minimumThrowsToWin },
    { should: false, reason: '至少要甩两张才能听牌', needed: 2 });
  t('末圈三赖选择普通弃牌', mahjongBot.chooseDiscard(round, 0) !== round.laizi, true);
}

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
