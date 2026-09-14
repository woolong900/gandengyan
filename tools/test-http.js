#!/usr/bin/env node
/** 启动隔离服务，验证 URL 容错及异常请求后已有连接仍可使用。 */
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const net = require('net');
const { spawn } = require('child_process');
const { WebSocket } = require('ws');
const { protocol } = require('../server/proto/protocol');

let pass = 0;
const t = (name, actual, expected) => {
  assert.deepEqual(actual, expected, name);
  pass++;
};

const freePort = () => new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.once('error', reject);
  probe.listen(0, '127.0.0.1', () => {
    const port = probe.address().port;
    probe.close((err) => err ? reject(err) : resolve(port));
  });
});

const request = (port, target, host = `127.0.0.1:${port}`) => new Promise((resolve, reject) => {
  const req = http.get({ hostname: '127.0.0.1', port, path: target, headers: { Host: host }, agent: false }, (res) => {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('error', reject);
    res.on('end', () => {
      try {
        resolve({ status: res.statusCode, body: JSON.parse(Buffer.concat(chunks).toString()) });
      } catch (err) { reject(err); }
    });
  });
  req.setTimeout(3000, () => req.destroy(new Error('HTTP 请求超时')));
  req.on('error', reject);
});

const requestText = (port, target, headers = {}) => new Promise((resolve, reject) => {
  const req = http.get({ hostname: '127.0.0.1', port, path: target, headers, agent: false }, (res) => {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('error', reject);
    res.on('end', () => resolve({
      status: res.statusCode,
      headers: res.headers,
      text: Buffer.concat(chunks).toString(),
    }));
  });
  req.setTimeout(3000, () => req.destroy(new Error('HTTP 请求超时')));
  req.on('error', reject);
});

const wsEvent = (ws, event, action) => new Promise((resolve, reject) => {
  const cleanup = () => {
    clearTimeout(timer);
    ws.off(event, done);
    ws.off('error', failed);
    ws.off('close', closed);
  };
  const done = (value) => { cleanup(); resolve(value); };
  const failed = (err) => { cleanup(); reject(err); };
  const closed = () => failed(new Error(`等待 ${event} 时连接关闭`));
  const timer = setTimeout(() => failed(new Error(`等待 ${event} 超时`)), 3000);
  ws.once(event, done);
  ws.once('error', failed);
  ws.once('close', closed);
  if (action) action();
});

const heartbeat = async (ws) => {
  const frame = Buffer.alloc(12);
  frame.writeUInt32BE(99, 0);
  frame.writeUInt32BE(12, 8);
  const reply = await wsEvent(ws, 'message', () => ws.send(frame));
  assert.equal(reply.readUInt32BE(0), 99);
  return Number(protocol[99].sc.decode(reply.subarray(12)).time) > 0;
};

const main = async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-http-test-'));
  let child;
  let exited;
  let ws;
  let output = '';
  try {
    const port = await freePort();
    child = spawn(process.execPath, [path.join(__dirname, '../server/index.js')], {
      env: {
        ...process.env,
        PORT: String(port),
        QJQP_DB: path.join(dir, 'state.sqlite'),
        QJQP_STATE: path.join(dir, 'state.json'),
        QJQP_FILLBOTS: '0',
        QJQP_LOAD_DEV_VARS: '0',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    exited = new Promise((resolve) => child.once('exit', resolve));
    await new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        child.off('error', failed);
        child.off('exit', stopped);
      };
      const failed = (err) => { cleanup(); reject(err); };
      const stopped = (code) => failed(new Error(`测试服务提前退出 ${code}\n${output}`));
      const timer = setTimeout(() => failed(new Error(`测试服务启动超时\n${output}`)), 8000);
      const collect = (buf) => {
        output = (output + buf.toString()).slice(-16000);
        if (output.includes('服务端起在')) { cleanup(); resolve(); }
      };
      child.stdout.on('data', collect);
      child.stderr.on('data', collect);
      child.once('error', failed);
      child.once('exit', stopped);
    });

    ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
    ws.on('error', () => {}); // 未等待事件时也不让清理期间的错误变成未捕获异常
    await wsEvent(ws, 'open');
    t('正常 HTTP 可用', (await request(port, '/version')).status, 200);
    const aasa = await requestText(port, '/.well-known/apple-app-site-association');
    t('AASA 配置可访问', aasa.status, 200);
    t('AASA 使用 JSON 类型', aasa.headers['content-type'], 'application/json; charset=utf-8');
    t('AASA 包含 iOS App ID', JSON.parse(aasa.text).applinks.details[0].appID, '4CSMM3394C.com.haoke.gandengyan');
    const forward = await request(port, '/v1/forwardconfig?key=ym', 'share.example.test');
    t('分享域名配置可用', forward.body.err_code, '0');
    t('分享域名使用当前服务', JSON.parse(forward.body.data).primary.url, `http://share.example.test`);
    const share = await requestText(port, '/download/ylhy-activity?roomId=100037');
    t('微信分享落地页可访问', share.status, 200);
    t('微信分享落地页显示房间号', share.text.includes('100037'), true);
    t('原连接心跳正常', await heartbeat(ws), true);
    t('异常 Host 不影响路径解析', (await request(port, '/version', '[')).status, 200);
    t('IPv6 Host 仍可正常访问', (await request(port, '/version', '[::1]')).status, 200);
    const invalid = await request(port, 'http://[/version');
    t('无效 URL 返回 400', invalid.status, 400);
    t('无效 URL 有错误响应', invalid.body.err_code, 1);
    t('异常请求后服务仍存活', child.exitCode, null);
    t('异常请求后原 WS 未断开', ws.readyState, WebSocket.OPEN);
    t('异常请求后原连接仍可心跳', await heartbeat(ws), true);
    t('异常请求后 HTTP 仍可用', (await request(port, '/version')).status, 200);
    const login = await request(port, '/login?accountType=guest');
    t('正常游客登录可用', login.body.err_code, 0);
    const wxLogin = await request(port, '/login?accountType=wx&code=test-code&appId=test-app');
    t('微信未配置时拒绝登录', wxLogin.body.err_code, 3);
    t('微信未配置时返回明确提示', wxLogin.body.err_msg, '服务器尚未配置微信登录');
    const tokenLogin = await request(port, `/login?accountType=token&token=${encodeURIComponent(login.body.data.token)}`);
    t('查询参数解析保持正常', tokenLogin.body.data.token, login.body.data.token);
    t('请求处理没有未捕获异常', output.includes('uncaughtException'), false);
    console.log(`\n${pass} 过 / 0 挂`);
  } finally {
    if (ws) ws.terminate();
    if (child && child.pid && child.exitCode === null && child.signalCode === null) {
      const timeout = setTimeout(() => child.kill('SIGKILL'), 3000);
      child.kill('SIGTERM');
      await exited;
      clearTimeout(timeout);
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
