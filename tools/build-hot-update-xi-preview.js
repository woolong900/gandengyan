#!/usr/bin/env node
/** Package the current Say Huzi release, optionally promoting it to all users. */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { buildReleaseProjectJsc } = require('./client-release-project');

const ROOT = path.join(__dirname, '..');
const FROM = Number(process.argv[2]);
const VERSION = Number(process.argv[3]);
const TEST_UID = 285636;
const FULL_RELEASE = process.argv.includes('--full-release');
const CHANGE = process.argv.find((arg) => arg.startsWith('--change='))?.slice('--change='.length);
if (!Number.isSafeInteger(FROM) || !Number.isSafeInteger(VERSION) || VERSION <= FROM) {
  throw new Error('用法：build-hot-update-xi-preview.js <当前稳定版> <新版本>');
}
const source = path.join(ROOT, 'dist', `hot-update-${FROM}`);
const output = path.join(ROOT, 'dist', `hot-update-${VERSION}`);
if (!fs.existsSync(source) || fs.existsSync(output)) throw new Error('源版本不存在或目标版本已存在');
const sourceConfig = JSON.parse(fs.readFileSync(path.join(source, 'hot-update.json'), 'utf8'));
const stableVersion = Number(sourceConfig.platforms.android.stableAssetVersion);
if (!Number.isSafeInteger(stableVersion) || stableVersion > FROM
  || Number(sourceConfig.platforms.ios.stableAssetVersion) !== stableVersion) {
  throw new Error('源版本的安卓/iOS 稳定版本不一致');
}

const encoded = buildReleaseProjectJsc({
  assetVersion: VERSION,
  packageVersion: '1.0.6',
  serviceBaseUrl: 'https://gandengyan.top',
});
for (const platform of ['android', 'ios']) {
  const fromRoot = path.join(source, platform, String(FROM));
  const toRoot = path.join(output, platform, String(VERSION));
  fs.cpSync(fromRoot, toRoot, { recursive: true });
  fs.writeFileSync(path.join(toRoot, 'src', 'project.jsc'), encoded);
  const manifestFile = path.join(toRoot, 'project.manifest');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  if (!manifest.assets || !manifest.assets['src/project.jsc']) {
    throw new Error(`${platform} 清单中缺少 project.jsc`);
  }
  manifest.packageUrl = manifest.packageUrl.replace(`/${FROM}/`, `/${VERSION}/`);
  manifest.remoteManifestUrl = `${manifest.packageUrl}project.manifest`;
  manifest.remoteVersionUrl = `${manifest.packageUrl}version.manifest`;
  manifest.version = String(VERSION);
  manifest.assets['src/project.jsc'] = {
    size: encoded.length,
    md5: crypto.createHash('md5').update(encoded).digest('hex'),
  };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  fs.writeFileSync(path.join(toRoot, 'version.manifest'), JSON.stringify({
    packageUrl: manifest.packageUrl,
    remoteManifestUrl: manifest.remoteManifestUrl,
    remoteVersionUrl: manifest.remoteVersionUrl,
    version: manifest.version,
  }));
}

const config = sourceConfig;
config.publishedAt = Date.now();
for (const platform of ['android', 'ios']) {
  const item = config.platforms[platform];
  item.latestAssetVersion = VERSION;
  item.stableAssetVersion = FULL_RELEASE ? VERSION : stableVersion;
  item.rollout = {
    enabled: !FULL_RELEASE,
    percentage: FULL_RELEASE ? 100 : 0,
    includeUids: FULL_RELEASE ? [] : [TEST_UID],
    includeDeviceIds: [],
    excludeUids: [],
    excludeDeviceIds: [],
    salt: crypto.randomBytes(12).toString('hex'),
  };
}
fs.writeFileSync(path.join(output, 'hot-update.json'), `${JSON.stringify(config, null, 2)}\n`);
fs.writeFileSync(path.join(output, 'release.json'), `${JSON.stringify({
  version: VERSION,
  basedOn: FROM,
  change: CHANGE || (FULL_RELEASE
    ? '说胡子喜钱设置全量发布；结算页抓分行只显示抓分'
    : '说胡子喜钱选项、未被压住时结算，先灰度给铠'),
  rollout: { includeUids: FULL_RELEASE ? [] : [TEST_UID],
    stableAssetVersion: FULL_RELEASE ? VERSION : stableVersion },
}, null, 2)}\n`);
console.log(`喜钱${FULL_RELEASE ? '全量' : '灰度'}热更新已生成：${output}`);
