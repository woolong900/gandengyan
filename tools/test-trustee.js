#!/usr/bin/env node
/** 托管只由房间规则或玩家选择开启；用虚拟时钟检查取消后的旧回调。 */
const assert = require('assert/strict');
const { Table } = require('../server/table');
const { emptyMember } = require('../server/shared');
const rules = require('../server/rules');

let pass = 0;
const t = (name, actual, expected) => {
  assert.deepEqual(actual, expected, name);
  pass++;
};

const fixture = (timeout = 0) => {
  let now = 10000;
  const timers = new Map();
  const moves = [];
  const config = rules.parseConfig(...Object.values(rules.buildParam({ 人数: 2 })));
  config.托管 = timeout;
  const host = {
    now: () => now,
    schedule: (name, dueAt) => timers.set(name, dueAt),
    cancel: (name) => timers.delete(name),
    send: () => {},
    persist: () => {},
    log: () => {},
    onUidRoom: () => {},
  };
  const table = new Table({ roomId: 100037, gameType: 2, num: 1, host: 100001, config }, host);
  table.members = [0, 1].map((seat) => emptyMember({ uid: 100001 + seat, roomId: table.roomId }, {
    connId: `connection-${seat}`,
    site: seat + 1,
    online: true,
  }));
  // 只替换牌型计算；所有托管开关、离线处理及计时仍使用真实 Table。
  const round = {
    over: false,
    waiting: [0],
    waitingSeats() { return this.over ? [] : this.waiting; },
    seatOf(uid) { return table.members.findIndex((member) => member.player.uid === uid); },
    autoPlay(seat) {
      moves.push(seat);
      this.waiting = [];
    },
  };
  table.round = round;
  const member = table.members[0];
  const key = `turn-${member.player.uid}`;
  const toggle = () => table.handle200(member.player.uid, 'trustee', {});
  return { table, round, member, timers, moves, key, toggle, now: () => now, advance: (ms) => { now += ms; } };
};

{
  const f = fixture();
  f.table.armTurns();
  f.table.leave(f.member.player.uid, f.member.connId);
  t('不自动托管房间掉线仍记录离线', f.member.online, false);
  t('不自动托管房间掉线不强制托管', f.member.trustee, false);
  t('不自动托管房间掉线不创建出牌计时器', f.timers.has(f.key), false);
  f.advance(60000);
  f.table.onTimer(f.key);
  t('不自动托管房间无效回调不改变托管状态', f.member.trustee, false);
  t('不自动托管房间无效回调不出牌', f.moves, []);
}

{
  const f = fixture(30);
  f.table.armTurns();
  f.table.leave(f.member.player.uid, f.member.connId);
  t('启用超时托管的房间掉线后继续自动托管', f.member.trustee, true);
  t('掉线后安排托管代打', f.timers.get(f.key), f.now() + 1000);
  f.advance(1000);
  f.table.onTimer(f.key);
  t('启用超时托管的房间掉线后仍能代打', f.moves, [0]);
}

{
  const f = fixture();
  t('不自动托管房间仍接受手动开启', f.toggle(), { error: 0 });
  t('手动开启保留托管状态', f.member.trustee, true);
  t('手动开启安排代打', f.timers.get(f.key), f.now() + 1000);
  f.table.leave(f.member.player.uid, f.member.connId);
  t('掉线不会取消玩家主动开启的托管', f.member.trustee, true);
  f.advance(1000);
  f.table.onTimer(f.key);
  t('不自动托管房间手动开启后仍能代打', f.moves, [0]);
}

{
  const f = fixture();
  f.toggle();
  f.advance(500);
  f.toggle();
  t('取消托管立即恢复手动状态', f.member.trustee, false);
  t('不自动托管房间取消后移除出牌计时器', f.timers.has(f.key), false);
  t('不自动托管房间取消后清除倒计时', f.member.turnDeadline, 0);
  f.advance(500);
  f.table.onTimer(f.key);
  t('取消后旧回调不能重新开启托管', f.member.trustee, false);
  t('取消后旧回调不能出牌', f.moves, []);
  t('取消后旧回调不能重新创建计时器', f.timers.has(f.key), false);
}

{
  const f = fixture(30);
  f.toggle();
  f.advance(500);
  f.toggle();
  const dueAt = f.now() + 30000;
  t('启用超时房取消后恢复手动状态', f.member.trustee, false);
  t('启用超时房取消后获得完整等待时长', f.timers.get(f.key), dueAt);
  t('启用超时房取消后显示新的房间倒计时', f.member.turnDeadline, Math.floor(dueAt / 1000));
  f.advance(500);
  f.table.onTimer(f.key);
  t('旧的一秒回调不能提前恢复托管', f.member.trustee, false);
  t('旧的一秒回调不能提前出牌', f.moves, []);
  t('旧的一秒回调保留新的等待期限', f.timers.get(f.key), dueAt);
  f.advance(dueAt - f.now() - 1);
  f.table.onTimer(f.key);
  t('界面倒计时取整不能令托管提前触发', f.member.trustee, false);
  t('毫秒期限之前不能代打', f.moves, []);
  f.advance(1);
  f.table.onTimer(f.key);
  t('新的房间等待时间到期后正常托管', f.member.trustee, true);
  t('新的房间等待时间到期后正常代打', f.moves, [0]);
}

{
  const f = fixture(30);
  f.round.waiting = [0, 1];
  f.member.trustee = true;
  f.table.armTurns();
  const other = f.table.members[1];
  const otherKey = `turn-${other.player.uid}`;
  const otherDueAt = f.timers.get(otherKey);
  f.advance(500);
  f.toggle();
  t('取消一席只重新计算本人的等待期限', f.timers.get(f.key), f.now() + 30000);
  t('取消一席不延长另一等待席位的期限', f.timers.get(otherKey), otherDueAt);
  t('取消一席不改变另一席位的倒计时', other.turnDeadline, Math.floor(otherDueAt / 1000));
}

{
  const f = fixture(30);
  f.table.armTurns();
  f.round.waiting = [1];
  f.advance(30000);
  f.table.onTimer(f.key);
  t('非等待席位的旧回调不能开启托管', f.member.trustee, false);
  t('非等待席位的旧回调不能代打', f.moves, []);
}

{
  const f = fixture();
  f.toggle();
  f.round.over = true;
  f.advance(1000);
  f.table.onTimer(f.key);
  t('已结束牌局的旧回调不能代打', f.moves, []);
  f.table.armTurns();
  t('已结束牌局清除托管计时器', f.timers.has(f.key), false);
  t('已结束牌局清除倒计时', f.member.turnDeadline, 0);
}

{
  const f = fixture();
  f.member.bot = true;
  f.table.armTurns();
  t('不自动托管房间仍安排陪玩操作', f.timers.get(f.key), f.now() + 800);
  const dueAt = f.timers.get(f.key);
  // setTimeout 可在期限前一毫秒回调；旧实现直接返回，陪玩便永远不出牌。
  f.timers.delete(f.key);
  f.advance(799);
  f.table.onTimer(f.key);
  t('陪玩计时提前触发时保留出牌期限', f.timers.get(f.key), dueAt);
  t('陪玩计时提前触发时暂不出牌', f.moves, []);
  f.timers.delete(f.key);
  f.advance(1);
  f.table.onTimer(f.key);
  t('陪玩到期仍能自动出牌', f.moves, [0]);
}

console.log(`\n${pass} 过 / 0 挂`);
