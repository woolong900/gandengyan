/**
 * Node 入口。牌局在 GameApp / Table，这里只接 HTTP 和 ws。
 */
const http = require('http');
const { URL } = require('url');
const { WebSocketServer } = require('ws');
const store = require('./store');
const { GameApp } = require('./app');

const PORT = Number(process.env.PORT) || 8080;

let saveTimer = null;
const persistSoon = (data) => {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    flush(data);
  }, 150);
};

const flush = (data) => {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  try {
    store.save(data || app.dump());
  } catch (err) {
    console.error('写存档失败', err);
  }
};

const app = new GameApp({
  persist: (data) => persistSoon(data),
  now: Date.now,
});

const json = (res, body) => {
  const s = JSON.stringify(body);
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(s),
  });
  res.end(s);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`HTTP ${req.method} ${url.pathname}${url.search}`);
  const out = app.http(url.pathname, url.searchParams);
  if (out.status === 404) return res.writeHead(404).end();
  return json(res, out.body);
});

const wss = new WebSocketServer({ server, path: '/ws' });
let nextConn = 1;

wss.on('connection', (ws) => {
  const connId = `n${nextConn++}`;
  console.log('WS 连上');
  app.attach(connId, (buf) => {
    if (ws.readyState === 1) ws.send(buf);
  });
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

const shutdown = (why) => {
  console.log(`收到 ${why}，落盘后退出`);
  try { flush(); } catch (err) { console.error(err); }
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  try { flush(); } catch (flushErr) { console.error(flushErr); }
  process.exit(1);
});
process.on('unhandledRejection', (err) => console.error('unhandledRejection', err));
server.on('error', (err) => console.error('HTTP 监听出错', err));

try {
  app.restore(store.load());
  flush();
  console.log(`从存档恢复 ${app.players.size} 个玩家、${app.tables.size} 个房间  ${store.FILE}`);
} catch (err) {
  console.error('读存档失败，空着启动', err);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务端起在 :${PORT}  （/version /login /ws）`);
});
