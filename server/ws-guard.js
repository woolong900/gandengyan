/**
 * WebSocket 连接防护：每连接令牌桶限流 + 协议层 ping 清理半开连接。
 * 原厂客户端每秒操作远低于默认额度；超过额度说明是脚本刷包，直接断开。
 */
const WS_MAX_PAYLOAD = Number(process.env.QJQP_WS_MAX_PAYLOAD) || 256 * 1024;
const RATE_PER_SEC = Number(process.env.QJQP_WS_RATE) || 20;
const BURST = Number(process.env.QJQP_WS_BURST) || 60;
const PING_MS = Number(process.env.QJQP_WS_PING_MS) || 30 * 1000;

/** 令牌桶：take() 返回 false 表示超限。 */
class TokenBucket {
  constructor({ rate = RATE_PER_SEC, burst = BURST, now = Date.now } = {}) {
    this.rate = rate;
    this.burst = burst;
    this.now = now;
    this.tokens = burst;
    this.at = now();
  }

  take(cost = 1) {
    const current = this.now();
    this.tokens = Math.min(this.burst, this.tokens + ((current - this.at) / 1000) * this.rate);
    this.at = current;
    if (this.tokens < cost) return false;
    this.tokens -= cost;
    return true;
  }
}

/** 定时 ping；上一轮没有回 pong 的连接直接 terminate，触发 close 让牌桌正确离线。 */
const startHeartbeat = (wss, intervalMs = PING_MS) => {
  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
  });
  const timer = setInterval(() => {
    for (const ws of wss.clients) {
      if (ws.isAlive === false) { ws.terminate(); continue; }
      ws.isAlive = false;
      try { ws.ping(); } catch (_) { ws.terminate(); }
    }
  }, intervalMs);
  timer.unref();
  wss.on('close', () => clearInterval(timer));
  return timer;
};

module.exports = { TokenBucket, startHeartbeat, WS_MAX_PAYLOAD, RATE_PER_SEC, BURST, PING_MS };
