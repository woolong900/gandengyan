const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SESSION_MS = 8 * 60 * 60 * 1000;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

const passwordRecord = (password) => {
  const plain = String(password || '');
  if (plain.length < 12 || plain.length > 200) throw new Error('管理员密码须为12至200个字符');
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.scryptSync(plain, Buffer.from(salt, 'hex'), 64).toString('hex');
  return { version: 1, salt, hash };
};

const secureEqual = (left, right) => {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

class AdminAuth {
  constructor({ file, now = Date.now } = {}) {
    this.file = file;
    this.now = now;
    this.sessions = new Map();
    this.failures = new Map();
    this.record = null;
    this.reload();
  }

  reload() {
    try {
      const record = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      if (!/^[0-9a-f]{64}$/.test(record.salt) || !/^[0-9a-f]{128}$/.test(record.hash)) throw new Error('密码记录格式错误');
      this.record = record;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      this.record = null;
    }
    this.sessions.clear();
  }

  configured() { return !!this.record; }

  verify(password) {
    if (!this.record) return false;
    const hash = crypto.scryptSync(String(password || ''), Buffer.from(this.record.salt, 'hex'), 64).toString('hex');
    return secureEqual(hash, this.record.hash);
  }

  login(password, ip) {
    const key = String(ip || 'unknown');
    const history = (this.failures.get(key) || []).filter((time) => this.now() - time < WINDOW_MS);
    if (history.length >= MAX_FAILURES) return { error: '尝试次数过多，请15分钟后重试', status: 429 };
    if (!this.verify(password)) {
      history.push(this.now());
      this.failures.set(key, history);
      return { error: '账号或密码错误', status: 401 };
    }
    this.failures.delete(key);
    const sid = crypto.randomBytes(32).toString('hex');
    const csrf = crypto.randomBytes(32).toString('hex');
    const session = { sid, csrf, expiresAt: this.now() + SESSION_MS, actor: '管理员' };
    this.sessions.set(sid, session);
    return { session };
  }

  session(req) {
    const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim())
      .find((part) => part.startsWith('qj_admin_sid='));
    const sid = cookie ? cookie.slice('qj_admin_sid='.length) : '';
    const session = this.sessions.get(sid);
    if (!session) return null;
    if (session.expiresAt <= this.now()) {
      this.sessions.delete(sid);
      return null;
    }
    return session;
  }

  csrfOk(req, session) {
    return !!session && secureEqual(req.headers['x-csrf-token'], session.csrf);
  }

  logout(session) { if (session) this.sessions.delete(session.sid); }

  changePassword(current, next) {
    if (!this.verify(current)) return { error: '当前密码错误' };
    let record;
    try { record = passwordRecord(next); } catch (error) { return { error: error.message }; }
    const temporary = path.join(path.dirname(this.file), `.admin-password-${crypto.randomBytes(8).toString('hex')}.tmp`);
    try {
      fs.writeFileSync(temporary, JSON.stringify(record), { mode: 0o600 });
      fs.renameSync(temporary, this.file);
      fs.chmodSync(this.file, 0o600);
      this.reload();
      return { ok: true };
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
  }

  cookie(sid, secure) {
    return `qj_admin_sid=${sid}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=${sid ? SESSION_MS / 1000 : 0}${secure ? '; Secure' : ''}`;
  }
}

module.exports = { AdminAuth, passwordRecord, secureEqual };
