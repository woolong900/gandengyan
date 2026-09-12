#!/usr/bin/env node
/**
 * 盯着 server/index.js：异常退出就拉起来。
 *
 * usage: PORT=8899 node tools/serve.js
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOG = process.env.QJQP_LOG || '/tmp/qjqp-srv.log';
const PORT = process.env.PORT || '8899';

let child = null;
let stopping = false;
let restarts = 0;
let stableTimer = null;

const stamp = (line) => {
  const when = new Date().toISOString();
  fs.appendFileSync(LOG, `\n[${when}] ${line}\n`);
  console.log(`[serve] ${line}`);
};

const start = () => {
  const out = fs.openSync(LOG, 'a');
  stamp(`启动 server/index.js :${PORT} 日志 ${LOG}`);
  child = spawn(process.execPath, ['server/index.js'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', out, out],
  });
  fs.closeSync(out);
  if (stableTimer) clearTimeout(stableTimer);
  stableTimer = setTimeout(() => { restarts = 0; }, 30000);
  child.on('exit', (code, signal) => {
    if (stableTimer) {
      clearTimeout(stableTimer);
      stableTimer = null;
    }
    stamp(`进程退出 code=${code} signal=${signal || ''}`);
    child = null;
    if (stopping) return;
    restarts += 1;
    const delay = Math.min(10000, 400 * (2 ** Math.min(restarts, 5)));
    stamp(`异常退出，${delay}ms 后第 ${restarts} 次拉起`);
    setTimeout(start, delay);
  });
};

const stop = (sig) => {
  if (stopping) return;
  stopping = true;
  stamp(`收到 ${sig}，停止守护`);
  if (child) child.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1500);
};

process.on('SIGTERM', () => stop('SIGTERM'));
process.on('SIGINT', () => stop('SIGINT'));

start();
