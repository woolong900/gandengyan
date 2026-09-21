#!/usr/bin/env node
/** 招募合伙人：客户端协议、联系方式校验、SQLite 落库和重复提交去重。 */
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');

let passed = 0;
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); passed++; };

const packCs = (proto, msg) => {
  const def = protocol[proto];
  const payload = def && def.cs && msg ? Buffer.from(def.cs.encode(def.cs.create(msg)).finish()) : Buffer.alloc(0);
  const out = Buffer.alloc(12 + payload.length);
  out.writeUInt32BE(proto, 0);
  out.writeUInt32BE(0, 4);
  out.writeUInt32BE(out.length, 8);
  payload.copy(out, 12);
  return out;
};

const unpackSc = (buf) => {
  const proto = buf.readUInt32BE(0);
  const def = protocol[proto];
  return { proto, msg: def.sc.decode(buf.subarray(12, buf.readUInt32BE(8))) };
};

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-agent-test-'));
process.env.QJQP_DB = path.join(dir, 'state.sqlite');
process.env.QJQP_STATE = path.join(dir, 'absent.json');
const store = require('../server/store');

try {
  let now = 1720000000000;
  const app = new GameApp({
    now: () => now,
    persist: () => {},
    onAgentApplication: (application) => store.appendAgentApplication(application),
  });
  const login = app.loginGuest('agent-application-device');
  const sent = [];
  app.attach('agent', (bytes) => sent.push(Buffer.from(bytes)));
  app.onMessage('agent', packCs(100, { token: login.token }));

  app.onMessage('agent', packCs(108, { content: 'abc' }));
  check('短微信号也可提交', Number(unpackSc(sent.at(-1)).msg.res.error), 0);
  check('短微信号按微信号保存', [store.listAgentApplications().total,
    store.listAgentApplications().items[0].contactType], [1, '微信号']);

  app.onMessage('agent', packCs(108, { content: '12345' }));
  check('纯数字但不是手机号会被拒绝', Number(unpackSc(sent.at(-1)).msg.res.error), 1);

  app.onMessage('agent', packCs(108, { content: '+86 138-0013-8000' }));
  check('手机号提交成功', Number(unpackSc(sent.at(-1)).msg.res.error), 0);
  let list = store.listAgentApplications();
  check('手机号规范化后落库', [list.total, list.items[0].contactType, list.items[0].contact],
    [2, '手机号', '13800138000']);

  app.onMessage('agent', packCs(108, { content: '13800138000' }));
  check('一分钟内重复提交仍返回成功', Number(unpackSc(sent.at(-1)).msg.res.error), 0);
  check('一分钟内重复提交不生成重复记录', store.listAgentApplications().total, 2);

  now += 60001;
  app.onMessage('agent', packCs(108, { content: 'weixin_123' }));
  list = store.listAgentApplications({ q: 'weixin' });
  check('微信号可按内容查询', [list.total, list.items[0].contactType], [1, '微信号']);
  check('同一玩家不同联系方式分别保存', store.listAgentApplications().total, 3);

  now += 60001;
  app.onMessage('agent', packCs(108, { content: '潜江合伙人' }));
  list = store.listAgentApplications({ q: '潜江' });
  check('中文微信联系名可以提交', [list.total, list.items[0].contactType], [1, '微信号']);

  store.close();
  check('关闭再打开数据库后申请仍存在', store.listAgentApplications().total, 4);
  const source = fs.readFileSync(path.join(__dirname, '..', 'client-cocos-recovered', 'assets', 'Script',
    'Recovered', 'ActivityLayer.js'), 'utf8');
  check('客户端会显示服务端校验错误', source.includes('else if (t.res.error) a.default.uiHelper.showTip(t.res.what);'), true);
  check('客户端联系方式输入框允许完整微信号', source.includes('this.input.maxLength = 32'), true);
  console.log(`\n${passed} 过 / 0 挂`);
} finally {
  store.close();
  fs.rmSync(dir, { recursive: true, force: true });
  delete process.env.QJQP_DB;
  delete process.env.QJQP_STATE;
}
