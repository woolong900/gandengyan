#!/usr/bin/env node
/** 从上一版生成商城视觉修正的定向灰度版本。 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { toJs, toJsc } = require('./jsc');
const { releaseGitInfo } = require('./release-git');
const { SHOPPING_MALL_PREFAB_ASSET, patchShoppingMallPrefab } = require('./client-shopping-mall');

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
const imageFile = path.join(root, 'assets', 'branding', 'shop', 'shop-background-r338.png');
const assetPath = 'res/raw-assets/0b/0b113fff-15df-4c89-8321-fb74e12e940f.png';
const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');

if (![from, version, stableVersion].every(Number.isSafeInteger)
    || from < 1 || version <= from || stableVersion < 1 || stableVersion > from) {
  throw new Error('版本参数无效：稳定版须不高于来源版，候选版须递增');
}
if (!includeUids.length || includeUids.some((uid) => !/^\d{1,20}$/.test(uid))) {
  throw new Error('--include-uids 须指定合法玩家 ID');
}
if (!fs.existsSync(source) || fs.existsSync(output)) throw new Error('源版本不存在或目标版本已存在');
const image = fs.readFileSync(imageFile);
if (image.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a'
    || image.readUInt32BE(16) !== 1559 || image.readUInt32BE(20) !== 720) {
  throw new Error('商城背景必须是 1559×720 的 PNG');
}
const key = 0x77;
const encrypted = Buffer.alloc(image.length + 10);
encrypted.write('aaabbbccc', 0, 'ascii');
encrypted[9] = key;
for (let index = 0; index < image.length; index += 1) encrypted[index + 10] = image[index] ^ key;

const config = JSON.parse(fs.readFileSync(path.join(source, 'hot-update.json'), 'utf8'));
if (Object.keys(config.platforms).sort().join(',') !== 'android,ios') {
  throw new Error('源版本缺少 Android 或 iOS 配置');
}
const git = releaseGitInfo(root);
if (git.dirty) throw new Error('请先提交商城界面改动，再生成正式灰度版');
const stage = fs.mkdtempSync(path.join(path.dirname(output), `.hot-update-${version}-shop-`));
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

    fs.writeFileSync(path.join(targetRoot, assetPath), encrypted);
    const prefabFile = path.join(targetRoot, SHOPPING_MALL_PREFAB_ASSET);
    const prefabBytes = patchShoppingMallPrefab(fs.readFileSync(prefabFile));
    fs.writeFileSync(prefabFile, prefabBytes);
    const manifestFile = path.join(targetRoot, 'project.manifest');
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    if (!manifest.assets[assetPath] || !manifest.assets[SHOPPING_MALL_PREFAB_ASSET]
        || !manifest.assets['src/project.jsc']) {
      throw new Error(`${platform} 源清单缺少商城背景、界面或脚本`);
    }
    const expected = `/${from}/`;
    if (!manifest.packageUrl.includes(expected)) throw new Error(`${platform} 源清单版本地址异常`);
    manifest.packageUrl = manifest.packageUrl.replace(expected, `/${version}/`);
    manifest.remoteManifestUrl = `${manifest.packageUrl}project.manifest`;
    manifest.remoteVersionUrl = `${manifest.packageUrl}version.manifest`;
    manifest.version = String(version);
    manifest.assets[assetPath] = { size: encrypted.length, md5: md5(encrypted) };
    manifest.assets[SHOPPING_MALL_PREFAB_ASSET] = { size: prefabBytes.length, md5: md5(prefabBytes) };
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
    change: arg('change', '商城界面视觉修正'), git,
  }, null, 2)}\n`);
  fs.renameSync(stage, output);
  console.log(`已生成商城背景 R${version} 灰度版：${output}`);
} catch (error) {
  fs.rmSync(stage, { recursive: true, force: true });
  throw error;
}
