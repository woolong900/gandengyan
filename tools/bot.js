#!/usr/bin/env node
/**
 * 陪玩：进房入座后自动摸打，把一局陪到底。
 * 用来在只有一个模拟器的情况下把人数凑齐。
 *
 * usage: node tools/bot.js <房号> [座位号] [http://主机:端口]
 */
const { startBot } = require('./botclient');

const room = Number(process.argv[2]);
if (!room) {
  console.error('要给房号：node tools/bot.js <房号> [座位号]');
  process.exit(1);
}

startBot({
  room,
  site: Number(process.argv[3] || 2),
  base: process.argv[4] || 'http://127.0.0.1:8899',
  rounds: Infinity, // 陪玩就一直陪着，几局是房间说了算
}).then(() => {
  console.log('断开');
  process.exit(0);
}).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
