#!/usr/bin/env node
/**
 * 房卡、邀请码。不连真服务，直接喂 GameApp。
 */
process.env.QJQP_FILLBOTS = '0';

const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');
const rules = require('../server/rules');
const { INVITE_GIVE, num } = require('../server/shared');

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

const boot = () => {
  const app = new GameApp({ persist: () => {}, now: () => 1 });
  const boxes = new Map();
  const attach = (id) => {
    const box = { sent: [] };
    boxes.set(id, box);
    app.attach(id, (bytes) => box.sent.push(Buffer.from(bytes)));
    return box;
  };
  const login = (id, token) => {
    const box = attach(id);
    app.onMessage(id, packCs(100, { token }));
    return { box, player: app.conns.get(id).player, login: last(box, 100) };
  };
  return { app, boxes, attach, login };
};

{
  const { app, login } = boot();
  const a = login('a', 't_inviter');
  const b = login('b', 't_new');
  t('新用户 0 张房卡', a.login.cardNum, 0);
  a.box.sent.length = 0;
  app.onMessage('a', packCs(103, null));
  const mine = last(a.box, 103);
  t('未绑定 103 邀请码空', mine.inviteCode, '');
  t('未绑定 103 奖励 1000', mine.giveCard, INVITE_GIVE);

  app.onMessage('b', packCs(104, { inviteCode: String(a.player.uid) }));
  t('绑定成功', num(last(b.box, 104).res.error), 0);
  t('邀请人 +1000', a.player.cardNum, INVITE_GIVE);
  t('新用户 +1000', b.player.cardNum, INVITE_GIVE);
  t('推了邀请人房卡', last(a.box, 1001) && last(a.box, 1001).card, INVITE_GIVE);
  t('推了新用户房卡', last(b.box, 1001) && last(b.box, 1001).card, INVITE_GIVE);

  app.onMessage('b', packCs(104, { inviteCode: String(a.player.uid) }));
  t('不能重复绑定', num(last(b.box, 104).res.error), 1);
  app.onMessage('a', packCs(104, { inviteCode: String(a.player.uid) }));
  t('不能绑自己', num(last(a.box, 104).res.error), 1);
  app.onMessage('a', packCs(104, { inviteCode: '999999' }));
  t('不存在的码', last(a.box, 104).res.what, '邀请码不存在');

  a.box.sent.length = 0;
  app.onMessage('b', packCs(103, null));
  t('已绑定带回码', last(b.box, 103).inviteCode, String(a.player.uid));
}

{
  const { app, login } = boot();
  const a = login('a', 't_poor');
  const param = rules.buildParam({ 人数: 2, 房费: '房主' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1, param1: param.param1, param2: param.param2,
  }));
  t('没卡建不了房主房', last(a.box, 201).res.what, '房卡不足');
  t('房号没被占', app.tables.size, 0);
}

{
  const { app, login } = boot();
  const a = login('a', 't_host');
  a.player.cardNum = 10;
  const param = rules.buildParam({ 人数: 2, 房费: '房主' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1, param1: param.param1, param2: param.param2,
  }));
  t('建房不扣房卡', a.player.cardNum, 10);
  t('建房成功', num(last(a.box, 201).res.error), 0);
  const roomId = num(last(a.box, 201).roomId);
  app.onMessage('a', packCs(202, { roomId }));
  t('进房不扣房卡', a.player.cardNum, 10);
  const table = app.tables.get(roomId);
  t('开局才扣房主', table.startGame(), null);
  t('房主 2 人 8 局扣 2', a.player.cardNum, 8);
  table.dissolve();
  t('已开局不退', a.player.cardNum, 8);
}

{
  const { app, login } = boot();
  const a = login('a', 't_aa1');
  const b = login('b', 't_aa2');
  a.player.cardNum = 5;
  b.player.cardNum = 5;
  const param = rules.buildParam({ 人数: 2, 房费: 'AA' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 2, param1: param.param1, param2: param.param2,
  }));
  t('AA 建房不扣', a.player.cardNum, 5);
  const roomId = num(last(a.box, 201).roomId);
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  t('AA 进房不扣', [a.player.cardNum, b.player.cardNum], [5, 5]);
  const table = app.tables.get(roomId);
  table.dissolve();
  t('没开局也不扣', [a.player.cardNum, b.player.cardNum], [5, 5]);
}

{
  const { app, login } = boot();
  const a = login('a', 't_aa3');
  const b = login('b', 't_aa4');
  a.player.cardNum = 5;
  b.player.cardNum = 5;
  const param = rules.buildParam({ 人数: 2, 房费: 'AA' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 2, param1: param.param1, param2: param.param2,
  }));
  const roomId = num(last(a.box, 201).roomId);
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  const table = app.tables.get(roomId);
  t('开局才扣 AA', table.startGame(), null);
  t('AA 16 局每人扣 2', [a.player.cardNum, b.player.cardNum], [3, 3]);
}

{
  const { app, login } = boot();
  const a = login('a', 't_aa_broke_host');
  const param = rules.buildParam({ 人数: 2, 房费: 'AA' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 2, param1: param.param1, param2: param.param2,
  }));
  t('AA 没卡建不了房', last(a.box, 201).res.what, '房卡不足');
}

{
  const { app, login } = boot();
  const a = login('a', 't_aa_ok');
  const b = login('b', 't_aa_broke');
  a.player.cardNum = 5;
  const param = rules.buildParam({ 人数: 2, 房费: 'AA' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 2, param1: param.param1, param2: param.param2,
  }));
  const roomId = num(last(a.box, 201).roomId);
  app.onMessage('b', packCs(202, { roomId }));
  t('AA 没卡坐不下', last(b.box, 202).res.what, '房卡不足');
  t('AA 没卡没入座', app.tables.get(roomId).members.length, 0);
}

{
  const { app, login } = boot();
  const a = login('a', 't_host_ok');
  const b = login('b', 't_guest_broke');
  a.player.cardNum = 10;
  const param = rules.buildParam({ 人数: 2, 房费: '房主' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1, param1: param.param1, param2: param.param2,
  }));
  const roomId = num(last(a.box, 201).roomId);
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  t('房主支付客人0张也能坐', num(last(b.box, 202).res.error), 0);
  t('房主支付客人入座了', app.tables.get(roomId).members.some((m) => m.player.uid === b.player.uid), true);
}

{
  const { app, login } = boot();
  const a = login('a', 't_shop');
  app.onMessage('a', packCs(112, { limit: 10, offset: 0, page: 1, perPage: 10 }));
  t('充值未开放', last(a.box, 112).res.what, '暂未开放充值');
}

{
  const dumped = {
    nextUid: 100003,
    nextRoomId: 100000,
    players: [{
      token: 't_old', uid: 100001, nickname: '老用户', sex: 1,
      cardNum: 100, roomId: 0, invitedBy: '100002',
    }],
  };
  const app = new GameApp({ persist: () => {}, now: () => 1 });
  app.restore(dumped);
  const old = app.players.get('t_old');
  t('旧存档房卡保留', old.cardNum, 100);
  t('旧存档邀请码保留', old.invitedBy, '100002');
}

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
