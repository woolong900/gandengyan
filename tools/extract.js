#!/usr/bin/env node
/**
 * Extracts named sprite frames out of the reference APK's packed atlases into
 * individual PNGs, plus audio clips and fonts.
 *
 * Sprite frames are stored trimmed inside atlases; we re-expand each onto its
 * original (untrimmed) canvas using the recorded offset so that art lines up
 * exactly the way the reference game positions it.
 *
 * usage: node tools/extract.js [outDir]
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require(path.join(__dirname, '../game/node_modules/pngjs'));

const OUT = process.argv[2] || path.join(__dirname, '../extracted-assets');
const MAP = JSON.parse(fs.readFileSync('/tmp/qjqp/out/assetmap.json', 'utf8'));
const raw = new Map(MAP.rawByUuid);

const imgDir = path.join(OUT, 'img');
const audioDir = path.join(OUT, 'audio');
const fontDir = path.join(OUT, 'font');
for (const d of [imgDir, audioDir, fontDir]) fs.mkdirSync(d, { recursive: true });

// ---------- sprite frames ----------
const frames = MAP.assets.filter((a) => a.type === 'cc.SpriteFrame' && a.name && a.texture && raw.has(a.texture));

// disambiguate duplicate names by original size
const nameCount = new Map();
for (const f of frames) {
  const key = f.name;
  const sz = (f.originalSize || []).join('x');
  if (!nameCount.has(key)) nameCount.set(key, new Set());
  nameCount.get(key).add(sz);
}

// Textures in the reference APK are obfuscated as:
//   "aaabbbccc" magic (9 bytes) + 1 key byte + payload XOR key
const MAGIC = Buffer.from('aaabbbccc', 'latin1');
function deobfuscate(buf) {
  if (buf.length < 10 || !buf.subarray(0, 9).equals(MAGIC)) return buf;
  const key = buf[9];
  const out = Buffer.from(buf.subarray(10));
  for (let i = 0; i < out.length; i++) out[i] ^= key;
  return out;
}

const texCache = new Map();
function loadTex(uuid) {
  if (texCache.has(uuid)) return texCache.get(uuid);
  if (texCache.size > 24) texCache.clear();
  let png = null;
  try {
    png = PNG.sync.read(deobfuscate(fs.readFileSync(raw.get(uuid))));
  } catch (e) {
    png = null;
  }
  texCache.set(uuid, png);
  return png;
}

// group frames by texture so each atlas is decoded once
const byTex = new Map();
for (const f of frames) {
  if (!byTex.has(f.texture)) byTex.set(f.texture, []);
  byTex.get(f.texture).push(f);
}

let written = 0;
let failed = 0;
const manifest = [];

for (const [texUuid, list] of byTex) {
  const src = loadTex(texUuid);
  if (!src) {
    failed += list.length;
    continue;
  }
  for (const f of list) {
    const full = JSON.parse(fs.readFileSync(f.importFile, 'utf8')).content;
    const [rx, ry, rw, rh] = full.rect;
    const [ow, oh] = full.originalSize;
    const off = full.offset || [0, 0];
    const rotated = !!full.rotated;
    const outW = Math.max(1, Math.round(ow));
    const outH = Math.max(1, Math.round(oh));
    const dst = new PNG({ width: outW, height: outH });
    dst.data.fill(0);

    // `rect` is already in display orientation; when `rotated` is set the
    // pixels are stored transposed in the atlas (region is rh wide, rw tall).
    // `offset` is the trimmed rect's center delta on the original canvas (y-up).
    const dw = rw;
    const dh = rh;
    const dx = Math.round((ow - dw) / 2 + off[0]);
    const dy = Math.round((oh - dh) / 2 - off[1]);

    for (let y = 0; y < dh; y++) {
      for (let x = 0; x < dw; x++) {
        const tx = dx + x;
        const ty = dy + y;
        if (tx < 0 || ty < 0 || tx >= outW || ty >= outH) continue;
        const sx = rotated ? rx + (rh - 1 - y) : rx + x;
        const sy = rotated ? ry + x : ry + y;
        if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) continue;
        const si = (sy * src.width + sx) << 2;
        const di = (ty * outW + tx) << 2;
        dst.data[di] = src.data[si];
        dst.data[di + 1] = src.data[si + 1];
        dst.data[di + 2] = src.data[si + 2];
        dst.data[di + 3] = src.data[si + 3];
      }
    }

    const sizes = nameCount.get(f.name);
    const suffix = sizes.size > 1 ? `@${ow}x${oh}` : '';
    const safe = f.name.replace(/[^\w.\-+]/g, '_');
    const file = `${safe}${suffix}.png`;
    fs.writeFileSync(path.join(imgDir, file), PNG.sync.write(dst));
    manifest.push({ file, name: f.name, w: ow, h: oh, atlas: path.basename(raw.get(texUuid)) });
    written++;
  }
}

// ---------- audio + fonts ----------
let audio = 0;
let fonts = 0;
for (const [uuid, file] of raw) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.mp3' || ext === '.ogg') {
    fs.writeFileSync(path.join(audioDir, `${uuid}${ext}`), deobfuscate(fs.readFileSync(file)));
    audio++;
  } else if (ext === '.ttf') {
    fs.writeFileSync(path.join(fontDir, `${uuid}${ext}`), deobfuscate(fs.readFileSync(file)));
    fonts++;
  }
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log({ written, failed, audio, fonts, out: OUT });
