#!/usr/bin/env node
/** Repair module dependencies and script UUIDs without regenerating recovered assets. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PROJECT = path.resolve(process.argv[2] || path.join(ROOT, 'client-cocos-recovered'));
const REPORT = path.join(PROJECT, 'recovery-report');
const SCRIPTS = path.join(PROJECT, 'assets', 'Script', 'Recovered');
const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const decodeUuid = (value) => {
  if (!value || (value.length !== 22 && value.length !== 23)) return value;
  const prefixLength = value.length === 23 ? 5 : 2;
  let hex = value.slice(0, prefixLength);
  for (let i = prefixLength; i < value.length; i += 2) {
    const a = BASE64.indexOf(value[i]);
    const b = BASE64.indexOf(value[i + 1]);
    if (a < 0 || b < 0) return value;
    hex += (a >> 2).toString(16);
    hex += (((a & 3) << 2) | (b >> 4)).toString(16);
    hex += (b & 15).toString(16);
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const bundle = fs.readFileSync(path.join(REPORT, 'project.bundle.js'), 'utf8');
const capture = bundle.replace(
  'window.__require = function e(t, o, n) {',
  'window.__require = function e(t, o, n) { __recoveredModules = t; n = [];',
);
const context = { window: {}, __recoveredModules: null };
vm.createContext(context);
vm.runInContext(capture, context, { timeout: 5000 });
const modules = context.__recoveredModules;
const moduleMap = JSON.parse(fs.readFileSync(path.join(REPORT, 'module-map.json'), 'utf8'));
let changedScripts = 0;
let changedMetas = 0;
let renamedScripts = 0;
let changedSerializedAssets = 0;
let normalizedTextureMetas = 0;

// Creator 2.4 treats a numeric JavaScript filename as a bundle id and cannot
// resolve relative requires to it. Give those recovered library modules a
// normal source filename while retaining their original script UUID.
for (const [name, oldSafeName] of Object.entries(moduleMap)) {
  if (!/^\d/.test(oldSafeName)) continue;
  const safeName = `module_${oldSafeName}`;
  for (const suffix of ['.js', '.js.meta']) {
    const oldPath = path.join(SCRIPTS, `${oldSafeName}${suffix}`);
    const newPath = path.join(SCRIPTS, `${safeName}${suffix}`);
    if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
      fs.renameSync(oldPath, newPath);
      renamedScripts += suffix === '.js' ? 1 : 0;
    }
  }
  moduleMap[name] = safeName;
}
fs.writeFileSync(path.join(REPORT, 'module-map.json'), `${JSON.stringify(moduleMap, null, 2)}\n`);

for (const [name, [, dependencies]] of Object.entries(modules)) {
  const safeName = moduleMap[name];
  if (!safeName) continue;
  const script = path.join(SCRIPTS, `${safeName}.js`);
  if (!fs.existsSync(script)) continue;
  let body = fs.readFileSync(script, 'utf8');
  const before = body;
  for (const [request, target] of Object.entries(dependencies || {})) {
    const targetName = moduleMap[String(target)];
    if (!targetName) continue;
    for (const candidate of [request, `./${String(target)}`, `./${targetName}`]) {
      const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      body = body.replace(
        new RegExp(`(^|[^\\w$])e\\(["']${escaped}["']\\)`, 'gm'),
        `$1require(${JSON.stringify(`./${targetName}`)})`,
      );
      body = body.replace(
        new RegExp(`require\\(["']${escaped}["']\\)`, 'g'),
        `require(${JSON.stringify(`./${targetName}`)})`,
      );
    }
  }
  if (body !== before) {
    fs.writeFileSync(script, body);
    changedScripts += 1;
  }
  const classMatch = body.match(/cc\._RF\.push\([^,]+,\s*["']([^"']+)/);
  if (!classMatch) continue;
  const uuid = decodeUuid(classMatch[1]);
  const metaPath = `${script}.meta`;
  const data = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  if (data.uuid !== uuid) {
    data.uuid = uuid;
    fs.writeFileSync(metaPath, `${JSON.stringify(data, null, 2)}\n`);
    changedMetas += 1;
  }
}

const migrateSerializedUuids = (value) => {
  if (!value || typeof value !== 'object') return false;
  let changed = false;
  if (typeof value.__uuid__ === 'string') {
    const decoded = decodeUuid(value.__uuid__);
    if (decoded !== value.__uuid__) { value.__uuid__ = decoded; changed = true; }
  }
  for (const child of Array.isArray(value) ? value : Object.values(value)) {
    if (migrateSerializedUuids(child)) changed = true;
  }
  return changed;
};
const visitSerializedAssets = (folder) => {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) visitSerializedAssets(file);
    else if (/\.(fire|prefab|anim)$/.test(entry.name)) {
      try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (migrateSerializedUuids(data)) {
          fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
          changedSerializedAssets += 1;
        }
      } catch (_) { /* non-JSON source assets are left intact */ }
    }
  }
};
visitSerializedAssets(path.join(PROJECT, 'assets'));

const normalizeTextureMetas = (folder) => {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) normalizeTextureMetas(file);
    else if (/\.(png|jpe?g)\.meta$/i.test(entry.name)) {
      try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        let changed = data.ver !== '2.2.0' || data.type !== 'texture';
        data.ver = '2.2.0'; data.type = 'texture';
        if (!data.wrapMode) data.wrapMode = 'clamp';
        if (!data.filterMode) data.filterMode = 'bilinear';
        if (typeof data.premultiplyAlpha !== 'boolean') data.premultiplyAlpha = false;
        if (!data.subMetas) data.subMetas = {};
        for (const sub of Object.values(data.subMetas)) {
          if (sub.rawTextureUuid !== data.uuid) { sub.rawTextureUuid = data.uuid; changed = true; }
        }
        if (changed) {
          fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
          normalizedTextureMetas += 1;
        }
      } catch (_) { /* ignored */ }
    }
  }
};
normalizeTextureMetas(path.join(PROJECT, 'assets'));

const settingsSource = fs.readFileSync(path.join(REPORT, 'settings.js'), 'utf8');
const settingsContext = { window: {} };
vm.createContext(settingsContext);
vm.runInContext(settingsSource, settingsContext, { timeout: 5000 });
const settings = settingsContext.window._CCSettings;
const spriteFrames = [];
for (const [encoded, entry] of Object.entries(settings.rawAssets.assets || {})) {
  const packed = /^\d+$/.test(encoded) ? settings.uuids[Number(encoded)] : encoded;
  if (settings.assetTypes[entry[1]] === 'cc.SpriteFrame') {
    spriteFrames.push({ uuid: decodeUuid(packed), logical: entry[0] });
  }
}
const mapPath = path.join(REPORT, 'spriteframe-paths.json');
fs.writeFileSync(mapPath, `${JSON.stringify(spriteFrames, null, 2)}\n`);
execFileSync('python3', [path.join(__dirname, 'migrate-cocos-spriteframes.py'), PROJECT, mapPath], { stdio: 'inherit' });
console.log(`脚本依赖已修复 ${changedScripts} 个，数字模块已重命名 ${renamedScripts} 个，组件 UUID 已修复 ${changedMetas} 个，场景引用已迁移 ${changedSerializedAssets} 个，纹理 Meta 已规范化 ${normalizedTextureMetas} 个。`);
