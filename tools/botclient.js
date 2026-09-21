/**
 * 一个会打牌的假客户端。
 *
 * 走的是和真客户端一样的流程：HTTP /login 拿 token -> WS 登录(100) -> 进房(202)
 * -> 入座(200 gameready) -> 收 999 推送自动摸打。
 *
 * 打法很笨：手里的癞子优先甩出去，其余摸什么打什么；能胡就胡，能杠就杠，能碰就碰。
 * 目的是把服务端的各条分支都走一遍，不是打得好。
 */
const http = require('http');
const WebSocket = require('ws');
const { protocol } = require('../server/proto/protocol');

/**
 * 和 `server/net.js` 是同一套帧格式，但方向反过来：
 * 我们发的是 cs、收的是 sc，直接复用服务端那两个函数会编解码错类型。
 */
const HEAD = 12;

const pack = (proto, msg) => {
  const cs = protocol[proto] && protocol[proto].cs;
  const payload = cs && msg ? Buffer.from(cs.encode(cs.create(msg)).finish()) : Buffer.alloc(0);
  const out = Buffer.alloc(HEAD + payload.length);
  out.writeUInt32BE(proto, 0);
  out.writeUInt32BE(0, 4);
  out.writeUInt32BE(out.length, 8);
  payload.copy(out, HEAD);
  return out;
};

const unpack = (buf) => {
  const proto = buf.readUInt32BE(0);
  const len = buf.readUInt32BE(8);
  const sc = protocol[proto] && protocol[proto].sc;
  return { proto, msg: sc ? sc.decode(buf.subarray(HEAD, len || buf.length)) : null };
};

const gameJson = (msghead, data) => pack(200, {
  json: JSON.stringify({ msghead, msgdata: JSON.stringify(data) }),
});

/** 先要个 token。accountType 随便填，服务端不校验 */
const login = (base) => new Promise((resolve, reject) => {
  http.get(`${base}/login?appName=qjqp&accountType=bot`, (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      try {
        resolve(JSON.parse(body).data.token);
      } catch (e) {
        reject(new Error(`/login 回包看不懂: ${body}`));
      }
    });
  }).on('error', reject);
});

/**
 * @param opts.room     房号；传 'new' 就自己建一个
 * @param opts.site     座位号
 * @param opts.base     服务端地址
 * @param opts.create   room==='new' 时的建房参数 { gameType, num, param1, param2 }
 * @param opts.delay    每步操作的停顿，给模拟器留出画面时间
 * @param opts.rounds   连打几局，打完自动再点准备
 * @param opts.onRoom   建好房后回调房号
 * @param opts.onEnd    一局结束回调
 * @param opts.log      日志输出
 */
function startBot(opts) {
  const {
    room, site = 2, base = 'http://127.0.0.1:8899',
    create, delay = 700, rounds = 1, onRoom, onEnd, log = console.log,
  } = opts;

  const me = {
    uid: 0, hand: [], laizi: 0, pizi: 0, playing: false,
    roomId: room, drawn: null, timer: null, played: 0,
  };
  const later = (fn) => setTimeout(fn, delay);

  return new Promise((resolve, reject) => {
    Promise.resolve(opts.token || login(base)).then((token) => {
      const ws = new WebSocket(`${base.replace('http', 'ws')}/ws`);
      const tag = () => `[${me.uid || '?'}]`;

      const send = (msghead, data = {}) => {
        log(`${tag()} -> ${msghead} ${JSON.stringify(data)}`);
        ws.send(gameJson(msghead, data));
      };

      /** 癞子一律甩出去，一张不留；没有癞子才摸什么打什么 */
      const pickDiscard = (drawn) => {
        if (me.laizi > 0) {
          if (drawn != null && drawn === me.laizi) return drawn;
          const held = me.hand.find((c) => c === me.laizi);
          if (held != null) return held;
        }
        if (drawn != null) return drawn;
        return me.hand[0];
      };

      /**
       * 排一手出牌，但先不发。
       *
       * 摸完牌如果能暗杠或自摸，服务端紧跟着还会推一条 game_operator；
       * 真客户端这时是亮出按钮等人点，所以这边也得先按住，
       * 等确认没有可选操作（或者选了「过」）再打出去。
       */
      const scheduleDiscard = (drawn) => {
        me.drawn = drawn;
        clearTimeout(me.timer);
        me.timer = setTimeout(() => {
          const card = pickDiscard(drawn);
          if (card == null) return;
          if (card !== drawn) {
            me.hand.splice(me.hand.indexOf(card), 1);
            if (drawn != null) me.hand.push(drawn);
          }
          me.hand.sort((a, b) => a - b);
          me.drawn = null;
          send('gamestep', { card });
        }, delay + 20);
      };

      const play = (msghead, body) => {
        if (msghead === 'game_begin' || msghead === 'game_end') {
          const mine = (body.info || []).find((it) => it.uid === me.uid);
          if (!mine) return;
          me.laizi = body.lz;
          me.pizi = body.lzp;
          me.hand = [...(mine.card.hand_card || [])];
          me.playing = msghead === 'game_begin';
          if (msghead === 'game_end') {
            me.played += 1;
            log(`${tag()} 第 ${me.played} 局结束，${mine.score >= 0 ? '+' : ''}${mine.score}，总分 ${mine.total}`);
            if (onEnd) onEnd(body);
            // 下一局要所有人重新点准备，和真客户端上那个「继续」按钮一样
            if (me.played < rounds) later(() => send('gameready', { site }));
            return;
          }
          // 庄家开局就有 14 张，得先打一张
          if (mine.card.draw_card > 0) scheduleDiscard(mine.card.draw_card);
          return;
        }

        if (!me.playing) return;

        if (msghead === 'game_draw' && body.uid === me.uid) return scheduleDiscard(body.card);

        // 碰完不补牌，直接轮到自己出
        if (msghead === 'game_touch' && body.uid === me.uid) {
          me.hand.splice(me.hand.indexOf(body.card), 1);
          me.hand.splice(me.hand.indexOf(body.card), 1);
          return scheduleDiscard(null);
        }

        // 杠完服务端会补一张，摸到再打，这里只把手牌扣掉
        if ((msghead === 'game_gang' || msghead === 'game_pzg') && body.uid === me.uid) {
          const take = body.card === me.pizi ? 3 : msghead === 'game_pzg' ? 3 : 4;
          for (let i = 0; i < take; i++) {
            const at = me.hand.indexOf(body.card);
            if (at >= 0) me.hand.splice(at, 1);
          }
          return;
        }

        if (msghead === 'game_bye') {
          log(`${tag()} 总结算 ${JSON.stringify(body.info && body.info.map((it) => ({
            uid: it.uid, score: it.score, zm: it.zm, jg: it.jg, dg: it.dg,
          })))}`);
          return;
        }

        // 选了「过」之后才轮到自己出牌
        if (msghead === 'game_pass' && body.uid === me.uid && me.drawn !== undefined) {
          return scheduleDiscard(me.drawn);
        }

        // 报清一色不换手牌，报完还是轮到自己出
        if (msghead === 'game_noticeqys' && body.uid === me.uid) {
          return scheduleDiscard(me.drawn);
        }

        if (msghead === 'game_operator') {
          clearTimeout(me.timer); // 有得选就先别急着出牌
          if (body.hu > 0) return later(() => send('gamehu'));
          // 报清一色没代价，能报就报
          if (body.bright_qys) return later(() => send('gamenotice', { type: 0 }));
          if (body.gang && body.gang.length > 0) {
            return later(() => send('gamegang', { card: body.gang[0] }));
          }
          if (body.touch > 0) return later(() => send('gamepeng'));
          return later(() => send('gameguo'));
        }
      };

      ws.on('open', () => ws.send(pack(100, { token })));

      ws.on('message', (data) => {
        const { proto, msg } = unpack(Buffer.from(data));

        if (proto === 100) {
          me.uid = protocol[100].sc.toObject(msg, { longs: Number }).uid;
          log(`${tag()} 已登录`);
          if (me.roomId === 'new') return ws.send(pack(201, create));
          return ws.send(pack(202, { roomId: me.roomId }));
        }

        if (proto === 201) {
          const sc = protocol[201].sc.toObject(msg, { longs: Number, defaults: true });
          me.roomId = sc.roomId;
          log(`${tag()} 建好房间 ${me.roomId}`);
          if (onRoom) onRoom(me.roomId);
          return ws.send(pack(202, { roomId: me.roomId }));
        }

        if (proto === 202) {
          const sc = protocol[202].sc.toObject(msg, { defaults: true });
          // 和客户端一个口径：<0 是网络错、>0 是业务错、0 才是成功
          if (sc.res && sc.res.error > 0) {
            reject(new Error(`进房失败: ${sc.res.what}`));
            return ws.close();
          }
          log(`${tag()} 进房 ${me.roomId}，坐 ${site} 号位`);
          return ws.send(gameJson('gameready', { site }));
        }

        if (proto === 99 || proto === 200) return; // 心跳和 200 的空回包没什么可看的

        if (proto === 999) {
          const { msghead, msgdata } = JSON.parse(protocol[999].sc.toObject(msg).json);
          const body = msgdata ? JSON.parse(msgdata) : {};
          if (msghead === 'roominfo' || msghead === 'lineperson' || msghead === 'trustee') return;
          if (msghead === 'chatroom' || msghead === 'nodissmissroom') return;
          if (msghead === 'exitroom') {
            log(`${tag()} 房间散了`);
            return;
          }
          // 有人申请解散就立刻同意，别让真玩家干等
          if (msghead === 'dissmissroom') {
            const agreed = (body.agree || []).map(Number);
            if (!agreed.includes(me.uid)) {
              log(`${tag()} 收到解散申请，自动同意`);
              later(() => send('dissmissroom', {}));
            }
            return;
          }
          return play(msghead, body);
        }
      });

      // 客户端 20 秒收不到心跳回包就重连，我们也照着发
      const beat = setInterval(() => ws.readyState === 1 && ws.send(pack(99, {})), 3000);

      ws.on('close', () => {
        clearInterval(beat);
        resolve();
      });
      ws.on('error', reject);
    }).catch(reject);
  });
}

module.exports = { startBot };
