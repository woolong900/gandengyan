/**
 * Node 入口。牌局在 GameApp / Table，这里只接 HTTP 和 ws。
 */
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { WebSocketServer } = require('ws');

const devVars = path.join(__dirname, '..', '.dev.vars');
if (process.env.QJQP_LOAD_DEV_VARS !== '0' && fs.existsSync(devVars)) {
  for (const line of fs.readFileSync(devVars, 'utf8').split('\n')) {
    const match = line.match(/^(QJQP_WECHAT_APPID|QJQP_WECHAT_APPSECRET|QJQP_ID_HASH_KEY|QJQP_APPLE_TEAM_ID|QJQP_PUBLIC_BASE_URL)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
}

const store = require('./store');
const { GameApp } = require('./app');
const { createVoice } = require('./voice');
const { authorizeWechat } = require('./wechat');
const { createAdminHttp } = require('./admin-http');

const voice = createVoice(path.join(path.dirname(store.FILE), 'voice'));

const PORT = Number(process.env.PORT) || 8080;
const LISTEN_HOST = process.env.HOST || '0.0.0.0';
const APP_BUNDLE_ID = 'com.haoke.gandengyan';
const APPLE_TEAM_ID = process.env.QJQP_APPLE_TEAM_ID || '4CSMM3394C';
const SHARE_ICON = fs.readFileSync(path.join(__dirname, 'public', 'share-icon.png'));
const operatorKeyFile = process.env.QJQP_OPERATOR_KEY_FILE || path.join(path.dirname(store.FILE), 'operator.key');
const operatorKey = String(process.env.QJQP_OPERATOR_KEY || (
  fs.existsSync(operatorKeyFile) ? fs.readFileSync(operatorKeyFile, 'utf8') : ''
)).trim();

let saveTimer = null;
let saveQueue = Promise.resolve();
let stopping = false;

const queueSave = (data) => {
  const write = saveQueue.then(() => store.saveAsync(data));
  saveQueue = write.catch((err) => console.error('写存档失败', err));
  return write;
};

const persistSoon = () => {
  if (saveTimer || stopping) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    queueSave(app.dump());
  }, 150);
};

const flush = (data) => {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  return queueSave(data || app.dump());
};

const app = new GameApp({
  persist: () => persistSoon(),
  now: Date.now,
  onRecord: (record) => store.archiveRecord(record),
});
const adminHttp = createAdminHttp({ app, store, flush,
  publicBaseUrl: String(process.env.QJQP_PUBLIC_BASE_URL || '').replace(/\/$/, ''),
});

const json = (res, body, status = 200) => {
  const s = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(s),
  });
  res.end(s);
};

const html = (res, body, status = 200) => {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'public, max-age=300',
    'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'",
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
};

const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const publicOrigin = (req) => {
  const configured = String(process.env.QJQP_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (configured) return configured;
  const forwarded = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const protocol = forwarded === 'https' ? 'https' : (req.socket.encrypted ? 'https' : 'http');
  const host = String(req.headers.host || `127.0.0.1:${PORT}`).replace(/[\r\n]/g, '');
  return `${protocol}://${host}`;
};

const sharePage = (req, roomId) => {
  const room = /^\d{4,10}$/.test(String(roomId || '')) ? String(roomId) : '';
  const roomText = room ? `<p class="room">房间号 <strong>${escapeHtml(room)}</strong></p>` : '';
  const origin = escapeHtml(publicOrigin(req));
  const title = escapeHtml(room ? `潜江干瞪眼 房间号：${room}` : '潜江干瞪眼');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="约上好友一起玩潜江干瞪眼"><meta property="og:image" content="${origin}/share/icon.png"><link rel="icon" type="image/png" href="/share/icon.png"><style>body{margin:0;background:#f7f1e4;color:#4b2d18;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}.card{box-sizing:border-box;max-width:560px;margin:12vh auto;padding:40px 28px;text-align:center;background:#fffaf0;border:1px solid #ead5b5;border-radius:22px;box-shadow:0 14px 40px #6d3e1920}h1{margin:0 0 18px;color:#9b3f20;font-size:32px}.room{font-size:22px}.room strong{font-size:38px;letter-spacing:3px;color:#d2692e}p{line-height:1.7}.tip{color:#765b47}</style></head><body><main class="card"><h1>潜江干瞪眼</h1>${roomText}<p>打开游戏${room ? '，在大厅输入上面的房间号' : ''}即可开始游戏。</p><p class="tip">来自好友的微信分享</p></main></body></html>`;
};

const recordSharePage = (req, record) => {
  const origin = escapeHtml(publicOrigin(req));
  const icon = `${origin}/share/icon.png`;
  if (!record) {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>战绩不存在或已过期</title><meta property="og:image" content="${icon}"><link rel="icon" href="/share/icon.png"></head><body style="font-family:sans-serif;text-align:center;padding:12vh 20px;color:#4b2d18"><h1>战绩不存在或已过期</h1><p>请让好友从游戏里重新分享战绩。</p></body></html>`;
  }
  const room = escapeHtml(record.roomId);
  const title = `潜江干瞪眼 战绩 房间号：${room}`;
  const ratio = Number(record.scoreRatio) > 0 ? Number(record.scoreRatio) : 1;
  const formatScore = (raw) => {
    const score = Number(raw || 0) / ratio;
    return Number.isFinite(score) ? `${Math.round(score * 100) / 100}分` : '0分';
  };
  const players = (record.players || []).slice(0, 20);
  const names = new Map(players.map((player) => [String(player.uid), escapeHtml(player.name)]));
  const rows = players.map((player) => `<li><span>${escapeHtml(player.name)}</span><strong>${formatScore(player.score)}</strong></li>`).join('');
  const hands = (record.details || []).slice(0, 100).map((hand, index) => {
    const scores = (hand.scores || []).map((item) => `<li><span>${names.get(String(item.uid)) || `玩家${escapeHtml(item.uid)}`}</span><strong>${formatScore(item.score)}</strong></li>`).join('');
    return `<section><h2>第 ${index + 1} 局</h2><ul>${scores}</ul></section>`;
  }).join('');
  const time = Number(record.time);
  const date = Number.isFinite(time) ? new Date(time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }) : '';
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="潜江干瞪眼房间战绩，查看玩家积分"><meta property="og:image" content="${icon}"><link rel="icon" href="/share/icon.png"><style>body{margin:0;background:#f7f1e4;color:#4b2d18;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}.card{box-sizing:border-box;max-width:560px;margin:30px auto;padding:28px;background:#fffaf0;border:1px solid #ead5b5;border-radius:20px}h1{color:#9b3f20}h2{font-size:19px;color:#9b3f20;margin:25px 0 9px}p{color:#765b47}ul{padding:0;margin:0;list-style:none}li{display:flex;justify-content:space-between;border-bottom:1px solid #ead5b5;padding:10px 0}strong{color:#b04e25}</style></head><body><main class="card"><h1>潜江干瞪眼战绩</h1><p>房间号：${room}　${escapeHtml(date)}<br>已打 ${Number(record.gameCount) || 0}/${Number(record.totalCount) || 0} 局</p><h2>总积分</h2><ul>${rows}</ul>${hands}</main></body></html>`;
};

const aasa = () => ({
  applinks: {
    apps: [],
    details: [{
      appID: `${APPLE_TEAM_ID}.${APP_BUNDLE_ID}`,
      paths: ['/wechat/*'],
    }],
  },
});

const logUrl = (url) => {
  const query = new URLSearchParams(url.searchParams);
  for (const key of ['token', 'code', 'deviceId', 'access_token', 'authorization']) {
    if (query.has(key)) query.set(key, '[redacted]');
  }
  const suffix = query.toString();
  return `${url.pathname}${suffix ? `?${suffix}` : ''}`;
};

const readBody = (req, limit) => new Promise((resolve, reject) => {
  const chunks = [];
  let n = 0;
  req.on('data', (c) => {
    n += c.length;
    if (n > limit) {
      req.destroy();
      reject(new Error('too large'));
      return;
    }
    chunks.push(c);
  });
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});

const operatorAuthorized = (req) => {
  if (!operatorKey) return false;
  const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const actual = Buffer.from(supplied);
  const expected = Buffer.from(operatorKey);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};

const server = http.createServer(async (req, res) => {
  let url;
  try {
    // 路由只使用路径和查询参数，不依赖客户端提供的 Host。
    url = new URL(req.url, 'http://localhost');
  } catch {
    return json(res, { err_code: 1, err_msg: 'invalid URL' }, 400);
  }
  console.log(`HTTP ${req.method} ${logUrl(url)}`);

  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
    try { return await adminHttp.handler(req, res, url); }
    catch (error) {
      console.error('管理后台请求失败', error);
      if (!res.headersSent) return json(res, { error: '管理后台处理失败' }, 500);
      return;
    }
  }

  if (url.pathname === '/operator/messages' || /^\/operator\/messages\/\d+$/.test(url.pathname)) {
    res.setHeader('Cache-Control', 'no-store');
    if (!operatorKey) return json(res, { error: '运营密钥未配置' }, 503);
    if (!operatorAuthorized(req)) return json(res, { error: '未授权' }, 401);
    if (req.method === 'GET' && url.pathname === '/operator/messages') {
      return json(res, { messages: app.operatorMessages });
    }
    if (req.method === 'POST' && url.pathname === '/operator/messages') {
      let body;
      try { body = JSON.parse((await readBody(req, 4096)).toString('utf8')); }
      catch { return json(res, { error: '消息参数不是有效 JSON' }, 400); }
      const created = app.createOperatorMessage(body);
      return json(res, created.error ? { error: created.error } : created.message, created.error ? 400 : 201);
    }
    if (req.method === 'DELETE' && /^\/operator\/messages\/\d+$/.test(url.pathname)) {
      const deleted = app.deleteOperatorMessage(Number(url.pathname.split('/').pop()));
      return json(res, deleted.error ? { error: deleted.error } : { deleted: deleted.message.id }, deleted.error ? 404 : 200);
    }
    return json(res, { error: '请求方法不支持' }, 405);
  }

  // Apple 要求 AASA 用 HTTPS 直接返回，不允许重定向。微信 iOS SDK
  // 使用同一个 /wechat/ 前缀完成 Universal Link 校验和回调。
  if (req.method === 'GET' && (url.pathname === '/apple-app-site-association'
      || url.pathname === '/.well-known/apple-app-site-association')) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return json(res, aasa());
  }
  if (req.method === 'GET' && url.pathname === '/share/icon.png') {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': SHARE_ICON.length,
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    });
    return res.end(SHARE_ICON);
  }
  if (req.method === 'GET' && /^\/avatars\/(0[1-9]|10)\.png$/.test(url.pathname)) {
    const filename = path.join(__dirname, 'public', 'avatars', path.basename(url.pathname));
    const image = fs.readFileSync(filename);
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': image.length,
      'Cache-Control': 'public, max-age=86400, immutable',
      'X-Content-Type-Options': 'nosniff',
    });
    return res.end(image);
  }
  if (req.method === 'GET' && (url.pathname === '/wechat' || url.pathname.startsWith('/wechat/'))) {
    return html(res, sharePage(req, url.searchParams.get('roomId')));
  }

  // 返回当前可公网访问的域名，避免微信分享继续指向原厂地址。
  if (req.method === 'GET' && url.pathname === '/v1/forwardconfig') {
    const data = { primary: { type: 'qj', url: publicOrigin(req) } };
    return json(res, { err_code: '0', data: JSON.stringify(data) });
  }
  if (req.method === 'GET' && url.pathname === '/v1/donamerecord') {
    return json(res, { err_code: '0', data: null });
  }
  if (req.method === 'GET' && url.pathname === '/download/ylhy-activity') {
    return html(res, sharePage(req, url.searchParams.get('roomId')));
  }
  if (req.method === 'GET' && url.pathname === '/download/record') {
    const id = String(url.searchParams.get('id') || '');
    const record = /^[a-zA-Z0-9]{1,64}$/.test(id)
      ? app.records.find((item) => item.shareCode === id || item.id === id) : null;
    return html(res, recordSharePage(req, record), record ? 200 : 404);
  }

  if (url.pathname === '/voice' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || '';
    if (!voice.allowPost(ip)) {
      return json(res, { err_code: 1, err_msg: 'too frequent' }, 429);
    }
    return readBody(req, voice.maxBytes).then((body) => {
      const out = voice.put(body);
      if (out.error) return json(res, { err_code: 1, err_msg: out.error }, 400);
      console.log(`  语音 ${out.bytes}B -> ${out.id}`);
      return json(res, { err_code: 0, id: out.id });
    }).catch(() => json(res, { err_code: 1, err_msg: 'too large' }, 400));
  }
  if (req.method === 'GET' && url.pathname.startsWith('/voice/')) {
    const file = voice.fileOf(url.pathname.slice('/voice/'.length));
    if (!file) return res.writeHead(404).end();
    const st = fs.statSync(file);
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': 'public, max-age=1800',
    });
    return fs.createReadStream(file).pipe(res);
  }

  if (req.method === 'GET' && url.pathname === '/login' && url.searchParams.get('accountType') === 'wx') {
    try {
      const requestedAppId = String(url.searchParams.get('appId') || '');
      const configuredAppId = process.env.QJQP_WECHAT_APPID || '';
      if (requestedAppId && configuredAppId && requestedAppId !== configuredAppId) {
        return json(res, { err_code: 4, err_msg: '微信 AppID 不匹配，请更新客户端' }, 400);
      }
      const profile = await authorizeWechat(url.searchParams.get('code'));
      const login = app.loginWechat(profile);
      console.log(`  微信登录 uid=${login.player.uid}`);
      return json(res, { err_code: 0, data: { token: login.token } });
    } catch (err) {
      console.error(`微信登录失败：${err.message}`);
      return json(res, { err_code: err.code || 1, err_msg: err.message }, 400);
    }
  }

  const out = app.http(url.pathname, url.searchParams);
  if (out.status === 404) return res.writeHead(404).end();
  return json(res, out.body);
});

const wss = new WebSocketServer({
  server,
  path: '/ws',
  maxPayload: 4 * 1024 * 1024,
});
let nextConn = 1;

wss.on('connection', (ws) => {
  const connId = `n${nextConn++}`;
  console.log('WS 连上');
  app.attach(connId, (buf) => {
    if (ws.readyState === 1) ws.send(buf);
  }, () => ws.close(4003, 'account disabled'));
  ws.on('error', (err) => console.error('WS 错误', err));
  ws.on('message', (data) => {
    try {
      app.onMessage(connId, data);
    } catch (err) {
      console.error('处理 WS 消息出错', err);
    }
  });
  ws.on('close', () => {
    console.log('WS 断开');
    app.detach(connId);
  });
});

const shutdown = async (why) => {
  if (stopping) return;
  stopping = true;
  console.log(`收到 ${why}，落盘后退出`);
  try { await flush(); } catch (err) { console.error(err); }
  store.close();
  process.exit(0);
};

process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
process.on('SIGINT', () => { void shutdown('SIGINT'); });
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  stopping = true;
  void flush().finally(() => {
    store.close();
    process.exit(1);
  });
});
process.on('unhandledRejection', (err) => console.error('unhandledRejection', err));
server.on('error', (err) => console.error('HTTP 监听出错', err));

try {
  app.restore(store.load());
  store.backfillRecords(app.records);
  void flush();
  console.log(`从存档恢复 ${app.players.size} 个玩家、${app.tables.size} 个房间  ${store.FILE}`);
} catch (err) {
  console.error('读存档失败，拒绝空数据启动', err);
  store.close();
  process.exit(1);
}

server.listen(PORT, LISTEN_HOST, () => {
  console.log(`服务端起在 ${LISTEN_HOST}:${PORT}  （/version /login /ws /voice）`);
});
