#!/usr/bin/env node
// 用假的 cc / jsb 环境直接运行客户端 HotUpdate.js、UpdateUtils.js，验证失败恢复逻辑。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SOURCE = path.join(__dirname, '../client-release-source/assets/Script/Recovered');
const STORAGE = '/data/qjqp/__data__/';
const E = { ERROR_NO_LOCAL_MANIFEST: 0, ERROR_DOWNLOAD_MANIFEST: 1, ERROR_PARSE_MANIFEST: 2, NEW_VERSION_FOUND: 3,
  ALREADY_UP_TO_DATE: 4, UPDATE_PROGRESSION: 5, ASSET_UPDATED: 6, ERROR_UPDATING: 7, UPDATE_FINISHED: 8,
  UPDATE_FAILED: 9, ERROR_DECOMPRESS: 10 };

function makeEnv({ packageVer = '1.0.6' } = {}) {
  const env = { restarts: 0, removed: [], downloadFailed: 0, updates: 0, dialogs: [], timers: [], storage: new Map(),
    fileSizes: new Map() };
  function Component() {}
  Component.prototype.schedule = function (fn) { env.timers.push({ fn, repeat: true }); };
  Component.prototype.scheduleOnce = function (fn, delay) { env.timers.push({ fn, delay }); };
  Component.prototype.unschedule = function (fn) { env.timers = env.timers.filter((timer) => timer.fn !== fn); };
  const localStorage = {
    getItem: (key) => (env.storage.has(key) ? env.storage.get(key) : null),
    setItem: (key, value) => env.storage.set(key, String(value)),
    removeItem: (key) => env.storage.delete(key),
  };
  const cc = { _RF: { push() {}, pop() {} }, Component, Node: class {}, Label: class {}, Asset: class {},
    _decorator: { ccclass: (target) => target, property: () => () => {} },
    sys: { isNative: true, os: 'Android', OS_ANDROID: 'Android', OS_IOS: 'iOS', localStorage },
    game: { restart() { env.restarts++; } }, log() {}, warn() {}, error() {},
    loader: {}, url: { raw: (value) => value } };
  class AssetsManager {
    constructor() { env.am = this; this.callback = null; }
    setVerifyCallback(fn) { env.verify = fn; }
    setMaxConcurrentTask() {}
    setEventCallback(fn) { this.callback = fn; }
    getState() { return 1; }
    update() { env.updates++; }
    downloadFailedAssets() { env.downloadFailed++; }
    getLocalManifest() { return { getSearchPaths: () => [STORAGE], isLoaded: () => true }; }
  }
  AssetsManager.State = { UNINITED: 0 };
  const jsb = { AssetsManager, EventAssetsManager: E, Manifest: class {},
    fileUtils: { getWritablePath: () => '/data/', removeDirectory: (dir) => { env.removed.push(dir); return true; },
      getFileSize: (file) => (env.fileSizes.has(file) ? env.fileSizes.get(file) : -1),
      getStringFromFile: () => JSON.stringify({ version: '361', assets: {} }), writeStringToFile() {},
      getSearchPaths: () => [], setSearchPaths() {} } };
  const stubs = {
    './SoundUtils': { default: { stopAll() {} } },
    './gContext': { default: { msgBox: { showOnlyOk: (text, confirm) => env.dialogs.push({ text, confirm }) } } },
    './GameConfig': { default: { appName: 'qjqp', packageVer, assertVer: 235, platform: 'android' } },
    './Http': { default: {} }, './ExUtils': { default: {} }, './UserData': { default: {} },
    './StringUtils': { default: {} }, './Storage': { default: {} },
  };
  const load = (name) => {
    const module = { exports: {} };
    const requireStub = (id) => { if (!(id in stubs)) throw new Error(`未提供依赖 ${id}`); return stubs[id]; };
    new Function('require', 'module', 'exports', 'cc', 'jsb', fs.readFileSync(path.join(SOURCE, `${name}.js`), 'utf8'))
      .call(module.exports, requireStub, module, module.exports, cc, jsb);
    return module.exports;
  };
  stubs['./UpdateUtils'] = load('UpdateUtils');
  env.UpdateUtils = stubs['./UpdateUtils'].default;
  env.HotUpdate = load('HotUpdate').default;
  env.event = (code) => env.am.callback({ getEventCode: () => code, getPercent: () => 0 });
  env.fire = () => { const timer = env.timers.find((item) => !item.repeat); assert.ok(timer, '应有待执行的重试');
    env.timers.splice(env.timers.indexOf(timer), 1); timer.fn.call(env.component); };
  env.pendingRetry = () => env.timers.some((item) => !item.repeat);
  env.start = () => { env.component = new env.HotUpdate(); env.component.pLabel = { node: { isValid: true }, string: '' };
    env.component.onLoad(); env.component.hotUpdate(362, 'https://example.test/hot-update/android/'); return env.component; };
  return env;
}

// 1. 单个文件失败只记录：不清理、不重启、不立即重试；整体失败后续传失败文件。
{
  const env = makeEnv(); env.start();
  env.event(E.ERROR_UPDATING); env.event(E.ERROR_UPDATING);
  assert.equal(env.restarts, 0); assert.deepEqual(env.removed, []); assert.equal(env.pendingRetry(), false);
  env.event(E.UPDATE_FAILED);
  assert.equal(env.pendingRetry(), true);
  env.fire();
  assert.equal(env.downloadFailed, 1); assert.equal(env.restarts, 0); assert.deepEqual(env.removed, []);
}

// 2. 网络失败用尽自动重试后弹窗；全程不清理已下载内容，确认后直接续传。
{
  const env = makeEnv(); env.start();
  for (let i = 0; i < 3; i++) { env.event(E.UPDATE_FAILED); env.fire(); }
  assert.equal(env.downloadFailed, 3); assert.equal(env.dialogs.length, 0);
  env.event(E.UPDATE_FAILED);
  assert.equal(env.dialogs.length, 1); assert.match(env.dialogs[0].text, /已下载的内容会保留/);
  assert.deepEqual(env.removed, []); assert.equal(env.restarts, 0);
  env.dialogs[0].confirm();
  assert.equal(env.downloadFailed, 4); assert.equal(env.restarts, 0); assert.deepEqual(env.removed, []);
  env.event(E.UPDATE_FAILED);
  assert.equal(env.pendingRetry(), true, '确认后重新获得自动重试次数');
}

// 3. 每轮只要有文件成功，就一直自动续传，不弹窗。
{
  const env = makeEnv(); env.start();
  for (let i = 0; i < 8; i++) { env.event(E.ASSET_UPDATED); env.event(E.UPDATE_FAILED); env.fire(); }
  assert.equal(env.dialogs.length, 0); assert.equal(env.downloadFailed, 8); assert.deepEqual(env.removed, []);
}

// 4. 下载停滞：重启续传，重试用尽后弹窗，仍不清理。
{
  const env = makeEnv(); const component = env.start();
  for (let i = 0; i < 3; i++) { component._updating = true; component._lastProgressAt = Date.now() - 31000;
    component._checkStall(); env.fire(); component._retryPending = false; }
  assert.equal(env.restarts, 3); assert.deepEqual(env.removed, []);
  component._updating = true; component._lastProgressAt = Date.now() - 31000; component._checkStall();
  assert.equal(env.dialogs.length, 1); assert.deepEqual(env.removed, []);
  env.dialogs[0].confirm();
  assert.equal(env.restarts, 4); assert.deepEqual(env.removed, []);
}

// 5. 大小校验：不一致判失败；校验失败且重试用尽才清理一次并重启；清理后放行，避免清单有误时锁死。
{
  const env = makeEnv(); env.start();
  env.fileSizes.set('/tmp/ok.png', 100); env.fileSizes.set('/tmp/short.jsc', 40);
  assert.equal(env.verify('/tmp/ok.png', { size: 100 }), true);
  assert.equal(env.verify('/tmp/unknown.png', { size: 100 }), true, '读不到大小时放行');
  assert.equal(env.verify('/tmp/ok.png', {}), true, '清单没有大小时放行');
  assert.equal(env.verify('/tmp/short.jsc', { size: 481664 }), false);
  for (let i = 0; i < 3; i++) { env.event(E.UPDATE_FAILED); env.fire(); }
  assert.deepEqual(env.removed, []);
  env.event(E.UPDATE_FAILED);
  assert.equal(env.dialogs.length, 0);
  assert.equal(env.removed.length > 0 && env.removed.every((dir) => dir.endsWith('_temp/')), true);
  env.fire();
  assert.equal(env.restarts, 1);
  assert.equal(env.verify('/tmp/short.jsc', { size: 481664 }), true, '清理重下后放行');
  const saved = JSON.parse(env.storage.get('__QJQP_HOT_UPDATE_RECOVERY__'));
  assert.equal(saved.cleaned, true); assert.equal(saved.corrupt, true);
}

// 6. 更新成功：记录版本并清掉恢复状态。
{
  const env = makeEnv(); env.start();
  env.event(E.UPDATE_FAILED); env.fire(); env.event(E.UPDATE_FINISHED);
  assert.equal(env.storage.get('__QJQP_ASSERT_VERSION__'), '362');
  assert.equal(env.storage.has('__QJQP_HOT_UPDATE_RECOVERY__'), false);
  assert.equal(env.restarts, 1);
}

// 7. 整包升级：热更新目录、临时目录、版本记录、搜索路径一并清掉。
{
  const env = makeEnv({ packageVer: '1.0.7' });
  env.storage.set('__KY_PACKAGE_VERSION__', '1.0.6'); env.storage.set('__QJQP_ASSERT_VERSION__', '362');
  env.storage.set('__KY_Hot_Update_Search_Paths__', '["/data/qjqp/__data__/"]');
  env.storage.set('__QJQP_HOT_UPDATE_RECOVERY__', '{}'); env.storage.set('__QJQP_ROLLOUT_KEY__', 'keep-me');
  env.UpdateUtils.cleanLocalCache();
  assert.deepEqual(env.removed, ['/data/qjqp/__data__/', '/data/qjqp/__data___temp/']);
  for (const key of ['__QJQP_ASSERT_VERSION__', '__KY_Hot_Update_Search_Paths__', '__QJQP_HOT_UPDATE_RECOVERY__']) {
    assert.equal(env.storage.has(key), false, key);
  }
  assert.equal(env.storage.get('__KY_PACKAGE_VERSION__'), '1.0.7');
  assert.equal(env.storage.get('__QJQP_ROLLOUT_KEY__'), 'keep-me');
  assert.equal(env.restarts, 1);
  env.UpdateUtils.cleanLocalCache();
  assert.equal(env.restarts, 1, '版本一致时不再清理');
}

console.log('客户端热更新恢复：单文件失败续传、弱网保留进度、大小校验、整包升级清理均通过');
