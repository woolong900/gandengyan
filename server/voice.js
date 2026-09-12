/**
 * 自建 /voice 存盘。当前客户端已改回 GME 上传，这条接口留着备用。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIR = process.env.QJQP_VOICE
  || path.join(__dirname, '..', 'data', 'voice');
const MAX = 256 * 1024;
const ID_RE = /^[a-f0-9]{24}$/;

const ensure = () => fs.mkdirSync(DIR, { recursive: true });

const put = (buf) => {
  if (!buf || !buf.length || buf.length > MAX) return null;
  ensure();
  const id = crypto.randomBytes(12).toString('hex');
  fs.writeFileSync(path.join(DIR, id), buf);
  return id;
};

const get = (id) => {
  if (!ID_RE.test(id || '')) return null;
  try {
    return fs.readFileSync(path.join(DIR, id));
  } catch {
    return null;
  }
};

module.exports = { put, get, MAX, DIR };
