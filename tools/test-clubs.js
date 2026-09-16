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
const c = login('c', 'club_c');
a.cardNum = 20;
b.cardNum = 20;

app.onMessage('a', packCs(153, null));
t('创建俱乐部代理信息可用', last(boxes.a, 153).code, 'QJQP');
t('创建俱乐部代理房卡充足', Number(last(boxes.a, 153).balanceCard) > 0, true);

app.onMessage('a', packCs(147, { name: '测试俱乐部' }));
const created = last(boxes.a, 147);
const clubId = Number(created.id);
t('创建俱乐部成功', Number(created.res.error), 0);
t('首个俱乐部 ID 从 158934 开始', clubId, 158934);

app.onMessage('a', packCs(143, { clubId }));
t('邀请页不能枚举所有玩家', last(boxes.a, 143).data.length, 0);
app.onMessage('a', packCs(140, { clubId, userCode: c.nickname }));
t('邀请搜索不允许按昵称查找', Number(last(boxes.a, 140).res.error), 1);
app.onMessage('a', packCs(140, { clubId, userCode: `0${c.uid}` }));
t('邀请搜索要求用户 ID 精确匹配', Number(last(boxes.a, 140).res.error), 1);
app.onMessage('a', packCs(140, { clubId, userCode: String(c.uid) }));
const exactInviteSearch = last(boxes.a, 140);
t('完整用户 ID 可以查到对应玩家', [Number(exactInviteSearch.res.error), Number(exactInviteSearch.info.id)], [0, c.uid]);

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

app.onMessage('a', packCs(135, { clubId, userId: b.uid, role: 2 }));
t('设置管理员', Number(last(boxes.a, 135).res.error), 0);
app.onMessage('a', packCs(133, { clubId, userId: b.uid, status: 1 }));
t('冻结成员', Number(last(boxes.a, 133).res.error), 0);
app.onMessage('a', packCs(134, { clubId, userId: b.uid, remark: '测试备注' }));
t('修改成员备注', Number(last(boxes.a, 134).res.error), 0);
app.onMessage('a', packCs(121, { clubId }));
const managed = last(boxes.a, 121).members.find((member) => Number(member.userId) === b.uid);
t('成员管理数据生效', [Number(managed.memberType), Number(managed.freeze), managed.remark], [2, 1, '测试备注']);

app.onMessage('a', packCs(149, { clubId, gameType: 2, num: 2, param1: gameParam.param1, param2: gameParam.param2 }));
t('添加俱乐部方案', Number(last(boxes.a, 149).res.error), 0);
app.onMessage('a', packCs(124, { clubId }));
const schemes = last(boxes.a, 124);
t('方案列表有一条', schemes.data.length, 1);
const schemeId = Number(schemes.data[0].id);
app.onMessage('a', packCs(151, { id: schemeId, status: true }));
t('方案自动开关', Number(last(boxes.a, 151).res.error), 0);
app.onMessage('a', packCs(122, { clubId }));
t('开启方案生成空桌', last(boxes.a, 122).rooms.length, 1);
const autoRoomId = Number(last(boxes.a, 122).rooms[0].id);
app.onMessage('a', packCs(202, { roomId: autoRoomId }));
t('进入自动桌成功', Number(last(boxes.a, 202).res.error), 0);
const autoSnapshot = JSON.parse(JSON.parse(last(boxes.a, 202).json).msgdata).room;
t('牌桌快照携带俱乐部 ID', Number(autoSnapshot.club_id), clubId);
const autoTables = [...app.tables.values()].filter((table) => table.clubId === clubId && Number(table.schemeId) === schemeId);
t('有人入座立即补一张空桌', [autoTables.length, autoTables.filter((table) => table.seats().length === 0).length], [2, 1]);
const vacantTable = autoTables.find((table) => table.members.length === 0);
app.onMessage('a', packCs(150, {
  id: schemeId, name: '', gameType: 2, num: 1, param1: gameParam.param1, param2: gameParam.param2, color: '0',
}));
t('玩法从16局改为8局成功', Number(last(boxes.a, 150).res.error), 0);
t('已有玩家的桌子保留16局', app.tables.get(autoRoomId).num, 2);
t('空桌立即改为8局', vacantTable.num, 1);
app.onMessage('a', packCs(122, { clubId }));
t('俱乐部桌子列表能看到补建空桌', last(boxes.a, 122).rooms.length, 2);
t('桌子列表显示新空桌8局', Number(last(boxes.a, 122).rooms.find((room) => Number(room.id) === vacantTable.roomId).num), 1);
app.onMessage('a', packCs(202, { roomId: autoRoomId }));
t('重连同一桌不会重复补桌', [...app.tables.values()].filter((table) => table.clubId === clubId && Number(table.schemeId) === schemeId).length, 2);
app.tables.get(autoRoomId).dissolve();
app.onMessage('a', packCs(152, { id: schemeId }));
t('删除俱乐部方案', Number(last(boxes.a, 152).res.error), 0);

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
const manualSnapshot = JSON.parse(JSON.parse(last(boxes.a, 202).json).msgdata).room;
t('手动创建的俱乐部房间也携带俱乐部 ID', Number(manualSnapshot.club_id), clubId);
app.onMessage('a', packCs(133, { clubId, userId: b.uid, status: 0 }));
t('解冻后允许成员入房', Number(last(boxes.a, 133).res.error), 0);
app.onMessage('b', packCs(202, { roomId }));
t('成员进俱乐部房成功', Number(last(boxes.b, 202).res.error), 0);
app.onMessage('a', packCs(157, { id: roomId, userCode: String(a.uid) }));
t('管理员不能踢自己', Number(last(boxes.a, 157).res.error), 1);
t('踢自己失败后仍在座', app.tables.get(roomId).seats().length, 2);
app.onMessage('a', packCs(135, { clubId, userId: b.uid, role: 1 }));
app.onMessage('b', packCs(157, { id: roomId, userCode: String(a.uid) }));
t('普通成员不能踢人', Number(last(boxes.b, 157).res.error), 1);
app.tables.get(roomId).step = 1;
app.onMessage('a', packCs(157, { id: roomId, userCode: String(b.uid) }));
t('开局后不能踢人', Number(last(boxes.a, 157).res.error), 1);
app.tables.get(roomId).step = 0;
app.onMessage('a', packCs(157, { id: roomId, userCode: String(b.uid) }));
t('管理员踢出其他玩家成功', Number(last(boxes.a, 157).res.error), 0);
t('被踢玩家座位与房间关联已清理', [app.tables.get(roomId).seats().length, app.uidRoom.has(b.uid), b.roomId], [1, false, 0]);
const kickedNotice = JSON.parse(last(boxes.b, 999).json);
t('被踢玩家收到退出通知', kickedNotice.msghead, 'exitroom');
app.onMessage('a', packCs(122, { clubId }));
const rooms = last(boxes.a, 122);
t('俱乐部房间列表', rooms.rooms.length, 1);
t('被踢头像不再出现在房间列表', rooms.rooms[0].players.map((player) => player.code), [String(a.uid)]);
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
