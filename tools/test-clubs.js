#!/usr/bin/env node
/**
 * 俱乐部核心闭环：创建、列表、申请、审核、成员、房间、设置和退出。
 */
process.env.QJQP_FILLBOTS = '0';

const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');
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
  return { proto, msg: def && def.sc ? def.sc.decode(payload) : null };
};

const last = (box, proto) => {
  for (let i = box.sent.length - 1; i >= 0; i--) {
    const frame = unpackSc(box.sent[i]);
    if (frame.proto === proto) return frame.msg;
  }
  return null;
};

const gameParam = rules.buildParam({ 人数: 2, 房费: '房主' });
const app = new GameApp({ persist: () => {}, now: () => 1, allowUnregisteredTokens: true });
const boxes = {};
const login = (id, token) => {
  boxes[id] = { sent: [] };
  app.attach(id, (bytes) => boxes[id].sent.push(Buffer.from(bytes)));
  app.onMessage(id, packCs(100, { token }));
  return app.conns.get(id).player;
};
const a = login('a', 'club_a');
const b = login('b', 'club_b');
a.cardNum = 20;
b.cardNum = 20;

app.onMessage('a', packCs(147, { name: '测试俱乐部' }));
const created = last(boxes.a, 147);
const clubId = Number(created.id);
t('创建俱乐部成功', Number(created.res.error), 0);
t('返回俱乐部 ID', clubId > 0, true);

boxes.a.sent.length = 0;
app.onMessage('a', packCs(113, {}));
let list = last(boxes.a, 113);
t('创建者能看到俱乐部', list.clubs.length, 1);
t('俱乐部名称', list.clubs[0].name, '测试俱乐部');
t('创建者是部长', Number(list.clubs[0].memberType), 3);

app.onMessage('b', packCs(117, { code: String(clubId) }));
t('申请加入成功', Number(last(boxes.b, 117).res.error), 0);
app.onMessage('a', packCs(137, { clubId }));
const applyList = last(boxes.a, 137);
t('部长能看到申请', applyList.data.length, 1);
const applyId = Number(applyList.data[0].id);
app.onMessage('a', packCs(138, { id: applyId }));
t('审核通过', Number(last(boxes.a, 138).res.error), 0);

app.onMessage('b', packCs(113, {}));
list = last(boxes.b, 113);
t('申请人审核后看到俱乐部', list.clubs.length, 1);
t('申请人是普通成员', Number(list.clubs[0].memberType), 1);
app.onMessage('a', packCs(121, { clubId }));
const members = last(boxes.a, 121);
t('成员列表两人', members.members.length, 2);

boxes.a.sent.length = 0;
app.onMessage('a', packCs(145, { id: clubId, name: '新俱乐部名', announcement: '欢迎加入' }));
t('修改俱乐部资料', Number(last(boxes.a, 145).res.error), 0);
app.onMessage('a', packCs(113, {}));
t('列表显示新名称', last(boxes.a, 113).clubs[0].name, '新俱乐部名');

app.onMessage('a', packCs(201, {
  gameType: 2, clubId, num: 1, param1: gameParam.param1, param2: gameParam.param2,
}));
const roomId = Number(last(boxes.a, 201).roomId);
t('俱乐部建房成功', Number(last(boxes.a, 201).res.error), 0);
app.onMessage('a', packCs(202, { roomId }));
app.onMessage('b', packCs(202, { roomId }));
app.onMessage('a', packCs(122, { clubId }));
const rooms = last(boxes.a, 122);
t('俱乐部房间列表', rooms.rooms.length, 1);
t('房间挂在俱乐部', Number(app.tables.get(roomId).clubId), clubId);

app.onMessage('a', packCs(136, { clubId, userId: b.uid }));
t('踢出成员', Number(last(boxes.a, 136).res.error), 0);
app.onMessage('a', packCs(121, { clubId }));
t('踢出后只剩部长', last(boxes.a, 121).members.length, 1);

const dump = app.dump();
const restored = new GameApp({ persist: () => {}, now: () => 1, allowUnregisteredTokens: true });
restored.restore(dump);
t('存档恢复俱乐部', restored.clubStore.listFor(a.uid).length, 1);
t('存档恢复成员', restored.clubStore.get(clubId).members.length, 1);

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
