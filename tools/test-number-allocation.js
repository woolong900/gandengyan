const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { GameApp } = require('../server/app');

const app = new GameApp();
const first = app.loginGuest('device-0001');
assert.equal(first.player.uid, 285633);

const nextBeforeBot = app.nextUid;
const bot = app.mintBot(2, 123456);
assert.ok(bot.uid >= 800000000 && bot.uid < 900000000);
assert.equal(app.nextUid, nextBeforeBot, '陪玩不能占用新玩家编号');
assert.equal(app.loginGuest('device-0002').player.uid, 285634);

const restored = new GameApp();
restored.restore({ ...app.dump(), nextUid: 100077 });
assert.equal(restored.loginGuest('device-0003').player.uid, 285635);
assert.equal(restored.loginGuest('device-0001').player.uid, 285633, '已有游客仍使用原 UID');

const oldRandomInt = crypto.randomInt;
try {
  crypto.randomInt = () => 321456;
  assert.equal(restored.mintRoomId(), 321456);
  restored.tables.set(321456, { closed: false });
  // 随机数持续碰撞时也必须找出另一个空房号。
  assert.equal(restored.mintRoomId(), 321457);
  restored.tables.delete(321456);
  assert.equal(restored.mintRoomId(), 321456, '已结束的房号可以重新使用');
} finally {
  crypto.randomInt = oldRandomInt;
}

console.log('房号与玩家编号 ✓');
