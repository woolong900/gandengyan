/**
 * 静态资源：PWA、下载页、协议页、分享图标（从 index.js 迁出）。
 */
const fs = require('fs');
const path = require('path');

const SERVER_DIR = path.join(__dirname, '..');

const SHARE_ICON = fs.readFileSync(path.join(SERVER_DIR, 'public', 'share-icon.png'));

const LEGAL_PAGES = new Map([
  ['/legal/user-agreement', fs.readFileSync(path.join(SERVER_DIR, 'public', 'legal', 'user-agreement.html'))],
  ['/legal/privacy-policy', fs.readFileSync(path.join(SERVER_DIR, 'public', 'legal', 'privacy-policy.html'))],
]);

const DOWNLOAD_ROOT = path.join(SERVER_DIR, 'public', 'download');

const PWA_ROOT = path.resolve(process.env.QJQP_PWA_ROOT || path.join(SERVER_DIR, '..', 'pwa'));

const PWA_TYPES = {
  '.bin': 'application/octet-stream',
  '.cconb': 'application/octet-stream',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.m4a': 'audio/mp4',
  '.manifest': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.wav': 'audio/wav',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.wasm': 'application/wasm',
};

const DOWNLOAD_ASSETS = new Map([
  ['/', { filename: 'home.html', type: 'text/html; charset=utf-8', cache: 'public, max-age=300' }],
  ['/download', { filename: 'index.html', type: 'text/html; charset=utf-8', cache: 'public, max-age=300' }],
  ['/download/', { filename: 'index.html', type: 'text/html; charset=utf-8', cache: 'public, max-age=300' }],
  ['/download/app.css', { filename: 'app.css', type: 'text/css; charset=utf-8', cache: 'public, max-age=3600' }],
  ['/download/app.js', { filename: 'app.js', type: 'text/javascript; charset=utf-8', cache: 'public, max-age=3600' }],
  ['/home.css', { filename: 'home.css', type: 'text/css; charset=utf-8', cache: 'public, max-age=3600' }],
  ['/download/app-icon.webp', { filename: 'app-icon.webp', type: 'image/webp', cache: 'public, max-age=86400' }],
  ['/download/app-icon-v2.webp', { filename: 'app-icon-v2.webp', type: 'image/webp', cache: 'public, max-age=86400' }],
  ['/download/game-logo.webp', { filename: 'game-logo.webp', type: 'image/webp', cache: 'public, max-age=86400' }],
]);

for (const asset of DOWNLOAD_ASSETS.values()) {
  if (!asset.body) asset.body = fs.readFileSync(path.join(DOWNLOAD_ROOT, asset.filename));
}

const servePwa = async (req, res, url) => {
  if (url.pathname === '/pwa') {
    res.writeHead(308, { Location: '/pwa/', 'Cache-Control': 'no-store' });
    return res.end();
  }
  let relative;
  try { relative = decodeURIComponent(url.pathname.slice('/pwa/'.length)); }
  catch (_) { return res.writeHead(400).end(); }
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  const filename = path.resolve(PWA_ROOT, relative);
  if (filename !== PWA_ROOT && !filename.startsWith(`${PWA_ROOT}${path.sep}`)) {
    return res.writeHead(403).end();
  }

  let stat;
  try { stat = await fs.promises.stat(filename); }
  catch (_) { return res.writeHead(404).end(); }
  if (!stat.isFile()) return res.writeHead(404).end();

  const basename = path.basename(filename);
  const headers = {
    'Content-Type': PWA_TYPES[path.extname(filename).toLowerCase()] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': /^(index\.html|sw\.js|pwa-register\.js|web-config\.js|manifest\.webmanifest)$/.test(basename)
      ? 'no-cache' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'Accept-Ranges': 'bytes',
  };
  if (basename === 'sw.js') headers['Service-Worker-Allowed'] = '/pwa/';

  const range = String(req.headers.range || '').match(/^bytes=(\d*)-(\d*)$/);
  if (range && stat.size) {
    const start = range[1] ? Number(range[1]) : Math.max(0, stat.size - Number(range[2] || 0));
    const end = range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= stat.size) {
      res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
      return res.end();
    }
    headers['Content-Length'] = end - start + 1;
    headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    res.writeHead(206, headers);
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(filename, { start, end }).pipe(res);
  }

  res.writeHead(200, headers);
  return req.method === 'HEAD' ? res.end() : fs.createReadStream(filename).pipe(res);
};

module.exports = { SHARE_ICON, LEGAL_PAGES, DOWNLOAD_ROOT, PWA_ROOT, PWA_TYPES, DOWNLOAD_ASSETS, servePwa };
