#!/usr/bin/env node
/** 托管只由房间规则或玩家选择开启；用虚拟时钟检查取消后的旧回调。 */
const assert = require('assert/strict');
const {
  Table, BOT_MIN_DELAY_MS, BOT_MAX_DELAY_MS, BOT_OPENING_PRESENTATION_MS,
} = require('../server/table');
const { emptyMember } = require('../server/shared');
const rules = require('../server/rules');

let pass = 0;
const t = (name, actual, expected) => {
  assert.deepEqual(actual, expected, name);
  pass++;
};

const fixture = (timeout = 0, random = 0) => {
  let now = 10000;
  const timers = new Map();
  const moves = [];
  const whitelist = new Set();
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
    trusteeWhitelisted: (uid) => whitelist.has(Number(uid)),
    trusteeStrategy: () => 'local',
    random: () => random,
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
    autoPlay(seat, policy) {
      moves.push({ seat, policy: policy || null });
      this.waiting = [];
    },
  };
  table.round = round;
  const member = table.members[0];
  const key = `turn-${member.player.uid}`;
  const toggle = () => table.handle200(member.player.uid, 'trustee', {});
  return { table, round, member, timers, moves, whitelist, key, toggle,
    now: () => now, advance: (ms) => { now += ms; } };
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
  t('启用超时托管的房间掉线后仍能代打', f.moves, [{ seat: 0, policy: null }]);
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
  t('不自动托管房间手动开启后仍能代打', f.moves, [{ seat: 0, policy: null }]);
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
  t('新的房间等待时间到期后正常代打', f.moves, [{ seat: 0, policy: null }]);
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
  t('陪玩到期仍能自动出牌', f.moves, [{ seat: 0, policy: null }]);
}

{
  const f = fixture(0, 1);
  f.member.bot = true;
  f.table.armTurns();
  t('陪玩随机延迟上限为 1.5 秒', f.timers.get(f.key), f.now() + BOT_MAX_DELAY_MS);
  f.advance(BOT_MAX_DELAY_MS - 1);
  f.table.onTimer(f.key);
  t('随机期限之前陪玩不出牌', f.moves, []);
  f.advance(1);
  f.table.onTimer(f.key);
  t('1.5 秒上限到期后陪玩正常出牌', f.moves, [{ seat: 0, policy: null }]);
}

{
  const f = fixture(0, 0.5);
  f.member.bot = true;
  f.table.armTurns();
  t('陪玩在 0.8–1.5 秒之间使用随机延迟', f.timers.get(f.key),
    f.now() + Math.round((BOT_MIN_DELAY_MS + BOT_MAX_DELAY_MS) / 2));
}

{
  const f = fixture();
  f.member.bot = true;
  f.table.lastRoundStartedAt = f.now();
  f.table.armTurns();
  const dueAt = f.now() + BOT_OPENING_PRESENTATION_MS + BOT_MIN_DELAY_MS;
  t('开局首个机器人操作等待客户端发牌理牌后再计时', f.timers.get(f.key), dueAt);
  f.advance(BOT_OPENING_PRESENTATION_MS + BOT_MIN_DELAY_MS - 1);
  f.table.onTimer(f.key);
  t('开局理牌缓冲结束前机器人不能操作', f.moves, []);
  f.advance(1);
  f.table.onTimer(f.key);
  t('开局展示结束后机器人按正常最短表现时间操作',
    f.moves, [{ seat: 0, policy: null }]);
}

{
  const f = fixture();
  f.whitelist.add(f.member.player.uid);
  f.table.syncManagedTrustees();
  t('干瞪眼小局中白名单玩家立即进入后台托管',
    [f.member.trustee, f.member.managedTrustee], [true, true]);
  t('后台托管使用机器人响应速度', f.timers.get(f.key), f.now() + 800);
  f.toggle();
  t('后台托管期间客户端可以立即取消并记录主动退出',
    [f.member.trustee, f.member.managedTrustee, f.member.managedTrusteeOptOut],
    [false, false, true]);
  t('主动取消后台托管立即停止代打', f.timers.has(f.key), false);

  f.table.round = null;
  f.table.syncManagedTrustees();
  t('主动退出后台托管会写入房间存档',
    f.table.dump().members[0].managedTrusteeOptOut, true);
  f.table.round = f.round;
  f.table.syncManagedTrustees();
  t('主动取消后下一小局不会因仍在白名单而自动恢复',
    [f.member.trustee, f.member.managedTrustee, f.timers.has(f.key)], [false, false, false]);

  f.table.resetManagedTrusteeOptOut(f.member.player.uid);
  f.table.syncManagedTrustees();
  t('后台再次明确启用后可以恢复托管',
    [f.member.trustee, f.member.managedTrustee, f.member.managedTrusteeOptOut],
    [true, true, false]);
  f.advance(800);
  f.table.onTimer(f.key);
  t('后台重新启用后到期自动出牌', f.moves, [{ seat: 0, policy: null }]);

  f.round.waiting = [0];
  f.whitelist.delete(f.member.player.uid);
  f.table.syncManagedTrustees();
  t('移出白名单立即解除后台托管',
    [f.member.trustee, f.member.managedTrustee], [false, false]);
  t('移出白名单立即清除托管计时器', f.timers.has(f.key), false);
}

{
  const f = fixture();
  let requests = 0;
  f.table.host.trusteeStrategy = () => 'jev';
  f.table.host.jevBot = {};
  f.round.prepareAutoPlayJev = () => {
    requests++;
    return { promise: new Promise(() => {}) };
  };
  f.whitelist.add(f.member.player.uid);
  f.table.syncManagedTrustees();
  t('轮到后台托管玩家时立即请求 Jev', requests, 1);
  f.table.armTurns();
  t('同一操作窗口重复计时不会重复请求 Jev', requests, 1);
  f.advance(BOT_MIN_DELAY_MS);
  f.table.onTimer(f.key);
  t('Jev 未在随机期限内返回时立即使用本地策略',
    f.moves, [{ seat: 0, policy: null }]);
}

{
  const f = fixture();
  f.table.gameType = 17;
  f.whitelist.add(f.member.player.uid);
  f.table.syncManagedTrustees();
  t('白名单不会在非干瞪眼牌局启用',
    [f.member.trustee, f.member.managedTrustee, f.timers.has(f.key)], [false, false, false]);
}

{
  const f = fixture();
  f.table.round = null;
  f.whitelist.add(f.member.player.uid);
  f.table.syncManagedTrustees();
  t('白名单不会在干瞪眼等待阶段启用',
    [f.member.trustee, f.member.managedTrustee, f.timers.has(f.key)], [false, false, false]);
}

console.log(`\n${pass} 过 / 0 挂`);
