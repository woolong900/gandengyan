#!/usr/bin/env node
const assert = require('assert/strict');
const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');

let passed = 0;
const check = (name, actual, expected) => {
  assert.deepEqual(actual, expected, name);
  passed++;
};
const cs = (id, body = {}) => {
  const payload = Buffer.from(protocol[id].cs.encode(protocol[id].cs.create(body)).finish());
  const frame = Buffer.alloc(12 + payload.length);
  frame.writeUInt32BE(id, 0);
  frame.writeUInt32BE(frame.length, 8);
  payload.copy(frame, 12);
  return frame;
};
const sc = (frame) => {
  const id = frame.readUInt32BE(0);
  return { id, body: protocol[id].sc.decode(frame.subarray(12)) };
};
const app = new GameApp({ now: () => 1000000, persist: () => {}, allowUnregisteredTokens: true });
const boxes = {};
const login = (key) => {
  boxes[key] = [];
  app.attach(key, (frame) => boxes[key].push(sc(Buffer.from(frame))));
  app.onMessage(key, cs(100, { token: key }));
  return app.conns.get(key).player;
};
const owner = login('owner');
const b = login('b');
const c = login('c');
const d = login('d');
const e = login('e');
const request = (who, id, body) => {
  app.onMessage(who, cs(id, body));
  return boxes[who].filter((item) => item.id === id).at(-1).body;
};

const created = request('owner', 147, { name: '消息测试俱乐部' });
const clubId = Number(created.id);
check('创建俱乐部', Number(created.res.error), 0);
const candidates = request('owner', 143, { clubId }).data.map((item) => Number(item.userId));
check('批量邀请列表显示真实玩家', candidates, [b.uid, c.uid, d.uid, e.uid]);
check('普通成员没有邀请权限', Number(request('b', 143, { clubId }).res.error), 1);

const batch = request('owner', 144, { clubId, userId: [b.uid, c.uid] });
check('批量邀请真实写入', Number(batch.res.error), 0);
check('两名在线收件人立即收到刷新信号', [boxes.b.some((item) => item.id === 1003), boxes.c.some((item) => item.id === 1003)], [true, true]);
const bInbox = request('b', 118, {}).invites;
check('消息显示邀请人昵称和俱乐部名', [bInbox[0].inviter, bInbox[0].name, bInbox[0].policy], [owner.nickname, '消息测试俱乐部', 0]);
const invitationId = Number(bInbox[0].id);
check('批量邀请排除已有待办玩家', request('owner', 143, { clubId }).data.map((item) => Number(item.userId)), [d.uid, e.uid]);
check('混合重复邀请整体失败', Number(request('owner', 144, { clubId, userId: [b.uid, d.uid] }).res.error), 1);
check('失败批次没有给另一玩家误发邀请', request('d', 118, {}).invites.length, 0);
check('不存在的玩家不能邀请', Number(request('owner', 141, { clubId, userId: 999999 }).res.error), 1);
check('同意邀请加入俱乐部', Number(request('b', 119, { id: invitationId }).res.error), 0);
check('同意后邀请从消息列表消失', request('b', 118, {}).invites.length, 0);
check('同意后成为成员', !!app.clubStore.member(app.clubStore.get(clubId), b.uid), true);
check('设置俱乐部管理员', Number(request('owner', 135, { clubId, userId: b.uid, role: 2 }).res.error), 0);
const cInvitationId = Number(request('c', 118, {}).invites[0].id);
check('拒绝邀请成功', Number(request('c', 120, { id: cInvitationId }).res.error), 0);
check('拒绝后消息消失', request('c', 118, {}).invites.length, 0);
check('单人邀请可发给未入会玩家', Number(request('owner', 141, { clubId, userId: d.uid }).res.error), 0);

boxes.owner.length = 0;
boxes.b.length = 0;
check('玩家可申请加入俱乐部', Number(request('e', 117, { code: String(clubId) }).res.error), 0);
check('申请后部长和管理员立即收到刷新信号', [
  boxes.owner.some((item) => item.id === 1003), boxes.b.some((item) => item.id === 1003),
], [true, true]);
const applicationMessage = request('owner', 118, {}).invites.find((item) => Number(item.id) >= 4000000000);
check('待审核申请显示在管理员消息中', [applicationMessage.inviter, Number(applicationMessage.policy)], ['俱乐部申请', 1]);
check('点击查看后标记申请消息已读', Number(request('owner', 120, { id: applicationMessage.id }).res.error), 0);
check('已读申请仍保留在消息列表', Number(request('owner', 118, {}).invites.find((item) => Number(item.id) === Number(applicationMessage.id)).policy), 2);
const applicationId = Number(request('owner', 137, { clubId }).data.find((item) => Number(item.code) === e.uid).id);
check('管理员审核通过入会申请', Number(request('owner', 138, { id: applicationId }).res.error), 0);
check('已处理申请自动从所有管理员消息中消失', [
  request('owner', 118, {}).invites.some((item) => Number(item.id) === Number(applicationMessage.id)),
  request('b', 118, {}).invites.some((item) => Number(item.id) === Number(applicationMessage.id)),
], [false, false]);

const allMessage = app.createOperatorMessage({ title: '维护通知', content: '今晚维护，请提前结束牌局。' }).message;
check('运营通知编号与邀请不冲突', allMessage.id >= 1000000000, true);
check('运营通知在消息列表显示未读', request('b', 118, {}).invites.find((item) => Number(item.id) === allMessage.id).policy, 1);
check('收件人确认已读', Number(request('b', 120, { id: allMessage.id }).res.error), 0);
check('已读后消息保留但状态改变', request('b', 118, {}).invites.find((item) => Number(item.id) === allMessage.id).policy, 2);
const targeted = app.createOperatorMessage({ title: '单独通知', content: '请联系管理员。', targetUid: c.uid }).message;
check('定向通知只给指定玩家', [request('b', 118, {}).invites.some((item) => Number(item.id) === targeted.id), request('c', 118, {}).invites.some((item) => Number(item.id) === targeted.id)], [false, true]);
check('其他玩家不能标记定向消息已读', Number(request('b', 120, { id: targeted.id }).res.error), 1);

const restored = new GameApp({ now: () => 1000000, persist: () => {} });
restored.restore(app.dump());
check('服务重启保留运营通知', restored.operatorMessages.length, 2);
check('服务重启保留已读状态', restored.playerByUid(b.uid).readMessageIds.includes(allMessage.id), true);
check('服务重启保留待处理邀请', restored.clubStore.inviteList(d.uid).length, 1);
check('撤回运营通知', !!app.deleteOperatorMessage(allMessage.id).message, true);
check('撤回后从列表消失', request('b', 118, {}).invites.some((item) => Number(item.id) === allMessage.id), false);
check('撤回剩余最后一条通知', !!app.deleteOperatorMessage(targeted.id).message, true);
const afterDelete = new GameApp({ now: () => 1000000, persist: () => {} });
afterDelete.restore(app.dump());
check('删除全部通知并重启后编号序列仍前进', afterDelete.nextOperatorMessageId, targeted.id + 1);
check('重启后新通知不复用旧编号', afterDelete.createOperatorMessage({ title: '新通知', content: '新正文' }).message.id, targeted.id + 1);

console.log(`\n${passed} 过 / 0 挂`);
