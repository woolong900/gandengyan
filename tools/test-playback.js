#!/usr/bin/env node
/**
 * 回放 127：打牌记步骤，散场按回放码整局还给客户端。
 */
process.env.QJQP_FILLBOTS = '0';

const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');
const { Tape, IDX, findPlayback, mintPlaybackId } = require('../server/playback');
const rules = require('../server/rules');

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

const packCs = (proto, msg) => {
  const def = protocol[proto];
  const payload = def && def.cs && msg
    ? Buffer.from(def.cs.encode(def.cs.create(msg)).finish())
    : Buffer.alloc(0);
  const out = Buffer.alloc(12 + payload.length);
  out.writeUInt32BE(proto, 0);
  out.writeUInt32BE(0, 4);
  out.writeUInt32BE(out.length, 8);
  payload.copy(out, 12);
  return out;
};

const unpackSc = (buf) => {
  const proto = buf.readUInt32BE(0);
  const len = buf.readUInt32BE(8);
  const payload = buf.subarray(12, len || buf.length);
  const def = protocol[proto];
  const msg = def && def.sc ? def.sc.decode(payload) : null;
  return { proto, msg };
};

const last = (box, proto) => {
  for (let i = box.sent.length - 1; i >= 0; i--) {
    const frame = unpackSc(box.sent[i]);
    if (frame.proto === proto) return frame.msg;
  }
  return null;
};

t('回放码 11 位', mintPlaybackId(100000, 1, 1).length, 11);
t('回放码带房号和局数', mintPlaybackId(100000, 3, 1), '10000003101');

{
  const tape = new Tape();
  tape.begin({
    table: {
      gameType: 2, roomId: 100000, hostUid: 100001, num: 1,
      param1: 2000, param2: 2, step: 1,
    },
    seats: [
      { player: { uid: 100001, nickname: '甲', sex: 1 }, score: 0 },
      { player: { uid: 100002, nickname: '乙', sex: 2 }, score: 0 },
    ],
    hands: [[1, 2, 3], [4, 5, 6]],
    dealerSeat: 0,
    pizi: 11,
    laizi: 12,
  });
  tape.get(100001, 19);
  tape.can([{ uid: 100001, cards: [IDX.HU, IDX.GANG] }]);
  tape.put(100001, 19);
  const pb = tape.finish();
  t('开局手牌在', pb.gameInfo.sites[0].handCards, [1, 2, 3]);
  t('庄家 uid', Number(pb.gameInfo.zhuang), 100001);
  t('第一步是摸牌', pb.steps[0].operates[0].index, IDX.GET);
  t('摸牌后带可操作', pb.steps[0].operates[1].index, IDX.CAN);
  t('第二步出牌', pb.steps[1].operates[0].index, IDX.PUT);
}

{
  const app = new GameApp({ persist: () => {}, now: () => 1 });
  const box = { sent: [] };
  app.attach('a', (bytes) => box.sent.push(Buffer.from(bytes)));
  app.onMessage('a', packCs(100, { token: 't_pb_a' }));
  const me = app.conns.get('a').player;
  me.cardNum = 20;
  box.sent.length = 0;
  const param = rules.buildParam({ 人数: 2, 房费: '房主' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1, param1: param.param1, param2: param.param2,
  }));
  const roomId = Number(last(box, 201).roomId);
  app.onMessage('a', packCs(202, { roomId }));
  const table = app.tables.get(roomId);
  t('开局', table.startGame(), null);
  table.dissolve();
  t('散场记下战绩', app.records.length, 1);
  const rec = app.records[0];
  t('有回放码', !!(rec.details && rec.details[0] && rec.details[0].id), true);
  const id = rec.details[0].id;
  t('回放码 11 位', id.length, 11);
  t('能按码找到', !!findPlayback(app.records, id), true);

  box.sent.length = 0;
  app.onMessage('a', packCs(127, { id }));
  const pb = last(box, 127);
  t('127 成功', Number(pb.res.error), 0);
  t('有玩家', pb.players.length >= 1, true);
  t('玩法是干瞪眼', Number(pb.roomInfo.type), 2);
  t('有摸牌步骤', pb.steps.some((s) => s.operates.some((o) => o.index === IDX.GET)), true);

  box.sent.length = 0;
  app.onMessage('a', packCs(127, { id: 'nope' }));
  t('没有的码', last(box, 127).res.what, '回放不存在');
}

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
