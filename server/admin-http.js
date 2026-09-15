const fs = require('fs');
const path = require('path');
const { AdminAuth } = require('./admin-auth');
const { AdminData } = require('./admin-data');

const json = (res, body, status = 200) => {
  const bytes = Buffer.from(JSON.stringify(body));
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': bytes.length });
  res.end(bytes);
};
const readJson = (req) => new Promise((resolve, reject) => {
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    reject(new Error('请求须为 application/json')); return;
  }
  const parts = [];
  let bytes = 0;
  req.on('data', (part) => {
    bytes += part.length;
    if (bytes > 8192) { reject(new Error('请求内容过大')); req.destroy(); return; }
    parts.push(part);
  });
  req.on('end', () => {
    try {
      const parsed = JSON.parse(Buffer.concat(parts).toString('utf8'));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('JSON 对象无效');
      resolve(parsed);
    } catch (error) { reject(error); }
  });
  req.on('error', reject);
});

const publicFiles = {
  '/admin': ['index.html', 'text/html; charset=utf-8'],
  '/admin/': ['index.html', 'text/html; charset=utf-8'],
  '/admin/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/admin/style.css': ['style.css', 'text/css; charset=utf-8'],
};

const createAdminHttp = ({ app, store, flush, authFile, publicBaseUrl = '' }) => {
  const auth = new AdminAuth({ file: authFile || path.join(path.dirname(store.FILE), 'admin-password.json') });
  const data = new AdminData(app, store);
  const assets = new Map(Object.entries(publicFiles).map(([url, [file, mime]]) => [url, {
    bytes: fs.readFileSync(path.join(__dirname, 'admin-public', file)), mime,
  }]));

  const secureRequest = (req) => String(publicBaseUrl).startsWith('https://')
    || String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https' || !!req.socket.encrypted;
  const sameOrigin = (req) => {
    const origin = String(req.headers.origin || '');
    if (!origin) return true;
    let parsed;
    try { parsed = new URL(origin); } catch { return false; }
    const base = publicBaseUrl ? new URL(publicBaseUrl) : null;
    return base ? parsed.origin === base.origin : parsed.host === req.headers.host;
  };

  const handler = async (req, res, url) => {
    if (!url.pathname.startsWith('/admin')) return false;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    const asset = assets.get(url.pathname);
    if (asset && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': asset.mime, 'Content-Length': asset.bytes.length });
      res.end(asset.bytes);
      return true;
    }
    if (!url.pathname.startsWith('/admin/api/')) { json(res, { error: '页面不存在' }, 404); return true; }

    const pathname = url.pathname.slice('/admin/api'.length);
    if (pathname === '/login' && req.method === 'POST') {
      if (!sameOrigin(req)) return json(res, { error: '来源无效' }, 403), true;
      if (!auth.configured()) return json(res, { error: '管理员密码尚未设置' }, 503), true;
      let body;
      try { body = await readJson(req); } catch (error) { return json(res, { error: error.message }, 400), true; }
      const result = auth.login(body.password, req.socket.remoteAddress);
      store.appendAudit({ action: result.error ? 'admin.login_failed' : 'admin.login', target: 'admin',
        details: { ip: req.socket.remoteAddress || '' } });
      if (result.error) return json(res, { error: result.error }, result.status), true;
      res.setHeader('Set-Cookie', auth.cookie(result.session.sid, secureRequest(req)));
      return json(res, { actor: result.session.actor, csrf: result.session.csrf }), true;
    }
    const session = auth.session(req);
    if (!session) return json(res, { error: '请先登录管理后台' }, 401), true;
    if (pathname === '/session' && req.method === 'GET') {
      return json(res, { actor: session.actor, csrf: session.csrf, expiresAt: session.expiresAt }), true;
    }
    if (req.method !== 'GET' && (!auth.csrfOk(req, session) || !sameOrigin(req))) {
      return json(res, { error: '会话校验失败' }, 403), true;
    }
    if (pathname === '/logout' && req.method === 'POST') {
      auth.logout(session);
      store.appendAudit({ action: 'admin.logout', target: 'admin' });
      res.setHeader('Set-Cookie', auth.cookie('', secureRequest(req)));
      return json(res, { ok: true }), true;
    }
    if (pathname === '/password' && req.method === 'POST') {
      let body;
      try { body = await readJson(req); } catch (error) { return json(res, { error: error.message }, 400), true; }
      const changed = auth.changePassword(body.currentPassword, body.newPassword);
      if (changed.error) return json(res, { error: changed.error }, 400), true;
      store.appendAudit({ actor: session.actor, action: 'admin.password_change', target: 'admin' });
      res.setHeader('Set-Cookie', auth.cookie('', secureRequest(req)));
      return json(res, { ok: true }), true;
    }

    const query = Object.fromEntries(url.searchParams.entries());
    if (req.method === 'GET') {
      let result;
      if (pathname === '/dashboard') result = data.dashboard();
      else if (pathname === '/players') result = data.players(query);
      else if (/^\/players\/\d+$/.test(pathname)) result = data.player(pathname.split('/').pop());
      else if (pathname === '/rooms') result = data.rooms(query);
      else if (/^\/rooms\/\d+$/.test(pathname)) result = data.room(pathname.split('/').pop());
      else if (pathname === '/records') result = data.records(query);
      else if (/^\/records\/[^/]+$/.test(pathname)) result = data.record(decodeURIComponent(pathname.slice('/records/'.length)));
      else if (pathname === '/clubs') result = data.clubs(query);
      else if (/^\/clubs\/\d+$/.test(pathname)) result = data.club(pathname.split('/').pop());
      else if (pathname === '/messages') result = { messages: app.operatorMessages.slice().reverse() };
      else if (pathname === '/notices') result = app.publicNotices;
      else if (pathname === '/audit') result = { entries: store.listAudit(query.limit) };
      else if (pathname === '/system') result = { sqliteFile: store.FILE,
        recordsArchived: store.recordHistoryStats(0).total, recordsRetained: app.records.length,
        recordsLimit: 300, authConfigured: auth.configured() };
      else return json(res, { error: '接口不存在' }, 404), true;
      return json(res, result.error ? { error: result.error } : result,
        Number.isInteger(result.status) ? result.status : 200), true;
    }

    let body = {};
    if (req.method === 'POST' || req.method === 'PUT') {
      try { body = await readJson(req); } catch (error) { return json(res, { error: error.message }, 400), true; }
    }
    let result;
    let action;
    let target;
    if (req.method === 'POST' && /^\/players\/\d+\/cards$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'player.cards'; result = data.adjustCards(target, body);
    } else if (req.method === 'POST' && /^\/players\/\d+\/status$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'player.status'; result = data.setStatus(target, body);
    } else if (req.method === 'POST' && /^\/rooms\/\d+\/dissolve$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'room.dissolve'; result = data.dissolveRoom(target, body);
    } else if (req.method === 'POST' && /^\/clubs\/\d+\/settings$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'club.settings'; result = data.updateClub(target, body);
    } else if (req.method === 'POST' && pathname === '/messages') {
      action = 'message.create'; result = app.createOperatorMessage(body); target = result.message && result.message.id;
    } else if (req.method === 'DELETE' && /^\/messages\/\d+$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'message.delete'; result = app.deleteOperatorMessage(Number(target));
    } else if (req.method === 'PUT' && pathname === '/notices') {
      target = '大厅'; action = 'notice.update'; result = data.updateNotices(body);
    } else if (req.method === 'POST' && pathname === '/backup') {
      const filename = path.join(path.dirname(store.FILE), 'backups', `admin-${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`);
      await flush();
      await store.backup(filename);
      result = { filename }; action = 'system.backup'; target = filename;
    } else return json(res, { error: '接口不存在' }, 404), true;

    if (result.error) return json(res, { error: result.error }, result.status || 400), true;
    if (action !== 'system.backup') await flush();
    store.appendAudit({ actor: session.actor, action, target,
      details: action === 'message.create' ? { title: result.message.title, targetUid: result.message.targetUid }
        : action === 'message.delete' ? { title: result.message.title }
          : result });
    return json(res, result.message || result, action === 'message.create' ? 201 : 200), true;
  };
  return { handler, auth, data };
};

module.exports = { createAdminHttp };
