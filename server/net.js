/**
 * socket 的帧格式，抄自客户端 `Network/NetData.js`：
 *
 *   [0,4)   uint32 BE  proto id
 *   [4,8)   uint32 BE  time（客户端一律发 0，服务端也不用管）
 *   [8,12)  uint32 BE  整帧长度 = 12 + 载荷
 *   [12,)              protobuf 载荷
 *
 * 客户端收到后会拿第三个字段和实际长度对账，对不上只打 error 不断开，
 * 但别赌这个——长度写错了后面全乱。
 */
const { protocol } = require('./proto/protocol');

const HEAD = 12;
const MAX_FRAME = 4 * 1024 * 1024;

function unpack(buf) {
  if (!buf || buf.length < HEAD) throw new Error('协议帧头不完整');
  if (buf.length > MAX_FRAME) throw new Error('协议帧过大');
  const proto = buf.readUInt32BE(0);
  const len = buf.readUInt32BE(8);
  if (len && (len < HEAD || len > buf.length)) throw new Error('协议帧长度无效');
  const payload = buf.subarray(HEAD, len || buf.length);
  const def = protocol[proto];
  // cs 为 null 表示这个 id 只有服务端往下推（比如 99 心跳）
  const msg = def && def.cs ? def.cs.decode(payload) : null;
  return { proto, msg };
}

function pack(proto, msg) {
  const def = protocol[proto];
  const payload = def && def.sc && msg ? Buffer.from(def.sc.encode(def.sc.create(msg)).finish()) : Buffer.alloc(0);
  const out = Buffer.alloc(HEAD + payload.length);
  out.writeUInt32BE(proto, 0);
  out.writeUInt32BE(0, 4);
  out.writeUInt32BE(out.length, 8);
  payload.copy(out, HEAD);
  return out;
}

/** 这个 id 的回包带不带 `res` 字段——用来给还没实现的请求兜一个「成功」 */
const hasRes = (proto) => {
  const sc = protocol[proto] && protocol[proto].sc;
  return !!(sc && 'res' in sc.prototype);
};

module.exports = { pack, unpack, hasRes, protocol };
