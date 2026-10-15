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
const source = path.resolve(arg('source'));
const output = path.resolve(arg('out'));
if (!Number.isSafeInteger(from) || !Number.isSafeInteger(version) || version <= from) {
  throw new Error('回滚发布版本必须大于源资源版本');
}
if (fs.existsSync(output)) throw new Error(`输出目录已存在：${output}`);

const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');
fs.mkdirSync(output, { recursive: true });
for (const platform of ['android', 'ios']) {
  const sourceRoot = path.join(source, platform, String(from));
  const targetRoot = path.join(output, platform, String(version));
  fs.cpSync(sourceRoot, targetRoot, { recursive: true });

  const projectScriptFile = path.join(targetRoot, 'src', 'project.jsc');
  const projectScript = toJs(fs.readFileSync(projectScriptFile));
  const pattern = new RegExp(`assertVer: ${from},\\npackageVer:`);
  const matches = projectScript.toString('binary').match(pattern) || [];
  if (matches.length !== 1) throw new Error(`${platform} 源脚本资源版本字段异常`);
  const patchedScript = Buffer.from(projectScript.toString('binary').replace(
    pattern, `assertVer: ${version},\npackageVer:`,
  ), 'binary');
  const encodedScript = toJsc(patchedScript);
  fs.writeFileSync(projectScriptFile, encodedScript);

  const manifestFile = path.join(targetRoot, 'project.manifest');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const packageUrl = manifest.packageUrl.replace(`/${from}/`, `/${version}/`);
  manifest.packageUrl = packageUrl;
  manifest.remoteManifestUrl = `${packageUrl}project.manifest`;
  manifest.remoteVersionUrl = `${packageUrl}version.manifest`;
  manifest.version = String(version);
  manifest.assets['src/project.jsc'] = { size: encodedScript.length, md5: md5(encodedScript) };
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
  item.stableAssetVersion = version;
  item.rollout.enabled = false;
  item.rollout.percentage = 100;
  item.rollout.includeUids = [];
  item.rollout.includeDeviceIds = [];
  item.rollout.excludeUids = [];
  item.rollout.excludeDeviceIds = [];
  item.rollout.salt = crypto.randomBytes(12).toString('hex');
}
fs.writeFileSync(path.join(output, 'hot-update.json'), `${JSON.stringify(config, null, 2)}\n`);
fs.writeFileSync(path.join(output, 'release.json'), `${JSON.stringify({
  version, rollbackFrom: from, source: path.relative(root, source),
}, null, 2)}\n`);
console.log(`已将 R${from} 原资源重新封装为回滚版本 R${version}：${output}`);
