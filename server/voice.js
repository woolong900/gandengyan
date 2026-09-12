/**
 * 按住说话的录音。原版走腾讯 GCloud 上传，自建服改成落到 data/voice/。
 * 客户端仍用 GCloud 本地录、播，只是文件进出换成这里。
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
