const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const emptyVersion = () => ({ err_code: '0', data: {} });

const compareVersions = (left, right) => {
  const a = String(left || '').split('.').map((part) => Number(part) || 0);
  const b = String(right || '').split('.').map((part) => Number(part) || 0);
  for (let index = 0; index < Math.max(a.length, b.length); index++) {
    const delta = (a[index] || 0) - (b[index] || 0);
    if (delta) return delta < 0 ? -1 : 1;
  }
  return 0;
};

const platformOf = (osType) => {
  const value = String(osType || '').toLowerCase();
  if (/(^|_)android(_|$)/.test(value)) return 'android';
  if (/(^|_)ios(_|$)/.test(value)) return 'ios';
  return '';
};

const assetVersion = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const stringList = (value, { numeric = false, limit = 100 } = {}) => {
  if (!Array.isArray(value)) return [];
  const result = [];
  const seen = new Set();
  for (const item of value) {
    const text = String(item == null ? '' : item).trim();
    if (!text || text.length > 128 || (numeric && !/^\d{1,20}$/.test(text)) || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
    if (result.length >= limit) break;
  }
  return result;
};

const rolloutConfig = (item) => {
  const source = item && item.rollout && typeof item.rollout === 'object' ? item.rollout : {};
  const percentage = Math.max(0, Math.min(100, Number(source.percentage) || 0));
  return {
    enabled: source.enabled === true,
    percentage,
    includeUids: stringList(source.includeUids, { numeric: true }),
    includeDeviceIds: stringList(source.includeDeviceIds),
    excludeUids: stringList(source.excludeUids, { numeric: true }),
    excludeDeviceIds: stringList(source.excludeDeviceIds),
    salt: String(source.salt || 'qjqp-rollout-v1').slice(0, 128),
  };
};

const rolloutBucket = (salt, platform, key) => crypto.createHash('sha256')
  .update(`${salt}|${platform}|${key}`)
  .digest().readUInt32BE(0) % 10000;

const mimeOf = (filename) => {
  if (filename.endsWith('.manifest') || filename.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filename.endsWith('.plist')) return 'application/xml; charset=utf-8';
  if (filename.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  if (filename.endsWith('.mp3')) return 'audio/mpeg';
  if (filename.endsWith('.apk')) return 'application/vnd.android.package-archive';
  if (filename.endsWith('.ipa')) return 'application/octet-stream';
  return 'application/octet-stream';
};

class HotUpdateService {
  constructor({ root, configFile, deviceFile } = {}) {
    this.root = path.resolve(root || path.join(process.cwd(), 'hot-update'));
    this.configFile = path.resolve(configFile || `${this.root}.json`);
    this.deviceFile = path.resolve(deviceFile || path.join(path.dirname(this.configFile), 'hot-update-devices.json'));
    this.config = { schemaVersion: 1, platforms: {} };
    this.configMtimeMs = -1;
    this.devices = new Map();
    this.deviceSaveTimer = null;
    this.loadDevices();
  }

  loadDevices() {
    let records = [];
    try {
      const parsed = JSON.parse(fs.readFileSync(this.deviceFile, 'utf8'));
      if (parsed && Array.isArray(parsed.devices)) records = parsed.devices;
    } catch {}
    const cutoff = Date.now() - 180 * 24 * 60 * 60 * 1000;
    for (const record of records) {
      if (!record || typeof record.id !== 'string' || Number(record.lastSeenAt || 0) < cutoff) continue;
      this.devices.set(record.id, record);
    }
  }

  saveDevicesSoon() {
    if (this.deviceSaveTimer) return;
    this.deviceSaveTimer = setTimeout(() => {
      this.deviceSaveTimer = null;
      const temporary = `${this.deviceFile}.${process.pid}.${Date.now()}.tmp`;
      try {
        fs.mkdirSync(path.dirname(this.deviceFile), { recursive: true });
        const devices = [...this.devices.values()].sort((a, b) => b.lastSeenAt - a.lastSeenAt).slice(0, 5000);
        fs.writeFileSync(temporary, `${JSON.stringify({ schemaVersion: 1, devices }, null, 2)}\n`, { mode: 0o600 });
        fs.renameSync(temporary, this.deviceFile);
      } catch (error) {
        console.error(`热更新设备记录保存失败：${error.message}`);
        try { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); } catch {}
      }
    }, 500);
    this.deviceSaveTimer.unref?.();
  }

  observeClient(platform, query, request, targetAssetVersion, action) {
    // 运维发布检查使用 probe=1。它仍走完整的版本选择逻辑，但不应被误算为
    // 一台真实设备，也不应污染灰度设备列表。
    if (query.get('probe') === '1') return;
    const supplied = String(query.get('rollout_key') || query.get('device_id') || '').trim().slice(0, 128);
    const forwarded = String(request.forwardedFor || '').split(',')[0].trim();
    const fallback = `${forwarded || request.remoteAddress || ''}|${request.userAgent || ''}`;
    const id = supplied || `legacy-${crypto.createHash('sha256').update(fallback).digest('hex').slice(0, 24)}`;
    const previous = this.devices.get(id) || {};
    const record = {
      id,
      legacy: !supplied,
      uid: /^\d{1,20}$/.test(String(query.get('uid') || '')) ? String(query.get('uid')) : '',
      platform,
      system: String(query.get('device_name') || '').trim().slice(0, 80),
      packageVersion: String(query.get('package_version') || '').trim().slice(0, 32),
      assetVersion: assetVersion(query.get('assert_version')),
      targetAssetVersion: assetVersion(targetAssetVersion),
      lastAction: action,
      lastSeenAt: Date.now(),
      firstSeenAt: Number(previous.firstSeenAt || Date.now()),
      checks: Number(previous.checks || 0) + 1,
    };
    this.devices.set(id, record);
    if (this.devices.size > 5500) {
      for (const stale of [...this.devices.values()].sort((a, b) => a.lastSeenAt - b.lastSeenAt).slice(0, 500)) {
        this.devices.delete(stale.id);
      }
    }
    this.saveDevicesSoon();
  }

  deviceStatus() {
    const config = this.loadConfig();
    return [...this.devices.values()].sort((a, b) => b.lastSeenAt - a.lastSeenAt).slice(0, 500).map((record) => {
      const rollout = rolloutConfig(config.platforms[record.platform] || {});
      return { ...record, included: rollout.includeDeviceIds.includes(record.id),
        excluded: rollout.excludeDeviceIds.includes(record.id) };
    });
  }

  loadConfig() {
    let stat;
    try { stat = fs.statSync(this.configFile); } catch { return this.config; }
    if (stat.mtimeMs === this.configMtimeMs) return this.config;
    try {
      const parsed = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      if (!parsed || parsed.schemaVersion !== 1 || !parsed.platforms || typeof parsed.platforms !== 'object') {
        throw new Error('格式无效');
      }
      this.config = parsed;
      this.configMtimeMs = stat.mtimeMs;
    } catch (error) {
      console.error(`热更新配置读取失败：${error.message}`);
    }
    return this.config;
  }

  availableVersions(platform) {
    const directory = path.join(this.root, platform);
    try {
      return fs.readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
        .map((entry) => Number(entry.name))
        .filter((version) => Number.isSafeInteger(version) && version > 0)
        .sort((left, right) => right - left);
    } catch { return []; }
  }

  rolloutTarget(platform, item, query, request = {}) {
    const latest = assetVersion(item.latestAssetVersion);
    const stable = Math.min(latest, assetVersion(item.stableAssetVersion, latest));
    // 旧配置没有 rollout 字段时保持原来的全量行为，避免升级服务端后意外停更。
    if (!item.rollout || item.rollout.enabled !== true) return latest;
    const rollout = rolloutConfig(item);
    const uid = String(query.get('uid') || '').trim();
    const deviceId = String(query.get('rollout_key') || query.get('device_id') || '').trim().slice(0, 128);
    if ((uid && rollout.excludeUids.includes(uid))
      || (deviceId && rollout.excludeDeviceIds.includes(deviceId))) return stable;
    if ((uid && rollout.includeUids.includes(uid))
      || (deviceId && rollout.includeDeviceIds.includes(deviceId))) return latest;
    if (rollout.percentage <= 0) return stable;
    if (rollout.percentage >= 100) return latest;
    // 旧客户端还没有 rollout_key；用来源地址与 UA 保证同一设备尽量稳定命中。
    const forwarded = String(request.forwardedFor || '').split(',')[0].trim();
    const fallback = `${forwarded || request.remoteAddress || ''}|${request.userAgent || ''}`;
    const key = deviceId ? `device:${deviceId}` : (uid ? `uid:${uid}` : `legacy:${fallback}`);
    return rolloutBucket(rollout.salt, platform, key) < Math.round(rollout.percentage * 100)
      ? latest : stable;
  }

  status() {
    const config = this.loadConfig();
    return {
      publishedAt: Number(config.publishedAt || 0),
      platforms: Object.fromEntries(['android', 'ios'].map((platform) => {
        const item = config.platforms[platform] || {};
        const latest = assetVersion(item.latestAssetVersion);
        return [platform, {
          configured: !!config.platforms[platform],
          enabled: item.enabled !== false,
          latestAssetVersion: latest,
          stableAssetVersion: Math.min(latest, assetVersion(item.stableAssetVersion, latest)),
          rollout: rolloutConfig(item),
          availableVersions: this.availableVersions(platform),
        }];
      })),
      devices: this.deviceStatus(),
    };
  }

  updateRollout(platform, input = {}) {
    if (!['android', 'ios'].includes(platform)) return { error: '平台无效', status: 404 };
    if (input.action && !['save', 'promote', 'pause', 'include-device', 'remove-device'].includes(input.action)) {
      return { error: '灰度操作无效', status: 400 };
    }
    const config = this.loadConfig();
    const current = config.platforms[platform];
    if (!current) return { error: '该平台尚未发布热更新资源', status: 404 };
    const available = this.availableVersions(platform);
    let latest = assetVersion(input.latestAssetVersion, assetVersion(current.latestAssetVersion));
    let stable = assetVersion(input.stableAssetVersion,
      assetVersion(current.stableAssetVersion, assetVersion(current.latestAssetVersion)));
    const previousRollout = rolloutConfig(current);
    let rollout;
    if (input.action === 'promote') {
      stable = latest;
      rollout = { ...previousRollout, enabled: false, percentage: 0,
        includeUids: [], includeDeviceIds: [], excludeUids: [], excludeDeviceIds: [] };
    } else if (input.action === 'pause') {
      rollout = { ...previousRollout, enabled: true, percentage: 0,
        includeUids: [], includeDeviceIds: [] };
    } else if (input.action === 'include-device' || input.action === 'remove-device') {
      const deviceId = String(input.deviceId || '').trim();
      if (!deviceId || deviceId.length > 128) return { error: '设备灰度 ID 无效', status: 400 };
      const included = new Set(previousRollout.includeDeviceIds);
      if (input.action === 'include-device') included.add(deviceId); else included.delete(deviceId);
      rollout = { ...previousRollout, enabled: true, includeDeviceIds: [...included].slice(0, 100) };
    } else {
      rollout = {
        enabled: input.rolloutEnabled !== false,
        percentage: Math.max(0, Math.min(100, Number(input.percentage) || 0)),
        includeUids: stringList(input.includeUids, { numeric: true }),
        includeDeviceIds: stringList(input.includeDeviceIds),
        excludeUids: stringList(input.excludeUids, { numeric: true }),
        excludeDeviceIds: stringList(input.excludeDeviceIds),
        salt: previousRollout.salt || crypto.randomBytes(12).toString('hex'),
      };
      if (!rollout.enabled) {
        stable = latest;
        rollout.percentage = 0;
        rollout.includeUids = [];
        rollout.includeDeviceIds = [];
      }
    }
    if (!Number.isSafeInteger(latest) || latest < 1 || !Number.isSafeInteger(stable) || stable < 1) {
      return { error: '稳定版本和候选版本必须是正整数', status: 400 };
    }
    if (stable > latest) return { error: '稳定版本不能高于候选版本', status: 400 };
    if (available.length && (!available.includes(latest) || !available.includes(stable))) {
      return { error: '所选版本的资源目录不存在，请先上传资源', status: 400 };
    }
    const next = {
      ...config,
      schemaVersion: 1,
      publishedAt: Date.now(),
      platforms: {
        ...config.platforms,
        [platform]: { ...current,
          enabled: typeof input.enabled === 'boolean' ? input.enabled : current.enabled !== false,
          latestAssetVersion: latest, stableAssetVersion: stable, rollout },
      },
    };
    fs.mkdirSync(path.dirname(this.configFile), { recursive: true });
    const temporary = `${this.configFile}.${process.pid}.${Date.now()}.tmp`;
    try {
      fs.writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 });
      fs.renameSync(temporary, this.configFile);
    } finally {
      try { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); } catch {}
    }
    this.config = next;
    try { this.configMtimeMs = fs.statSync(this.configFile).mtimeMs; } catch { this.configMtimeMs = -1; }
    return this.status().platforms[platform];
  }

  versionBody(query, publicBaseUrl, request = {}) {
    const platform = platformOf(query.get('os_type'));
    if (!platform) return emptyVersion();
    const item = this.loadConfig().platforms[platform];
    if (!item || item.enabled === false) return emptyVersion();

    const packageVersion = String(query.get('package_version') || '0');
    if (item.minimumPackageVersion && compareVersions(packageVersion, item.minimumPackageVersion) < 0
      && item.packageUrl) {
      this.observeClient(platform, query, request, item.latestAssetVersion, 'package');
      return {
        err_code: '0',
        data: {
          action: '2',
          package_action: String(item.packageAction || (platform === 'android' ? 2 : 1)),
          package_url: String(item.packageUrl),
          package_desc: String(item.packageDescription || '发现新版本，请先升级客户端。'),
          package_name: String(item.packageName || ''),
        },
      };
    }

    const latest = this.rolloutTarget(platform, item, query, request);
    const current = Number(query.get('assert_version') || 0);
    this.observeClient(platform, query, request, latest, latest > current ? 'asset' : 'none');
    if (!Number.isSafeInteger(latest) || latest <= current) return emptyVersion();
    const base = String(item.assetBaseUrl || `${String(publicBaseUrl).replace(/\/$/, '')}/hot-update/${platform}/`);
    return {
      err_code: '0',
      data: {
        action: '1',
        assert_version: String(latest),
        assert_url: base.endsWith('/') ? base : `${base}/`,
      },
    };
  }

  serve(req, res, url) {
    if (!url.pathname.startsWith('/hot-update/')) return false;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end();
      return true;
    }
    let relative;
    try { relative = decodeURIComponent(url.pathname.slice('/hot-update/'.length)); }
    catch { res.writeHead(400).end(); return true; }
    if (!relative || relative.includes('\\') || relative.includes('\0')
      || relative.split('/').some((part) => !part || part === '.' || part === '..')) {
      res.writeHead(404).end();
      return true;
    }
    const filename = path.resolve(this.root, relative);
    if (!filename.startsWith(`${this.root}${path.sep}`)) { res.writeHead(404).end(); return true; }
    let stat;
    try { stat = fs.statSync(filename); } catch { res.writeHead(404).end(); return true; }
    if (!stat.isFile()) { res.writeHead(404).end(); return true; }

    let start = 0;
    let end = stat.size - 1;
    let status = 200;
    const range = String(req.headers.range || '').match(/^bytes=(\d*)-(\d*)$/);
    if (range) {
      if (range[1]) start = Number(range[1]);
      if (range[2]) end = Number(range[2]);
      if (!range[1] && range[2]) start = Math.max(0, stat.size - Number(range[2]));
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= stat.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
        res.end();
        return true;
      }
      end = Math.min(end, stat.size - 1);
      status = 206;
    }
    const headers = {
      'Content-Type': mimeOf(filename),
      'Content-Length': end - start + 1,
      'Accept-Ranges': 'bytes',
      'Cache-Control': relative.startsWith('packages/')
        ? 'public, max-age=300' : 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    };
    if (status === 206) headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    res.writeHead(status, headers);
    if (req.method === 'HEAD') { res.end(); return true; }
    fs.createReadStream(filename, { start, end }).pipe(res);
    return true;
  }
}

module.exports = { HotUpdateService, compareVersions, platformOf };
