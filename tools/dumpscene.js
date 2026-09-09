#!/usr/bin/env node
/**
 * Dumps a Cocos Creator imported scene/prefab JSON as a readable node tree,
 * resolving __id__ links, positions, sizes, sprite-frame names and labels.
 *
 * usage: node tools/dumpscene.js <SceneName|uuid> [maxDepth]
 */
const fs = require('fs');
const path = require('path');

const MAP = JSON.parse(fs.readFileSync('/tmp/qjqp/out/assetmap.json', 'utf8'));
const byUuid = new Map(MAP.assets.map((a) => [a.uuid, a]));

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
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}
function assetName(u) {
  const uuid = decodeUuid(u);
  const a = byUuid.get(uuid);
  if (!a) return `<${uuid.slice(0, 8)}>`;
  return a.name ? `${a.name}` : `<${a.type} ${uuid.slice(0, 8)}>`;
}

const target = process.argv[2];
const MAXD = Number(process.argv[3] || 99);
let rec = MAP.assets.find((a) => a.uuid === target) || MAP.assets.find((a) => a.name === target && a.type === 'cc.SceneOrPrefab');
if (!rec) {
  console.error('not found:', target);
  process.exit(1);
}
const D = JSON.parse(fs.readFileSync(rec.importFile, 'utf8'));
const get = (r) => (r && typeof r.__id__ === 'number' ? D[r.__id__] : null);

function num(n) {
  return typeof n === 'number' ? (Math.round(n * 100) / 100).toString() : '0';
}
function vec(v) {
  if (!v) return null;
  return `${num(v.x)},${num(v.y)}`;
}

function compInfo(c) {
  if (!c) return null;
  const t = c.__type__ || '?';
  const parts = [];
  if (t === 'cc.Sprite') {
    if (c._spriteFrame) parts.push(`spr=${assetName(c._spriteFrame.__uuid__)}`);
    if (c._type) parts.push(`type=${c._type}`);
    if (c._sizeMode !== undefined) parts.push(`sizeMode=${c._sizeMode}`);
    return `Sprite(${parts.join(' ')})`;
  }
  if (t === 'cc.Label') {
    const s = (c._string || '').replace(/\n/g, '\\n');
    parts.push(`"${s}"`);
    if (c._fontSize) parts.push(`fs=${c._fontSize}`);
    if (c._N$horizontalAlign !== undefined) parts.push(`hAlign=${c._N$horizontalAlign}`);
    if (c._N$file) parts.push(`font=${assetName(c._N$file.__uuid__)}`);
    return `Label(${parts.join(' ')})`;
  }
  if (t === 'cc.Button') return 'Button';
  if (t === 'cc.Widget') {
    const w = [];
    for (const k of ['_left', '_right', '_top', '_bottom']) if (c[k] !== undefined) w.push(`${k.slice(1)}=${num(c[k])}`);
    return `Widget(${w.join(' ')} align=${c._alignFlags})`;
  }
  if (t === 'cc.Layout') return `Layout(type=${c._N$layoutType} spacingX=${num(c._N$spacingX)} spacingY=${num(c._N$spacingY)})`;
  if (t === 'cc.Animation') return 'Animation';
  if (t === 'cc.ParticleSystem') return 'Particle';
  if (t === 'cc.Mask') return `Mask(${c._type})`;
  if (t === 'cc.ScrollView') return 'ScrollView';
  if (t === 'cc.ProgressBar') return 'ProgressBar';
  if (t === 'sp.Skeleton') return `Spine(${c._N$skeletonData ? assetName(c._N$skeletonData.__uuid__) : ''})`;
  if (t === 'dragonBones.ArmatureDisplay') return `DragonBones(${c._N$dragonAsset ? assetName(c._N$dragonAsset.__uuid__) : ''})`;
  return `Script(${t})`;
}

let lines = [];
function walkNode(ref, depth, prefix) {
  const n = get(ref);
  if (!n) return;
  const pos = n._position ? vec(n._position) : n._trs ? `${num(n._trs.array?.[0])},${num(n._trs.array?.[1])}` : '';
  const size = n._contentSize ? `${num(n._contentSize.width)}x${num(n._contentSize.height)}` : '';
  const anchor = n._anchorPoint ? vec(n._anchorPoint) : '';
  const scale = n._scale && (n._scale.x !== 1 || n._scale.y !== 1) ? ` scale=${vec(n._scale)}` : '';
  const active = n._active === false ? ' [inactive]' : '';
  const comps = (n._components || []).map((r) => compInfo(get(r))).filter(Boolean);
  const meta = [
    pos ? `pos=(${pos})` : '',
    size ? `size=${size}` : '',
    anchor && anchor !== '0.5,0.5' ? `anchor=(${anchor})` : '',
    scale,
    n._opacity !== undefined && n._opacity !== 255 ? `op=${n._opacity}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  lines.push(`${prefix}${n._name || '?'}${active}  ${meta}${comps.length ? '  { ' + comps.join(' | ') + ' }' : ''}`);
  if (depth >= MAXD) {
    if ((n._children || []).length) lines.push(`${prefix}  ...(${n._children.length} children)`);
    return;
  }
  for (const c of n._children || []) walkNode(c, depth + 1, prefix + '  ');
}

// find root: SceneAsset -> scene, or cc.Prefab -> data
const root = D[0];
console.log(`# ${rec.name}  (${rec.type})  file=${path.basename(rec.importFile)}  nodes=${D.length}`);
if (root.__type__ === 'cc.SceneAsset') walkNode(root.scene, 0, '');
else if (root.__type__ === 'cc.Prefab') walkNode(root.data, 0, '');
else walkNode({ __id__: 1 }, 0, '');
console.log(lines.join('\n'));
