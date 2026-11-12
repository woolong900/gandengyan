/**
 * 分享落地页、战绩分享页与 Universal Link 配置（从 index.js 迁出）。
 */
const { APPLE_APP_IDS, PORT } = require('./config');
const { escapeHtml } = require('./responses');

const publicOrigin = (req) => {
  const configured = String(process.env.QJQP_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (configured) return configured;
  const forwarded = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const protocol = forwarded === 'https' ? 'https' : (req.socket.encrypted ? 'https' : 'http');
  const host = String(req.headers.host || `127.0.0.1:${PORT}`).replace(/[\r\n]/g, '');
  return `${protocol}://${host}`;
};

const pwaWechatResultUrl = (key, value) => {
  const query = new URLSearchParams({ [key]: String(value || '') });
  return `/pwa/?${query}`;
};

const sharePage = (req, roomId) => {
  const room = /^\d{4,10}$/.test(String(roomId || '')) ? String(roomId) : '';
  const roomText = room ? `<p class="room">房间号 <strong>${escapeHtml(room)}</strong></p>` : '';
  const origin = escapeHtml(publicOrigin(req));
  const title = escapeHtml(room ? `潜江干瞪眼 房间号：${room}` : '潜江干瞪眼');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="约上好友一起玩潜江干瞪眼"><meta property="og:image" content="${origin}/share/icon.png"><link rel="icon" type="image/png" href="/share/icon.png"><style>body{margin:0;background:#f7f1e4;color:#4b2d18;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}.card{box-sizing:border-box;max-width:560px;margin:12vh auto;padding:40px 28px;text-align:center;background:#fffaf0;border:1px solid #ead5b5;border-radius:22px;box-shadow:0 14px 40px #6d3e1920}h1{margin:0 0 18px;color:#9b3f20;font-size:32px}.room{font-size:22px}.room strong{font-size:38px;letter-spacing:3px;color:#d2692e}p{line-height:1.7}.tip{color:#765b47}</style></head><body><main class="card"><h1>潜江干瞪眼</h1>${roomText}<p>打开游戏${room ? '，在大厅输入上面的房间号' : ''}即可开始游戏。</p><p class="tip">来自好友的微信分享</p></main></body></html>`;
};

const recordSharePage = (req, record) => {
  const origin = escapeHtml(publicOrigin(req));
  const icon = `${origin}/share/icon.png`;
  if (!record) {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>战绩不存在或已过期</title><meta property="og:image" content="${icon}"><link rel="icon" href="/share/icon.png"></head><body style="font-family:sans-serif;text-align:center;padding:12vh 20px;color:#4b2d18"><h1>战绩不存在或已过期</h1><p>请让好友从游戏里重新分享战绩。</p></body></html>`;
  }
  const room = escapeHtml(record.roomId);
  const title = `潜江干瞪眼 战绩 房间号：${room}`;
  const ratio = Number(record.scoreRatio) > 0 ? Number(record.scoreRatio) : 1;
  const formatScore = (raw) => {
    const score = Number(raw || 0) / ratio;
    return Number.isFinite(score) ? `${Math.round(score * 100) / 100}分` : '0分';
  };
  const players = (record.players || []).slice(0, 20);
  const names = new Map(players.map((player) => [String(player.uid), escapeHtml(player.name)]));
  const rows = players.map((player) => `<li><span>${escapeHtml(player.name)}</span><strong>${formatScore(player.score)}</strong></li>`).join('');
  const hands = (record.details || []).slice(0, 100).map((hand, index) => {
    const scores = (hand.scores || []).map((item) => `<li><span>${names.get(String(item.uid)) || `玩家${escapeHtml(item.uid)}`}</span><strong>${formatScore(item.score)}</strong></li>`).join('');
    return `<section><h2>第 ${index + 1} 局</h2><ul>${scores}</ul></section>`;
  }).join('');
  const time = Number(record.time);
  const date = Number.isFinite(time) ? new Date(time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }) : '';
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="潜江干瞪眼房间战绩，查看玩家积分"><meta property="og:image" content="${icon}"><link rel="icon" href="/share/icon.png"><style>body{margin:0;background:#f7f1e4;color:#4b2d18;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}.card{box-sizing:border-box;max-width:560px;margin:30px auto;padding:28px;background:#fffaf0;border:1px solid #ead5b5;border-radius:20px}h1{color:#9b3f20}h2{font-size:19px;color:#9b3f20;margin:25px 0 9px}p{color:#765b47}ul{padding:0;margin:0;list-style:none}li{display:flex;justify-content:space-between;border-bottom:1px solid #ead5b5;padding:10px 0}strong{color:#b04e25}</style></head><body><main class="card"><h1>潜江干瞪眼战绩</h1><p>房间号：${room}　${escapeHtml(date)}<br>已打 ${Number(record.gameCount) || 0}/${Number(record.totalCount) || 0} 局</p><h2>总积分</h2><ul>${rows}</ul>${hands}</main></body></html>`;
};

const aasa = () => ({
  applinks: {
    apps: [],
    details: APPLE_APP_IDS.map((appID) => ({
      appID,
      paths: ['/wechat/*'],
    })),
  },
});

module.exports = { publicOrigin, pwaWechatResultUrl, sharePage, recordSharePage, aasa };
