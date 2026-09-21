#!/usr/bin/env node
const assert = require('assert/strict');
const { mergeState } = require('./merge-user-accounts');

let pass = 0;
const t = (name, actual, expected) => {
  assert.deepEqual(actual, expected, name);
  pass += 1;
};

const fixture = () => ({
  players: [
    {
      uid: 285636, token: 'current-token', nickname: '铠', cardNum: 200, roomId: 0,
      wechatOpenid: 'new-openid', wechatUnionid: 'new-unionid', inviteCode: 'CBWUJ',
      createdAt: 200, lastLoginAt: 500, readMessageIds: [2],
    },
    {
      uid: 100041, token: 'old-token', nickname: '铠', cardNum: 9998, roomId: 0,
      wechatOpenid: 'old-openid', wechatUnionid: 'old-unionid', inviteCode: 'DYSHR',
      createdAt: 100, lastLoginAt: 300, readMessageIds: [1, 2],
    },
  ],
  rooms: [],
  records: [{
    id: 'record-old', roomId: 103071, uids: [100041, 100099],
    players: [{ uid: 100041 }, { uid: 100099 }],
    details: [{ scores: [{ uid: 100041, score: 5 }] }],
    playbacks: { hand: { roomInfo: { roomId: 103071, house: 100041 }, steps: [{ operates: [{ uid: 100041 }] }] } },
  }],
  operatorMessages: [{ id: 1, targetUid: 100041 }, { id: 2, targetUid: 0 }],
  clubs: { clubs: [] },
});

const main = () => {
  const result = mergeState(fixture(), 285636, 100041);
  t('删除待合并 UID', result.state.players.map((player) => player.uid), [285636]);
  t('房卡保留较大值而不叠加', result.primary.cardNum, 9998);
  t('保留最早注册时间', result.primary.createdAt, 100);
  t('合并两套 openid', result.primary.wechatOpenids, ['new-openid', 'old-openid']);
  t('合并两套 unionid', result.primary.wechatUnionids, ['new-unionid', 'old-unionid']);
  t('保留旧 token 为别名', result.primary.tokenAliases, ['old-token']);
  t('保留旧邀请码为别名', result.primary.inviteCodeAliases, ['DYSHR']);
  t('当前战绩 UID 已迁移', result.state.records[0].uids, [285636, 100099]);
  t('回放内嵌 UID 已迁移', result.state.records[0].playbacks.hand.steps[0].operates[0].uid, 285636);
  t('回放房号不变', result.state.records[0].roomId, 103071);
  t('定向消息已迁移', result.state.operatorMessages[0].targetUid, 285636);

  const primaryActiveFixture = fixture();
  primaryActiveFixture.players[0].roomId = 654321;
  primaryActiveFixture.rooms.push({ roomId: 654321, host: 285636, members: [{ uid: 285636 }] });
  primaryActiveFixture.clubs.clubs.push({ id: 1, ownerUid: 285636, members: [{ uid: 285636 }] });
  t('保留账号在房间或俱乐部中仍可合并',
    mergeState(primaryActiveFixture, 285636, 100041).state.players.length, 1);

  const roomFixture = fixture();
  roomFixture.rooms.push({ roomId: 123456, host: 100041, members: [{ uid: 100041 }] });
  assert.throws(() => mergeState(roomFixture, 285636, 100041), /活动房间/);
  pass += 1;

  const clubFixture = fixture();
  clubFixture.clubs.clubs.push({ id: 1, ownerUid: 7, members: [{ uid: 100041 }] });
  assert.throws(() => mergeState(clubFixture, 285636, 100041), /俱乐部/);
  pass += 1;

  console.log(`\n${pass} 过 / 0 挂`);
};

main();
