/**
 * HTTP 响应与请求体工具（从 index.js 迁出）。
 */
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

const redirect = (res, location) => {
  res.writeHead(302, {
    Location: location,
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
  });
  res.end();
};

const logUrl = (url) => {
  const query = new URLSearchParams(url.searchParams);
  for (const key of ['token', 'code', 'migrationTicket', 'ticket', 'wechat_ticket', 'state', 'deviceId', 'device_id', 'rollout_key', 'access_token', 'authorization']) {
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

module.exports = { json, html, redirect, escapeHtml, readBody, logUrl };
