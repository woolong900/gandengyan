#!/usr/bin/env node
/**
 * Rebuilds the reference APK's original asset tree using the uuid -> path map
 * recovered from settings.js, and reports which atlas each extracted sprite
 * frame came from (so mahjong-specific art can be told apart from shared UI).
 */
const fs = require('fs');
const path = require('path');

const MAP = JSON.parse(fs.readFileSync('/tmp/qjqp/out/uuid2path.json', 'utf8'));
const ASSETMAP = JSON.parse(fs.readFileSync('/tmp/qjqp/out/assetmap.json', 'utf8'));
const raw = new Map(ASSETMAP.rawByUuid);
const OUT = process.argv[2] || path.join(__dirname, '../extracted-assets/named');

const MAGIC = Buffer.from('aaabbbccc', 'latin1');
function deobfuscate(buf) {
  if (buf.length < 10 || !buf.subarray(0, 9).equals(MAGIC)) return buf;
  const key = buf[9];
  const out = Buffer.from(buf.subarray(10));
  for (let i = 0; i < out.length; i++) out[i] ^= key;
  return out;
}

let copied = 0;
let missing = 0;
for (const [uuid, relPath] of Object.entries(MAP)) {
  const src = raw.get(uuid);
  if (!src) {
    missing++;
    continue;
  }
  const dest = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, deobfuscate(fs.readFileSync(src)));
  copied++;
}
console.log({ copied, missing, out: OUT });

// ---- which atlas does each sprite frame belong to?
const atlasOfFrame = new Map();
for (const a of ASSETMAP.assets) {
  if (a.type !== 'cc.SpriteFrame' || !a.name || !a.texture) continue;
  const file = raw.get(a.texture);
  if (!file) continue;
  const uuid = path.basename(file).replace(/\.[^.]+$/, '');
  atlasOfFrame.set(a.name, MAP[uuid] || `<${uuid}>`);
}
fs.writeFileSync(
  '/tmp/qjqp/out/frame2atlas.json',
  JSON.stringify(Object.fromEntries(atlasOfFrame), null, 1)
);

const byDir = {};
for (const p of atlasOfFrame.values()) {
  const d = p.split('/').slice(0, 2).join('/');
  byDir[d] = (byDir[d] || 0) + 1;
}
console.log('\nsprite frames by source dir:');
console.log(
  Object.entries(byDir)
    .sort((a, b) => b[1] - a[1])
    .map(([d, c]) => `  ${String(c).padStart(5)}  ${d}`)
    .join('\n')
);
