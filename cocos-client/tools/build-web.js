#!/usr/bin/env node
/** Build the recovered Cocos Creator project for mobile browsers. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const creator = process.env.COCOS_CREATOR
  || '/tmp/CocosCreator-2.4.13/CocosCreator.app/Contents/MacOS/CocosCreator';
const stageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-web-build-'));
const project = path.join(stageRoot, 'project');
const stageBuild = path.join(project, 'build');
const finalBuild = path.join(root, 'build', 'web-mobile');
const loginSceneUuid = 'c7580864-d9b1-4542-af37-53010c85cb3b';
const debug = /^(1|true)$/i.test(process.env.QJQP_WEB_DEBUG || '');

if (!fs.existsSync(creator)) throw new Error(`缺少 Cocos Creator 2.4.13：${creator}`);

function run(command, args, options = {}) {
  console.log(`$ ${path.basename(command)} ${args.join(' ')}`);
  execFileSync(command, args, { stdio: 'inherit', ...options });
}

fs.mkdirSync(project, { recursive: true });
for (const name of ['assets', 'recovery-report', 'settings']) {
  fs.cpSync(path.join(root, name), path.join(project, name), { recursive: true });
}
for (const name of ['package.json', 'project.json']) {
  fs.copyFileSync(path.join(root, name), path.join(project, name));
}
const installedLong = path.join(root, 'node_modules', 'long');
if (!fs.existsSync(installedLong)) {
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: root });
}
fs.mkdirSync(path.join(project, 'node_modules'), { recursive: true });
fs.cpSync(installedLong, path.join(project, 'node_modules', 'long'), { recursive: true });

// These recovered built-ins collide with Creator 2.4's own built-in assets.
for (const type of ['cc.EffectAsset', 'cc.Material']) {
  fs.rmSync(path.join(project, 'assets/resources/_RecoveredDependencies', type), {
    recursive: true,
    force: true,
  });
}
const builtins = new Set([
  '0275e94c-56a7-410f-bd1a-fc7483f7d14a', '567dcd80-8bf4-4535-8a5a-313f1caf078a',
  '617323dd-11f4-4dd3-8eec-0caf6b3b45b9', '71561142-4c83-4933-afca-cb7a17f67053',
  'b43ff3c2-02bb-4874-81f7-f2dea6970f18', 'd6d3ca85-4681-47c1-b5dd-d036a9d39ea2',
  'd81ec8ad-247c-4e62-aa3c-d35c4193c7af', 'e851e89b-faa2-4484-bea6-5c01dd9f06e2',
  'edd215b9-2796-4a05-aaf5-81f96c9281ce',
]);
const textureDir = path.join(project, 'assets/resources/_RecoveredDependencies/Textures');
// This orphan is random binary data left behind with a .png suffix. It has no
// UUID references and Creator otherwise reports an avoidable importer error.
for (const name of ['1fcde46cd.png', '1fcde46cd.png.meta']) {
  fs.rmSync(path.join(textureDir, name), { force: true });
}
for (const name of fs.readdirSync(textureDir)) {
  if (!name.endsWith('.meta')) continue;
  const meta = path.join(textureDir, name);
  try {
    if (!builtins.has(JSON.parse(fs.readFileSync(meta, 'utf8')).uuid)) continue;
    fs.rmSync(meta, { force: true });
    fs.rmSync(meta.slice(0, -5), { force: true });
  } catch (_) { /* keep malformed entries for Creator to report */ }
}

const env = { ...process.env, PATH: `/tmp/cocos-bin:${process.env.PATH}` };
run('arch', ['-x86_64', creator, '--path', project, '--force', '--build', [
  'platform=web-mobile',
  `debug=${debug}`,
  `sourceMaps=${debug}`,
  'md5Cache=false',
  'inlineSpriteFrames=true',
  'orientation=landscape',
  'webOrientation=landscape',
  'title=潜江干瞪眼',
  `buildPath=${stageBuild}`,
  `startScene=${loginSceneUuid}`,
].join(';')], { cwd: project, env });

const generated = path.join(stageBuild, 'web-mobile');
if (!fs.existsSync(generated)) throw new Error(`Creator 没有生成 Web 目录：${generated}`);
const mainDir = path.join(generated, 'assets', 'main');
const indexFile = fs.readdirSync(mainDir).find((name) => /^index(?:\.[\da-f]+)?\.js$/.test(name));
if (!indexFile) throw new Error('没有找到 Cocos Web 主脚本包');
run(process.execPath, [
  path.join(__dirname, '..', '..', 'tools', 'build-recovered-bundle.js'),
  project,
  path.join(mainDir, indexFile),
]);

const webConfig = `window.QJQP_WEB_CONFIG = window.QJQP_WEB_CONFIG || {\n  apiBase: "/__qjqp_api",\n  websocketUrl: (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/__qjqp_ws"\n};\n`;
fs.writeFileSync(path.join(generated, 'web-config.js'), webConfig);
const htmlFile = path.join(generated, 'index.html');
let html = fs.readFileSync(htmlFile, 'utf8');
if (!html.includes('web-config.js')) {
  html = html.replace('</head>', '  <script src="web-config.js"></script>\n</head>');
  fs.writeFileSync(htmlFile, html);
}

fs.rmSync(finalBuild, { recursive: true, force: true });
fs.mkdirSync(path.dirname(finalBuild), { recursive: true });
fs.cpSync(generated, finalBuild, { recursive: true });
run(process.execPath, [path.join(__dirname, '..', '..', 'tools', 'package-cocos-pwa.js'), finalBuild]);
console.log(`WEB_BUILD=${finalBuild}`);
