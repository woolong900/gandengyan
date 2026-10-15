#!/usr/bin/env node
/** Serve the Web build and proxy the existing game API/WebSocket as same-origin routes. */
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const tls = require('tls');

const root = path.resolve(process.env.QJQP_WEB_ROOT || path.join(__dirname, '..', 'build', 'web-mobile'));
const host = process.env.QJQP_WEB_HOST || '127.0.0.1';
const port = Number(process.env.QJQP_WEB_PORT || 7456);
const upstreamHost = process.env.QJQP_UPSTREAM_HOST || 'gmhiu.com';
const apiPrefix = '/__qjqp_api';
const websocketPath = '/__qjqp_ws';

if (!fs.existsSync(path.join(root, 'index.html'))) {
  throw new Error(`Web 构建不存在，请先运行 npm run web:build：${root}`);
}

const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.png': 'image/png',
  '.ttf': 'font/ttf', '.wasm': 'application/wasm', '.webp': 'image/webp',
};

function proxyHttp(req, res) {
  const upstreamPath = req.url.slice(apiPrefix.length) || '/';
  const headers = { ...req.headers, host: upstreamHost };
  delete headers.origin;
  const upstream = https.request({
    hostname: upstreamHost,
    port: 443,
    method: req.method,
    path: upstreamPath,
    headers,
  }, (response) => {
    res.writeHead(response.statusCode || 502, response.headers);
    response.pipe(res);
  });
  upstream.on('error', (error) => {
    res.writeHead(502, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'upstream_error', message: error.message }));
  });
  req.pipe(upstream);
}

function serveStatic(req, res) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://local').pathname); }
  catch (_) { res.writeHead(400); res.end('Bad request'); return; }
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {
      'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'content-length': stat.size,
      'cache-control': 'no-cache',
    });
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/__health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, webRoot: root, upstream: upstreamHost }));
  } else if (req.url === apiPrefix || req.url.startsWith(`${apiPrefix}/`) || req.url.startsWith(`${apiPrefix}?`)) {
    proxyHttp(req, res);
  } else {
    serveStatic(req, res);
  }
});

server.on('upgrade', (req, client, head) => {
  if (!req.url.startsWith(websocketPath)) { client.destroy(); return; }
  const suffix = req.url.slice(websocketPath.length);
  const upstream = tls.connect(443, upstreamHost, { servername: upstreamHost });
  upstream.once('secureConnect', () => {
    const headers = [];
    for (const [name, value] of Object.entries(req.headers)) {
      if (name === 'host' || name === 'origin') continue;
      if (Array.isArray(value)) for (const item of value) headers.push(`${name}: ${item}`);
      else if (value !== undefined) headers.push(`${name}: ${value}`);
    }
    headers.push(`host: ${upstreamHost}`, `origin: https://${upstreamHost}`);
    upstream.write(`GET /ws${suffix} HTTP/1.1\r\n${headers.join('\r\n')}\r\n\r\n`);
    if (head.length) upstream.write(head);
    client.pipe(upstream).pipe(client);
  });
  const close = () => { client.destroy(); upstream.destroy(); };
  upstream.on('error', close);
  client.on('error', close);
});

server.listen(port, host, () => {
  console.log(`潜江干瞪眼 Web：http://${host}:${port}`);
  console.log(`HTTP 代理：https://${upstreamHost} <- ${apiPrefix}`);
  console.log(`WebSocket 代理：wss://${upstreamHost}/ws <- ${websocketPath}`);
});
