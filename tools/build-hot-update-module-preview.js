#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { parseAst } = require('rollup/parseAst');
const { toJs, toJsc } = require('./jsc');

const args = process.argv.slice(2);
const arg = (name, fallback = '') => {
  const index = args.indexOf(`--${name}`);
  if (index < 0) return fallback;
  if (!args[index + 1]) throw new Error(`--${name} 缺少参数`);
  return args[index + 1];
};

const root = path.join(__dirname, '..');
const source = path.resolve(arg('source'));
const from = Number(arg('from'));
const moduleSource = path.resolve(arg('module-source'));
const moduleVersion = Number(arg('module-version'));
const version = Number(arg('version'));
const stableVersion = Number(arg('stable-version'));
const output = path.resolve(arg('out'));
const modules = arg('modules').split(',').map((value) => value.trim()).filter(Boolean);
const lazyGContext = args.includes('--lazy-gcontext');
const includeUids = arg('include-uids').split(',').map((value) => value.trim())
  .filter((value) => /^\d+$/.test(value));

if (![from, moduleVersion, version, stableVersion].every(Number.isSafeInteger)
    || from < 1 || moduleVersion < 1 || version <= from
    || stableVersion < 1 || stableVersion > version) {
  throw new Error('版本参数无效');
}
if (!modules.length) throw new Error('--modules 至少指定一个模块');
if (fs.existsSync(output)) throw new Error(`输出目录已存在：${output}`);

const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');
const keyOf = (key) => (key.type === 'Identifier' ? key.name : key.value);
const replaceOnce = (sourceText, before, after, label) => {
  const first = sourceText.indexOf(before);
  if (first < 0 || sourceText.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${label} 没有唯一命中`);
  }
  return sourceText.slice(0, first) + after + sourceText.slice(first + before.length);
};

const moduleRanges = (sourceText) => {
  const ast = parseAst(sourceText);
  let table = null;
  for (const statement of ast.body) {
    const expression = statement.type === 'ExpressionStatement' && statement.expression;
    if (expression && expression.type === 'AssignmentExpression'
        && expression.right.type === 'CallExpression'
        && expression.right.arguments[0]
        && expression.right.arguments[0].type === 'ObjectExpression') {
      table = expression.right.arguments[0];
      break;
    }
  }
  if (!table) throw new Error('project.jsc 中没有找到模块表');
  return new Map(table.properties.map((property) => [keyOf(property.key), {
    start: property.value.start,
    end: property.value.end,
    source: sourceText.slice(property.value.start, property.value.end),
  }]));
};

const replaceModules = (baseText, moduleText, names) => {
  const base = moduleRanges(baseText);
  const replacement = moduleRanges(moduleText);
  const edits = names.map((name) => {
    if (!base.has(name) || !replacement.has(name)) throw new Error(`缺少模块：${name}`);
    return { ...base.get(name), source: replacement.get(name).source, name };
  }).sort((left, right) => right.start - left.start);
  let result = baseText;
  for (const edit of edits) result = result.slice(0, edit.start) + edit.source + result.slice(edit.end);
  return result;
};

fs.mkdirSync(output, { recursive: true });
for (const platform of ['android', 'ios']) {
  const sourceRoot = path.join(source, platform, String(from));
  const moduleRoot = path.join(moduleSource, platform, String(moduleVersion));
  const targetRoot = path.join(output, platform, String(version));
  fs.cpSync(sourceRoot, targetRoot, { recursive: true });

  const baseScript = toJs(fs.readFileSync(path.join(sourceRoot, 'src', 'project.jsc'))).toString('utf8');
  const selectedScript = toJs(fs.readFileSync(path.join(moduleRoot, 'src', 'project.jsc'))).toString('utf8');
  let nextScript = replaceModules(baseScript, selectedScript, modules);
  if (lazyGContext) {
    nextScript = replaceOnce(nextScript,
      'var i = require("./UpdateUtils"), a = require("./SoundUtils"), h = require("./gContext"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e, t, o) {',
      'var i = require("./UpdateUtils"), a = require("./SoundUtils"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e, t, o) {',
      'HotUpdate 顶层 gContext 依赖');
    nextScript = replaceOnce(nextScript,
      'h.default && h.default.msgBox && h.default.msgBox.showOnlyOk ? h.default.msgBox.showOnlyOk("更新未完成：" + e + "。请切换到稳定网络，确认后重新下载。", o) : this.scheduleOnce(o, 3);',
      'var n = null;\ntry {\nn = require("./gContext").default;\n} catch (e) {}\nn && n.msgBox && n.msgBox.showOnlyOk ? n.msgBox.showOnlyOk("更新未完成：" + e + "。请切换到稳定网络，确认后重新下载。", o) : this.scheduleOnce(o, 3);',
      'HotUpdate 错误提示延迟加载');
  }
  const versionPattern = new RegExp(`assertVer: ${from},\\npackageVer:`, 'g');
  const matches = nextScript.match(versionPattern) || [];
  if (matches.length !== 1) throw new Error(`${platform} 版本字段匹配到 ${matches.length} 处`);
  nextScript = nextScript.replace(versionPattern, `assertVer: ${version},\npackageVer:`);
  const encoded = toJsc(Buffer.from(nextScript, 'utf8'));
  fs.writeFileSync(path.join(targetRoot, 'src', 'project.jsc'), encoded);

  const manifestFile = path.join(targetRoot, 'project.manifest');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const packageUrl = manifest.packageUrl.replace(`/${from}/`, `/${version}/`);
  manifest.packageUrl = packageUrl;
  manifest.remoteManifestUrl = `${packageUrl}project.manifest`;
  manifest.remoteVersionUrl = `${packageUrl}version.manifest`;
  manifest.version = String(version);
  manifest.assets['src/project.jsc'] = { size: encoded.length, md5: md5(encoded) };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  fs.writeFileSync(path.join(targetRoot, 'version.manifest'), JSON.stringify({
    packageUrl: manifest.packageUrl,
    remoteManifestUrl: manifest.remoteManifestUrl,
    remoteVersionUrl: manifest.remoteVersionUrl,
    version: manifest.version,
  }));
}

const config = JSON.parse(fs.readFileSync(path.join(source, 'hot-update.json'), 'utf8'));
config.publishedAt = Date.now();
for (const platform of ['android', 'ios']) {
  const item = config.platforms[platform];
  item.latestAssetVersion = version;
  item.stableAssetVersion = stableVersion;
  item.rollout = {
    enabled: true,
    percentage: 0,
    includeUids,
    includeDeviceIds: [],
    excludeUids: [],
    excludeDeviceIds: [],
    salt: crypto.randomBytes(12).toString('hex'),
  };
}
fs.writeFileSync(path.join(output, 'hot-update.json'), `${JSON.stringify(config, null, 2)}\n`);
fs.writeFileSync(path.join(output, 'release.json'), `${JSON.stringify({
  version,
  from,
  moduleSource: path.relative(root, moduleSource),
  moduleVersion,
  modules,
  lazyGContext,
  stableVersion,
  includeUids,
}, null, 2)}\n`);
console.log(`已生成 R${version} 模块灰度：${modules.join(', ')}；稳定版 R${stableVersion}`);
