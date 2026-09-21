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
const WX_APP_A = 'wxaaaaaaaaaaaaaaaa';
const WX_APP_B = 'wxbbbbbbbbbbbbbbbb';

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
    fs.writeFileSync(path.join(dir, 'state.json'), JSON.stringify({
      nextUid: 285634,
      players: [{
        token: 'wx-old-token', uid: 285633, nickname: '微信迁移玩家', cardNum: 200,
        wechatOpenid: 'wx-old-openid', wechatUnionid: 'wx-old-unionid', roomId: 0,
      }],
      records: [{
        id: 'R1000371234567890', shareCode: 'abcdef0123456789abcdef01', roomId: 100037,
        gameId: 2, gameCount: 1, totalCount: 8, time: Date.now(), scoreRatio: 10,
        players: [{ uid: 100001, name: '甲<&乙', score: 80 }, { uid: 100002, name: '丙', score: -80 }],
        details: [{ id: '10003701', scores: [{ uid: 100001, score: 50 }, { uid: 100002, score: -50 }] }],
        uids: [100001, 100002],
      }],
    }));
    const hotUpdateRoot = path.join(dir, 'hot-update');
    const hotUpdateConfig = path.join(dir, 'hot-update.json');
    fs.mkdirSync(path.join(hotUpdateRoot, 'android', '236', 'res'), { recursive: true });
    fs.writeFileSync(path.join(hotUpdateRoot, 'android', '236', 'res', 'check.bin'), 'hot-update-ok');
    fs.writeFileSync(hotUpdateConfig, JSON.stringify({
      schemaVersion: 1,
      platforms: {
        android: {
          enabled: true,
          latestAssetVersion: 236,
          minimumPackageVersion: '1.0.6',
          packageAction: 2,
          packageUrl: 'https://updates.example.test/hot-update/packages/game.apk',
          packageName: 'game.apk',
        },
      },
    }));
    child = spawn(process.execPath, [path.join(__dirname, '../server/index.js')], {
      env: {
        ...process.env,
        PORT: String(port),
        QJQP_DB: path.join(dir, 'state.sqlite'),
        QJQP_STATE: path.join(dir, 'state.json'),
        QJQP_FILLBOTS: '0',
        QJQP_LOAD_DEV_VARS: '0',
        QJQP_WECHAT_APPID: WX_APP_A,
        QJQP_WECHAT_APPSECRET: 'secret-a',
        QJQP_WECHAT_APPS: JSON.stringify({ [WX_APP_B]: 'secret-b' }),
        QJQP_HOT_UPDATE_ROOT: hotUpdateRoot,
        QJQP_HOT_UPDATE_CONFIG: hotUpdateConfig,
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
    const oldPackageUpdate = await request(port,
      '/version?os_type=qjqp_android_yuanlai&package_version=1.0.5&assert_version=234');
    t('旧安装包收到强制整包升级',
      [oldPackageUpdate.body.data.action, oldPackageUpdate.body.data.package_action], ['2', '2']);
    const assetUpdate = await request(port,
      '/version?os_type=qjqp_android_yuanlai&package_version=1.0.6&assert_version=235');
    t('新安装包收到资源热更新',
      [assetUpdate.body.data.action, assetUpdate.body.data.assert_version, assetUpdate.body.data.assert_url],
      ['1', '236', `http://127.0.0.1:${port}/hot-update/android/`]);
    t('最新资源不重复更新', (await request(port,
      '/version?os_type=qjqp_android_yuanlai&package_version=1.0.6&assert_version=236')).body.data, {});
    const hotAsset = await requestText(port, '/hot-update/android/236/res/check.bin');
    t('热更新资源路由可用', [hotAsset.status, hotAsset.text], [200, 'hot-update-ok']);
    const downloadPage = await requestText(port, '/download', {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Mobile',
    });
    t('客户端下载页可访问', downloadPage.status, 200);
    t('下载页使用独立样式和脚本',
      downloadPage.text.includes('/download/app.css') && downloadPage.text.includes('/download/app.js'), true);
    t('下载页包含安卓安装包入口',
      downloadPage.text.includes('href="https://l.heiwuya.cn/QeQZ6I"'), true);
    t('下载页标明内置资源版本', downloadPage.text.includes('资源 R274'), true);
    t('下载页包含 iOS 安装入口',
      downloadPage.text.includes('id="iosInstall" href="https://l.heiwuya.cn/UTsdzR"'), true);
    t('下载页包含法律条款且不展示公司名称',
      downloadPage.text.includes('/legal/privacy-policy')
        && !downloadPage.text.includes('湖北浩克互娱科技有限公司'), true);
    const downloadScript = await requestText(port, '/download/app.js');
    t('下载页脚本不覆盖外部安装链接',
      downloadScript.text.includes('itms-services://?action=download-manifest'), false);
    const downloadIcon = await requestText(port, '/download/app-icon-v2.webp');
    t('下载页压缩图标可访问',
      [downloadIcon.status, downloadIcon.headers['content-type']], [200, 'image/webp']);
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
    t('微信分享落地页有新图标预览', share.text.includes(`http://127.0.0.1:${port}/share/icon.png`), true);
    t('微信分享预览使用新品牌名称', share.text.includes('og:title" content="潜江干瞪眼 房间号：100037'), true);
    const shareIcon = await requestText(port, '/share/icon.png');
    t('分享图标可以直接访问', shareIcon.status, 200);
    t('分享图标保持 PNG 格式', shareIcon.headers['content-type'], 'image/png');
    t('分享图标含 PNG 签名', shareIcon.text.slice(1, 4), 'PNG');
    const agreement = await requestText(port, '/legal/user-agreement');
    t('用户协议网页可访问', agreement.status, 200);
    t('用户协议包含运营主体', agreement.text.includes('湖北浩克互娱科技有限公司'), true);
    const privacy = await requestText(port, '/legal/privacy-policy');
    t('隐私政策网页可访问', privacy.status, 200);
    t('隐私政策包含儿童规则', privacy.text.includes('儿童个人信息保护规则'), true);
    const record = await requestText(port, '/download/record?id=abcdef0123456789abcdef01');
    t('战绩链接可显示详情', record.status, 200);
    t('战绩有房间号与玩法名称', record.text.includes('潜江干瞪眼 战绩 房间号：100037'), true);
    t('战绩按房间倍率显示积分', record.text.includes('8分'), true);
    t('战绩包含每局积分', record.text.includes('第 1 局') && record.text.includes('5分'), true);
    t('玩家名字不会注入 HTML', record.text.includes('甲&lt;&amp;乙'), true);
    t('无效战绩显示过期提示', (await requestText(port, '/download/record?id=missing')).status, 404);
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
    t('非配置 AppID 被拒绝', wxLogin.body.err_code, 4);
    t('非配置 AppID 返回明确提示', wxLogin.body.err_msg, '微信 AppID 不匹配，请更新客户端');
    const migration = await request(port,
      `/login?accountType=wxMigration&token=wx-old-token&appId=${WX_APP_B}`);
    t('旧微信登录凭证可申请一次性迁移票据', migration.body.err_code, 0);
    t('迁移票据不是原登录 token',
      /^wm_[A-Za-z0-9_-]{40,}$/.test(migration.body.data.migrationTicket), true);
    t('迁移票据有效期 10 分钟', migration.body.data.expiresIn, 600);
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
