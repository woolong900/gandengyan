#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(process.argv[2] || path.join(projectRoot, '..'));
const brandingRoot = path.join(sourceRoot, 'assets', 'branding');

if (!fs.existsSync(brandingRoot)) {
  throw new Error(`找不到正式项目品牌资源目录：${brandingRoot}`);
}

const replacements = [
  ['login/login-logo.png', 'assets/resources/Hall/Res/Texture/Login/login_logo.png'],
  ['login/login-background.jpg', 'assets/resources/Hall/Res/Texture/Login/login_bg.jpg'],
  ['hall/hall-background.png', 'assets/resources/Hall/Res/Texture/Center/game_bg.png'],
  ['hall/hall-character.png', 'assets/resources/Hall/Res/Texture/Center/girl.png'],
  ['club/club-background.png', 'assets/resources/Hall/Res/Texture/Club/club_bg.png'],
  ['club/club-character-empty.png', 'assets/resources/Hall/Res/Texture/Club/ren.png'],
  ['table/table-background-2d.jpg', 'assets/resources/Hall/Res/Texture/Game/2d/table/tabel.jpg'],
  ['table/table-background-3d.jpg', 'assets/resources/Hall/Res/Texture/Game/3d/table/tabel.jpg'],
  ['share/settlement-background.png', 'assets/resources/Hall/Res/Texture/Game/record_share/share_bg_new.png'],
  ['share/download-qr.png', 'assets/resources/Hall/Res/Texture/Game/record_share/qrcode_hg.png'],
  ['share/moments-poster.jpg', 'assets/resources/Hall/Res/Texture/Share/shareGame.jpg'],
  ['settlement/btn-exit-busy-orange-v4.png', 'assets/resources/_RecoveredDependencies/Textures/e07c10f8-e75a-5ae8-d2f6-40c4b109d372.png'],
];

const qjshzTextures = [
  '609a7ea7-dcd3-4770-9830-847e4aecacbf.jpg',
  '19c83aa89.png',
  '0968299a-e998-4a49-9435-69aa1a61b8ff.png',
];
for (const file of qjshzTextures) {
  replacements.push([
    path.join('..', '..', 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures', file),
    path.join('assets', 'resources', '_RecoveredDependencies', 'Textures', file),
  ]);
}

const legacyTargets = new Map();
const collectMeta = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectMeta(file);
      continue;
    }
    if (!entry.name.endsWith('.meta')) continue;
    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    if (meta.uuid) legacyTargets.set(meta.uuid, file.slice(0, -5));
  }
};
collectMeta(path.join(projectRoot, 'assets'));

const legacyRoot = path.join(brandingRoot, 'legacy-cleanup');
for (const name of fs.readdirSync(legacyRoot).sort()) {
  const uuid = path.parse(name).name;
  let target = legacyTargets.get(uuid);
  if (!target) {
    const recoveredTarget = path.join(projectRoot, 'assets', 'resources', '_RecoveredDependencies', 'Textures', name);
    if (fs.existsSync(recoveredTarget)) target = recoveredTarget;
  }
  if (!target) throw new Error(`找不到旧品牌资源 ${name} 在 Cocos 工程中的目标文件`);
  replacements.push([path.join('legacy-cleanup', name), path.relative(projectRoot, target)]);
}

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
let changed = 0;
let unchanged = 0;

for (const [sourceName, targetName] of replacements) {
  const source = sourceName.startsWith(`..${path.sep}`)
    ? path.resolve(brandingRoot, sourceName)
    : path.join(brandingRoot, sourceName);
  const target = path.join(projectRoot, targetName);
  if (!fs.existsSync(source)) throw new Error(`缺少正式发布资源：${source}`);
  if (!fs.existsSync(target)) throw new Error(`缺少 Cocos 目标资源：${target}`);
  if (sha256(source) === sha256(target)) {
    unchanged += 1;
    continue;
  }
  fs.copyFileSync(source, target);
  changed += 1;
  console.log(`已同步 ${path.relative(projectRoot, target)}`);
}

console.log(`正式发布资源同步完成：更新 ${changed} 个，已一致 ${unchanged} 个。`);
