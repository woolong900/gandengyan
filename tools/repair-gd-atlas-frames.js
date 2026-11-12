// Restore original R234 SpriteFrame geometry after Creator's recovered-atlas import.
// Source .meta files already carry the original values; patch the packed asset,
// not scene scale or shared runtime sprites. Run before calculating the PWA hash.
const fs = require('node:fs');
const path = require('node:path');
const NAMES = ['shuangshang', 'shuangxia', 'lipai', 'huifu', 'hengpai', 'shupai'];
function packedUuid(uuid) {
  const hex = uuid.replace(/-/g, '');
  return hex.slice(0, 2) + Buffer.from(hex.slice(2), 'hex').toString('base64');
}
function repair(build, metaFile = path.join(__dirname, '../cocos-client/assets/resources/_RecoveredDependencies/Textures/144a59770.png.meta'), names = NAMES) {
  const root = path.join(build, 'assets/resources');
  const configFile = path.join(root, 'config.json');
  if (!fs.existsSync(configFile)) return 0;
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  const metas = JSON.parse(fs.readFileSync(metaFile, 'utf8')).subMetas;
  const files = new Map();
  let present = 0;
  for (const name of names) {
    const meta = metas[name], encoded = packedUuid(meta.uuid);
    const index = config.uuids.findIndex(uuid => uuid === meta.uuid || uuid === encoded);
    if (index < 0) continue; // Older/other builds may not contain GuanDan.
    present++;
    const pack = Object.entries(config.packs || {}).find(([, ids]) => ids.includes(index));
    const id = pack ? pack[0] : meta.uuid;
    const folder = path.join(root, 'import', id.slice(0, 2));
    const candidates = fs.readdirSync(folder).filter(file => file === id + '.json' ||
      (file.startsWith(id + '.') && file.endsWith('.json')));
    if (candidates.length !== 1) throw Error('Ambiguous/missing GD import: ' + id);
    const file = path.join(folder, candidates[0]);
    if (!files.has(file)) files.set(file, []);
    files.get(file).push(name);
  }
  if (!present) return 0;
  if (present !== names.length) throw Error('Incomplete GD frame registration');
  let changed = 0;
  for (const [file, names] of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const before = JSON.stringify(data), found = new Map(names.map(name => [name, 0]));
    function visit(value) {
      if (!value || typeof value !== 'object') return;
      if (found.has(value.name) && Array.isArray(value.rect) && Array.isArray(value.originalSize)) {
        const meta = metas[value.name];
        found.set(value.name, found.get(value.name) + 1);
        value.rect = [meta.trimX, meta.trimY, meta.width, meta.height];
        value.offset = [meta.offsetX, meta.offsetY];
        value.originalSize = [meta.rawWidth, meta.rawHeight];
        if (meta.rotated) value.rotated = 1;
        else delete value.rotated;
        value.capInsets = [meta.borderLeft, meta.borderTop, meta.borderRight, meta.borderBottom];
      }
      Object.values(value).forEach(visit);
    }
    visit(data);
    for (const [name, count] of found) if (count !== 1) throw Error('Expected one GD SpriteFrame: ' + name + ', found ' + count);
    const after = JSON.stringify(data);
    if (before !== after) { fs.writeFileSync(file, after); changed++; }
  }
  return changed;
}
function repairMarkers(build) {
  return repair(build, path.join(__dirname, '../cocos-client/assets/resources/_RecoveredDependencies/Textures/140aeccfa.png.meta'), ['jipai_laizi', 'peipaibiao', 'jinLog', 'huanLog']);
}
module.exports = {repair, repairMarkers, NAMES};
if (require.main === module) console.log('GD atlas packs repaired: ' + repair(path.resolve(process.argv[2] || 'cocos-client/build/web-mobile')));
