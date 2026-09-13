#!/usr/bin/env node
const assert = require('assert/strict');
const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');
const { validateIdentity } = require('../server/identity');

let pass = 0;
const t = (name, actual, expected) => {
  assert.deepEqual(actual, expected, name);
  pass++;
};

const packCs = (proto, body) => {
  const def = protocol[proto];
  const payload = def && def.cs
    ? Buffer.from(def.cs.encode(def.cs.create(body || {})).finish())
    : Buffer.alloc(0);
  const frame = Buffer.alloc(12 + payload.length);
  frame.writeUInt32BE(proto, 0);
  frame.writeUInt32BE(frame.length, 8);
  payload.copy(frame, 12);
  return frame;
};

const decodeSc = (proto, frame) => protocol[proto].sc.decode(frame.subarray(12, frame.readUInt32BE(8)));

const request = (app, connId, proto, body) => {
  let response = null;
  const receive = (bytes) => { response = decodeSc(bytes.readUInt32BE(0), bytes); };
  if (!app.conns.has(connId)) app.attach(connId, receive);
  else app.conns.get(connId).send = receive;
  app.onMessage(connId, packCs(proto, body));
  return response;
};

const login = (app, connId) => {
  const out = app.http('/login', new URLSearchParams('accountType=guest'));
  const token = out.body.data.token;
  const response = request(app, connId, 100, { token });
  assert.equal(Number(response.res.error), 0);
  return { token, uid: response.uid };
};

const main = () => {
  const valid = validateIdentity({ realName: ' 张 三 ', idCard: '11010519491231002x' });
  t('姓名和身份证输入会被标准化', valid, { realName: '张三', idCard: '11010519491231002X' });
  t('错误校验位会被拒绝', !!validateIdentity({ realName: '张三', idCard: '110105194912310021' }).error, true);
  t('不存在的出生日期会被拒绝', !!validateIdentity({ realName: '张三', idCard: '11010519990230002X' }).error, true);
  t('英文姓名会被拒绝', !!validateIdentity({ realName: 'John', idCard: '11010519491231002X' }).error, true);

  let persisted = null;
  const app = new GameApp({ identityHashKey: 'test-only-secret', persist: (data) => { persisted = data; } });
  const first = login(app, 'first');
  const before = request(app, 'first', 101, {});
  t('认证前查询为空', [before.realName, before.idCard], ['', '']);

  const bound = request(app, 'first', 102, { realName: '张三', idCard: '11010519491231002X' });
  t('合法身份绑定成功', Number(bound.res.error), 0);
  const after = request(app, 'first', 101, {});
  t('查询只返回脱敏身份', [after.realName, after.idCard], ['张', '110105********002X']);
  const serialized = JSON.stringify(persisted);
  t('存档不含完整姓名', serialized.includes('张三'), false);
  t('存档不含完整身份证', serialized.includes('11010519491231002X'), false);

  const repeat = request(app, 'first', 102, { realName: '李四', idCard: '11010519491231002X' });
  t('已认证账号不能修改', Number(repeat.res.error), 1);

  login(app, 'second');
  const duplicate = request(app, 'second', 102, { realName: '张三', idCard: '11010519491231002X' });
  t('同一身份证不能绑定多个账号', duplicate.res.what, '该身份证已绑定其他账号');

  const restored = new GameApp({ identityHashKey: 'test-only-secret' });
  restored.restore(persisted);
  const persistedPlayer = restored.players.get(first.token);
  t('重启后保留认证状态', persistedPlayer.identityVerified, true);
  t('重启后仍只有脱敏数据', restored.identityInfo(persistedPlayer).idCard, '110105********002X');

  const unconfigured = new GameApp();
  login(unconfigured, 'missing-key');
  const unavailable = request(unconfigured, 'missing-key', 102, { realName: '张三', idCard: '11010519491231002X' });
  t('缺少哈希密钥时拒绝收集身份信息', unavailable.res.what, '实名认证服务尚未配置，请联系管理员');

  const anonymous = new GameApp({ identityHashKey: 'test-only-secret' });
  let anonymousReply = false;
  anonymous.attach('anonymous', () => { anonymousReply = true; });
  anonymous.onMessage('anonymous', packCs(101, {}));
  t('未登录不能查询实名状态', anonymousReply, false);

  console.log(`\n${pass} 过 / 0 挂`);
};

main();
