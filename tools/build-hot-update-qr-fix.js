#!/usr/bin/env node
/** Copy the active stable release to a new version and replace its share QR. */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const FROM = Number(process.argv[2]);
const VERSION = Number(process.argv[3]);
if (!Number.isSafeInteger(FROM) || !Number.isSafeInteger(VERSION) || VERSION <= FROM) {
  throw new Error('用法：build-hot-update-qr-fix.js <当前稳定版> <新版本>');
}
const source = path.join(ROOT, 'dist', `hot-update-${FROM}`);
const output = path.join(ROOT, 'dist', `hot-update-${VERSION}`);
const qr = fs.readFileSync(path.join(ROOT, 'assets', 'branding', 'share', 'download-qr.png'));
if (!qr.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
  throw new Error('二维码源文件不是 PNG');
}

execFileSync(process.execPath, [path.join(__dirname, 'build-hot-update-rollback.js'),
  '--from', String(FROM), '--version', String(VERSION), '--source', source, '--out', output],
{ stdio: 'inherit' });
const key = 0x77;
const encrypted = Buffer.alloc(qr.length);
for (let i = 0; i < qr.length; i++) encrypted[i] = qr[i] ^ key;
const asset = Buffer.concat([Buffer.from('aaabbbccc', 'ascii'), Buffer.from([key]), encrypted]);
const name = 'res/raw-assets/20/206b229f-fa1c-409e-b47e-b2d2c0938d57.png';
for (const platform of ['android', 'ios']) {
  const release = path.join(output, platform, String(VERSION));
  fs.writeFileSync(path.join(release, name), asset);
  const manifestFile = path.join(release, 'project.manifest');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  if (!manifest.assets[name]) throw new Error(`${platform} 清单缺少二维码资源`);
  manifest.assets[name] = {
    size: asset.length,
    md5: crypto.createHash('md5').update(asset).digest('hex'),
  };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest));
}
fs.writeFileSync(path.join(output, 'release.json'), `${JSON.stringify({
  version: VERSION,
  basedOn: FROM,
  change: '战绩分享二维码改为 https://gandengyan.top/download',
}, null, 2)}\n`);
console.log(`战绩二维码热更新已生成：${output}`);
