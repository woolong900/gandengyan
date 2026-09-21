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
  t('手里多于一张癞子时必须先甩到剩一张',
    { should: decision.should, reason: decision.reason },
    { should: true, reason: '多癞子必须先甩' });
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
  // 暗杠后已有确定正杠账。甩癞会暂时退一向听，但补回来的进张
  // 明显多于保留癞子路线，不应被“只剩最后一圈”的旧阈值卡住。
  round.hands[0] = [2, 4, 7, 7, 11, 11, 12, 13, 14, 15];
  round.drawn[0] = 3;
  round.melds = [[{ type: 'an', card: 9, from: 0 }], []];
  round.discards = [[], []];
  round.shuai = [[], []];
  round.gangs = [{ seat: 0, type: 'an', from: null, burst: false }];
  const decision = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 1
  );
  t('自己已有暗杠时正杠账能突破末圈限制', decision.should, true);
  t('正杠账放宽仍只允许退一向听',
    decision.throwAnalysis.shanten - decision.keep.shanten, 1);
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
  // 1 号明杠是 2 号点的，0 号本家没有直接杠债，但仍要考虑对手杠势。
  round.gangs = [{ seat: 1, type: 'ming', from: 2, burst: false }];
  const otherPlayersGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('无别家杠势时边界好牌可甩癞', noGang.should, true);
  t('别人点给别人的公杠也会降低甩癞意愿', otherPlayersGang.should, false);
  t('间接对手杠势只轻扣一档', otherPlayersGang.opponentGangPressure, 1);
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
  t('别人已有暗杠、本家负债时改为保癞', opponentGang.should, false);
  t('别人的全付杠账是负收益', opponentGang.ledger.net < 0, true);

  round.gangs = [{ seat: 1, type: 'ming', from: 0, burst: false }];
  round.melds[1] = [{ type: 'ming', card: 9, from: 0 }];
  const pointGang = mahjongBot._test.shuaiDecision(
    mahjongBot._test.context(round, 0), round.looseTiles(0), 0
  );
  t('自己点给别人杠后也会降低甩癞意愿', pointGang.should, false);
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
  round.autoPlay(0);
  t('干瞪眼自摸房机器人会报清一色', round.baoQys[0], true);
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
  t('碰后报清一色不会重新开放自摸', !!(round.pending && round.pending.hu), false);
  t('碰后报清一色没有违规结算', !!io.sent.over, false);
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

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
