/**
 * 房内语音文件。新客户端使用 M4A/AAC，旧客户端仍可能上传 SILK；
 * 要防的是同步读盘卡住 WS、以及被刷满磁盘。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const defaults = {
  maxBytes: Number(process.env.QJQP_VOICE_MAX) || 64 * 1024,
  ttlMs: Number(process.env.QJQP_VOICE_TTL_MS) || 30 * 60 * 1000,
  maxFiles: Number(process.env.QJQP_VOICE_MAX_FILES) || 2000,
  maxTotal: Number(process.env.QJQP_VOICE_MAX_TOTAL) || 80 * 1024 * 1024,
  postsPerMin: Number(process.env.QJQP_VOICE_RPM) || 60,
};

const createVoice = (dir, opts = {}) => {
  const maxBytes = opts.maxBytes || defaults.maxBytes;
  const ttlMs = opts.ttlMs || defaults.ttlMs;
  const maxFiles = opts.maxFiles || defaults.maxFiles;
  const maxTotal = opts.maxTotal || defaults.maxTotal;
  const postsPerMin = opts.postsPerMin || defaults.postsPerMin;
  const nowFn = opts.now || Date.now;
  const hits = new Map();
  let prunedAt = 0;

  const ensure = () => fs.mkdirSync(dir, { recursive: true });

  const idOf = (raw) => {
    const s = String(raw || '').replace(/^qjqp:/, '');
    return /^[a-f0-9]{32}$/.test(s) ? s : '';
  };

  const allowPost = (ip) => {
    const now = nowFn();
    const key = ip || 'unknown';
    const arr = (hits.get(key) || []).filter((t) => now - t < 60000);
    if (arr.length >= postsPerMin) {
      hits.set(key, arr);
      return false;
    }
    arr.push(now);
    hits.set(key, arr);
    return true;
  };

  const prune = () => {
    ensure();
    let names;
    try { names = fs.readdirSync(dir); } catch { return; }
    const now = nowFn();
    const files = [];
    for (const name of names) {
      if (name.startsWith('.')) {
        try { fs.unlinkSync(path.join(dir, name)); } catch { /* */ }
        continue;
      }
      if (!/^[a-f0-9]{32}$/.test(name)) continue;
      const p = path.join(dir, name);
      try {
        const st = fs.statSync(p);
        if (now - st.mtimeMs > ttlMs) {
          fs.unlinkSync(p);
          continue;
        }
        files.push({ p, mtime: st.mtimeMs, size: st.size });
      } catch { /* */ }
    }
    files.sort((a, b) => a.mtime - b.mtime);
    let total = files.reduce((n, f) => n + f.size, 0);
    while (files.length > maxFiles || total > maxTotal) {
      const f = files.shift();
      if (!f) break;
      try { fs.unlinkSync(f.p); } catch { /* */ }
      total -= f.size;
    }
  };

  const pruneSoon = () => {
    const now = nowFn();
    if (now - prunedAt < 15000) return;
    prunedAt = now;
    try { prune(); } catch { /* */ }
  };

  const isSupportedAudio = (buf) => {
    if (!buf || buf.length < 8) return false;
    if (buf.toString('ascii', 0, 6) === '#!SILK') return true;
    // Android MediaRecorder 与 iOS AVAudioRecorder 统一输出 MPEG-4/AAC。
    // ISO BMFF 文件在第 4 字节处以 ftyp 标识容器类型。
    return buf.length >= 12 && buf.toString('ascii', 4, 8) === 'ftyp';
  };

  const put = (buf) => {
    if (!buf || buf.length < 8 || buf.length > maxBytes) return { error: 'too large' };
    if (!isSupportedAudio(buf)) return { error: 'invalid' };
    pruneSoon();
    ensure();
    const id = crypto.randomBytes(16).toString('hex');
    const tmp = path.join(dir, `.${id}.tmp`);
    const dest = path.join(dir, id);
    fs.writeFileSync(tmp, buf);
    fs.renameSync(tmp, dest);
    return { id: `qjqp:${id}`, bytes: buf.length };
  };

  const fileOf = (raw) => {
    const id = idOf(raw);
    if (!id) return '';
    const p = path.join(dir, id);
    try {
      return fs.existsSync(p) ? p : '';
    } catch {
      return '';
    }
  };

  return {
    maxBytes, allowPost, put, fileOf, prune, idOf,
  };
};

module.exports = { createVoice };
