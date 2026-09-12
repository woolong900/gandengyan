#!/usr/bin/env node
const { pack, unpack } = require('../server/net');

let pass = 0;
let fail = 0;
const t = (name, got, want) => {
  const ok = got === want;
  if (ok) pass++;
  else {
    fail++;
    console.log(`  ✗ ${name}: 得到 ${JSON.stringify(got)} 期望 ${JSON.stringify(want)}`);
  }
};

const frame = pack(99, { time: 1 });
t('正常帧可解包', unpack(frame).proto, 99);

for (const [name, bytes] of [
  ['短帧', Buffer.alloc(4)],
  ['长度过小', (() => { const b = Buffer.alloc(12); b.writeUInt32BE(8, 8); return b; })()],
  ['长度超出实际', (() => { const b = Buffer.alloc(12); b.writeUInt32BE(20, 8); return b; })()],
]) {
  let threw = false;
  try { unpack(bytes); } catch { threw = true; }
  t(`${name}被拒绝`, threw, true);
}

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
