/**
 * 自建服务端。目标是让原版客户端（改过地址的 APK）能一路走到大厅。
 *
 * 客户端启动的固定顺序（见客户端 LoadingLayer / LoginLayer / LoginMsg）：
 *   1. GET  /version   回 err_code=0 且 data.action 不是 1/2/3 就不更新，直接进登录
 *   2. GET  /login     回 data.token
 *   3. WS   连上后发 proto 100 CSLogin{token}
 *   4.      syncData 里 **阻塞**等 proto 113 getClubList，它不成功就卡在登录页
 *   5.      SCLogin.roomId 为 0 才进大厅，大于 0 会直接去重连那个房间
 *
 * 除了 100 和 113，其余请求先统一兜一个 `res.error = 0` 的空回包：
 * 客户端对这些只打日志不阻塞，等实现到哪一块再换成真逻辑。
 */
const http = require('http');
const { URL } = require('url');
const { WebSocketServer } = require('ws');
const { pack, unpack, hasRes, protocol } = require('./net');

const PORT = Number(process.env.PORT) || 8080;

/** token -> 玩家。先放内存，够跑通登录 */
const players = new Map();
let nextUid = 100001;

const json = (res, body) => {
  const s = JSON.stringify(body);
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(s) });
  res.end(s);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams;
  console.log(`HTTP ${req.method} ${url.pathname}${url.search}`);

  if (url.pathname === '/version') {
    // action 空着 = 不更新。填 "1" 会让客户端去热更，"2" 是强制下载整包
    return json(res, { err_code: '0', data: {} });
  }

  if (url.pathname === '/login') {
    const uid = nextUid++;
    const token = `t_${q.get('accountType') || 'guest'}_${uid}`;
    players.set(token, { uid, nickname: `玩家${uid}`, sex: 1, cardNum: 100 });
    return json(res, { err_code: 0, data: { token } });
  }

  res.writeHead(404).end();
});

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WS 连上');
  let me = null;

  ws.on('message', (data) => {
    const { proto, msg } = unpack(Buffer.from(data));

    if (proto === 100) {
      me = players.get(msg.token) || { uid: nextUid++, nickname: '游客', sex: 1, cardNum: 0 };
      console.log(`  100 登录 token=${msg.token} -> uid=${me.uid}`);
      return ws.send(pack(100, {
        res: { error: 0, what: '' },
        uid: me.uid,
        nickname: me.nickname,
        avatarUrl: '',
        sex: me.sex,
        roomId: 0, // 大于 0 客户端会直接去重连房间，别乱填
        cardNum: me.cardNum,
        ip: '127.0.0.1',
      }));
    }

    if (proto === 113) {
      console.log('  113 俱乐部列表（空）');
      return ws.send(pack(113, { res: { error: 0, what: '' }, clubs: [], count: 0, total: 0 }));
    }

    if (protocol[proto]) {
      // 还没实现的请求：能带 res 的就回一个成功，客户端不会卡住
      console.log(`  ${proto} 未实现${hasRes(proto) ? '，兜一个成功' : '，无 res 字段，忽略'}`);
      if (hasRes(proto)) ws.send(pack(proto, { res: { error: 0, what: '' } }));
      return;
    }

    console.log(`  ${proto} 未知 proto id`);
  });

  ws.on('close', () => console.log('WS 断开'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务端起在 :${PORT}  （/version /login /ws）`);
});
