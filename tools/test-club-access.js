#!/usr/bin/env node
/** 俱乐部房间准入：真实协议覆盖入座、观战、重连及拒绝后的状态。 */
process.env.QJQP_FILLBOTS = '0';

const assert = require('assert/strict');
const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');
const rules = require('../server/rules');

let pass = 0;
const t = (name, got, want) => {
  assert.deepEqual(got, want, name);
  pass++;
};
const packCs = (proto, msg) => {
  const payload = Buffer.from(protocol[proto].cs.encode(protocol[proto].cs.create(msg)).finish());
  const out = Buffer.alloc(12 + payload.length);
  out.writeUInt32BE(proto, 0);
  out.writeUInt32BE(out.length, 8);
  payload.copy(out, 12);
  return out;
};

const apps = [];
const fixture = (clubRoom = true) => {
  const app = new GameApp();
  apps.push(app);
  let connSeq = 0;
  const login = (oldToken) => {
    const token = oldToken || app.http('/login', new URLSearchParams()).body.data.token;
    const connId = `access-${++connSeq}`;
    const sent = [];
    app.attach(connId, (buf) => sent.push(buf));
    app.onMessage(connId, packCs(100, { token }));
    return { token, connId, sent, player: app.conns.get(connId).player };
  };
  const call = (client, proto, msg) => {
    client.sent.length = 0;
    app.onMessage(client.connId, packCs(proto, msg));
    const buf = client.sent.findLast((frame) => frame.readUInt32BE(0) === proto);
    assert.ok(buf, `收到 ${proto} 响应`);
    return protocol[proto].sc.decode(buf.subarray(12, buf.readUInt32BE(8)));
  };
  const host = login();
  const member = login();
  const outsider = login();
  for (const client of [host, member, outsider]) client.player.cardNum = 20;
  const { club } = app.clubStore.create(host.player.uid, '准入测试');
  const { application } = app.clubStore.apply(member.player.uid, club.code);
  app.clubStore.approve(host.player.uid, application.id);
  const config = { gameType: 2, num: 1, clubId: clubRoom ? club.id : 0,
    ...rules.buildParam({ 人数: 2, 房费: '房主', 观战: true }) };
  const roomId = Number(call(host, 201, config).roomId);
  assert.ok(roomId);
  assert.equal(Number(call(host, 202, { roomId }).res.error), 0);
  return { app, login, call, host, member, outsider, club, config, roomId, table: app.tables.get(roomId) };
};

const deniedJoin = (f, client, reason) => {
  const before = JSON.stringify(f.app.dump());
  const mapping = f.app.uidRoom.get(client.player.uid);
  const connRoom = f.app.conns.get(client.connId).roomId;
  const response = f.call(client, 202, { roomId: f.roomId });
  t(`${reason}返回错误`, Number(response.res.error), 1);
  t(`${reason}提示`, response.res.what, reason);
  t(`${reason}不泄露房间快照`, !!response.json, false);
  t(`${reason}不改变玩家、座位或房间数据`, JSON.stringify(f.app.dump()), before);
  t(`${reason}不改变房间索引`, f.app.uidRoom.get(client.player.uid), mapping);
  t(`${reason}不改变连接房间`, f.app.conns.get(client.connId).roomId, connRoom);
};

try {
  {
    const f = fixture();
    deniedJoin(f, f.outsider, '不是俱乐部成员');
    t('正常会员入座成功', Number(f.call(f.member, 202, { roomId: f.roomId }).res.error), 0);
    deniedJoin(f, f.outsider, '不是俱乐部成员'); // 满座、可观战也不能绕过权限
    const mine = f.table.members.find((m) => m.player.uid === f.member.player.uid);
    const site = mine.site;
    f.app.detach(f.member.connId);
    const reconnected = f.login(f.member.token);
    t('正常会员断线后可重连', Number(f.call(reconnected, 202, { roomId: f.roomId }).res.error), 0);
    t('重连保留原座位', mine.site, site);
    t('重连不新增座位', f.table.seats().length, 2);
    t('重连绑定新连接', mine.connId, reconnected.connId);

    const { application } = f.app.clubStore.apply(f.outsider.player.uid, f.club.code);
    f.app.clubStore.approve(f.host.player.uid, application.id);
    t('获准加入俱乐部后可观战', Number(f.call(f.outsider, 202, { roomId: f.roomId }).res.error), 0);
    t('观战保持满桌两席', [f.table.seats().length, f.table.watchers().length], [2, 1]);
  }
  {
    const f = fixture();
    f.app.clubStore.freeze(f.host.player.uid, f.club.id, f.member.player.uid, 1);
    deniedJoin(f, f.member, '你已被俱乐部冻结');
    f.app.clubStore.freeze(f.host.player.uid, f.club.id, f.member.player.uid, 0);
    t('解冻后可入座', Number(f.call(f.member, 202, { roomId: f.roomId }).res.error), 0);
    f.app.clubStore.freeze(f.host.player.uid, f.club.id, f.member.player.uid, 1);
    f.app.detach(f.member.connId);
    const reconnected = f.login(f.member.token);
    deniedJoin(f, reconnected, '你已被俱乐部冻结');
    t('被冻结重连不接管原座位', f.table.members.find((m) => m.player.uid === f.member.player.uid).connId, null);
  }
  {
    const f = fixture();
    f.club.settings.closed = true;
    deniedJoin(f, f.member, '俱乐部已关闭');
    f.club.settings.closed = false;
    t('重新开放后可入座', Number(f.call(f.member, 202, { roomId: f.roomId }).res.error), 0);
    f.app.detach(f.member.connId);
    f.club.settings.closed = true;
    deniedJoin(f, f.login(f.member.token), '俱乐部已关闭');
  }
  {
    const f = fixture();
    f.call(f.member, 202, { roomId: f.roomId });
    f.app.detach(f.member.connId);
    f.app.clubStore.kick(f.host.player.uid, f.club.id, f.member.player.uid);
    deniedJoin(f, f.login(f.member.token), '不是俱乐部成员');
  }
  {
    const f = fixture();
    f.app.clubStore.clubs.delete(f.club.id);
    deniedJoin(f, f.member, '不是俱乐部成员');
  }
  {
    const f = fixture(false);
    t('普通房仍允许非会员入座', Number(f.call(f.outsider, 202, { roomId: f.roomId }).res.error), 0);
  }
  {
    const f = fixture();
    t('非会员仍不能创建俱乐部房', f.call(f.outsider, 201, f.config).res.what, '不是俱乐部成员');
    f.app.clubStore.freeze(f.host.player.uid, f.club.id, f.member.player.uid, 1);
    t('冻结会员仍不能创建俱乐部房', f.call(f.member, 201, f.config).res.what, '你已被俱乐部冻结');
    f.app.clubStore.freeze(f.host.player.uid, f.club.id, f.member.player.uid, 0);
    f.club.settings.closed = true;
    t('关闭俱乐部仍不能建房', f.call(f.member, 201, f.config).res.what, '俱乐部已关闭');
    t('拒绝建房不新增桌子', f.app.tables.size, 1);
  }
  console.log(`\n${pass} 过 / 0 挂`);
} finally {
  for (const app of apps) for (const key of app.timeouts.keys()) app.cancel(key);
}
