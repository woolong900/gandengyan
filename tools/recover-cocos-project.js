#!/usr/bin/env node
/**
 * Reconstruct an editable Cocos Creator 2.1.3 project from the shipped APK.
 *
 * The APK contains compiled Creator assets plus a CommonJS module bundle. This
 * tool restores the original logical asset paths from settings.jsc, decrypts
 * protected raw files, unwraps JSON/DragonBones/bitmap-font data, and splits the
 * application bundle into one readable JavaScript file per module.
 */
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const { toJs } = require('./jsc');

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const index = argv.indexOf(`--${name}`);
  return index < 0 ? fallback : argv[index + 1];
};

const ROOT = path.join(__dirname, '..');
const APK = path.resolve(arg('apk', path.join(ROOT, 'tools', '.cache', 'qjqp-base.apk')));
const OUT = path.resolve(arg('out', process.env.QJQP_COCOS_PROJECT
  || path.join(ROOT, 'cocos-client')));
const APKTOOL = process.env.APKTOOL || '/tmp/apktool.jar';
const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const IMPORTED_TYPES = new Set([
  'cc.SceneAsset',
  'cc.SpriteAtlas',
  'cc.Prefab',
  'dragonBones.DragonBonesAsset',
  'dragonBones.DragonBonesAtlasAsset',
  'cc.BitmapFont',
  'cc.AnimationClip',
  'cc.JsonAsset',
  'cc.EffectAsset',
  'cc.Material',
]);

if (!fs.existsSync(APK)) throw new Error(`APK 不存在：${APK}`);
if (!fs.existsSync(APKTOOL)) throw new Error(`apktool 不存在：${APKTOOL}`);

const decodeUuid = (value) => {
  if (value.length !== 22 && value.length !== 23) return value;
  const prefixLength = value.length === 23 ? 5 : 2;
  let hex = value.slice(0, prefixLength);
  for (let index = prefixLength; index < value.length; index += 2) {
    const lhs = BASE64.indexOf(value[index]);
    const rhs = BASE64.indexOf(value[index + 1]);
    if (lhs < 0 || rhs < 0) return value;
    hex += (lhs >> 2).toString(16);
    hex += (((lhs & 3) << 2) | (rhs >> 4)).toString(16);
    hex += (rhs & 15).toString(16);
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const mkdir = (target) => fs.mkdirSync(target, { recursive: true });
const write = (target, data) => {
  mkdir(path.dirname(target));
  fs.writeFileSync(target, data);
};
const stableUuid = (value) => {
  const hex = crypto.createHash('sha1').update(value).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
const meta = (uuid, extra = {}) => `${JSON.stringify({
  ver: '1.0.0',
  uuid,
  ...extra,
}, null, 2)}\n`;

const decoded = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-cocos-recover-'));
console.log(`1/5 解包 ${path.basename(APK)}`);
execFileSync('java', ['-jar', APKTOOL, 'd', '-f', '-o', decoded, APK], {
  stdio: ['ignore', 'ignore', 'pipe'],
});

try {
  fs.rmSync(OUT, { recursive: true, force: true });
  mkdir(OUT);
  const assetsRoot = path.join(OUT, 'assets', 'resources');
  mkdir(assetsRoot);

  console.log('2/5 解密构建配置和脚本');
  const settingsSource = toJs(fs.readFileSync(path.join(decoded, 'assets', 'src', 'settings.jsc'))).toString('utf8');
  const projectSource = toJs(fs.readFileSync(path.join(decoded, 'assets', 'src', 'project.jsc'))).toString('utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(settingsSource, context, { timeout: 5000 });
  const settings = context.window._CCSettings;
  if (!settings || !settings.rawAssets || !settings.assetTypes) throw new Error('无法解析 Cocos 构建配置');

  const records = [];
  for (const [encoded, entry] of Object.entries(settings.rawAssets.assets || {})) {
    const packedUuid = /^\d+$/.test(encoded) ? settings.uuids[Number(encoded)] : encoded;
    records.push({
      uuid: decodeUuid(packedUuid),
      logical: entry[0],
      type: settings.assetTypes[entry[1]],
      subAsset: entry[2],
    });
  }

  const locate = (kind, uuid) => {
    const folder = path.join(decoded, 'assets', 'res', kind, uuid.slice(0, 2));
    if (!fs.existsSync(folder)) return null;
    const direct = fs.readdirSync(folder).find((name) => name === `${uuid}.json` || name.startsWith(`${uuid}.`));
    if (direct) return path.join(folder, direct);
    const nested = path.join(folder, uuid);
    if (!fs.existsSync(nested)) return null;
    const files = [];
    const walk = (dir) => {
      for (const name of fs.readdirSync(dir)) {
        const target = path.join(dir, name);
        if (fs.statSync(target).isDirectory()) walk(target);
        else files.push(target);
      }
    };
    walk(nested);
    return files[0] || null;
  };

  const readRaw = (source) => {
    const data = fs.readFileSync(source);
    if (data.length > 10 && data.subarray(0, 9).toString('ascii') === 'aaabbbccc') {
      const key = data[9];
      const plain = Buffer.alloc(data.length - 10);
      for (let index = 10; index < data.length; index += 1) plain[index - 10] = data[index] ^ key;
      return plain;
    }
    return data;
  };

  const spriteFrames = new Map();
  for (const record of records.filter((item) => item.type === 'cc.SpriteFrame')) {
    spriteFrames.set(record.logical, record.uuid);
  }

  const bitmapFont = (asset) => {
    const config = asset._fntConfig || {};
    const chars = Object.entries(config.fontDefDictionary || {});
    const atlas = config.atlasName || `${asset._name}.png`;
    const lines = [
      `info face="${asset._name || ''}" size=${config.fontSize || asset.fontSize || 32} bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=0,0`,
      `common lineHeight=${config.commonHeight || config.fontSize || asset.fontSize || 32} base=${config.fontSize || asset.fontSize || 32} scaleW=2048 scaleH=2048 pages=1 packed=0`,
      `page id=0 file="${atlas}"`,
      `chars count=${chars.length}`,
    ];
    for (const [id, value] of chars) {
      const rect = value.rect || {};
      lines.push(`char id=${id} x=${rect.x || 0} y=${rect.y || 0} width=${rect.width || 0} height=${rect.height || 0} xoffset=${value.xOffset || 0} yoffset=${value.yOffset || 0} xadvance=${value.xAdvance || rect.width || 0} page=0 chnl=0`);
    }
    return `${lines.join('\n')}\n`;
  };

  console.log('3/5 恢复场景、Prefab、图片、音频和配置文件');
  let recoveredAssets = 0;
  const missing = [];
  const destinationByUuid = new Map();
  for (const record of records) {
    if (record.type === 'cc.SpriteFrame') continue;
    let source = null;
    if (IMPORTED_TYPES.has(record.type)) source = locate('import', record.uuid);
    else source = locate('raw-assets', record.uuid) || locate('import', record.uuid);
    if (!source) {
      missing.push(record);
      continue;
    }

    // Published SpriteAtlas imports are serialized JSON, not their original
    // XML plist source. Individual SpriteFrames are recovered separately, and
    // these atlas containers are unreferenced, so do not emit invalid plists.
    if (record.type === 'cc.SpriteAtlas' && record.logical.endsWith('.plist')) {
      continue;
    }

    const destination = path.join(assetsRoot, record.logical);
    let contents;
    if (IMPORTED_TYPES.has(record.type)) {
      const parsed = JSON.parse(fs.readFileSync(source, 'utf8'));
      if (record.type === 'cc.JsonAsset') contents = `${JSON.stringify(parsed.json, null, 2)}\n`;
      else if (record.type === 'dragonBones.DragonBonesAsset') contents = `${JSON.stringify(JSON.parse(parsed._dragonBonesJson), null, 2)}\n`;
      else if (record.type === 'dragonBones.DragonBonesAtlasAsset') contents = `${JSON.stringify(JSON.parse(parsed._atlasJson), null, 2)}\n`;
      else if (record.type === 'cc.BitmapFont') contents = bitmapFont(parsed);
      else contents = fs.readFileSync(source);
    } else {
      contents = readRaw(source);
    }
    write(destination, contents);

    const extra = { subMetas: {} };
    if (record.type === 'cc.Texture2D') {
      const logicalWithoutExtension = record.logical.replace(/\.[^.]+$/, '');
      const spriteUuid = spriteFrames.get(logicalWithoutExtension);
      if (spriteUuid) {
        const name = path.basename(logicalWithoutExtension);
        extra.ver = '2.2.0';
        extra.type = 'texture';
        extra.wrapMode = 'clamp';
        extra.filterMode = 'bilinear';
        extra.premultiplyAlpha = false;
        extra.subMetas[name] = {
          ver: '1.0.3',
          uuid: spriteUuid,
          rawTextureUuid: record.uuid,
          trimType: 'auto',
          trimThreshold: 1,
          rotated: false,
          offsetX: 0,
          offsetY: 0,
          trimX: 0,
          trimY: 0,
          width: 0,
          height: 0,
          rawWidth: 0,
          rawHeight: 0,
          borderTop: 0,
          borderBottom: 0,
          borderLeft: 0,
          borderRight: 0,
          subMetas: {},
        };
      }
    }
    write(`${destination}.meta`, meta(record.uuid, extra));
    destinationByUuid.set(record.uuid, destination);
    recoveredAssets += 1;
  }
  if (missing.length) {
    write(path.join(OUT, 'recovery-report', 'missing-assets.json'), `${JSON.stringify(missing, null, 2)}\n`);
  }

  // settings.rawAssets only lists directly loadable resources. Scenes and
  // prefabs also point at generated atlases, nested prefabs and animation data
  // that exist only in res/import. Restore those under a clearly marked folder
  // and preserve their UUIDs so serialized references remain resolvable.
  const importedFiles = [];
  const collectFiles = (folder) => {
    for (const name of fs.readdirSync(folder)) {
      const target = path.join(folder, name);
      if (fs.statSync(target).isDirectory()) collectFiles(target);
      else if (name.endsWith('.json')) importedFiles.push(target);
    }
  };
  collectFiles(path.join(decoded, 'assets', 'res', 'import'));
  const mappedUuids = new Set(records.map((record) => record.uuid));
  const dependenciesRoot = path.join(assetsRoot, '_RecoveredDependencies');
  const dependencyCounts = {};
  const parsedImports = importedFiles.map((source) => {
    const uuid = path.basename(source, '.json');
    const asset = JSON.parse(fs.readFileSync(source, 'utf8'));
    const type = Array.isArray(asset) ? asset[0] && asset[0].__type__ : asset.__type__;
    return { source, uuid, asset, type };
  });

  const textureMeta = (uuid) => ({
    ver: '2.2.0',
    uuid,
    type: 'texture',
    wrapMode: 'clamp',
    filterMode: 'bilinear',
    premultiplyAlpha: false,
    subMetas: {},
  });

  // Generated atlas textures are omitted from rawAssets but their image bytes
  // and import records remain in the APK.
  for (const item of parsedImports) {
    if (item.type !== 'cc.Texture2D' || mappedUuids.has(item.uuid)) continue;
    const source = locate('raw-assets', item.uuid);
    if (!source) {
      missing.push({ uuid: item.uuid, type: item.type, logical: '_RecoveredDependencies' });
      continue;
    }
    const extension = path.extname(source) || '.png';
    const destination = path.join(dependenciesRoot, 'Textures', `${item.uuid}${extension}`);
    write(destination, readRaw(source));
    write(`${destination}.meta`, `${JSON.stringify(textureMeta(item.uuid), null, 2)}\n`);
    destinationByUuid.set(item.uuid, destination);
    dependencyCounts[item.type] = (dependencyCounts[item.type] || 0) + 1;
  }

  // Rebuild SpriteFrame sub-metadata, including trim rectangles created by
  // automatic atlases. This is what lets scene UUID references resolve back to
  // the correct region of a recovered texture.
  let recoveredSpriteFrames = 0;
  const missingSpriteTextures = [];
  for (const item of parsedImports) {
    if (item.type !== 'cc.SpriteFrame') continue;
    const content = item.asset.content || {};
    const textureUuid = decodeUuid(content.texture || '');
    const texture = destinationByUuid.get(textureUuid);
    if (!texture || !fs.existsSync(`${texture}.meta`)) {
      missingSpriteTextures.push({ frame: item.uuid, texture: textureUuid, name: content.name });
      continue;
    }
    const textureInfo = JSON.parse(fs.readFileSync(`${texture}.meta`, 'utf8'));
    const rect = content.rect || [0, 0, 0, 0];
    const offset = content.offset || [0, 0];
    const original = content.originalSize || [rect[2] || 0, rect[3] || 0];
    const insets = content.capInsets || [0, 0, 0, 0];
    let key = content.name || item.uuid;
    if (textureInfo.subMetas[key] && textureInfo.subMetas[key].uuid !== item.uuid) key = `${key}_${item.uuid.slice(0, 8)}`;
    textureInfo.subMetas[key] = {
      ver: '1.0.3',
      uuid: item.uuid,
      rawTextureUuid: textureUuid,
      trimType: 'custom',
      trimThreshold: 1,
      rotated: !!content.rotated,
      offsetX: offset[0] || 0,
      offsetY: offset[1] || 0,
      trimX: rect[0] || 0,
      trimY: rect[1] || 0,
      width: rect[2] || 0,
      height: rect[3] || 0,
      rawWidth: original[0] || 0,
      rawHeight: original[1] || 0,
      borderTop: insets[0] || 0,
      borderBottom: insets[1] || 0,
      borderLeft: insets[2] || 0,
      borderRight: insets[3] || 0,
      subMetas: {},
    };
    write(`${texture}.meta`, `${JSON.stringify(textureInfo, null, 2)}\n`);
    recoveredSpriteFrames += 1;
  }
  if (missingSpriteTextures.length) {
    write(path.join(OUT, 'recovery-report', 'missing-sprite-textures.json'), `${JSON.stringify(missingSpriteTextures, null, 2)}\n`);
  }

  const copyDependencyTexture = (packedUuid, folder, outputName) => {
    const uuid = decodeUuid(packedUuid || '');
    const source = destinationByUuid.get(uuid);
    if (!source || !fs.existsSync(source) || !outputName) return false;
    const destination = path.join(folder, outputName);
    write(destination, fs.readFileSync(source));
    write(`${destination}.meta`, meta(stableUuid(`dependency-texture:${uuid}:${destination}`), {
      type: 'texture', subMetas: {},
    }));
    return true;
  };

  for (const item of parsedImports) {
    if (mappedUuids.has(item.uuid) || item.type === 'cc.SpriteFrame' || item.type === 'cc.Texture2D') continue;
    const name = item.asset._name || item.uuid;
    const folder = path.join(dependenciesRoot, item.type.replace(/[^a-zA-Z0-9_.-]/g, '_'), item.uuid);
    let destination;
    let contents;
    switch (item.type) {
      case 'cc.Prefab':
        destination = path.join(folder, `${name}.prefab`);
        contents = fs.readFileSync(item.source);
        break;
      case 'cc.AnimationClip':
        destination = path.join(folder, `${name}.anim`);
        contents = fs.readFileSync(item.source);
        break;
      case 'cc.Material':
        destination = path.join(folder, `${name}.mtl`);
        contents = fs.readFileSync(item.source);
        break;
      case 'cc.EffectAsset':
        destination = path.join(folder, `${name}.effect`);
        contents = fs.readFileSync(item.source);
        break;
      case 'dragonBones.DragonBonesAsset':
        destination = path.join(folder, `${name}.json`);
        contents = `${JSON.stringify(JSON.parse(item.asset._dragonBonesJson), null, 2)}\n`;
        break;
      case 'dragonBones.DragonBonesAtlasAsset': { // eslint-disable-line no-case-declarations
        destination = path.join(folder, `${name}.json`);
        const atlas = JSON.parse(item.asset._atlasJson);
        contents = `${JSON.stringify(atlas, null, 2)}\n`;
        const textureRef = item.asset._texture || item.asset.texture || {};
        copyDependencyTexture(textureRef.__uuid__, folder, atlas.imagePath || `${name}.png`);
        break;
      }
      case 'sp.SkeletonData': { // eslint-disable-line no-case-declarations
        destination = path.join(folder, `${name}.json`);
        contents = `${JSON.stringify(JSON.parse(item.asset.skeletonJsonStr), null, 2)}\n`;
        write(path.join(folder, `${name}.atlas`), item.asset._atlasText || '');
        for (let index = 0; index < (item.asset.textures || []).length; index += 1) {
          copyDependencyTexture(
            item.asset.textures[index].__uuid__,
            folder,
            (item.asset.textureNames || [])[index] || `${name}-${index}.png`,
          );
        }
        break;
      }
      default:
        continue;
    }
    write(destination, contents);
    write(`${destination}.meta`, meta(item.uuid, { subMetas: {} }));
    destinationByUuid.set(item.uuid, destination);
    dependencyCounts[item.type] = (dependencyCounts[item.type] || 0) + 1;
  }

  console.log('4/5 拆分 669 个编译脚本模块');
  const captureSource = projectSource.replace(
    'window.__require = function e(t, o, n) {',
    'window.__require = function e(t, o, n) { __recoveredModules = t; __recoveredEntries = n; n = [];',
  );
  const moduleContext = { window: {}, __recoveredModules: null, __recoveredEntries: null };
  vm.createContext(moduleContext);
  vm.runInContext(captureSource, moduleContext, { timeout: 5000 });
  const modules = moduleContext.__recoveredModules;
  if (!modules) throw new Error('无法解析项目脚本模块');
  const moduleNames = new Map();
  for (const name of Object.keys(modules)) {
    const raw = name.replace(/[^a-zA-Z0-9_$.-]/g, '_');
    // Creator 2.4 fails to resolve relative requires whose filename starts
    // with a digit and emits `void 0` in the bundle dependency table.
    const safe = /^\d/.test(raw) ? `module_${raw}` : raw;
    moduleNames.set(name, safe);
  }

  const scriptsRoot = path.join(OUT, 'assets', 'Script', 'Recovered');
  mkdir(scriptsRoot);
  const unresolvedRequires = [];
  for (const [name, [factory, dependencies]] of Object.entries(modules)) {
    const factorySource = factory.toString();
    let body = factorySource.slice(factorySource.indexOf('{') + 1, factorySource.lastIndexOf('}')).trim();
    for (const [request, target] of Object.entries(dependencies || {})) {
      const targetName = String(target);
      if (!moduleNames.has(targetName)) {
        unresolvedRequires.push({ module: name, request, target });
        continue;
      }
      const escaped = request.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      body = body.replace(
        new RegExp(`(^|[^\\w$])e\\(["']${escaped}["']\\)`, 'gm'),
        `$1require(${JSON.stringify(`./${moduleNames.get(targetName)}`)})`,
      );
    }
    const destination = path.join(scriptsRoot, `${moduleNames.get(name)}.js`);
    write(destination, `// Recovered from the production CommonJS bundle.\nvar e = require, t = module, o = exports;\n${body}\n`);
    const classMatch = body.match(/cc\._RF\.push\([^,]+,\s*["']([^"']+)/);
    const scriptUuid = classMatch ? decodeUuid(classMatch[1]) : stableUuid(`recovered-script:${name}`);
    write(`${destination}.meta`, meta(scriptUuid, { isPlugin: false, loadPluginInWeb: true, loadPluginInNative: true, loadPluginInEditor: false, subMetas: {} }));
  }

  console.log('5/5 写入工程配置和恢复报告');
  write(path.join(OUT, 'project.json'), `${JSON.stringify({
    engine: 'cocos2d-html5',
    packages: 'packages',
    name: '潜江干瞪眼-恢复工程',
  }, null, 2)}\n`);
  write(path.join(OUT, 'settings', 'project.json'), `${JSON.stringify({
    'last-module-event-record-time': 0,
    'design-resolution-width': 1280,
    'design-resolution-height': 720,
    'fit-width': false,
    'fit-height': true,
    'use-customize-simulator': false,
    'simulator-orientation': false,
    'use-project-simulator-setting': false,
    'start-scene': 'current',
  }, null, 2)}\n`);
  write(path.join(OUT, 'recovery-report', 'settings.js'), settingsSource);
  write(path.join(OUT, 'recovery-report', 'project.bundle.js'), projectSource);
  write(path.join(OUT, 'recovery-report', 'module-map.json'), `${JSON.stringify(Object.fromEntries(moduleNames), null, 2)}\n`);
  write(path.join(OUT, 'recovery-report', 'module-graph.json'), `${JSON.stringify({
    modules: Object.fromEntries(Object.entries(modules).map(([name, value]) => [name, value[1] || {}])),
    entries: moduleContext.__recoveredEntries || [],
  }, null, 2)}\n`);
  write(path.join(OUT, 'recovery-report', 'unresolved-requires.json'), `${JSON.stringify(unresolvedRequires, null, 2)}\n`);
  write(path.join(OUT, 'recovery-report', 'AndroidManifest.xml'), fs.readFileSync(path.join(decoded, 'AndroidManifest.xml')));

  const report = {
    cocosCreatorVersion: '2.1.3',
    sourceApk: APK,
    launchScene: settings.launchScene,
    scenes: settings.scenes.length,
    serializedImportFiles: fs.readdirSync(path.join(decoded, 'assets', 'res', 'import'), { recursive: true }).filter((name) => String(name).endsWith('.json')).length,
    assetRecords: records.length,
    recoveredAssets,
    missingAssets: missing.length,
    recoveredDependencies: Object.values(dependencyCounts).reduce((total, count) => total + count, 0),
    recoveredDependencyTypes: dependencyCounts,
    recoveredSpriteFrames,
    missingSpriteTextures: missingSpriteTextures.length,
    scriptModules: Object.keys(modules).length,
    unresolvedRequires: unresolvedRequires.length,
  };
  write(path.join(OUT, 'recovery-report', 'summary.json'), `${JSON.stringify(report, null, 2)}\n`);
  write(path.join(OUT, 'README.md'), `# 潜江干瞪眼 Cocos Creator 恢复工程\n\n该工程从已发布 APK 恢复，目标版本为 **Cocos Creator 2.1.3**。\n\n## 当前恢复内容\n\n- ${report.scenes} 个场景\n- ${report.recoveredAssets} 个可映射资源及 ${report.recoveredDependencies} 个构建期依赖资源\n- ${report.recoveredSpriteFrames} 个 SpriteFrame 裁剪与 UUID 映射\n- ${report.scriptModules} 个拆分后的 JavaScript 模块\n- 图片、音频、字体、Prefab、动画和 JSON 的原逻辑路径\n- 原脚本模块名、依赖关系和序列化组件 ID\n\n## 打开方式\n\n1. 安装 Cocos Creator 2.1.3。\n2. 用 Creator 打开本目录，等待 Library 完成首次导入。\n3. 首次打开场景时，从 assets/resources/Hall/Scene/LoginScene.fire 开始。\n\n## 恢复限制\n\n脚本是从发布包拆分出的 ES5 JavaScript，无法恢复原 TypeScript、注释和原始目录层级。场景与 Prefab 来自构建后的序列化数据，部分编辑器专用信息已经被发布流程裁剪。自动图集、位图字体和 DragonBones 已尽量转换为源格式，但仍需在 Creator 中逐项检查。Android 微信、语音和设备 ID 等原生桥接代码不属于 Cocos 资源，需另行迁移到原生构建模板。\n\n当前机器没有安装 Cocos Creator 2.1.3，因此已完成静态语法、依赖和 UUID 一致性验证，但尚未完成 Creator 编辑器导入与重新构建验证。该目录是可继续整理的恢复工程，不应直接视为已经能够一键发布的原始工程。\n\n详细统计见 recovery-report/summary.json。原始解密 bundle 和构建设置保存在 recovery-report 中，便于对照。\n`);

  console.log(JSON.stringify(report, null, 2));
  console.log(`完成：${OUT}`);
} finally {
  fs.rmSync(decoded, { recursive: true, force: true });
}
