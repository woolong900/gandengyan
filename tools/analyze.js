#!/usr/bin/env node
/**
 * Analyzes the extracted Cocos Creator APK: decodes compressed UUID references,
 * builds a uuid -> {name, type, rawFile} map, and reports scenes/prefabs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '/tmp/qjqp/extracted/assets/res';
const IMPORT = path.join(ROOT, 'import');
const RAW = path.join(ROOT, 'raw-assets');

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const VALUES = new Array(128).fill(0);
for (let i = 0; i < B64.length; i++) VALUES[B64.charCodeAt(i)] = i;
const HEX = '0123456789abcdef';

function decodeUuid(base64) {
  const short = base64.split('@')[0];
  if (short.length !== 22) return base64;
  let hex = short[0] + short[1];
  for (let i = 2; i < 22; i += 2) {
    const lhs = VALUES[short.charCodeAt(i)];
    const rhs = VALUES[short.charCodeAt(i + 1)];
    hex += HEX[lhs >> 2] + HEX[((lhs & 3) << 2) | (rhs >> 4)] + HEX[rhs & 0xf];
  }
  const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  return base64.replace(short, uuid);
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// ---- index raw assets by uuid
const rawByUuid = new Map();
for (const f of walk(RAW)) {
  const base = path.basename(f);
  const uuid = base.slice(0, base.lastIndexOf('.') > 0 ? base.lastIndexOf('.') : base.length);
  rawByUuid.set(uuid, f);
}

// ---- parse import jsons
const assets = new Map(); // uuid -> record
const typeCount = {};
const importFiles = walk(IMPORT).filter((f) => f.endsWith('.json'));

for (const f of importFiles) {
  const uuid = path.basename(f, '.json');
  let data;
  try {
    data = JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {
    continue;
  }
  let type = Array.isArray(data) ? 'cc.SceneOrPrefab' : data.__type__ || 'unknown';
  let name = null;
  if (!Array.isArray(data) && data.content) {
    name = data.content.name || null;
  }
  if (Array.isArray(data)) {
    // scene/prefab: array of objects; find the asset root name
    const flat = Array.isArray(data[0]) ? data[0] : data;
    for (const o of flat) {
      if (o && (o.__type__ === 'cc.Prefab' || o.__type__ === 'cc.SceneAsset') && o._name) {
        name = o._name;
        break;
      }
    }
    if (!name) {
      for (const o of flat) {
        if (o && o.__type__ === 'cc.Node' && o._name) {
          name = o._name;
          break;
        }
      }
    }
  }
  typeCount[type] = (typeCount[type] || 0) + 1;
  assets.set(uuid, { uuid, type, name, importFile: f, size: fs.statSync(f).size });
}

// ---- link sprite frames to textures
const spriteFrames = [];
for (const rec of assets.values()) {
  if (rec.type !== 'cc.SpriteFrame') continue;
  const data = JSON.parse(fs.readFileSync(rec.importFile, 'utf8'));
  const texUuid = data.content.texture ? decodeUuid(data.content.texture) : null;
  rec.texture = texUuid;
  rec.rect = data.content.rect;
  rec.originalSize = data.content.originalSize;
  spriteFrames.push(rec);
  if (texUuid && rawByUuid.has(texUuid)) rec.rawFile = rawByUuid.get(texUuid);
}

const out = {
  typeCount,
  totals: {
    importFiles: importFiles.length,
    rawAssets: rawByUuid.size,
    spriteFrames: spriteFrames.length,
  },
  assets: [...assets.values()],
  rawByUuid: [...rawByUuid.entries()],
};
fs.mkdirSync('/tmp/qjqp/out', { recursive: true });
fs.writeFileSync('/tmp/qjqp/out/assetmap.json', JSON.stringify(out, null, 1));

console.log('types:', typeCount);
console.log('totals:', out.totals);
const named = spriteFrames.filter((s) => s.name);
console.log('named spriteframes:', named.length);
console.log('\nsample sprite names:');
console.log(
  named
    .slice(0, 40)
    .map((s) => `  ${s.name} ${s.originalSize && s.originalSize.join('x')} ${s.rawFile ? '[tex]' : ''}`)
    .join('\n')
);
const scenes = [...assets.values()].filter((a) => a.type === 'cc.SceneOrPrefab');
console.log('\nscene/prefab-like files:', scenes.length);
console.log(
  scenes
    .sort((a, b) => b.size - a.size)
    .slice(0, 30)
    .map((s) => `  ${String(s.size).padStart(8)} ${s.name || '?'} ${path.basename(s.importFile)}`)
    .join('\n')
);
