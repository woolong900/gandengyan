const net = require('net');
const IP2Region = require('ip2region').default;

const normalizeIp = (raw) => {
  let value = String(raw || '').trim().replace(/^"|"$/g, '');
  if (value.startsWith('[')) value = value.slice(1, value.indexOf(']'));
  if (value.startsWith('::ffff:')) value = value.slice(7);
  if (net.isIP(value)) return value;
  const ipv4WithPort = value.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  return ipv4WithPort && net.isIP(ipv4WithPort[1]) ? ipv4WithPort[1] : '';
};

const isPrivateIp = (raw) => {
  const ip = normalizeIp(raw);
  if (!ip) return false;
  if (net.isIP(ip) === 6) {
    const lower = ip.toLowerCase();
    return lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe8')
      || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb');
  }
  const octets = ip.split('.').map(Number);
  return octets[0] === 10 || octets[0] === 127 || octets[0] === 0
    || (octets[0] === 169 && octets[1] === 254)
    || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    || (octets[0] === 192 && octets[1] === 168)
    || (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127);
};

const clientIp = (req) => {
  const remote = normalizeIp(req && req.socket && req.socket.remoteAddress);
  // 仅当请求来自本机反向代理时信任代理头，避免公网直连伪造 IP。
  if (isPrivateIp(remote)) {
    const real = normalizeIp(req && req.headers && req.headers['x-real-ip']);
    if (real) return real;
    const forwarded = String(req && req.headers && req.headers['x-forwarded-for'] || '')
      .split(',').map(normalizeIp).filter(Boolean);
    if (forwarded.length) return forwarded[forwarded.length - 1];
  }
  return remote;
};

const locationFromResponse = (data) => {
  if (!data) return '';
  const country = String(data.country || '').trim();
  const region = String(data.province || data.region || '').trim();
  const city = String(data.city || '').trim();
  const domestic = ['中国', 'China'].includes(country);
  return [...new Set([domestic ? '' : country, region, city].filter(Boolean))].join(' ');
};

class IpGeoService {
  constructor({ searcher } = {}) {
    this.searcher = searcher || new IP2Region();
    this.cache = new Map();
  }

  lookup(rawIp) {
    const ip = normalizeIp(rawIp);
    if (!ip) return Promise.resolve('');
    if (isPrivateIp(ip)) return Promise.resolve('内网');
    if (this.cache.has(ip)) return Promise.resolve(this.cache.get(ip));
    try {
      const location = locationFromResponse(this.searcher.search(ip));
      this.cache.set(ip, location);
      return Promise.resolve(location);
    } catch (error) {
      console.error(`IP 归属地查询失败 ${ip}: ${error.message}`);
      return Promise.resolve('');
    }
  }
}

module.exports = { normalizeIp, isPrivateIp, clientIp, locationFromResponse, IpGeoService };
