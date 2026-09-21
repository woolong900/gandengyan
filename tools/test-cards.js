#!/usr/bin/env node
/**
 * 房卡、邀请码。不连真服务，直接喂 GameApp。
 */
process.env.QJQP_FILLBOTS = '0';

const { GameApp } = require('../server/app');
const { Table } = require('../server/table');
const { protocol } = require('../server/proto/protocol');
const rules = require('../server/rules');
const {
  NEW_PLAYER_CARDS, INVITE_GIVE, INVITE_AMBIGUOUS, mintInviteCode, num,
} = require('../server/shared');

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

{
  const used = new Set();
  let dirty = false;
  for (let i = 0; i < 200; i++) {
    const code = mintInviteCode(used);
    used.add(code);
    if (INVITE_AMBIGUOUS.test(code) || code.length !== 5) dirty = true;
  }
  t('连发 200 个邀请码都不含 I/O/Z/L', dirty, false);
  t('连发邀请码不重复', used.size, 200);
}

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
  const app = new GameApp({ persist: () => {}, now: () => 1, allowUnregisteredTokens: true });
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
  const app = new GameApp({ persist: () => {}, now: () => 1 });
  const box = { sent: [] };
  app.attach('unknown', (bytes) => box.sent.push(Buffer.from(bytes)));
  app.onMessage('unknown', packCs(100, { token: 'never-issued' }));
  t('未知 token 拒绝登录', Number(last(box, 100).res.error), 65);
  t('未知 token 不自动建号', app.players.size, 0);
}

{
  const { app, login } = boot();
  const a = login('a', 't_bad_config');
  const badPeople = rules.buildParam({ 人数: 5 });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1,
    param1: badPeople.param1, param2: badPeople.param2,
  }));
  t('拒绝不支持的人数', last(a.box, 201).res.what, '人数只支持 2 至 4 人');
  t('非法建房不占房号', app.tables.size, 0);
}

{
  const app = new GameApp({ persist: () => {} });
  app.economySettings.newPlayerCards = 321;
  const guest = app.loginGuest('configured-guest-device-123456');
  const wechat = app.loginWechat({ openid: 'configured-wechat-openid', nickname: '新微信用户' });
  t('游客注册按后台设置赠送房卡', guest.player.cardNum, 321);
  t('微信注册按后台设置赠送房卡', wechat.player.cardNum, 321);
  app.economySettings.newPlayerCards = 99;
  t('修改设置不改动已注册游客', guest.player.cardNum, 321);
  t('修改设置不改动已注册微信用户', wechat.player.cardNum, 321);
}

{
  const { app, login } = boot();
  const a = login('a', 't_no_voice_room');
  const voice = rules.buildParam({ 语音房: true });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1,
    param1: voice.param1, param2: voice.param2,
  }));
  t('拒绝创建语音房', last(a.box, 201).res.what, '暂不支持语音房');
  t('语音房不占房号', app.tables.size, 0);
}

{
  const { app, login } = boot();
  const a = login('a', 't_bad_message');
  app.onMessage('a', packCs(200, { json: '{' }));
  t('损坏的房内消息被拒绝', last(a.box, 200).res.what, '房内消息格式无效');
}

{
  const { app, login } = boot();
  const a = login('a', 't_inviter');
  const b = login('b', 't_new');
  t('新用户默认赠送 200 张房卡', a.login.cardNum, NEW_PLAYER_CARDS);
  t('登录就有 5 位大写邀请码', /^[A-Z]{5}$/.test(a.player.inviteCode), true);
  t('邀请码不含 I/O/Z/L', INVITE_AMBIGUOUS.test(a.player.inviteCode), false);
  t('两人邀请码不同', a.player.inviteCode !== b.player.inviteCode, true);
  a.box.sent.length = 0;
  app.onMessage('a', packCs(103, null));
  const mine = last(a.box, 103);
  t('103 带回自己的码', mine.username, a.player.inviteCode);
  t('未绑定 103 邀请码空', mine.inviteCode, '');
  t('未绑定 103 奖励 1000', mine.giveCard, INVITE_GIVE);
  t('103 带回后台邀请页面文案', mine.mobile, '绑定推荐人邀请码，可获得1000张房卡！');

  app.onMessage('b', packCs(104, { inviteCode: a.player.inviteCode.toLowerCase() }));
  t('绑定成功', num(last(b.box, 104).res.error), 0);
  t('邀请人 +1000', a.player.cardNum, NEW_PLAYER_CARDS + INVITE_GIVE);
  t('新用户 +1000', b.player.cardNum, NEW_PLAYER_CARDS + INVITE_GIVE);
  t('推了邀请人房卡', last(a.box, 1001) && last(a.box, 1001).card, NEW_PLAYER_CARDS + INVITE_GIVE);
  t('推了新用户房卡', last(b.box, 1001) && last(b.box, 1001).card, NEW_PLAYER_CARDS + INVITE_GIVE);

  app.onMessage('b', packCs(104, { inviteCode: a.player.inviteCode }));
  t('不能重复绑定', num(last(b.box, 104).res.error), 1);
  app.onMessage('a', packCs(104, { inviteCode: a.player.inviteCode }));
  t('不能绑自己', last(a.box, 104).res.what, '不能绑定自己的邀请码');
  app.onMessage('a', packCs(104, { inviteCode: 'ZZZZZ' }));
  t('不存在的码', last(a.box, 104).res.what, '邀请码不存在');
  app.onMessage('a', packCs(104, { inviteCode: String(b.player.uid) }));
  t('不能再用 uid 当码', last(a.box, 104).res.what, '邀请码无效');

  app.onMessage('b', packCs(103, null));
  t('已绑定带回对方码', last(b.box, 103).inviteCode, a.player.inviteCode);
  t('已绑定仍带回自己的码', last(b.box, 103).username, b.player.inviteCode);
}

{
  const { app, login } = boot();
  const a = login('a', 't_poor');
  a.player.cardNum = 0;
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
  a.player.cardNum = 0;
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
  b.player.cardNum = 0;
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
  b.player.cardNum = 0;
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
  const { app, login } = boot();
  const a = login('a', 't_one_room');
  a.player.cardNum = 20;
  const param = rules.buildParam({ 人数: 2, 房费: '房主' });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1, param1: param.param1, param2: param.param2,
  }));
  const roomId = num(last(a.box, 201).roomId);
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1, param1: param.param1, param2: param.param2,
  }));
  t('已在房间不能重复建房', last(a.box, 201).res.what, '已经在房间里');
  t('重复建房不增加房间', app.tables.size, 1);
}

{
  const dumped = {
    nextUid: 100003,
    nextRoomId: 100000,
    players: [{
      token: 't_old', uid: 100001, nickname: '老用户', sex: 1,
      cardNum: 100, roomId: 0, inviteCode: 'ABCDE', invitedBy: 'VWXYZ',
    }],
  };
  const app = new GameApp({ persist: () => {}, now: () => 1, allowUnregisteredTokens: true });
  app.restore(dumped);
  const old = app.players.get('t_old');
  t('旧存档房卡保留', old.cardNum, 100);
  t('旧存档邀请码保留', old.inviteCode, 'ABCDE');
  t('旧存档绑定码保留', old.invitedBy, 'VWXYZ');
}

{
  const { app, login } = boot();
  const owner = login('owner', 't_club_owner');
  const member = login('member', 't_club_member');
  const invited = login('invited', 't_club_invited');
  owner.player.cardNum = 0;
  member.player.cardNum = 0;
  invited.player.cardNum = 0;
  const { club } = app.clubStore.create(owner.player.uid, '房卡测试俱乐部');
  t('创建俱乐部时不把部长算作新加入成员', club.balanceCard, 0);

  app.onMessage('member', packCs(117, { code: club.code }));
  const applicationId = num(club.applications[0].id);
  app.onMessage('owner', packCs(138, { id: applicationId }));
  t('审核通过首位新成员给俱乐部200张', club.balanceCard, 200);
  t('入会赠送不进入玩家账户', member.player.cardNum, 0);
  app.onMessage('member', packCs(115, { id: club.id }));
  app.onMessage('owner', packCs(141, { clubId: club.id, userId: member.player.uid }));
  const rejoinInvite = club.invites.find((item) => item.toUid === member.player.uid);
  app.onMessage('member', packCs(119, { id: rejoinInvite.id }));
  t('同一成员重新加入不再领取房卡', club.balanceCard, 200);

  app.economySettings.newPlayerCards = 260;
  const configuredNewPlayer = login('configured-new-player', 't_configured_new_player');
  t('新注册用户按后台设置获取初始房卡', configuredNewPlayer.player.cardNum, 260);
  t('修改初始房卡不追溯改动已有用户', owner.player.cardNum, 0);

  app.economySettings.clubJoinBonus = 300;
  app.onMessage('owner', packCs(141, { clubId: club.id, userId: invited.player.uid }));
  const firstInvite = club.invites.find((item) => item.toUid === invited.player.uid);
  app.onMessage('invited', packCs(119, { id: firstInvite.id }));
  t('接受邀请的新成员按新设置领取房卡', club.balanceCard, 500);
  t('新成员奖励没有误加给玩家', invited.player.cardNum, 0);

  app.economySettings.inviteBindBonus = 75;
  app.economySettings.invitePageText = '测试自定义邀请文案';
  app.onMessage('invited', packCs(103, null));
  t('客户端邀请码页面看到后台设置数量', last(invited.box, 103).giveCard, 75);
  t('客户端邀请码页面看到后台设置文案', last(invited.box, 103).mobile, '测试自定义邀请文案');
  app.onMessage('invited', packCs(104, { inviteCode: owner.player.inviteCode }));
  t('邀请码绑定按设置奖励双方', [owner.player.cardNum, invited.player.cardNum], [75, 75]);
  app.onMessage('invited', packCs(104, { inviteCode: owner.player.inviteCode }));
  t('再次绑定不重复送房卡', [owner.player.cardNum, invited.player.cardNum], [75, 75]);

  owner.player.cardNum = 0;
  const aa = rules.buildParam({ 人数: 2, 房费: 'AA' });
  app.onMessage('owner', packCs(201, { gameType: 2, clubId: club.id, num: 2,
    param1: aa.param1, param2: aa.param2 }));
  t('玩家0张也可用俱乐部余额建房', num(last(owner.box, 201).res.error), 0);
  const roomId = num(last(owner.box, 201).roomId);
  app.onMessage('owner', packCs(202, { roomId }));
  app.onMessage('member', packCs(202, { roomId }));
  t('玩家0张也可在俱乐部AA房入座', num(last(member.box, 202).res.error), 0);
  const room = app.tables.get(roomId);
  t('俱乐部房首次开局成功', room.startGame(), null);
  t('16局2人整桌从俱乐部扣4张', club.balanceCard, 496);
  t('俱乐部房不扣玩家房卡', [owner.player.cardNum, member.player.cardNum], [0, 0]);
  t('重复扣费调用不再扣卡', [room.takeRoomCards(), club.balanceCard, room.cardCharges.length], [null, 496, 1]);

  const restored = new GameApp({ persist: () => {}, now: () => 1, allowUnregisteredTokens: true });
  restored.restore(app.dump());
  t('奖励设置恢复后保留', restored.economySettings,
    { newPlayerCards: 260, clubJoinBonus: 300, inviteBindBonus: 75,
      invitePageText: '测试自定义邀请文案' });
  t('俱乐部余额和已奖励成员恢复后保留',
    [restored.clubStore.get(club.id).balanceCard, restored.clubStore.get(club.id).rewardedMemberUids.length],
    [496, 3]);
  const oldSnapshot = app.dump();
  delete oldSnapshot.clubs.clubs[0].rewardedMemberUids;
  const migrated = new GameApp({ persist: () => {}, now: () => 1, allowUnregisteredTokens: true });
  migrated.restore(oldSnapshot);
  t('旧俱乐部存档把现有成员视为已入会', migrated.clubStore.get(club.id).rewardedMemberUids.length, 3);
}

{
  const { app, login } = boot();
  const owner = login('owner', 't_empty_club_owner');
  const { club } = app.clubStore.create(owner.player.uid, '空余额俱乐部');
  const param = rules.buildParam({ 人数: 2, 房费: '房主' });
  app.onMessage('owner', packCs(201, { gameType: 2, clubId: club.id, num: 1,
    param1: param.param1, param2: param.param2 }));
  t('俱乐部没卡时不能手动建房', last(owner.box, 201).res.what, '俱乐部房卡不足');
  t('余额不足建房不占房号', app.tables.size, 0);
  const automatic = new Table({ roomId: 100000, gameType: 2, clubId: club.id, num: 1,
    param1: param.param1, param2: param.param2, host: owner.player.uid,
    config: rules.parseConfig(param.param1, param.param2) }, app.tableHost(100000));
  app.tables.set(automatic.roomId, automatic);
  automatic.join(owner.player, 'owner');
  t('空余额自动桌不能开局', automatic.startGame(), '俱乐部房卡不足');
  t('开局失败不扣卡不推进局数', [club.balanceCard, automatic.step, automatic.cardCharges.length], [0, 0, 0]);
}

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
