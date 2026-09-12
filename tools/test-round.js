#!/usr/bin/env node
/**
 * 牌局规则单测。不连服务端，直接把 Round 的手牌摆好再走流程。
 * 番数、抢杠胡、只许自摸、少三张、皮子杠、癞子不能打、
 * 土豪必杠 / 堆癞子、一炮多响，都在这儿核对。
 */
const { Round } = require('../server/round');
const rules = require('../server/rules');
const mahjong = require('../server/mahjong');

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
  t('热铳不加番', rules.huMultiplier(rules.HU.屁胡 | rules.HU.热铳, c), 2);
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

// ---------------------------------------------------------------- 只许自摸：点炮不问

{
  const { round, io } = boot(2, { 只许自摸: true });
  // 下家听的是 1，庄家打 1 也不该问胡
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

// ---------------------------------------------------------------- 抢杠胡

{
  const { round, io } = boot(2);
  // 庄家碰了 1，手里摸到第四张 1；下家听 1
  round.laizi = 19;
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 1;
  round.melds[0] = [{ type: 'peng', card: 1, from: 1 }];
  round.hands[1] = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [1], razz: false, qys: false };
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

// ---------------------------------------------------------------- 皮子三张杠

{
  const { round, io } = boot(2);
  const pz = round.pizi;
  round.hands[0] = [pz, pz, pz, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 13;
  round.turn = 0;
  t('三张皮子能杠', mahjong.canPiziGang(round.looseTiles(0), pz), true);
  io.sent.length = 0;
  t('皮子杠成功', round.doSelfGang(0, pz, false), null);
  t('朝天笑走暗杠消息', io.sent.some((x) => x.h === 'game_gang' && x.d.view === 2 && x.d.card === pz), true);
  t('不进癞子区', io.sent.some((x) => x.h === 'game_pzg'), false);
  t('面子记成皮子杠', round.melds[0].some((m) => m.type === 'pizi' && m.card === pz), true);
  const snap = round.snapshot(0);
  t('朝天进碰杠区', snap.info[0].card.ag_card, [pz]);
  t('癞子区没有朝天', snap.info[0].card.hzg_card.includes(pz), false);
}

{
  t('两张皮子能点笑', mahjong.canMingGang([11, 11, 2, 3, 4], 11, 19, 11), true);
}

// ---------------------------------------------------------------- 亮癞之后癞子不当万能

{
  const { round } = boot(2);
  round.laizi = 19; // 固定一个手里没有的癞子，避免随机皮子把这手牌凑成硬胡
  const lz = round.laizi;
  // 差一张靠癞子凑顺子
  round.hands[0] = [1, 2, 4, 5, 6, 11, 11, 11, 12, 12, 13, 13, lz];
  round.drawn[0] = 3;
  t('亮之前能胡', round.canHu(0), true);
  round.razz[0] = 1;
  t('亮之后不能胡', round.canHu(0), false);
}

// ---------------------------------------------------------------- 结算：自摸每家出、点炮一家出、喜钱

{
  const { round } = boot(2);
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 13];
  round.drawn[0] = 14;
  round.razz[0] = 1; // 亮过癞，胡了拿喜钱
  round.roundScore = [0, 0];
  round.seats.forEach((m) => { m.score = 0; });
  round.win(0, 14, null);
  // 底分 1，黑摸 4 倍（手里亮过癞，癞子不当万能，14 也不是癞子 → 黑摸）
  // 再加喜钱 10 倍，每家付 (4+10)*10 = 140 内分
  t('自摸赢家得分', round.seats[0].score, 140);
  t('自摸输家出分', round.seats[1].score, -140);
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
  t('结算后没准备，下一局按钮才出得来', end && end.d.info.every((it) => it.ready === false), true);
  t('胡后余牌按摸牌顺序摊出', end && end.d.surplus_card, round.wall.remainCards());
  t('胡后还有余牌', end && end.d.surplus_card.length > 0, true);
}

// ---------------------------------------------------------------- 托管代打

{
  const { round, io } = boot(2);
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 13];
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
  round.pending = { kind: 'self', seat: 0, hu: true, gang: [], razz: false, qys: false };
  io.sent.length = 0;
  round.autoPlay(0);
  t('托管自摸会胡', io.sent.over && io.sent.over.winner, 0);
}

{
  const { round } = boot(2);
  round.pending = { kind: 'discard', from: 0, card: 1, candidates: [{ seat: 1, ops: { hu: 0, peng: true, gang: false } }], replies: new Map() };
  t('等人碰时 waiting 是下家', round.waitingSeats(), [1]);
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
  const { round, io } = boot(3, { 热铳: false, 喜钱: 0 });
  round.laizi = 19;
  // 庄家补杠 1，下家和对家都能抢
  round.hands[0] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  round.drawn[0] = 1;
  round.melds[0] = [{ type: 'peng', card: 1, from: 1 }];
  round.hands[1] = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  round.hands[2] = [1, 1, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9];
  round.turn = 0;
  round.pending = { kind: 'self', seat: 0, hu: false, gang: [1], razz: false, qys: false };
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
  const { round, io } = boot(3);
  round.laizi = 19;
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
  round.razz[0] = 1;
  round.hands[0] = [1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13, 13];
  round.drawn[0] = 14;
  round.seats.forEach((m) => { m.score = 0; });
  round.roundScore = [0, 0];
  // 黑摸 4 + 亮癞喜钱 10，再乘赢家一张癞子 ×2 → 每家 28
  round.win(0, 14, null);
  t('亮癞喜钱也乘癞子翻倍', [round.seats[0].score, round.seats[1].score], [280, -280]);
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
  t('恢复后牌墙还能摸', restored.wall.remain() < round.wall.remain() || restored.drawn[1] != null, true);
}

{
  const voice = require('../server/voice');
  const fs = require('fs');
  const dir = voice.DIR;
  const raw = Buffer.from([1, 2, 3, 4, 9]);
  const id = voice.put(raw);
  t('语音能存', !!id && id.length, 24);
  t('语音能取回', voice.get(id) && [...voice.get(id)], [...raw]);
  t('坏 id 取不到', voice.get('../x'), null);
  t('空包不存', voice.put(Buffer.alloc(0)), null);
  if (id) try { fs.unlinkSync(require('path').join(dir, id)); } catch { /* */ }
}

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
