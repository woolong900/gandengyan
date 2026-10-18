#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { toJs, toJsc } = require('./jsc');

const args = process.argv.slice(2);
const arg = (name) => {
  const index = args.indexOf(`--${name}`);
  if (index < 0 || !args[index + 1]) throw new Error(`缺少 --${name}`);
  return args[index + 1];
};

const root = path.join(__dirname, '..');
const from = Number(arg('from'));
const version = Number(arg('version'));
const stableVersion = Number(arg('stable-version'));
const source = path.resolve(arg('source'));
const output = path.resolve(arg('out'));
const includeUids = arg('include-uids').split(',').map((value) => value.trim())
  .filter((value) => /^\d+$/.test(value));

if (![from, version, stableVersion].every(Number.isSafeInteger)
    || from < 1 || version <= from || stableVersion < 1 || stableVersion > version) {
  throw new Error('版本参数无效');
}
if (fs.existsSync(output)) throw new Error(`输出目录已存在：${output}`);

const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');
const replaceOnce = (sourceText, before, after, label) => {
  const first = sourceText.indexOf(before);
  if (first < 0 || sourceText.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${label} 没有唯一命中`);
  }
  return sourceText.slice(0, first) + after + sourceText.slice(first + before.length);
};

const patchProgressOnly = (sourceText) => {
  let result = replaceOnce(sourceText,
    't._curP = 0;\nreturn t;',
    't._curP = 0;\nt._lastDownloadedBytes = 0;\nreturn t;',
    '进度字节状态');
  result = replaceOnce(result,
    'this._updateProgressUI(n);',
    'this._updateProgressUI(n, e);',
    '进度事件');
  result = replaceOnce(result,
    'this._version = e;\nthis._url = t;\nvar n = function(e) {',
    'this._version = e;\nthis._url = t;\nthis._curP = 0;\nthis._lastDownloadedBytes = 0;\nthis._setStatus("0.0%  正在准备下载");\nvar n = function(e) {',
    '进度初始化');
  result = replaceOnce(result,
    't.prototype._updateProgressUI = function(e) {\nif (this.node && this.node.isValid && e > this._curP) {\nthis._curP = e;\nthis.pNode.width = 947 * e;\nthis.pLabel.string = (100 * e).toFixed(1) + "%";\n}\n};',
    't.prototype._setStatus = function(e) {\nif (this.pLabel && this.pLabel.node && this.pLabel.node.isValid) this.pLabel.string = e;\n};\n'
      + 't.prototype._formatBytes = function(e) {\nvar t = Math.max(0, Number(e) || 0);\nreturn t >= 1048576 ? (t / 1048576).toFixed(1) + " MB" : (t / 1024).toFixed(0) + " KB";\n};\n'
      + 't.prototype._eventNumber = function(e, t) {\ntry {\nvar o = e && e[t];\nif ("function" === typeof o) {\nvar n = Number(o.call(e));\nif (isFinite(n) && n >= 0) return n;\n}\n} catch (e) {}\nreturn 0;\n};\n'
      + 't.prototype._updateProgressUI = function(e, t) {\nif (!this.node || !this.node.isValid) return;\nvar o = Math.max(0, Math.min(1, Number(e) || 0)), n = this._eventNumber(t, "getDownloadedBytes"), r = this._eventNumber(t, "getTotalBytes"), i = this._eventNumber(t, "getDownloadedFiles"), a = this._eventNumber(t, "getTotalFiles");\nthis._curP = Math.max(this._curP, o);\nthis._lastDownloadedBytes = Math.max(this._lastDownloadedBytes, n);\nif (this.pNode && this.pNode.isValid) this.pNode.width = 947 * this._curP;\nvar s = (100 * this._curP).toFixed(1) + "%";\nif (r > 0) s += "  " + this._formatBytes(n) + "/" + this._formatBytes(r); else if (a > 0) s += "  " + i + "/" + a + " 个文件";\nthis._setStatus(s);\n};',
    '进度显示实现');
  return result;
};

fs.mkdirSync(output, { recursive: true });
for (const platform of ['android', 'ios']) {
  const sourceRoot = path.join(source, platform, String(from));
  const targetRoot = path.join(output, platform, String(version));
  fs.cpSync(sourceRoot, targetRoot, { recursive: true });

  const scriptFile = path.join(targetRoot, 'src', 'project.jsc');
  let script = toJs(fs.readFileSync(scriptFile)).toString('utf8');
  script = patchProgressOnly(script);
  script = replaceOnce(script, `assertVer: ${from},\npackageVer:`,
    `assertVer: ${version},\npackageVer:`, '资源版本');
  const encoded = toJsc(Buffer.from(script, 'utf8'));
  fs.writeFileSync(scriptFile, encoded);

  const manifestFile = path.join(targetRoot, 'project.manifest');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const packageUrl = manifest.packageUrl.replace(`/${from}/`, `/${version}/`);
  manifest.packageUrl = packageUrl;
  manifest.remoteManifestUrl = `${packageUrl}project.manifest`;
  manifest.remoteVersionUrl = `${packageUrl}version.manifest`;
  manifest.version = String(version);
  manifest.assets['src/project.jsc'] = { size: encoded.length, md5: md5(encoded) };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  fs.writeFileSync(path.join(targetRoot, 'version.manifest'), JSON.stringify({
    packageUrl: manifest.packageUrl,
    remoteManifestUrl: manifest.remoteManifestUrl,
    remoteVersionUrl: manifest.remoteVersionUrl,
    version: manifest.version,
  }));
}

const config = JSON.parse(fs.readFileSync(path.join(source, 'hot-update.json'), 'utf8'));
config.publishedAt = Date.now();
for (const platform of ['android', 'ios']) {
  const item = config.platforms[platform];
  item.latestAssetVersion = version;
  item.stableAssetVersion = stableVersion;
  item.rollout = {
    enabled: true,
    percentage: 0,
    includeUids,
    includeDeviceIds: [],
    excludeUids: [],
    excludeDeviceIds: [],
    salt: crypto.randomBytes(12).toString('hex'),
  };
}
fs.writeFileSync(path.join(output, 'hot-update.json'), `${JSON.stringify(config, null, 2)}\n`);
fs.writeFileSync(path.join(output, 'release.json'), `${JSON.stringify({
  version,
  from,
  source: path.relative(root, source),
  stage: 'hot-update-progress-only',
  stableVersion,
  includeUids,
}, null, 2)}\n`);
console.log(`已生成 R${version} 进度显示单项灰度；稳定版 R${stableVersion}`);
