#!/usr/bin/env node
/** Builds a contact sheet from extracted PNGs so crops can be eyeballed.
 *  usage: node tools/montage.js <regex> <out.png> [cols] [cellW] [cellH]
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require(path.join(__dirname, '../game/node_modules/pngjs'));

const DIR = path.join(__dirname, '../extracted-assets/img');
const re = new RegExp(process.argv[2] || '.');
const out = process.argv[3] || '/tmp/qjqp/out/montage.png';
const cols = Number(process.argv[4] || 12);
const cw = Number(process.argv[5] || 110);
const ch = Number(process.argv[6] || 150);

const files = fs
  .readdirSync(DIR)
  .filter((f) => re.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (!files.length) {
  console.error('no files match');
  process.exit(1);
}
const rows = Math.ceil(files.length / cols);
const sheet = new PNG({ width: cols * cw, height: rows * ch });
// checkerboard so transparency is visible
for (let y = 0; y < sheet.height; y++) {
  for (let x = 0; x < sheet.width; x++) {
    const i = (y * sheet.width + x) << 2;
    const c = ((x >> 3) + (y >> 3)) % 2 ? 210 : 170;
    sheet.data[i] = sheet.data[i + 1] = sheet.data[i + 2] = c;
    sheet.data[i + 3] = 255;
  }
}
files.forEach((f, idx) => {
  let src;
  try {
    src = PNG.sync.read(fs.readFileSync(path.join(DIR, f)));
  } catch {
    return;
  }
  const col = idx % cols;
  const row = (idx / cols) | 0;
  const scale = Math.min(1, (cw - 6) / src.width, (ch - 6) / src.height);
  const dw = Math.max(1, Math.round(src.width * scale));
  const dh = Math.max(1, Math.round(src.height * scale));
  const ox = col * cw + ((cw - dw) >> 1);
  const oy = row * ch + ((ch - dh) >> 1);
  for (let y = 0; y < dh; y++) {
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(src.width - 1, (x / scale) | 0);
      const sy = Math.min(src.height - 1, (y / scale) | 0);
      const si = (sy * src.width + sx) << 2;
      const di = ((oy + y) * sheet.width + ox + x) << 2;
      const a = src.data[si + 3] / 255;
      for (let k = 0; k < 3; k++) sheet.data[di + k] = Math.round(src.data[si + k] * a + sheet.data[di + k] * (1 - a));
      sheet.data[di + 3] = 255;
    }
  }
});
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, PNG.sync.write(sheet));
console.log(`${files.length} tiles -> ${out} (${sheet.width}x${sheet.height})`);
