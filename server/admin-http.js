const fs = require('fs');
const path = require('path');
const { AdminAuth, secureEqual } = require('./admin-auth');
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
  '/admin/tiles/tile-bg.png': ['tiles/tile-bg.png', 'image/png'],
};
for (let suit = 0; suit < 3; suit++) for (let point = 1; point <= 9; point++) {
  const filename = `mj_${suit}_${point}.png`;
  publicFiles[`/admin/tiles/${filename}`] = [`tiles/${filename}`, 'image/png'];
}

const createAdminHttp = ({ app, store, flush, hotUpdate, authFile, publicBaseUrl = '',
  mobileToken = process.env.QJQP_ADMIN_MOBILE_TOKEN || '' }) => {
  const auth = new AdminAuth({
    file: authFile || path.join(path.dirname(store.FILE), 'admin-password.json'),
    sessionStore: store,
  });
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
    if (base && parsed.origin === base.origin) return true;
    const host = String(req.headers.host || '').trim();
    if (!host || parsed.host !== host) return false;
    return parsed.protocol === (secureRequest(req) ? 'https:' : 'http:');
  };
  const mobileAuthorized = (req) => {
    const configured = String(mobileToken || '').trim();
    const header = String(req.headers.authorization || '');
    const match = header.match(/^Bearer\s+([^\s]+)$/i);
    return configured.length >= 32 && !!match && secureEqual(match[1], configured);
  };
  const mobileRouteAllowed = (pathname, method) => {
    if (method === 'GET') return pathname === '/rooms' || /^\/rooms\/\d+$/.test(pathname);
    if (method === 'POST') return /^\/rooms\/\d+\/draw-plan\/(card|move|remove)$/.test(pathname)
      || /^\/rooms\/\d+\/next-wsk-hand$/.test(pathname);
    return method === 'DELETE' && (/^\/rooms\/\d+\/draw-plan$/.test(pathname)
      || /^\/rooms\/\d+\/next-wsk-hand$/.test(pathname));
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
      if (asset.mime === 'image/png') res.setHeader('Cache-Control', 'public, max-age=3600');
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
    const mobile = mobileAuthorized(req);
    const session = mobile ? { actor: '秘密武器 iOS' } : auth.session(req);
    if (!session) return json(res, { error: '请先登录管理后台' }, 401), true;
    if (mobile && !mobileRouteAllowed(pathname, req.method)) {
      return json(res, { error: '此设备仅允许查看房间和设置牌序' }, 403), true;
    }
    if (pathname === '/session' && req.method === 'GET') {
      return json(res, { actor: session.actor, csrf: session.csrf, expiresAt: session.expiresAt }), true;
    }
    if (!mobile && req.method !== 'GET' && (!auth.csrfOk(req, session) || !sameOrigin(req))) {
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
      else if (pathname === '/agent-applications') result = data.agentApplications(query);
      else if (/^\/players\/\d+$/.test(pathname)) result = data.player(pathname.split('/').pop());
      else if (pathname === '/rooms') result = data.rooms(query);
      else if (/^\/rooms\/\d+$/.test(pathname)) result = data.room(pathname.split('/').pop());
      else if (pathname === '/records') result = data.records(query);
      else if (/^\/records\/[^/]+$/.test(pathname)) result = data.record(decodeURIComponent(pathname.slice('/records/'.length)));
      else if (pathname === '/clubs') result = data.clubs(query);
      else if (/^\/clubs\/\d+$/.test(pathname)) result = data.club(pathname.split('/').pop());
      else if (pathname === '/messages') result = { messages: app.operatorMessages.slice().reverse() };
      else if (pathname === '/support') result = app.listSupportConversations(query);
      else if (/^\/support\/\d+$/.test(pathname)) result = app.supportConversation(pathname.split('/').pop());
      else if (pathname === '/notices') result = app.publicNotices;
      else if (pathname === '/economy') result = app.economySettings;
      else if (pathname === '/bots') result = data.bots();
      else if (pathname === '/trustees') result = data.trustees();
      else if (pathname === '/audit') result = { entries: store.listAudit(query.limit) };
      else if (pathname === '/hot-update' && hotUpdate) result = hotUpdate.status();
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
    } else if (req.method === 'POST' && /^\/rooms\/\d+\/draw-plan$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'room.draw_plan_set'; result = data.setRoomDrawPlan(target, body);
    } else if (req.method === 'POST' && /^\/rooms\/\d+\/draw-plan\/card$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'room.draw_plan_append'; result = data.editRoomDrawPlan(target, 'append', body);
    } else if (req.method === 'POST' && /^\/rooms\/\d+\/draw-plan\/move$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'room.draw_plan_move'; result = data.editRoomDrawPlan(target, 'move', body);
    } else if (req.method === 'POST' && /^\/rooms\/\d+\/draw-plan\/remove$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'room.draw_plan_remove'; result = data.editRoomDrawPlan(target, 'remove', body);
    } else if (req.method === 'DELETE' && /^\/rooms\/\d+\/draw-plan$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'room.draw_plan_clear'; result = data.clearRoomDrawPlan(target);
    } else if (req.method === 'POST' && /^\/rooms\/\d+\/next-wsk-hand$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'room.next_wsk_hand_set'; result = data.setNextWskHandPlan(target, body);
    } else if (req.method === 'DELETE' && /^\/rooms\/\d+\/next-wsk-hand$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'room.next_wsk_hand_clear'; result = data.clearNextWskHandPlan(target);
    } else if (req.method === 'POST' && /^\/clubs\/\d+\/settings$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'club.settings'; result = data.updateClub(target, body);
    } else if (req.method === 'POST' && /^\/clubs\/\d+\/cards$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'club.cards'; result = data.adjustClubCards(target, body);
    } else if (req.method === 'POST' && pathname === '/messages') {
      action = 'message.create'; result = app.createOperatorMessage(body); target = result.message && result.message.id;
    } else if (req.method === 'POST' && /^\/support\/\d+\/reply$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'support.reply';
      result = app.replySupportMessage(target, body.content, session.actor);
    } else if (req.method === 'POST' && /^\/support\/\d+\/read$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'support.read';
      result = app.supportConversation(target, true);
    } else if (req.method === 'POST' && /^\/support\/\d+\/close$/.test(pathname)) {
      target = pathname.split('/')[2]; action = body.closed === false ? 'support.reopen' : 'support.close';
      result = app.closeSupportConversation(target, body.closed !== false);
    } else if (req.method === 'DELETE' && /^\/messages\/\d+$/.test(pathname)) {
      target = pathname.split('/')[2]; action = 'message.delete'; result = app.deleteOperatorMessage(Number(target));
    } else if (req.method === 'PUT' && pathname === '/notices') {
      target = '大厅'; action = 'notice.update'; result = data.updateNotices(body);
    } else if (req.method === 'PUT' && pathname === '/economy') {
      target = '全局房卡奖励'; action = 'economy.update'; result = data.updateEconomy(body);
    } else if (req.method === 'PUT' && pathname === '/bots') {
      target = '机器人'; action = 'bots.update'; result = data.updateBots(body);
    } else if (req.method === 'PUT' && pathname === '/trustees') {
      target = String(body.uid || ''); action = 'trustee_whitelist.update'; result = data.updateTrustee(body);
    } else if (req.method === 'PUT' && /^\/hot-update\/(android|ios)$/.test(pathname) && hotUpdate) {
      target = pathname.split('/').pop(); action = `hot_update.${body.action || 'rollout'}`;
      result = hotUpdate.updateRollout(target, body);
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
          : action.startsWith('support.') ? { uid: Number(target) }
          : action.startsWith('hot_update.') ? {
            stableAssetVersion: result.stableAssetVersion,
            latestAssetVersion: result.latestAssetVersion,
            percentage: result.rollout && result.rollout.percentage,
            includeUidCount: result.rollout && result.rollout.includeUids.length,
            includeDeviceCount: result.rollout && result.rollout.includeDeviceIds.length,
          }
          : result });
    return json(res, result.message || result, action === 'message.create' ? 201 : 200), true;
  };
  return { handler, auth, data };
};

module.exports = { createAdminHttp };
