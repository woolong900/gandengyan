#!/usr/bin/env node
/** 从当前候选版生成仅替换大厅四个按钮的定向灰度版。 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { toJs, toJsc } = require('./jsc');
const { releaseGitInfo } = require('./release-git');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const arg = (name, fallback = '') => {
  const index = args.indexOf(`--${name}`);
  return index < 0 ? fallback : args[index + 1];
};
const from = Number(arg('from'));
const version = Number(arg('version'));
const stableVersion = Number(arg('stable-version'));
const includeUids = arg('include-uids').split(',').map((value) => value.trim()).filter(Boolean);
const source = path.resolve(arg('source', path.join(root, 'dist', `hot-update-${from}`)));
const output = path.resolve(arg('out', path.join(root, 'dist', `hot-update-${version}`)));
const buttonRoot = path.join(root, 'assets', 'branding', 'hall', 'selected-v3');
const buttonAssets = new Map([
  ['5a582a61-69ad-4721-93c3-c76ae5b19a53', ['club_btn.png', 515, 258]],
  ['239688a6-a09f-4414-b75b-e631f7a42a5b', ['createroom_btn.png', 269, 210]],
  ['729289fb-7448-40a2-b047-93553336b3d5', ['joinroom_btn.png', 277, 213]],
  ['fce0d237-72b2-4de9-b145-ac4de1c62144', ['backroom_btn.png', 269, 210]],
]);
const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');
const encrypt = (image) => {
  const result = Buffer.alloc(image.length + 10);
  result.write('aaabbbccc', 0, 'ascii');
  result[9] = 0x77;
  for (let i = 0; i < image.length; i += 1) result[i + 10] = image[i] ^ 0x77;
  return result;
};

if (![from, version, stableVersion].every(Number.isSafeInteger)
    || from < 1 || version <= from || stableVersion < 1 || stableVersion > from) {
  throw new Error('版本参数无效：稳定版须不高于来源版，候选版须递增');
}
if (!includeUids.length || includeUids.some((uid) => !/^\d{1,20}$/.test(uid))) {
  throw new Error('--include-uids 须指定合法玩家 ID');
}
if (!fs.existsSync(source) || fs.existsSync(output)) throw new Error('源版本不存在或目标版本已存在');
const images = new Map();
for (const [uuid, [filename, width, height]] of buttonAssets) {
  const image = fs.readFileSync(path.join(buttonRoot, filename));
  if (image.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a'
      || image.readUInt32BE(16) !== width || image.readUInt32BE(20) !== height) {
    throw new Error(`${filename} 必须是 ${width}×${height} 的 PNG`);
  }
  images.set(`res/raw-assets/${uuid.slice(0, 2)}/${uuid}.png`, encrypt(image));
}
const config = JSON.parse(fs.readFileSync(path.join(source, 'hot-update.json'), 'utf8'));
if (Object.keys(config.platforms).sort().join(',') !== 'android,ios') {
  throw new Error('源版本缺少 Android 或 iOS 配置');
}
for (const platform of ['android', 'ios']) {
  if (config.platforms[platform].latestAssetVersion !== from
      || config.platforms[platform].stableAssetVersion !== stableVersion) {
    throw new Error(`${platform} 源配置版本与发布参数不一致`);
  }
}
const stage = fs.mkdtempSync(path.join(path.dirname(output), `.hot-update-${version}-hall-`));
try {
  for (const platform of ['android', 'ios']) {
    const sourceRoot = path.join(source, platform, String(from));
    const targetRoot = path.join(stage, platform, String(version));
    fs.cpSync(sourceRoot, targetRoot, { recursive: true });

    const scriptFile = path.join(targetRoot, 'src', 'project.jsc');
    const script = toJs(fs.readFileSync(scriptFile)).toString('utf8');
    const marker = `assertVer: ${from},\npackageVer:`;
    if (script.split(marker).length !== 2) throw new Error(`${platform} 源脚本版本字段异常`);
    const encoded = toJsc(Buffer.from(script.replace(marker,
      `assertVer: ${version},\npackageVer:`), 'utf8'));
    fs.writeFileSync(scriptFile, encoded);

    const manifestFile = path.join(targetRoot, 'project.manifest');
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const expected = `/${from}/`;
    if (!manifest.packageUrl.includes(expected)) throw new Error(`${platform} 源清单版本地址异常`);
    manifest.packageUrl = manifest.packageUrl.replace(expected, `/${version}/`);
    manifest.remoteManifestUrl = `${manifest.packageUrl}project.manifest`;
    manifest.remoteVersionUrl = `${manifest.packageUrl}version.manifest`;
    manifest.version = String(version);
    for (const [assetPath, encrypted] of images) {
      if (!manifest.assets[assetPath]) throw new Error(`${platform} 源清单缺少 ${assetPath}`);
      fs.writeFileSync(path.join(targetRoot, assetPath), encrypted);
      manifest.assets[assetPath] = { size: encrypted.length, md5: md5(encrypted) };
    }
    manifest.assets['src/project.jsc'] = { size: encoded.length, md5: md5(encoded) };
    fs.writeFileSync(manifestFile, JSON.stringify(manifest));
    fs.writeFileSync(path.join(targetRoot, 'version.manifest'), JSON.stringify({
      packageUrl: manifest.packageUrl,
      remoteManifestUrl: manifest.remoteManifestUrl,
      remoteVersionUrl: manifest.remoteVersionUrl,
      version: manifest.version,
    }));
  }
  config.publishedAt = Date.now();
  for (const platform of ['android', 'ios']) {
    const item = config.platforms[platform];
    item.latestAssetVersion = version;
    item.stableAssetVersion = stableVersion;
    item.rollout = {
      enabled: true, percentage: 0, includeUids,
      includeDeviceIds: [], excludeUids: [], excludeDeviceIds: [],
      salt: crypto.randomBytes(12).toString('hex'),
    };
  }
  fs.writeFileSync(path.join(stage, 'hot-update.json'), `${JSON.stringify(config, null, 2)}\n`);
  fs.writeFileSync(path.join(stage, 'release.json'), `${JSON.stringify({
    version, from, stableVersion, includeUids,
    change: '大厅四个主按钮恢复原 APP 素材', git: releaseGitInfo(root),
  }, null, 2)}\n`);
  fs.renameSync(stage, output);
  console.log(`已生成大厅按钮 R${version} 灰度版：${output}`);
} catch (error) {
  fs.rmSync(stage, { recursive: true, force: true });
  throw error;
}
