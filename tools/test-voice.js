#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createVoice } = require('../server/voice');

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

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-voice-'));
const silk = Buffer.from('#!SILK_V3' + 'x'.repeat(40));
const m4a = Buffer.concat([Buffer.alloc(4), Buffer.from('ftypM4A '), Buffer.alloc(40)]);
let clock = 1_000_000;
const voice = createVoice(dir, {
  maxBytes: 80,
  ttlMs: 1000,
  maxFiles: 2,
  maxTotal: 10 * 1024,
  postsPerMin: 2,
  now: () => clock,
});

t('拒绝非支持音频', voice.put(Buffer.from('hello!!!')).error, 'invalid');
t('拒绝过大', voice.put(Buffer.concat([silk, Buffer.alloc(80)])).error, 'too large');
const a = voice.put(silk);
t('写入成功', !!a.id && a.id.startsWith('qjqp:'), true);
t('接受双端通用 AAC', voice.put(m4a).error || '', '');
t('能取到文件', !!voice.fileOf(a.id), true);
t('坏 id 没有文件', voice.fileOf('qjqp:not-a-real-id-value-xxx'), '');

t('同一 IP 前两次能发', voice.allowPost('1.1.1.1'), true);
t('同一 IP 第二次能发', voice.allowPost('1.1.1.1'), true);
t('同一 IP 超频被拒', voice.allowPost('1.1.1.1'), false);
t('另一个 IP 不受影响', voice.allowPost('2.2.2.2'), true);

clock += 2000;
const b = voice.put(silk);
const c = voice.put(silk);
voice.prune();
t('过期文件被清掉', voice.fileOf(a.id), '');
t('超限时留下新的', !!voice.fileOf(b.id) || !!voice.fileOf(c.id), true);

fs.rmSync(dir, { recursive: true, force: true });
console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
