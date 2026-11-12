#!/usr/bin/env node
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { WebSocketServer, WebSocket } = require('ws');
const { TokenBucket, startHeartbeat } = require('../server/ws-guard');

(async () => {
  let now = 0;
  const bucket = new TokenBucket({ rate: 10, burst: 3, now: () => now });
  assert.equal(bucket.take(), true);
  assert.equal(bucket.take(), true);
  assert.equal(bucket.take(), true);
  assert.equal(bucket.take(), false, '突发额度用完后拒绝');
  now += 100;
  assert.equal(bucket.take(), true, '按速率回补');
  assert.equal(bucket.take(), false);
  now += 10000;
  for (let i = 0; i < 3; i++) assert.equal(bucket.take(), true);
  assert.equal(bucket.take(), false, '回补不超过突发上限');

  // 不回 pong 的半开连接会在两轮心跳内被清理。
  const wss = new WebSocketServer({ host: '127.0.0.1', port: 0 });
  await once(wss, 'listening');
  startHeartbeat(wss, 50);
  const client = new WebSocket(`ws://127.0.0.1:${wss.address().port}`, { autoPong: false });
  await once(client, 'open');
  const [code] = await once(client, 'close');
  assert.equal(code, 1006, '服务端 terminate 半开连接');

  const healthy = new WebSocket(`ws://127.0.0.1:${wss.address().port}`);
  await once(healthy, 'open');
  await new Promise((resolve) => setTimeout(resolve, 200));
  assert.equal(healthy.readyState, WebSocket.OPEN, '正常回 pong 的连接保留');
  healthy.close();
  wss.close();
  console.log('WS 防护：令牌桶限流、心跳清理均通过');
})().catch((error) => { console.error(error); process.exit(1); });
