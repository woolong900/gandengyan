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
  const bytes = Buffer.from(frame);
  const id = bytes.readUInt32BE(0);
  return { id, body: protocol[id].sc.decode(bytes.subarray(12)) };
};
const supportData = (frames, msghead) => {
  const frame = frames.filter((item) => item.id === 999).map((item) => {
    const envelope = JSON.parse(item.body.json);
    return { msghead: envelope.msghead, data: JSON.parse(envelope.msgdata) };
  }).filter((item) => item.msghead === msghead).at(-1);
  return frame && frame.data;
};

let now = Date.UTC(2026, 9, 12, 4, 0, 0);
let persisted = null;
const app = new GameApp({ now: () => now, persist: (data) => { persisted = data; }, allowUnregisteredTokens: true });
const frames = [];
app.attach('player', (frame) => frames.push(sc(frame)));
app.onMessage('player', cs(100, { token: 'support-player-token' }));
const player = app.conns.get('player').player;
frames.length = 0;

const gameJson = (msghead, body = {}) => cs(200, {
  json: JSON.stringify({ msghead, msgdata: JSON.stringify(body) }),
});
app.onMessage('player', gameJson('support_history'));
check('未进入房间也能读取客服会话', Number(frames.at(-1).body.res.error), 0);
check('客服会话返回在线状态与服务时间', [
  supportData(frames, 'support_history').serviceOnline,
  supportData(frames, 'support_history').serviceHours,
], [true, '09:00–22:00']);

frames.length = 0;
app.onMessage('player', gameJson('support_send', { content: '最后一局没有出现胡牌按钮', clientVersion: '1.0.6/300' }));
check('大厅内可直接提交反馈', Number(frames.at(-1).body.res.error), 0);
const sent = supportData(frames, 'support_message');
check('玩家消息携带版本但不伪造房间', [
  sent.message.content, sent.message.context.clientVersion, sent.message.context.roomId,
], ['最后一局没有出现胡牌按钮', '1.0.6/300', 0]);
check('新消息进入后台待处理', app.listSupportConversations().unread, 1);
check('客服消息触发持久化', persisted.supportConversations[0].messages.length, 1);

frames.length = 0;
now += 1000;
const reply = app.replySupportMessage(player.uid, '已收到，正在核对该局记录。', '测试客服');
check('后台可回复客服会话', reply.message.from, 'admin');
check('客服回复即时推送给在线玩家', supportData(frames, 'support_message').message.content,
  '已收到，正在核对该局记录。');
check('客服回复后玩家未读数增加', reply.conversation.playerUnread, 1);

frames.length = 0;
app.onMessage('player', gameJson('support_read'));
check('玩家打开会话后标记已读', app.supportConversation(player.uid).conversation.playerUnread, 0);
check('空消息被服务端拒绝', app.sendSupportMessage(player, '   ').error,
  '请输入1至200个字的反馈内容');

const restored = new GameApp({ now: () => now, persist: () => {} });
restored.restore(app.dump());
check('服务重启后保留完整客服会话', restored.supportConversation(player.uid).conversation.messages.map((item) => item.from),
  ['player', 'admin']);
check('服务重启后消息编号继续递增', restored.nextSupportMessageId, 3);

console.log(`\n${passed} 过 / 0 挂`);
