#!/usr/bin/env node
/**
 * Dumps a Cocos Creator imported scene/prefab JSON as a readable node tree,
 * resolving __id__ links, positions, sizes, sprite-frame names and labels.
 *
 * usage: node tools/dumpscene.js <SceneName|uuid> [maxDepth] [--local]
 *
 * 坐标默认换算成**设计分辨率 1280x720 的屏幕坐标**（左上原点、y 向下），并且**累加了
 * 各级父节点的位移**——预制体里不少分组节点自身带偏移（如 CardLayer3D 的 left_gang_hide
 * 是 (6.94, -29.96)），照抄子节点的局部坐标会整块错位。要看原始局部坐标加 --local。
 */
const fs = require('fs');
const path = require('path');

const DESIGN_H = 720;
const MAP_FILE = '/tmp/qjqp/out/assetmap.json';
if (!fs.existsSync(MAP_FILE)) {
  console.error(`缺少 ${MAP_FILE}，先跑 node tools/analyze.js`);
  process.exit(1);
}
const MAP = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
const byUuid = new Map(MAP.assets.map((a) => [a.uuid, a]));

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const VALUES = new Array(128).fill(0);
for (let i = 0; i < B64.length; i++) VALUES[B64.charCodeAt(i)] = i;
const HEX = '0123456789abcdef';
/** cocos 压缩 UUID：前 2 位原样，其后每 2 个 base64 字符还原成 3 个 hex */
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
const args = process.argv.slice(3);
const LOCAL = args.includes('--local');
const MAXD = Number(args.find((a) => !a.startsWith('--')) || 99);
const rec =
  MAP.assets.find((a) => a.uuid === target) ||
  MAP.assets.find((a) => a.name === target && a.type === 'cc.SceneOrPrefab') ||
  MAP.assets.find((a) => a.name === target);
if (!rec) {
  console.error('not found:', target);
  process.exit(1);
}
const D = JSON.parse(fs.readFileSync(rec.importFile, 'utf8'));
/** 子节点/组件可能是 {__id__} 引用，也可能是内联对象 */
function deref(r) {
  if (!r || typeof r !== 'object') return null;
  if (typeof r.__id__ === 'number') return D[r.__id__];
  return r;
}

function num(n) {
  return typeof n === 'number' ? (Math.round(n * 100) / 100).toString() : '0';
}
function vec(v) {
  return v ? `${num(v.x)},${num(v.y)}` : null;
}

const SIZE_MODE = ['CUSTOM', 'TRIMMED', 'RAW'];
const SPRITE_TYPE = ['SIMPLE', 'SLICED', 'TILED', 'FILLED', 'MESH'];

function compInfo(c) {
  if (!c) return null;
  const t = c.__type__ || '?';
  const parts = [];
  if (t === 'cc.Sprite') {
    if (c._spriteFrame) parts.push(`spr=${assetName(c._spriteFrame.__uuid__)}`);
    if (c._type) parts.push(SPRITE_TYPE[c._type] || c._type);
    if (c._sizeMode) parts.push(SIZE_MODE[c._sizeMode] || c._sizeMode);
    if (c._enabled === false) parts.push('disabled');
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

const lines = [];
function walkNode(ref, depth, prefix, ax, ay) {
  const n = deref(ref);
  if (!n) return;
  const p = n._position || (n._trs ? { x: n._trs.array?.[0], y: n._trs.array?.[1] } : null);
  const gx = ax + (p?.x || 0);
  const gy = ay + (p?.y || 0);
  const size = n._contentSize ? `${num(n._contentSize.width)}x${num(n._contentSize.height)}` : '';
  const anchor = n._anchorPoint ? vec(n._anchorPoint) : '';
  const sc = n._scale || { x: n._scaleX ?? 1, y: n._scaleY ?? 1 };
  const meta = [
    `pos=(${num(gx)},${num(LOCAL ? gy : DESIGN_H - gy)})`,
    size ? `size=${size}` : '',
    anchor && anchor !== '0.5,0.5' ? `anchor=(${anchor})` : '',
    sc.x !== 1 || sc.y !== 1 ? `scale=${vec(sc)}` : '',
    n._eulerAngles?.z ? `euler=${num(n._eulerAngles.z)}` : '',
    n._skewX || n._skewY ? `skew=${num(n._skewX || 0)},${num(n._skewY || 0)}` : '',
    n._opacity !== undefined && n._opacity !== 255 ? `op=${n._opacity}` : '',
    n._active === false ? '[inactive]' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const comps = (n._components || []).map((r) => compInfo(deref(r))).filter(Boolean);
  lines.push(`${prefix}${n._name || '?'}  ${meta}${comps.length ? '  { ' + comps.join(' | ') + ' }' : ''}`);
  if (depth >= MAXD) {
    if ((n._children || []).length) lines.push(`${prefix}  ...(${n._children.length} children)`);
    return;
  }
  for (const c of n._children || []) walkNode(c, depth + 1, prefix + '  ', gx, gy);
}

const root = D[0];
const frame = LOCAL ? '局部坐标（cocos，y 向上）' : '屏幕坐标（1280x720，左上原点，已累加父偏移）';
console.log(`# ${rec.name}  (${rec.type})  file=${path.basename(rec.importFile)}  nodes=${D.length}  ${frame}`);
if (root.__type__ === 'cc.SceneAsset') walkNode(root.scene, 0, '', 0, 0);
else if (root.__type__ === 'cc.Prefab') walkNode(root.data, 0, '', 0, 0);
else walkNode({ __id__: 1 }, 0, '', 0, 0);
console.log(lines.join('\n'));
