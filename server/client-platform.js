'use strict';

const { clientIp } = require('./ip-geo');

const platformFromVersion = (query) => {
  const osType = String(query.get('os_type') || '').toLowerCase();
  const deviceName = String(query.get('device_name') || '').toLowerCase();
  if (osType.includes('android') && deviceName.includes('android')) return 'android';
  if (osType.includes('ios') && deviceName.includes('ios')) return 'ios';
  return 'unknown';
};

const platformFromPlayer = (player, ip, now = Date.now(), ttl = 24 * 60 * 60 * 1000) => {
  if (!player || !['android', 'ios'].includes(player.lastClientPlatform)) return 'unknown';
  const seenAt = Number(player.lastClientPlatformAt || 0);
  if (!seenAt || now - seenAt > ttl) return 'unknown';
  return player.lastClientPlatform;
};

class ClientPlatformTracker {
  constructor({ ttl = 24 * 60 * 60 * 1000, now = Date.now } = {}) {
    this.ttl = ttl;
    this.now = now;
    this.recent = new Map();
  }

  key(uid, ip) {
    return `${Number(uid) || 0}|${String(ip || '')}`;
  }

  prune(now = this.now()) {
    for (const [key, item] of this.recent) {
      if (!item || now - item.seenAt > this.ttl) this.recent.delete(key);
    }
  }

  remember(req, query) {
    if (query.get('probe') === '1') return null;
    const uid = Number(query.get('uid'));
    const platform = platformFromVersion(query);
    const ip = clientIp(req);
    if (!Number.isSafeInteger(uid) || uid <= 0 || platform === 'unknown' || !ip) return null;
    const now = this.now();
    this.prune(now);
    const observed = { uid, ip, platform, seenAt: now };
    this.recent.set(this.key(uid, ip), observed);
    return observed;
  }

  resolve(uid, ip) {
    const item = this.recent.get(this.key(uid, ip));
    if (!item || this.now() - item.seenAt > this.ttl) return 'unknown';
    return item.platform;
  }
}

module.exports = { ClientPlatformTracker, platformFromVersion, platformFromPlayer };
