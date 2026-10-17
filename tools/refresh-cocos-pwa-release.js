#!/usr/bin/env node
/** Refresh the existing Creator 2.4 Web build from the active native release. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const RELEASE = Number(process.argv[2] || 301);
const BASE = path.join(ROOT, 'cocos-client', 'build', 'web-mobile');
const NATIVE = path.join(ROOT, 'dist', `hot-update-${RELEASE}`, 'android', String(RELEASE));
const OUTPUT = path.resolve(process.argv[3] || path.join(ROOT, 'dist', `pwa-r${RELEASE}`));
const SOURCE = path.join(ROOT, 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures');
const WEB_TEXTURES = path.join(OUTPUT, 'assets', 'resources', 'native');
const WEB_IMPORT = path.join(OUTPUT, 'assets', 'resources', 'import');
const CONFIG = path.join(OUTPUT, 'assets', 'resources', 'config.json');
const sceneUuid = 'dc294676-c185-4f9d-89a5-4085ac3a9175';
const cardAtlas = '1a62d6dfc';
const buttonAtlas = '19c83aa89';

if (!fs.existsSync(path.join(BASE, 'index.html'))) throw new Error('缺少已验证的 Cocos 2.4 Web 基础包');
if (!fs.existsSync(path.join(NATIVE, 'res', 'import', 'dc', `${sceneUuid}.json`))) {
  throw new Error(`缺少 R${RELEASE} 的稳定版场景资源`);
}
if (fs.existsSync(OUTPUT)) throw new Error(`输出目录已存在：${OUTPUT}`);

const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function expandUuid(uuid) {
  if (uuid.length !== 22) return uuid;
  let hex = uuid.slice(0, 2);
  for (let i = 2; i < 22; i += 2) {
    hex += ((b64.indexOf(uuid[i]) << 6) | b64.indexOf(uuid[i + 1]))
      .toString(16).padStart(3, '0');
  }
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

fs.cpSync(BASE, OUTPUT, { recursive: true });
execFileSync(process.execPath, [path.join(ROOT, 'tools', 'build-recovered-bundle.js'),
  path.join(ROOT, 'cocos-client'), path.join(OUTPUT, 'assets', 'main', 'index.js')],
{ stdio: 'inherit' });
const bundleFile = path.join(OUTPUT, 'assets', 'main', 'index.js');
let bundle = fs.readFileSync(bundleFile, 'utf8');
const versionPattern = /assertVer: \d+,\npackageVer: "[^"]+",/g;
if ((bundle.match(versionPattern) || []).length !== 1) throw new Error('Web 包版本字段不唯一');
bundle = bundle.replace(versionPattern, `assertVer: ${RELEASE},\npackageVer: "1.0.6",`);
fs.writeFileSync(bundleFile, bundle);

// The four Qianfen card sheets and the action-button sheet changed after the
// September Web build. Their SpriteFrames are already in the Web resource map.
for (const name of [
  '1580e8a3b.png', '191f83490.png', cardAtlas + '.png', '1e79e9934.png', buttonAtlas + '.png',
]) {
  const target = path.join(WEB_TEXTURES, name.slice(0, 2), name);
  if (!fs.existsSync(target)) throw new Error(`Web 包缺少图集目标：${name}`);
  fs.copyFileSync(path.join(SOURCE, name), target);
}
const shareQr = path.join(WEB_TEXTURES, '20', '206b229f-fa1c-409e-b47e-b2d2c0938d57.png');
if (!fs.existsSync(shareQr)) throw new Error('Web 包缺少战绩分享二维码');
fs.copyFileSync(path.join(ROOT, 'assets', 'branding', 'share', 'download-qr.png'), shareQr);

// The old Web build packed the WSK scene and button SpriteFrames together.
// Use the active R301 serialized assets so the new, taller button sheet gets
// matching crop rectangles. Two Web-only quick-message frames are retained.
const config = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
const sceneIndex = config.uuids.findIndex((uuid) => expandUuid(uuid) === sceneUuid);
const buttonFrameIndex = Object.entries(config.paths)
  .find(([, value]) => value[0] === `_RecoveredDependencies/Textures/${buttonAtlas}`)?.[0];
const pack = Object.entries(config.packs).find(([, members]) =>
  members.includes(sceneIndex) && members.includes(Number(buttonFrameIndex)));
if (!pack || sceneIndex < 0) throw new Error('找不到说胡子场景与按钮资源包');
const [packId, members] = pack;
const webOnly = new Set([
  '9e8f858a-5c2b-4cc5-a12b-0f362862d661',
  'f2f16c44-3952-4d2f-8acf-f0f871945645',
]);
let copied = 0;
for (const member of members) {
  const uuid = expandUuid(config.uuids[member]);
  const target = path.join(WEB_IMPORT, uuid.slice(0, 2), `${uuid}.json`);
  const source = path.join(NATIVE, 'res', 'import', uuid.slice(0, 2), `${uuid}.json`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
    copied++;
    continue;
  }
  if (!webOnly.has(uuid)) throw new Error(`稳定版缺少资源：${uuid}`);
  const name = uuid === '9e8f858a-5c2b-4cc5-a12b-0f362862d661'
    ? 'qjshz-quick-copper' : 'qjshz-quick-red';
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'cocos-client', 'assets', 'resources',
    '_RecoveredDependencies', 'Textures', `${name}.png.meta`), 'utf8'));
  const frame = meta.subMetas[name];
  fs.writeFileSync(target, JSON.stringify({
    __type__: 'cc.SpriteFrame',
    content: {
      name,
      texture: meta.uuid,
      rect: [0, 0, frame.width, frame.height],
      offset: [0, 0],
      originalSize: [frame.rawWidth, frame.rawHeight],
      rotated: false,
      capInsets: [0, 0, 0, 0],
    },
  }));
}
if (copied !== members.length - webOnly.size) throw new Error('资源包数量与预期不符');
delete config.packs[packId];
fs.writeFileSync(CONFIG, JSON.stringify(config));

execFileSync(process.execPath, [path.join(ROOT, 'tools', 'package-cocos-pwa.js'), OUTPUT],
  { stdio: 'inherit' });
console.log(`PWA_RELEASE=R${RELEASE}`);
console.log(`PWA_OUTPUT=${OUTPUT}`);
