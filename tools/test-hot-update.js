#!/usr/bin/env node
const assert = require('assert/strict');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { HotUpdateService, compareVersions, platformOf } = require('../server/hot-update');
const { toJs, toJsc } = require('./jsc');

let passed = 0;
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); passed++; };
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-hot-update-test-'));

const request = (port, pathname, headers = {}) => new Promise((resolve, reject) => {
  const req = http.get({ hostname: '127.0.0.1', port, path: pathname, headers }, (res) => {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
  });
  req.on('error', reject);
});

const main = async () => {
  const root = path.join(dir, 'served');
  const configFile = path.join(dir, 'hot-update.json');
  fs.mkdirSync(path.join(root, 'android/235'), { recursive: true });
  fs.mkdirSync(path.join(root, 'android/236/res'), { recursive: true });
  fs.writeFileSync(path.join(root, 'android/236/res/check.bin'), '0123456789');
  fs.writeFileSync(configFile, JSON.stringify({ schemaVersion: 1, platforms: { android: {
    enabled: true, latestAssetVersion: 236, minimumPackageVersion: '1.0.6', packageAction: 2,
    packageUrl: 'https://game.example/hot-update/packages/game.apk', packageName: 'game.apk',
  } } }));
  const service = new HotUpdateService({ root, configFile });
  check('版本比较支持补丁版本', compareVersions('1.0.5', '1.0.6'), -1);
  check('Android 平台识别', platformOf('qjqp_android_yuanlai'), 'android');
  let body = service.versionBody(new URLSearchParams({
    os_type: 'qjqp_android_yuanlai', package_version: '1.0.5', assert_version: '234',
  }), 'https://game.example');
  check('旧引导包收到整包升级', [body.data.action, body.data.package_action], ['2', '2']);
  body = service.versionBody(new URLSearchParams({
    os_type: 'qjqp_android_yuanlai', package_version: '1.0.6', assert_version: '235',
  }), 'https://game.example');
  check('新引导包收到资源更新', [body.data.action, body.data.assert_version,
    body.data.assert_url], ['1', '236', 'https://game.example/hot-update/android/']);
  body = service.versionBody(new URLSearchParams({
    os_type: 'qjqp_android_yuanlai', package_version: '1.0.6', assert_version: '236',
  }), 'https://game.example');
  check('最新资源不重复更新', body, { err_code: '0', data: {} });

  let rollout = service.updateRollout('android', {
    stableAssetVersion: 235, latestAssetVersion: 236, rolloutEnabled: true, percentage: 0,
    includeUids: ['100055'], includeDeviceIds: ['test-device'],
    excludeUids: [], excludeDeviceIds: ['blocked-device'],
  });
  check('灰度配置保存候选版与稳定版', [rollout.stableAssetVersion, rollout.latestAssetVersion,
    rollout.rollout.enabled, rollout.rollout.percentage], [235, 236, true, 0]);
  body = service.versionBody(new URLSearchParams({
    os_type: 'qjqp_android_yuanlai', package_version: '1.0.6', assert_version: '234', uid: '100055',
  }), 'https://game.example');
  check('指定测试玩家命中候选版', body.data.assert_version, '236');
  body = service.versionBody(new URLSearchParams({
    os_type: 'qjqp_android_yuanlai', package_version: '1.0.6', assert_version: '234', rollout_key: 'normal-device',
  }), 'https://game.example');
  check('未命中灰度的玩家只收到稳定版', body.data.assert_version, '235');
  const observed = service.status().devices.find((device) => device.id === 'normal-device');
  check('服务端记录设备当前版本和灰度目标', [observed.platform, observed.packageVersion,
    observed.assetVersion, observed.targetAssetVersion, observed.lastAction],
  ['android', '1.0.6', 234, 235, 'asset']);
  const devicesBeforeProbe = service.status().devices.length;
  body = service.versionBody(new URLSearchParams({
    os_type: 'qjqp_android_yuanlai', package_version: '1.0.6', assert_version: '234',
    rollout_key: 'deployment-probe', probe: '1',
  }), 'https://game.example');
  check('运维探测仍返回正确版本', body.data.assert_version, '235');
  check('运维探测不写入设备列表', [service.status().devices.length,
    service.status().devices.some((device) => device.id === 'deployment-probe')], [devicesBeforeProbe, false]);
  body = service.versionBody(new URLSearchParams({
    os_type: 'qjqp_android_yuanlai', package_version: '1.0.6', assert_version: '234',
    uid: '100055', rollout_key: 'blocked-device',
  }), 'https://game.example');
  check('灰度排除名单优先于指定名单', body.data.assert_version, '235');
  rollout = service.updateRollout('android', {
    stableAssetVersion: 235, latestAssetVersion: 236, rolloutEnabled: true, percentage: 100,
  });
  body = service.versionBody(new URLSearchParams({
    os_type: 'qjqp_android_yuanlai', package_version: '1.0.6', assert_version: '235', rollout_key: 'any-device',
  }), 'https://game.example');
  check('百分百灰度命中候选版', body.data.assert_version, '236');
  rollout = service.updateRollout('android', { action: 'promote' });
  check('候选版可提升为全量稳定版', [rollout.stableAssetVersion, rollout.rollout.enabled], [236, false]);

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (!service.serve(req, res, url)) res.writeHead(404).end();
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const full = await request(port, '/hot-update/android/236/res/check.bin');
  check('资源文件可下载', [full.status, full.body.toString()], [200, '0123456789']);
  const range = await request(port, '/hot-update/android/236/res/check.bin', { Range: 'bytes=2-5' });
  check('资源文件支持断点续传', [range.status, range.body.toString(), range.headers['content-range']],
    [206, '2345', 'bytes 2-5/10']);
  check('路径穿越被拒绝', (await request(port, '/hot-update/%2e%2e/hot-update.json')).status, 404);
  await new Promise((resolve) => server.close(resolve));

  const fake = path.join(dir, 'fake');
  fs.mkdirSync(path.join(fake, 'assets/src'), { recursive: true });
  fs.mkdirSync(path.join(fake, 'assets/res/raw-assets/2c'), { recursive: true });
  fs.writeFileSync(path.join(fake, 'assets/src/project.jsc'), toJsc(Buffer.from(
    'var x={assertVer: 235,\npackageVer: "1.0.6",};\n' +
    'desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 2 ],\ndetailIds: [ 1, 2 ]\n' +
    'defCheck: [ 21, 23, 24 ],\ndetailIds: [ 20, 21, 23 ],\n' +
    '20: {\nvalue: 2,\ndesc: "只许自摸",\nisHide: !0\n}\n' +
    '} else this._checkbox(e);\n};\ne.prototype._checkbox = function(e) {', 'utf8')));
  fs.writeFileSync(path.join(fake, 'assets/src/settings.jsc'), Buffer.from('settings'));
  fs.writeFileSync(path.join(fake, 'assets/res/raw-assets/2c/2c8a7447-5900-4cca-b1ef-51d750d90396.manifest'),
    JSON.stringify({ version: '235', assets: {} }));
  fs.mkdirSync(path.join(fake, 'assets/res/import/ee'), { recursive: true });
  fs.writeFileSync(path.join(fake,
    'assets/res/import/ee/ee9dd0eb-c83f-4802-bfca-98e27e9cc2d5.json'), JSON.stringify({
    __type__: 'cc.SpriteFrame',
    content: {
      name: 'btn_blue', texture: '09aCma6ZhKSZQ1aaoaYbj/', rect: [0, 0, 128, 55],
      offset: [0, 0], originalSize: [128, 55], capInsets: [0, 0, 0, 0],
    },
  }));
  fs.mkdirSync(path.join(fake, 'assets/res/raw-assets/1f'), { recursive: true });
  fs.writeFileSync(path.join(fake, 'assets/res/raw-assets/1f/1fcde46cd.png'), Buffer.from('old atlas'));
  fs.mkdirSync(path.join(fake, 'assets/res/import/63'), { recursive: true });
  const fakeSingleEnd = new Array(9).fill(null);
  fakeSingleEnd[5] = {
    __type__: 'cc.Node', _name: 'BtnNext',
    _components: [{ __type__: 'cc.Button', clickEvents: [{ handler: 'onNext' }] }],
  };
  fakeSingleEnd[8] = {
    __type__: 'cc.Node', _name: 'BtnQuit',
    _components: [{ __type__: 'cc.Button', clickEvents: [{ handler: 'onQuitRoom' }] }],
  };
  fs.writeFileSync(path.join(fake,
    'assets/res/import/63/637f38e8-9c8c-424f-ba6c-8b738e0467c7.json'), JSON.stringify(fakeSingleEnd));
  fs.mkdirSync(path.join(fake, 'assets/res/import/5c'), { recursive: true });
  const fakeWskSingleEnd = new Array(36).fill(null);
  fakeWskSingleEnd[30] = {
    __type__: 'cc.Node', _name: 'qjshz',
    _children: [{ __id__: 32 }, { __id__: 34 }, { __id__: 35 }],
  };
  fakeWskSingleEnd[32] = {
    __type__: 'cc.Node', _name: 'bgNode', _children: [{ __id__: 33 }],
  };
  fakeWskSingleEnd[33] = {
    __type__: 'cc.Node', _name: 'btn_exit', _parent: { __id__: 32 },
    _components: [
      { __type__: 'cc.Sprite', _spriteFrame: { __uuid__: 'old-exit' } },
      { __type__: 'cc.Button', clickEvents: [{ handler: 'onClickExit' }] },
      { __type__: 'cc.Widget' },
    ],
  };
  fakeWskSingleEnd[34] = {
    __type__: 'cc.Node', _name: 'BtnGameNext', _parent: { __id__: 30 },
    _components: [
      { __type__: 'cc.Sprite', _spriteFrame: { __uuid__: 'old-next' } },
      { __type__: 'cc.Button', clickEvents: [{ handler: 'onClickNext' }] },
    ],
  };
  fakeWskSingleEnd[35] = {
    __type__: 'cc.Node', _name: 'BtnShare', _parent: { __id__: 30 },
    _components: [
      { __type__: 'cc.Sprite', _spriteFrame: { __uuid__: 'old-share' } },
      { __type__: 'cc.Button', clickEvents: [{ handler: 'onClickShare' }] },
    ],
  };
  fs.writeFileSync(path.join(fake,
    'assets/res/import/5c/5c282881-ef01-4d39-8c09-c1df292a8db3.json'), JSON.stringify(fakeWskSingleEnd));
  const fakeApk = path.join(dir, 'fake.apk');
  execFileSync('zip', ['-qr', fakeApk, 'assets'], { cwd: fake });
  const release = path.join(dir, 'release');
  execFileSync(process.execPath, [path.join(__dirname, 'publish-hot-update.js'), '--version', '236',
    '--package-version', '1.0.6', '--base-url', 'https://game.example',
    '--service-base-url', 'https://service.example', '--android', fakeApk,
    '--out', release]);
  const manifest = JSON.parse(fs.readFileSync(path.join(release, 'android/236/project.manifest'), 'utf8'));
  check('发布器生成完整清单', [manifest.version, Object.keys(manifest.assets).sort()],
    ['236', [
      'res/import/5c/5c282881-ef01-4d39-8c09-c1df292a8db3.json',
      'res/import/63/637f38e8-9c8c-424f-ba6c-8b738e0467c7.json',
      'res/import/e0/e07c10f8-e75a-5ae8-d2f6-40c4b109d372.json',
      'res/import/e9/e9e4084a-b40b-f780-a5dd-ed4476da7ba7.json',
      'res/import/ee/ee9dd0eb-c83f-4802-bfca-98e27e9cc2d5.json',
      'res/raw-assets/1f/1fcde46cd.png',
      'res/raw-assets/20/206b229f-fa1c-409e-b47e-b2d2c0938d57.png',
      'res/raw-assets/db/dbd4ba35-fdeb-4a79-a26f-1f3ba1fdfca9.jpg',
      'res/raw-assets/e0/e07c10f8-e75a-5ae8-d2f6-40c4b109d372.png',
      'src/project.jsc', 'src/settings.jsc',
    ]]);
  const quickFrame = JSON.parse(fs.readFileSync(path.join(release,
    'android/236/res/import/ee/ee9dd0eb-c83f-4802-bfca-98e27e9cc2d5.json'), 'utf8'));
  check('发布器同步快捷按钮纹理与 SpriteFrame 尺寸',
    [quickFrame.content.rect, quickFrame.content.originalSize],
    [[0, 0, 128, 39], [128, 39]]);
  const settlementAtlas = fs.readFileSync(path.join(release, 'android/236/res/raw-assets/1f/1fcde46cd.png'));
  check('发布器保留安装包原版结算按钮图集', settlementAtlas.toString(), 'old atlas');
  const singleEnd = JSON.parse(fs.readFileSync(path.join(release,
    'android/236/res/import/63/637f38e8-9c8c-424f-ba6c-8b738e0467c7.json'), 'utf8'));
  check('发布器删除右上角退出并在右下角重建继续/退出', [
    singleEnd[5]._name, singleEnd[5]._position, singleEnd[5]._scale,
    singleEnd[8]._name, singleEnd[8]._position, singleEnd[8]._scale,
    singleEnd.some((item) => item && item._name === 'BtnQuit'),
  ], [
    'BtnContinueBottom', { __type__: 'cc.Vec3', x: 125, y: -303 },
    { __type__: 'cc.Vec3', x: 0.5, y: 0.5, z: 1 },
    'BtnExitBottom', { __type__: 'cc.Vec3', x: 290, y: -303 },
    { __type__: 'cc.Vec3', x: 0.9, y: 0.9, z: 1 }, false,
  ]);
  const wskSingleEnd = JSON.parse(fs.readFileSync(path.join(release,
    'android/236/res/import/5c/5c282881-ef01-4d39-8c09-c1df292a8db3.json'), 'utf8'));
  check('说胡子结算页互换继续/分享位置并用独立贴图重建退出', [
    wskSingleEnd[30]._children.map((child) => child.__id__),
    wskSingleEnd[32]._children.map((child) => child.__id__),
    wskSingleEnd[33]._name, wskSingleEnd[33]._parent, wskSingleEnd[33]._components,
    wskSingleEnd[34]._name, wskSingleEnd[34]._position,
    wskSingleEnd[35]._name, wskSingleEnd[35]._position,
    wskSingleEnd[35]._components[0]._spriteFrame,
    wskSingleEnd[35]._components[1].clickEvents[0].handler,
  ], [
    [32, 34, 35], [],
    'RemovedTopExit', null, [],
    'BtnGameNext', { __type__: 'cc.Vec3', x: -418, y: -222 },
    'BtnExitBottom', { __type__: 'cc.Vec3', x: 418, y: -222 },
    { __uuid__: 'e95AhKtAv3gKXd7UR22nun' }, 'onClickExit',
  ]);
  const busyExitTexture = fs.readFileSync(path.join(release,
    'android/236/res/raw-assets/e0/e07c10f8-e75a-5ae8-d2f6-40c4b109d372.png'));
  check('新有事退出按钮使用独立加密纹理',
    busyExitTexture.subarray(0, 9).toString('ascii'), 'aaabbbccc');
  const publishedQr = fs.readFileSync(path.join(release,
    'android/236/res/raw-assets/20/206b229f-fa1c-409e-b47e-b2d2c0938d57.png'));
  const qrBody = Buffer.alloc(publishedQr.length - 10);
  for (let index = 10; index < publishedQr.length; index += 1) {
    qrBody[index - 10] = publishedQr[index] ^ publishedQr[9];
  }
  check('热更新覆盖最新战绩二维码', qrBody.equals(fs.readFileSync(path.join(__dirname,
    '../assets/branding/share/download-qr.png'))), true);
  check('热更新覆盖最新朋友圈海报', fs.readFileSync(path.join(release,
    'android/236/res/raw-assets/db/dbd4ba35-fdeb-4a79-a26f-1f3ba1fdfca9.jpg')).equals(
    fs.readFileSync(path.join(__dirname, '../assets/branding/share/moments-poster.jpg'))), true);
  const publishedProject = toJs(fs.readFileSync(path.join(release, 'android/236/src/project.jsc'))).toString('utf8');
  check('发布器同步脚本资源版本', publishedProject.includes('assertVer: 236'), true);
  check('发布器只携带目标网络地址',
    publishedProject.includes('https://service.example/version') &&
    publishedProject.includes('https://service.example/login') &&
    publishedProject.includes('wss://service.example/ws') &&
    !publishedProject.includes('192.168.') &&
    !publishedProject.includes('127.0.0.1') &&
    !publishedProject.includes('localhost'), true);
  check('发布器恢复只许自摸选项',
    publishedProject.includes('desc: "只许自摸"\n}') && !publishedProject.includes('desc: "只许自摸",\nisHide'), true);
  check('发布器写入只许自摸与热铳联动',
    publishedProject.includes('20 === e && !this.isChecked(20) && !this.isChecked(21)'), true);
  check('发布器写入干瞪眼默认规则',
    publishedProject.includes('defCheck: [ 20, 21, 23, 24 ],\ndetailIds: [ 20, 21, 23 ]') &&
    publishedProject.includes('for (var q = [ 20, 21, 23 ], p = 0; p < q.length; p++)'), true);
  check('发布器把干瞪眼排在潜江癞晃前面',
    publishedProject.includes('defCheck: [ 2 ],\ndetailIds: [ 2, 1 ]'), true);
  const qjshzModule = publishedProject.slice(
    publishedProject.indexOf('"GameLogicWSK_QJSHZ"'),
    publishedProject.indexOf('"GameLogicWSK_QJWSKBD"'),
  );
  check('发布器携带说胡子完整规则源码',
    publishedProject.includes('desc: "8张炸大过四大天王"') &&
    qjshzModule.includes('this._isBomb8BiggerKing = e.isChecked(22)') &&
    !qjshzModule.includes('WSK_Double_Fang'), true);
  const qjshzRoomConfigStart = publishedProject.indexOf('name: "说胡子"');
  const qjshzRoomConfig = publishedProject.slice(
    qjshzRoomConfigStart,
    publishedProject.indexOf('name: "五十K必打"', qjshzRoomConfigStart),
  );
  check('说胡子建房其它设置不再显示尾游可以捡分',
    qjshzRoomConfig.includes('desc: "尾游可以捡分",\nisHide: !0') &&
    qjshzRoomConfig.includes('detailIds: [ 15, 16, 22, 17, 20 ]') &&
    !qjshzRoomConfig.includes('detailIds: [ 14, 15, 16, 22, 17, 20 ]'), true);
  const wskSingleEndStart = publishedProject.indexOf('t.prototype._udpateQJSHZ = function()');
  const wskSingleEndModule = publishedProject.slice(
    wskSingleEndStart,
    publishedProject.indexOf('t.prototype.start = function()', wskSingleEndStart),
  );
  check('说胡子结算脚本与当前按钮节点一致且不再查找已删除的分享按钮',
    wskSingleEndModule.includes('getChildByName("BtnGameNext")') &&
    wskSingleEndModule.includes('getChildByName("BtnExitBottom")') &&
    !wskSingleEndModule.includes('getChildByName("BtnContinueBottom")') &&
    !wskSingleEndModule.includes('getChildByName("BtnShare")'), true);
  check('潜江晃晃全局结算不显示流局次数',
    publishedProject.includes('config.index !== u.eGameIds.QJHH && s(v, "hz_count", c.eTotalEndDetailType.HZ_COUNT, d);'),
    true);
  check('邀请码页面顶部文案使用服务端配置并保留默认值',
    publishedProject.includes('r.default.inviteTipText = t.mobile || "绑定推荐人邀请码，可获得"') &&
    publishedProject.includes('e.inviteTipLabel.string = l.default.inviteTipText || "绑定推荐人邀请码，可获得"'),
    true);
  const releaseConfig = JSON.parse(fs.readFileSync(path.join(release, 'hot-update.json'))).platforms.android;
  check('发布器默认生成零比例灰度候选版', [releaseConfig.stableAssetVersion,
    releaseConfig.latestAssetVersion, releaseConfig.rollout.enabled, releaseConfig.rollout.percentage],
  [235, 236, true, 0]);
  check('客户端版本检查携带稳定灰度标识',
    publishedProject.includes('rollout_key: f()') && publishedProject.includes('__QJQP_ROLLOUT_UID__') &&
    publishedProject.includes('device_name:'), true);
  const clientHotUpdate = fs.readFileSync(path.join(__dirname,
    '../client-release-source/assets/Script/Recovered/HotUpdate.js'), 'utf8');
  check('客户端会保存更新后搜索路径',
    clientHotUpdate.includes('Array.prototype.unshift.apply(e, t);'), true);
  const gameConstant = fs.readFileSync(path.join(__dirname,
    '../client-release-source/assets/Script/Recovered/GameConstant.js'), 'utf8');
  check('客户端引导基线与整包版本一致',
    gameConstant.includes('assertVer: 235') && gameConstant.includes('packageVer: "1.0.6"'), true);

  console.log(`\n${passed} 过 / 0 挂`);
};

main().finally(() => fs.rmSync(dir, { recursive: true, force: true })).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
