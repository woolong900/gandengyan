/**
 * Node 入口。牌局在 GameApp / Table，这里只接 HTTP 和 ws。
 */
const http = require('http');
const { URL } = require('url');
const { WebSocketServer } = require('ws');
const store = require('./store');
const voice = require('./voice');
const { GameApp } = require('./app');

const PORT = Number(process.env.PORT) || 8080;

let saveTimer = null;
let saveQueue = Promise.resolve();
let stopping = false;

const queueSave = (data) => {
  saveQueue = saveQueue
    .then(() => store.saveAsync(data))
    .catch((err) => console.error('写存档失败', err));
  return saveQueue;
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
});

const json = (res, body, status = 200) => {
  const s = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(s),
  });
  res.end(s);
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

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`HTTP ${req.method} ${url.pathname}${url.search}`);

  if (req.method === 'POST' && url.pathname === '/voice') {
    return readBody(req, voice.MAX).then((buf) => {
      const id = voice.put(buf);
      if (!id) return json(res, { err: 'empty' }, 400);
      console.log(`  语音上传 ${id} ${buf.length}B`);
      return json(res, { id });
    }).catch(() => res.writeHead(413).end());
  }
  if (req.method === 'GET' && url.pathname.startsWith('/voice/')) {
    const buf = voice.get(url.pathname.slice('/voice/'.length));
    if (!buf) return res.writeHead(404).end();
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Length': buf.length,
    });
    return res.end(buf);
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

const shutdown = async (why) => {
  if (stopping) return;
  stopping = true;
  console.log(`收到 ${why}，落盘后退出`);
  try { await flush(); } catch (err) { console.error(err); }
  process.exit(0);
};

process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
process.on('SIGINT', () => { void shutdown('SIGINT'); });
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  stopping = true;
  void flush().finally(() => process.exit(1));
});
process.on('unhandledRejection', (err) => console.error('unhandledRejection', err));
server.on('error', (err) => console.error('HTTP 监听出错', err));

try {
  app.restore(store.load());
  void flush();
  console.log(`从存档恢复 ${app.players.size} 个玩家、${app.tables.size} 个房间  ${store.FILE}`);
} catch (err) {
  console.error('读存档失败，空着启动', err);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务端起在 :${PORT}  （/version /login /ws）`);
});
