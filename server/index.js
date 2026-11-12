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
    const match = line.match(/^(QJQP_WECHAT_APPID|QJQP_WECHAT_APPSECRET|QJQP_WECHAT_APPS|QJQP_WECHAT_WEB_APPID|QJQP_WECHAT_WEB_APPSECRET|QJQP_ID_HASH_KEY|QJQP_APPLE_TEAM_ID|QJQP_PUBLIC_BASE_URL)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
}

const store = require('./store');
const { GameApp } = require('./app');
const { createVoice } = require('./voice');
const { authorizeWechat } = require('./wechat');
const { createAdminHttp } = require('./admin-http');
const { HotUpdateService } = require('./hot-update');
const { clientIp, IpGeoService } = require('./ip-geo');
const { ClientPlatformTracker, platformFromPlayer } = require('./client-platform');
const { TokenBucket, startHeartbeat, WS_MAX_PAYLOAD } = require('./ws-guard');
const { LISTEN_HOST, PORT } = require('./http/config');
const { html, json, logUrl, readBody, redirect } = require('./http/responses');
const { aasa, publicOrigin, pwaWechatResultUrl, recordSharePage, sharePage } = require('./http/pages');
const { DOWNLOAD_ASSETS, LEGAL_PAGES, SHARE_ICON, servePwa } = require('./http/static-files');
const {
  WEB_WECHAT_STATE_TTL, WEB_WECHAT_TICKET_TTL, consumeWebWechatToken, hasWechatCredentials, issueWebWechatToken,
  webWechatCredentials, webWechatStates, webWechatTickets, wechatCredentials,
} = require('./http/web-wechat');

const voice = createVoice(path.join(path.dirname(store.FILE), 'voice'));
const hotUpdate = new HotUpdateService({
  root: process.env.QJQP_HOT_UPDATE_ROOT || path.join(path.dirname(store.FILE), 'hot-update'),
  configFile: process.env.QJQP_HOT_UPDATE_CONFIG || path.join(path.dirname(store.FILE), 'hot-update.json'),
});
const ipGeo = new IpGeoService();
const clientPlatforms = new ClientPlatformTracker();
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
  onAgentApplication: (application) => store.appendAgentApplication(application),
  onAccountMigration: (entry) => store.appendAudit({
    at: entry.linkedAt, actor: '系统', action: 'wechat_appid_migration', target: String(entry.uid),
    details: {
      appId: entry.appId,
      openidAliasCount: entry.openidAliasCount,
      unionidAliasCount: entry.unionidAliasCount,
    },
  }),
});
const adminHttp = createAdminHttp({ app, store, flush, hotUpdate,
  publicBaseUrl: String(process.env.QJQP_PUBLIC_BASE_URL || '').replace(/\/$/, ''),
});

const recordLoginNetwork = (player, req) => {
  if (!player || player.bot) return;
  const ip = clientIp(req);
  if (!ip) return;
  const needsLookup = player.lastIp !== ip || !player.lastIpCity;
  player.lastIp = ip;
  player.lastIpAt = app.now();
  if (needsLookup) player.lastIpCity = '';
  app.persist();
  if (!needsLookup) return;
  void ipGeo.lookup(ip).then((location) => {
    const current = app.playerByUid(player.uid);
    if (!current || current.lastIp !== ip || !location) return;
    current.lastIpCity = location;
    current.lastIpLocatedAt = app.now();
    app.persist();
  });
};

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

  if (req.method === 'GET' && url.pathname === '/version') {
    const observed = clientPlatforms.remember(req, url.searchParams);
    if (observed) {
      const player = app.playerByUid(observed.uid);
      if (player && (player.lastClientPlatform !== observed.platform
          || player.lastClientPlatformIp !== observed.ip
          || Number(player.lastClientPlatformAt || 0) !== observed.seenAt)) {
        player.lastClientPlatform = observed.platform;
        player.lastClientPlatformIp = observed.ip;
        player.lastClientPlatformAt = observed.seenAt;
        app.persist();
      }
    }
    return json(res, hotUpdate.versionBody(url.searchParams, publicOrigin(req), {
      forwardedFor: req.headers['x-forwarded-for'],
      remoteAddress: req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    }));
  }
  if (url.pathname.startsWith('/hot-update/')) return hotUpdate.serve(req, res, url);

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
  if (req.method === 'GET' && LEGAL_PAGES.has(url.pathname)) {
    return html(res, LEGAL_PAGES.get(url.pathname));
  }
  if ((req.method === 'GET' || req.method === 'HEAD')
      && (url.pathname === '/pwa' || url.pathname.startsWith('/pwa/'))) {
    return servePwa(req, res, url);
  }
  if ((req.method === 'GET' || req.method === 'HEAD') && DOWNLOAD_ASSETS.has(url.pathname)) {
    const asset = DOWNLOAD_ASSETS.get(url.pathname);
    const headers = {
      'Content-Type': asset.type,
      'Content-Length': asset.body.length,
      'Cache-Control': asset.cache,
      'X-Content-Type-Options': 'nosniff',
    };
    if (asset.type.startsWith('text/html')) {
      headers['Content-Security-Policy'] = "default-src 'none'; img-src 'self'; style-src 'self'; script-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
    }
    res.writeHead(200, headers);
    return res.end(req.method === 'HEAD' ? undefined : asset.body);
  }
  if (req.method === 'GET' && url.pathname === '/wechat/pwa-login') {
    const credentials = webWechatCredentials();
    if (!credentials) return redirect(res,
      pwaWechatResultUrl('wechat_error', '服务器尚未配置微信网页登录'));
    if (!/MicroMessenger/i.test(String(req.headers['user-agent'] || ''))) {
      return redirect(res, pwaWechatResultUrl('wechat_error', '微信登录请在微信内打开此页面'));
    }
    const state = issueWebWechatToken(webWechatStates, { credentials }, WEB_WECHAT_STATE_TTL);
    const callback = `${publicOrigin(req)}/wechat/pwa-callback`;
    const authorize = new URL('https://open.weixin.qq.com/connect/oauth2/authorize');
    authorize.search = new URLSearchParams({
      appid: credentials.appId,
      redirect_uri: callback,
      response_type: 'code',
      scope: 'snsapi_userinfo',
      state,
    });
    return redirect(res, `${authorize}#wechat_redirect`);
  }
  if (req.method === 'GET' && url.pathname === '/wechat/pwa-callback') {
    const state = consumeWebWechatToken(webWechatStates, url.searchParams.get('state'));
    if (!state) return redirect(res,
      pwaWechatResultUrl('wechat_error', '微信授权已失效，请重新登录'));
    if (url.searchParams.get('error') || !url.searchParams.get('code')) {
      return redirect(res, pwaWechatResultUrl('wechat_error', '已取消微信登录'));
    }
    try {
      const profile = await authorizeWechat(url.searchParams.get('code'), state.credentials);
      const login = app.loginWechat(profile, { appId: state.credentials.appId });
      recordLoginNetwork(login.player, req);
      const ticket = issueWebWechatToken(webWechatTickets, { token: login.token }, WEB_WECHAT_TICKET_TTL);
      console.log(`  PWA 微信登录 uid=${login.player.uid}`);
      return redirect(res, pwaWechatResultUrl('wechat_ticket', ticket));
    } catch (err) {
      console.error(`PWA 微信登录失败：${err.message}`);
      return redirect(res, pwaWechatResultUrl('wechat_error', err.message || '微信登录失败'));
    }
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

  if (req.method === 'GET' && url.pathname === '/login'
      && url.searchParams.get('accountType') === 'wxMigration') {
    try {
      const credentials = wechatCredentials(url.searchParams.get('appId'));
      if (!credentials) return json(res, hasWechatCredentials()
        ? { err_code: 4, err_msg: '微信 AppID 不匹配，请更新客户端' }
        : { err_code: 3, err_msg: '服务器尚未配置微信登录' }, 400);
      const migration = app.issueWechatMigrationTicket(url.searchParams.get('token'), credentials.appId);
      return json(res, {
        err_code: 0, data: { migrationTicket: migration.ticket, expiresIn: migration.expiresIn },
      });
    } catch (err) {
      console.error(`微信账号迁移准备失败：${err.message}`);
      return json(res, { err_code: err.code || 1, err_msg: err.message }, 400);
    }
  }

  if (req.method === 'GET' && url.pathname === '/login'
      && url.searchParams.get('accountType') === 'webWechatTicket') {
    const login = consumeWebWechatToken(webWechatTickets, url.searchParams.get('ticket'));
    if (!login) return json(res, { err_code: 66, err_msg: '微信登录已失效，请重新登录' }, 400);
    recordLoginNetwork(app.playerForToken(login.token), req);
    return json(res, { err_code: 0, data: { token: login.token } });
  }

  if (req.method === 'GET' && url.pathname === '/login' && url.searchParams.get('accountType') === 'wx') {
    try {
      const credentials = wechatCredentials(url.searchParams.get('appId'));
      if (!credentials) {
        return json(res, hasWechatCredentials()
          ? { err_code: 4, err_msg: '微信 AppID 不匹配，请更新客户端' }
          : { err_code: 3, err_msg: '服务器尚未配置微信登录' }, 400);
      }
      const profile = await authorizeWechat(url.searchParams.get('code'), credentials);
      const login = app.loginWechat(profile, {
        appId: credentials.appId,
        migrationTicket: url.searchParams.get('migrationTicket'),
      });
      recordLoginNetwork(login.player, req);
      console.log(`  微信登录 uid=${login.player.uid}${login.migrated ? ' AppID迁移' : ''}`);
      return json(res, { err_code: 0, data: { token: login.token, migrated: !!login.migrated } });
    } catch (err) {
      console.error(`微信登录失败：${err.message}`);
      return json(res, { err_code: err.code || 1, err_msg: err.message }, 400);
    }
  }

  const out = app.http(url.pathname, url.searchParams);
  if (url.pathname === '/login' && out.body && Number(out.body.err_code) === 0) {
    const token = out.body.data && out.body.data.token;
    recordLoginNetwork(app.playerForToken(token), req);
  }
  if (out.status === 404) return res.writeHead(404).end();
  return json(res, out.body);
});

const wss = new WebSocketServer({
  server,
  path: '/ws',
  maxPayload: WS_MAX_PAYLOAD,
});
startHeartbeat(wss);
let nextConn = 1;

wss.on('connection', (ws, req) => {
  const connId = `n${nextConn++}`;
  const ip = clientIp(req);
  console.log('WS 连上');
  app.attach(connId, (buf) => {
    if (ws.readyState === 1) ws.send(buf);
  }, (code = 4003, reason = 'account disabled') => ws.close(code, reason), {
    platformForUid: (uid) => {
      const recent = clientPlatforms.resolve(uid, ip);
      return recent !== 'unknown'
        ? recent : platformFromPlayer(app.playerByUid(uid), ip, app.now());
    },
  });
  ws.on('error', (err) => console.error('WS 错误', err));
  const bucket = new TokenBucket();
  let limited = false;
  ws.on('message', (data) => {
    if (limited) return;
    if (!bucket.take()) {
      limited = true;
      console.warn(`WS 消息过于频繁，断开 ${ip}`);
      ws.close(1008, 'rate limit');
      return;
    }
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
