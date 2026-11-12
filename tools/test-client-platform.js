#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const {
  ClientPlatformTracker, platformFromPlayer, platformFromVersion,
} = require('../server/client-platform');

let now = 1000;
const tracker = new ClientPlatformTracker({ ttl: 500, now: () => now });
const req = (ip) => ({ socket: { remoteAddress: ip }, headers: {} });
const query = (value) => new URLSearchParams(value);

assert.equal(platformFromVersion(query({
  os_type: 'qjqp_android_yuanlai', device_name: 'Android 16',
})), 'android');
assert.equal(platformFromVersion(query({
  os_type: 'qjqp_ios_company', device_name: 'iOS 26.6',
})), 'ios');
assert.equal(platformFromVersion(query({
  os_type: 'qjqp_android_yuanlai', device_name: '',
})), 'unknown', '缺少真实设备信息的运维探测不能冒充 Android');

const observed = tracker.remember(req('203.0.113.10'), query({
  uid: '285638', os_type: 'qjqp_android_yuanlai', device_name: 'Android 16',
}));
assert.deepEqual(observed, {
  uid: 285638, ip: '203.0.113.10', platform: 'android', seenAt: 1000,
});
assert.equal(tracker.resolve(285638, '203.0.113.10'), 'android');
assert.equal(tracker.resolve(285638, '203.0.113.11'), 'unknown', '不同地址不能复用平台识别');
assert.equal(tracker.resolve(285639, '203.0.113.10'), 'unknown', '不同账号不能复用平台识别');

tracker.remember(req('203.0.113.10'), query({
  uid: '285638', os_type: 'qjqp_ios_company', device_name: 'iOS 26.6',
}));
assert.equal(tracker.resolve(285638, '203.0.113.10'), 'ios', '同一账号换设备后应采用最近平台');

now += 501;
assert.equal(tracker.resolve(285638, '203.0.113.10'), 'unknown', '过期平台信息必须拒绝授权');

const persisted = {
  lastClientPlatform: 'android',
  lastClientPlatformIp: '203.0.113.10',
  lastClientPlatformAt: now,
};
assert.equal(platformFromPlayer(persisted, '203.0.113.10', now, 500), 'android',
  '服务重启后应能从玩家存档恢复平台');
assert.equal(platformFromPlayer(persisted, '203.0.113.11', now, 500), 'android',
  '移动网络或 VPN 换 IP 后仍应按账号恢复最近的平台');
assert.equal(platformFromPlayer(persisted, '203.0.113.10', now + 501, 500), 'unknown',
  '存档平台过期后也必须拒绝授权');

{
  // /version 无需登录：内存表必须有上限，且不能每次请求都全表清理。
  let clock = 0;
  const capped = new ClientPlatformTracker({
    ttl: 1000, now: () => clock, maxEntries: 3, pruneEveryMs: 100,
  });
  const android = (uid) => query({ uid: String(uid), os_type: 'android', device_name: 'android' });
  for (let uid = 1; uid <= 5; uid++) capped.remember(req('203.0.113.20'), android(uid));
  assert.equal(capped.recent.size, 3, '超出容量时淘汰最旧条目');
  assert.equal(capped.resolve(1, '203.0.113.20'), 'unknown', '最旧条目被淘汰');
  assert.equal(capped.resolve(5, '203.0.113.20'), 'android', '最新条目保留');

  capped.remember(req('203.0.113.20'), android(3));
  capped.remember(req('203.0.113.20'), android(6));
  assert.equal(capped.resolve(3, '203.0.113.20'), 'android', '再次访问的条目会刷新到最新');
  assert.equal(capped.resolve(4, '203.0.113.20'), 'unknown');

  let scans = 0;
  const originalPrune = capped.prune.bind(capped);
  capped.prune = (at) => { scans++; return originalPrune(at); };
  clock = 1000;
  capped.remember(req('203.0.113.20'), android(7));
  capped.remember(req('203.0.113.20'), android(8));
  clock = 1050;
  capped.remember(req('203.0.113.20'), android(9));
  assert.equal(scans, 1, '清理节流：同一窗口内只扫描一次');
}

console.log('客户端平台识别：账号、移动网络换址、设备信息与过期隔离均通过');
